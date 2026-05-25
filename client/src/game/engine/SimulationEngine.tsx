// SimulationEngine.tsx
// Main orchestrator for the simulation and assessment.
// Manages task flow, BKT updates, promotion logic, retry, guided mode.
// Calls adaptive engine after every question in real time.

import { useState, useEffect, useRef, useCallback } from 'react'
import { MONEY_TRANSACTIONS_TASKS } from '../tasks/taskData_money'
import type { Task } from '../tasks/taskData_money'
import { logAttempt, startSession, endSession } from './adaptiveClient'
import { saveSessionState, loadSessionState, clearSessionState, isOnline, savePendingAttempt } from './sessionStore'
import { playQuestionAudio, playSceneAudio, stopSceneAudio } from './audioManager'
import TapSelect from './interactions/TapSelect'
import TrueFalse from './interactions/TrueFalse'
import FillBlank from './interactions/FillBlank'
import ScenarioChoice from './interactions/ScenarioChoice'
import SequentialSteps from './interactions/SequentialSteps'
import DragDrop from './interactions/DragDrop'
import FeedbackOverlay from './FeedbackOverlay'
import SessionSummary from './SessionSummary'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Difficulty = 'easy' | 'intermediate' | 'advanced'
type Phase = 'loading' | 'task' | 'feedback' | 'between_difficulty' | 'summary'

interface AttemptRecord {
  taskId: string
  topic: string
  correct: boolean
  mastery: number
  hintsUsed: number
  responseTime: number
}

interface DifficultyResult {
  difficulty: Difficulty
  attempts: AttemptRecord[]
  averageMastery: number
  passed: boolean
  retriesUsed: number
  guidedModeTriggered: boolean
}

