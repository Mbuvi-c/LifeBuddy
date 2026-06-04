// SimulationEngine.tsx
// Main orchestrator for the simulation and assessment.
// Manages task flow, BKT updates, promotion logic, follow-up remediation.
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
type Phase = 'loading' | 'task' | 'feedback' | 'summary'

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
  const [phase, setPhase]                         = useState<Phase>('loading')
  const [currentTier, setCurrentTier]             = useState<1 | 2 | 3>(1)
  const [currentDiff, setCurrentDiff]             = useState<Difficulty>('easy')
  const [taskQueue, setTaskQueue]                 = useState<Task[]>([])
  const [taskIndex, setTaskIndex]                 = useState(0)
  const [attempts, setAttempts]                   = useState<AttemptRecord[]>([])
  const [diffResults, setDiffResults]             = useState<DifficultyResult[]>([])
  const [followUpPhase, setFollowUpPhase]         = useState(false)
  const [followUpQueue, setFollowUpQueue]         = useState<Task[]>([])
  const [followUpIndex, setFollowUpIndex]         = useState(0)
  const [followUpTriggered, setFollowUpTriggered] = useState(false)
  const [promotedWithRemediation, setPromotedWithRemediation] = useState(false)
  const [followUpFeedback, setFollowUpFeedback]   = useState<{ correct: boolean; explanation: string } | null>(null)
  const [completedTaskIds, setCompletedTaskIds]   = useState<string[]>([])
  const [lastCorrect, setLastCorrect]             = useState(false)
  const [currentMastery, setCurrentMastery]       = useState(0.15)
  const [previousMastery, setPreviousMastery]     = useState(0.15)
  const [sessionStartMastery, setSessionStartMastery] = useState(0.15)
  const [hintsAllowed, setHintsAllowed]           = useState(true)
  const attemptNumber  = useRef(1)
  const latestAttempts = useRef<AttemptRecord[]>([])

  // ── Init session ───────────────────────────────────────────────────────────
  useEffect(() => {
    initSession()
  }, [])

  async function initSession() {
    console.log('initSession called, skillId:', skillId, 'allTasks:', allTasks.length)
    await startSession(learnerId)

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
    setPhase('task')

    if (tasks[0]) {
      playQuestionAudio(tasks[0].id, skillId)
    }
  }

  // ── Current task ───────────────────────────────────────────────────────────
  const currentTask = taskQueue[taskIndex] ?? null

  // ── Handle answer (main tasks) ─────────────────────────────────────────────
  const handleAnswer = useCallback(async (
    correct: boolean,
    responseTime: number,
    hintsUsed: number
  ) => {
    if (!currentTask) return

    setLastCorrect(correct)
    setPhase('feedback')

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
    let record: AttemptRecord = {
      taskId:      currentTask.id,
      topic:       currentTask.topic,
      correct,
      mastery:     currentMastery,
      hintsUsed,
      responseTime,
    }

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

        record = { ...record, mastery: newMastery }
      }
    } else {
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

    // Always record every attempt regardless of online status
    const newAttempts = [...attempts, record]
    setAttempts(newAttempts)
    latestAttempts.current = newAttempts
    setCompletedTaskIds(prev => [...prev, currentTask.id])

    await saveSessionState({
      learner_id:            learnerId,
      skill:                 skillId,
      tier:                  currentTier,
      difficulty:            currentDiff,
      difficulty_attempts:   0,
      tasks_completed:       [...completedTaskIds, currentTask.id],
      weak_topics:           [],
      high_performer_gaps:   [],
      guided_mode_triggered: false,
      current_task_index:    taskIndex + 1,
      mastery:               newMastery,
      last_updated:          Date.now(),
    })
  }, [currentTask, currentMastery, attempts, learnerId, skillId, currentTier, currentDiff, completedTaskIds, taskIndex])

  // ── Handle follow-up answer (no logAttempt, advances index only) ───────────
  const handleFollowUpAnswer = useCallback((
    correct: boolean,
    _responseTime: number,
    _hintsUsed: number
  ) => {
    const task = followUpQueue[followUpIndex]
    if (!task) return

    setFollowUpFeedback({ correct, explanation: task.explanation })

    setTimeout(() => {
      setFollowUpFeedback(null)
      const isLast = followUpIndex >= followUpQueue.length - 1
      if (isLast) {
        finishSession(diffResults, true)
      } else {
        const next = followUpIndex + 1
        setFollowUpIndex(next)
        playQuestionAudio(followUpQueue[next].id, skillId)
      }
    }, 2000)
  }, [followUpQueue, followUpIndex, diffResults, skillId])

  // ── Handle feedback dismiss ────────────────────────────────────────────────
  const handleFeedbackDismiss = useCallback(() => {
    const isLastTask = taskIndex >= taskQueue.length - 1

    if (!isLastTask) {
      const nextIndex = taskIndex + 1
      setTaskIndex(nextIndex)
      setPhase('task')
      if (taskQueue[nextIndex]) {
        playQuestionAudio(taskQueue[nextIndex].id, skillId)
      }
      return
    }

    evaluateDifficulty(latestAttempts.current)
  }, [taskIndex, taskQueue, skillId])

  function evaluateDifficulty(completedAttempts: AttemptRecord[]) {
    const localBKT = calcAverageMastery(latestAttempts.current)
    const passed   = localBKT >= MASTERY_THRESHOLD

    console.log('evaluateDifficulty: localBKT =', localBKT, 'passed =', passed)

    const result: DifficultyResult = {
      difficulty:     currentDiff,
      attempts:       completedAttempts,
      averageMastery: localBKT,
      passed,
    }

    const newResults = [...diffResults, result]
    setDiffResults(newResults)

    if (passed) {
      promote(newResults)
    } else {
      // Load 7 follow-up tasks from same difficulty
      const followUpTasks = getTasksForDifficulty(allTasks, currentTier, currentDiff, completedTaskIds)
      console.log('Starting follow-up phase:', followUpTasks.length, 'tasks')
      setFollowUpPhase(true)
      setFollowUpTriggered(true)
      setFollowUpQueue(followUpTasks)
      setFollowUpIndex(0)
      if (followUpTasks[0]) {
        playQuestionAudio(followUpTasks[0].id, skillId)
      }
    }
  }

  // ── Promote to next difficulty or tier ────────────────────────────────────
  function promote(results: DifficultyResult[]) {
    const diffIndex = DIFFICULTIES.indexOf(currentDiff)
    const tierIndex = TIERS.indexOf(currentTier)

    if (diffIndex < DIFFICULTIES.length - 1) {
      const nextDiff = DIFFICULTIES[diffIndex + 1]
      setCurrentDiff(nextDiff)
      setPreviousMastery(currentMastery)
      loadDifficulty(currentTier, nextDiff, completedTaskIds)
    } else if (tierIndex < TIERS.length - 1) {
      const nextTier = TIERS[tierIndex + 1] as 1 | 2 | 3
      setCurrentTier(nextTier)
      setCurrentDiff('easy')
      setPreviousMastery(currentMastery)
      loadDifficulty(nextTier, 'easy', completedTaskIds)
    } else {
      finishSession(results)
    }
  }

  // ── Finish session ─────────────────────────────────────────────────────────
  async function finishSession(results: DifficultyResult[], promotedWithRemediationFlag = false) {
    await endSession(learnerId)
    await clearSessionState(learnerId)
    setDiffResults(results)
    if (promotedWithRemediationFlag) setPromotedWithRemediation(true)
    setPhase('summary')
  }

  // ── Render interaction based on task type ─────────────────────────────────
  function renderInteraction(
    task: Task,
    onAnswer: (correct: boolean, responseTime: number, hintsUsed: number) => void
  ) {
    const props = { task, learnerId, onAnswer, hintsAllowed }
    switch (task.type) {
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
        promotedWithRemediation={promotedWithRemediation}
        followUpTriggered={followUpTriggered}
        onContinue={onComplete}
        onOptionalChallenge={() => {
          const gapTopics = hpGaps.map(g => g.topic)
          const challengeTasks = allTasks.filter(t =>
            gapTopics.includes(t.topic) && !completedTaskIds.includes(t.id)
          ).slice(0, gapTopics.length)
          setTaskQueue(challengeTasks)
          setTaskIndex(0)
          setPhase('task')
          if (challengeTasks[0]) {
            playQuestionAudio(challengeTasks[0].id, skillId)
          }
        }}
        onHome={onHome}
      />
    )
  }

  // ── Follow-up phase ────────────────────────────────────────────────────────
  if (followUpPhase) {
    const followUpTask = followUpQueue[followUpIndex] ?? null
    return (
      <div style={s.root}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <button style={s.homeBtn} onClick={onHome}>←</button>
            <div style={s.skillLabel}>{SKILL_NAMES[skillId] ?? skillId}</div>
          </div>
          <div style={s.headerRight}>
            <div style={s.tierChip}>
              T{currentTier} · {currentDiff.charAt(0).toUpperCase() + currentDiff.slice(1)}
            </div>
            <div style={s.followUpChip}>💪 Follow-up</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={s.progressWrap}>
          <div style={s.progressTrack}>
            <div style={{
              ...s.progressFill,
              width: `${(followUpIndex / followUpQueue.length) * 100}%`,
              background: 'linear-gradient(90deg, #6d28d9, #c084fc)',
            }} />
          </div>
          <span style={s.progressLabel}>
            {followUpIndex + 1} / {followUpQueue.length}
          </span>
        </div>

        {/* Task area */}
        <div style={s.taskArea}>
          {followUpTask && renderInteraction(followUpTask, handleFollowUpAnswer)}
        </div>

        {/* Follow-up feedback overlay — auto-dismisses after 2s */}
        {followUpFeedback && (
          <>
            <div style={s.feedbackBackdrop} />
            <div style={{
              ...s.followUpFeedbackCard,
              borderColor: followUpFeedback.correct
                ? 'rgba(74,222,128,0.4)'
                : 'rgba(248,113,113,0.4)',
              background: followUpFeedback.correct
                ? 'rgba(13,35,24,0.97)'
                : 'rgba(30,10,20,0.97)',
            }}>
              <div style={s.followUpFeedbackIcon}>
                {followUpFeedback.correct ? '✅' : '❌'}
              </div>
              <div style={{
                ...s.followUpFeedbackTitle,
                color: followUpFeedback.correct ? '#4ade80' : '#f87171',
              }}>
                {followUpFeedback.correct ? 'Correct!' : 'Not quite'}
              </div>
              <div style={s.followUpFeedbackExplanation}>
                {followUpFeedback.explanation}
              </div>
            </div>
          </>
        )}

      </div>
    )
  }

  // ── Main task phase ────────────────────────────────────────────────────────
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
        </div>
      </div>

      {/* Progress bar */}
      <div style={s.progressWrap}>
        <div style={s.progressTrack}>
          <div style={{
            ...s.progressFill,
            width: `${(taskIndex / TASKS_PER_DIFFICULTY) * 100}%`,
          }} />
        </div>
        <span style={s.progressLabel}>
          {taskIndex + 1} / {TASKS_PER_DIFFICULTY}
        </span>
      </div>

      {/* Task area */}
      <div style={s.taskArea}>
        {currentTask && renderInteraction(currentTask, handleAnswer)}
      </div>

      {/* Feedback overlay */}
      {phase === 'feedback' && (
        <FeedbackOverlay
          correct={lastCorrect}
          guidedMode={false}
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
  followUpChip: {
    padding: '4px 10px',
    borderRadius: 20,
    background: 'rgba(192,132,252,0.1)',
    border: '1px solid rgba(192,132,252,0.25)',
    fontSize: 11,
    fontWeight: 700,
    color: '#c084fc',
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

  // Follow-up feedback overlay
  feedbackBackdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 199,
    backdropFilter: 'blur(6px)',
    background: 'rgba(0,0,0,0.5)',
  },
  followUpFeedbackCard: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 200,
    borderRadius: 24,
    border: '1.5px solid',
    padding: '40px 44px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
    minWidth: 300,
    maxWidth: 400,
    textAlign: 'center',
    boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
  },
  followUpFeedbackIcon: {
    fontSize: 52,
  },
  followUpFeedbackTitle: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
  },
  followUpFeedbackExplanation: {
    fontSize: 13,
    color: 'rgba(240,234,255,0.7)',
    lineHeight: 1.6,
  },
}