interface SimulationEngineProps {
  skillId: string
  learnerId: string
  onComplete: () => void
  onHome: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TASKS_PER_DIFFICULTY = 7
const MASTERY_THRESHOLD    = 0.70
const DIFFICULTIES: Difficulty[] = ['easy', 'intermediate', 'advanced']
const TIERS = [1, 2, 3] as const

const SKILL_TASK_MAP: Record<string, Task[]> = {
  money_transactions: MONEY_TRANSACTIONS_TASKS,
}

const SKILL_NAMES: Record<string, string> = {
  money_transactions:     'Money & Transactions',
  time_planning:          'Time & Planning',
  digital_safety:         'Digital Safety & Communication',
  mobile_money:           'Mobile Money & M-Pesa',
  communication_advocacy: 'Communication & Self-Advocacy',
  financial_planning:     'Financial Planning',
  community_safety:       'Community & Personal Safety',
  workplace_readiness:    'Workplace Readiness',
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getTasksForDifficulty(
  allTasks: Task[],
  tier: number,
  difficulty: Difficulty,
  exclude: string[] = []
): Task[] {
  const tierIndex = tier - 1
  const diffIndex = ['easy', 'intermediate', 'advanced'].indexOf(difficulty)
  const start = tierIndex * 21 + diffIndex * 7
  const end = start + 7
  return allTasks.slice(start, end)
}

function calcAverageMastery(attempts: AttemptRecord[]): number {
  if (!attempts.length) return 0
  const valid = attempts.filter(a => typeof a.mastery === 'number' && !isNaN(a.mastery))
  if (!valid.length) return 0
  return valid.reduce((sum, a) => sum + a.mastery, 0) / valid.length
}

function getWeakTopics(results: DifficultyResult[]): { topic: string; mastery: number }[] {
  const topicMap: Record<string, number[]> = {}
  results.forEach(r => {
    r.attempts.forEach(a => {
      if (!topicMap[a.topic]) topicMap[a.topic] = []
      topicMap[a.topic].push(a.mastery)
    })
  })
  return Object.entries(topicMap)
    .map(([topic, masteries]) => ({
      topic,
      mastery: masteries.reduce((s, m) => s + m, 0) / masteries.length,
    }))
    .filter(t => t.mastery < MASTERY_THRESHOLD)
}

function getHighPerformerGaps(results: DifficultyResult[]): { topic: string; mastery: number }[] {
  const topicMap: Record<string, number[]> = {}
  results.forEach(r => {
    r.attempts.forEach(a => {
      if (!topicMap[a.topic]) topicMap[a.topic] = []
      topicMap[a.topic].push(a.mastery)
    })
  })
  return Object.entries(topicMap)
    .map(([topic, masteries]) => ({
      topic,
      mastery: masteries.reduce((s, m) => s + m, 0) / masteries.length,
    }))
    .filter(t => t.mastery >= MASTERY_THRESHOLD && t.mastery < 1.0)
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function SimulationEngine({
  skillId,
  learnerId,
  onComplete,
  onHome,
}: SimulationEngineProps) {
  const allTasks = MONEY_TRANSACTIONS_TASKS

  // ── Session state ──────────────────────────────────────────────────────────
  const [phase, setPhase]                 = useState<Phase>('loading')
  const [currentTier, setCurrentTier]     = useState<1 | 2 | 3>(1)
  const [currentDiff, setCurrentDiff]     = useState<Difficulty>('easy')
  const [taskQueue, setTaskQueue]         = useState<Task[]>([])
  const [taskIndex, setTaskIndex]         = useState(0)
  const [attempts, setAttempts]           = useState<AttemptRecord[]>([])
  const [diffResults, setDiffResults]     = useState<DifficultyResult[]>([])
  const [retriesUsed, setRetriesUsed]     = useState(0)
  const [guidedMode, setGuidedMode]       = useState(false)
  const [guidedTriggered, setGuidedTriggered] = useState(false)
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([])
  const [lastCorrect, setLastCorrect]     = useState(false)
  const [currentMastery, setCurrentMastery] = useState(0.15)
  const [previousMastery, setPreviousMastery] = useState(0.15)
  const [sessionStartMastery, setSessionStartMastery] = useState(0.15)
  const [hintsAllowed, setHintsAllowed]   = useState(true)
  const attemptNumber                     = useRef(1)
  const latestAttempts                    = useRef<AttemptRecord[]>([])

  // ── Init session ───────────────────────────────────────────────────────────
  useEffect(() => {
    initSession()
  }, [])

async function initSession() {
    console.log('initSession called, skillId:', skillId, 'allTasks:', allTasks.length)
    console.log('SKILL_TASK_MAP keys:', Object.keys(SKILL_TASK_MAP))
    console.log('direct lookup:', SKILL_TASK_MAP[skillId]?.length)
    console.log('MONEY_TRANSACTIONS_TASKS length:', MONEY_TRANSACTIONS_TASKS.length)
    await startSession(learnerId)

    // Try to restore saved session state
    const saved = await loadSessionState(learnerId)
    if (saved && saved.skill === skillId) {
      setCurrentTier(saved.tier as 1 | 2 | 3)
      setCurrentDiff(saved.difficulty)
      setCurrentMastery(saved.mastery)
      setPreviousMastery(saved.mastery)
      setSessionStartMastery(saved.mastery)
      setCompletedTaskIds(saved.tasks_completed)
    }

    loadDifficulty(
      saved?.tier as 1 | 2 | 3 ?? 1,
      saved?.difficulty ?? 'easy',
      saved?.tasks_completed ?? []
    )
  }

function loadDifficulty(
    tier: 1 | 2 | 3,
    difficulty: Difficulty,
    exclude: string[]
  ) {
    const tasks = getTasksForDifficulty(allTasks, tier, difficulty, exclude)
    console.log('loadDifficulty:', tier, difficulty, 'tasks found:', tasks.length, 'allTasks:', allTasks.length)
    setTaskQueue(tasks)
    setTaskIndex(0)
    setAttempts([])
    setPhase('task')

    // Play question audio for first task
    if (tasks[0]) {
      playQuestionAudio(tasks[0].id, skillId)
    }
  }

  // ── Current task ───────────────────────────────────────────────────────────
  const currentTask = taskQueue[taskIndex] ?? null

  // ── Handle answer ──────────────────────────────────────────────────────────
  const handleAnswer = useCallback(async (
    correct: boolean,
    responseTime: number,
    hintsUsed: number
  ) => {
    if (!currentTask) return

    setLastCorrect(correct)
    setPhase('feedback')


    // Log to adaptive engine
    const attempt = {
      learner_id:      learnerId,
      simulation_type: 'functional_life_skills',
      task_type:       currentTask.type,
      success:         correct,
      skill:           skillId,
      response_type:   correct ? 'correct' as const : 'incorrect' as const,
      hints_used:      hintsUsed,
      quit_signal:     false,
      response_time:   responseTime,
      attempt_number:  attemptNumber.current++,
    }

    let newMastery = currentMastery

    if (isOnline()) {
      const response = await logAttempt(attempt)
     if (response) {
        newMastery = response.mastery
        setCurrentMastery(response.mastery)

        if (response.hci_config?.hint_frequency === 'high') {
          setHintsAllowed(true)
        } else if (response.hci_config?.hint_frequency === 'none') {
          setHintsAllowed(false)
        }

        // Record attempt with real mastery from engine
        const record: AttemptRecord = {
          taskId:       currentTask.id,
          topic:        currentTask.topic,
          correct,
          mastery:      newMastery,
          hintsUsed,
          responseTime,
        }
        const newAttempts = [...attempts, record]
        setAttempts(newAttempts)
        latestAttempts.current = newAttempts
        setCompletedTaskIds(prev => [...prev, currentTask.id])
      }
    } else {
      // Offline — save for later sync
      await savePendingAttempt({
        learner_id:    learnerId,
        skill:         skillId,
        task_id:       currentTask.id,
        success:       correct,
        response_time: responseTime,
        hints_used:    hintsUsed,
        timestamp:     Date.now(),
        synced:        false,
      })
    }

    // Save session state for offline resume
    await saveSessionState({
      learner_id:              learnerId,
      skill:                   skillId,
      tier:                    currentTier,
      difficulty:              currentDiff,
      difficulty_attempts:     retriesUsed,
      tasks_completed:         [...completedTaskIds, currentTask.id],
      weak_topics:             [],
      high_performer_gaps:     [],
      guided_mode_triggered:   guidedTriggered,
      current_task_index:      taskIndex + 1,
      mastery:                 newMastery,
      last_updated:            Date.now(),
    })

  }, [currentTask, currentMastery, attempts, learnerId, skillId, currentTier, currentDiff, completedTaskIds, retriesUsed, guidedTriggered, taskIndex])

  // ── Handle feedback dismiss ────────────────────────────────────────────────
  const handleFeedbackDismiss = useCallback(() => {
    const isLastTask = taskIndex >= taskQueue.length - 1

    if (!isLastTask) {
      // More tasks in this difficulty — advance
      const nextIndex = taskIndex + 1
      setTaskIndex(nextIndex)
      setPhase('task')
      if (taskQueue[nextIndex]) {
        playQuestionAudio(taskQueue[nextIndex].id, skillId)
      }
      return
    }

    // All tasks in this difficulty done — evaluate
   evaluateDifficulty(latestAttempts.current)

}, [taskIndex, taskQueue, skillId])

function evaluateDifficulty(completedAttempts: AttemptRecord[]) {
    console.log('evaluateDifficulty:', completedAttempts.length, 'attempts')
    console.log('retriesUsed:', retriesUsed, 'guidedMode:', guidedMode)
    const avgMastery = calcAverageMastery(completedAttempts)
    console.log('avgMastery:', avgMastery, 'passed:', avgMastery >= MASTERY_THRESHOLD)
    const passed     = avgMastery >= MASTERY_THRESHOLD

    const result: DifficultyResult = {
      difficulty:            currentDiff,
      attempts:              completedAttempts,
      averageMastery:        avgMastery,
      passed,
      retriesUsed,
      guidedModeTriggered:   guidedMode,
    }

    if (passed) {
      // Passed — promote to next difficulty or tier
      const newResults = [...diffResults, result]
      setDiffResults(newResults)
      setRetriesUsed(0)
      setGuidedMode(false)
      promote(newResults)
    } else if (retriesUsed === 0) {
      // First failure — retry with variation tasks
      setRetriesUsed(1)
      setAttempts([])
      const exclude = completedAttempts.map(a => a.taskId)
      loadDifficulty(currentTier, currentDiff, [...completedTaskIds, ...exclude])
    } else {
      // Second failure — guided mode
      setGuidedMode(true)
      setGuidedTriggered(true)
      setRetriesUsed(0)
      setAttempts([])
      const newResults = [...diffResults, { ...result, guidedModeTriggered: true }]
      setDiffResults(newResults)
      // Load tasks again in guided mode
      loadDifficulty(currentTier, currentDiff, completedTaskIds)
    }
  }

  // ── Promote to next difficulty or tier ────────────────────────────────────
  function promote(results: DifficultyResult[]) {
    const diffIndex = DIFFICULTIES.indexOf(currentDiff)
    const tierIndex = TIERS.indexOf(currentTier)

    if (diffIndex < DIFFICULTIES.length - 1) {
      // Next difficulty within same tier
      const nextDiff = DIFFICULTIES[diffIndex + 1]
      setCurrentDiff(nextDiff)
      setPreviousMastery(currentMastery)
      setPhase('between_difficulty')
    } else if (tierIndex < TIERS.length - 1) {
      // Next tier
      const nextTier = TIERS[tierIndex + 1] as 1 | 2 | 3
      setCurrentTier(nextTier)
      setCurrentDiff('easy')
      setPreviousMastery(currentMastery)
      setPhase('between_difficulty')
    } else {
      // All tiers and difficulties complete
      finishSession(results)
    }
  }

  // ── Between difficulty transition ─────────────────────────────────────────
  function handleContinueFromTransition() {
    loadDifficulty(currentTier, currentDiff, completedTaskIds)
  }

  // ── Finish session ─────────────────────────────────────────────────────────
  async function finishSession(results: DifficultyResult[]) {
    await endSession(learnerId)
    await clearSessionState(learnerId)
    setDiffResults(results)
    setPhase('summary')
  }

  // ── Guided mode completion ─────────────────────────────────────────────────
  useEffect(() => {
    if (!guidedMode) return
    if (taskIndex >= taskQueue.length - 1 && phase === 'feedback') {
      // After guided mode — load variation tasks
      setGuidedMode(false)
      const exclude = taskQueue.map(t => t.id)
      loadDifficulty(currentTier, currentDiff, [...completedTaskIds, ...exclude])
    }
  }, [guidedMode, taskIndex, taskQueue, phase])

  // ── Render interaction based on task type ─────────────────────────────────
  function renderInteraction() {
    if (!currentTask) return null
    const props = {
      task:         currentTask,
      learnerId,
      onAnswer:     handleAnswer,
      hintsAllowed: guidedMode ? false : hintsAllowed,
    }
    switch (currentTask.type) {
      case 'tap_select':       return <TapSelect       {...props} />
      case 'true_false':       return <TrueFalse       {...props} />
      case 'fill_blank':       return <FillBlank       {...props} />
      case 'scenario_choice':  return <ScenarioChoice  {...props} />
      case 'sequential_steps': return <SequentialSteps {...props} />
      case 'drag_drop':        return <DragDrop        {...props} />
      default:                 return null
    }
  }

  // ── Derived summary data ───────────────────────────────────────────────────
  const allAttempts    = diffResults.flatMap(r => r.attempts)
  const weakTopics     = getWeakTopics(diffResults)
  const hpGaps         = getHighPerformerGaps(diffResults)
  const totalCorrect   = allAttempts.filter(a => a.correct).length
  const totalAttempted = allAttempts.length

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <div style={s.center}>
        <div style={s.loadingDot} />
        <div style={s.loadingText}>Getting your tasks ready...</div>
      </div>
    )
  }

  if (phase === 'summary') {
    return (
      <SessionSummary
        skillId={skillId}
        skillName={SKILL_NAMES[skillId] ?? skillId}
        tierCompleted={currentTier}
        mastery={currentMastery}
        previousMastery={sessionStartMastery}
        tasksAttempted={totalAttempted}
        tasksCorrect={totalCorrect}
        weakTopics={weakTopics}
        highPerformerGaps={hpGaps}
        guidedModeTriggered={guidedTriggered}
        onContinue={onComplete}
        onOptionalChallenge={() => {
          // Load optional challenge tasks for high performer gaps
          const gapTopics = hpGaps.map(g => g.topic)
          const challengeTasks = allTasks.filter(t =>
            gapTopics.includes(t.topic) && !completedTaskIds.includes(t.id)
          ).slice(0, gapTopics.length)
          setTaskQueue(challengeTasks)
          setTaskIndex(0)
          setAttempts([])
          setPhase('task')
          if (challengeTasks[0]) {
            playQuestionAudio(challengeTasks[0].id, skillId)
          }
        }}
        onHome={onHome}
      />
    )
  }

  if (phase === 'between_difficulty') {
    const diffIndex  = DIFFICULTIES.indexOf(currentDiff)
    const isNewTier  = diffIndex === 0
    return (
      <div style={s.center}>
        <div style={s.transitionCard}>
          <div style={s.transitionIcon}>{isNewTier ? '🚀' : '⭐'}</div>
          <div style={s.transitionTitle}>
            {isNewTier
              ? `Tier ${currentTier} Unlocked!`
              : `${currentDiff.charAt(0).toUpperCase() + currentDiff.slice(1)} Level!`}
          </div>
          <div style={s.transitionText}>
            {isNewTier
              ? `You have completed all of Tier ${currentTier - 1}. Ready for the next level?`
              : `Great work! Moving to ${currentDiff} tasks.`}
          </div>
          <div style={s.masteryChip}>
            Mastery: {Math.round(currentMastery * 100)}%
          </div>
          <button style={s.continueBtn} onClick={handleContinueFromTransition}>
            Continue →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={s.root}>

      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <button style={s.homeBtn} onClick={onHome}>←</button>
          <div style={s.skillLabel}>
            {SKILL_NAMES[skillId] ?? skillId}
          </div>
        </div>
        <div style={s.headerRight}>
          <div style={s.tierChip}>
            T{currentTier} · {currentDiff.charAt(0).toUpperCase() + currentDiff.slice(1)}
          </div>
          {guidedMode && (
            <div style={s.guidedChip}>💡 Guided</div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={s.progressWrap}>
        <div style={s.progressTrack}>
          <div style={{
            ...s.progressFill,
            width: `${((taskIndex) / TASKS_PER_DIFFICULTY) * 100}%`,
          }} />
        </div>
        <span style={s.progressLabel}>
          {taskIndex + 1} / {TASKS_PER_DIFFICULTY}
        </span>
      </div>

      {/* Task area */}
      <div style={s.taskArea}>
        {currentTask && renderInteraction()}
      </div>

      {/* Feedback overlay */}
      {phase === 'feedback' && (
        <FeedbackOverlay
          correct={lastCorrect}
          guidedMode={guidedMode}
          onDismiss={handleFeedbackDismiss}
        />
      )}

    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const s: Record<string, any> = {
  root: {
    minHeight: '100dvh',
    background: '#06040d',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: '#f0eaff',
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(168,85,247,0.1)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  homeBtn: {
    width: 36, height: 36,
    borderRadius: 10,
    border: '1px solid rgba(168,85,247,0.2)',
    background: 'transparent',
    color: 'rgba(240,234,255,0.5)',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
  },
  skillLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(240,234,255,0.7)',
  },
  tierChip: {
    padding: '4px 10px',
    borderRadius: 20,
    background: 'rgba(168,85,247,0.12)',
    border: '1px solid rgba(168,85,247,0.25)',
    fontSize: 11,
    fontWeight: 700,
    color: '#a855f7',
    letterSpacing: '0.05em',
  },
  guidedChip: {
    padding: '4px 10px',
    borderRadius: 20,
    background: 'rgba(251,191,36,0.1)',
    border: '1px solid rgba(251,191,36,0.25)',
    fontSize: 11,
    fontWeight: 700,
    color: '#fbbf24',
  },

  // Progress
  progressWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 20px',
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    background: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
    transition: 'width 0.4s ease',
    boxShadow: '0 0 8px rgba(168,85,247,0.4)',
  },
  progressLabel: {
    fontSize: 11,
    color: 'rgba(240,234,255,0.3)',
    flexShrink: 0,
    letterSpacing: '0.05em',
  },

  // Task area
  taskArea: {
    flex: 1,
    padding: '20px 20px 40px',
    overflowY: 'auto',
  },

  // Loading
  center: {
    minHeight: '100dvh',
    background: '#06040d',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  loadingDot: {
    width: 12, height: 12,
    borderRadius: '50%',
    background: '#a855f7',
    boxShadow: '0 0 20px rgba(168,85,247,0.6)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(240,234,255,0.4)',
  },

  // Between difficulty transition
  transitionCard: {
    width: '100%',
    maxWidth: 380,
    background: '#0e0a1a',
    border: '1px solid rgba(168,85,247,0.2)',
    borderRadius: 28,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    textAlign: 'center',
    boxShadow: '0 0 40px rgba(168,85,247,0.1)',
    margin: '0 20px',
  },
  transitionIcon: {
    fontSize: 52,
  },
  transitionTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#f0eaff',
    fontFamily: "'Syne', sans-serif",
  },
  transitionText: {
    fontSize: 14,
    color: 'rgba(240,234,255,0.6)',
    lineHeight: 1.6,
  },
  masteryChip: {
    padding: '6px 16px',
    borderRadius: 20,
    background: 'rgba(168,85,247,0.12)',
    border: '1px solid rgba(168,85,247,0.25)',
    fontSize: 13,
    fontWeight: 700,
    color: '#a855f7',
  },
  continueBtn: {
    width: '100%',
    padding: '14px 20px',
    borderRadius: 14,
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: 'none',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 4px 20px rgba(168,85,247,0.3)',
    marginTop: 8,
  },
}
