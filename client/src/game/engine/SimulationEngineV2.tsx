// SimulationEngineV2.tsx
// Stage 1 — Task display and navigation ✅
// Stage 2 — Real BKT mastery recording ✅
// Stage 3 — Promotion, follow-up tasks, guided mode lite ✅
// Stage 4 — Session summary (next)

import { useState, useEffect, useRef } from 'react'
import { MONEY_TRANSACTIONS_TASKS } from '../tasks/taskData_money'
import { startSession, logAttempt } from './adaptiveClient'
import TapSelect       from './interactions/TapSelect'
import TrueFalse       from './interactions/TrueFalse'
import FillBlank       from './interactions/FillBlank'
import ScenarioChoice  from './interactions/ScenarioChoice'
import SequentialSteps from './interactions/SequentialSteps'
import DragDrop        from './interactions/DragDrop'
import type { Task }   from '../tasks/types'

// ── Skill → task data map ─────────────────────────────────────────────────────
const SKILL_TASK_MAP: Record<string, Task[]> = {
  money_transactions: MONEY_TRANSACTIONS_TASKS,
  // Add as task files are built:
  // time_planning:          TIME_PLANNING_TASKS,
  // digital_safety:         DIGITAL_SAFETY_TASKS,
  // mobile_money:           MOBILE_MONEY_TASKS,
  // communication_advocacy: COMMUNICATION_ADVOCACY_TASKS,
  // financial_planning:     FINANCIAL_PLANNING_TASKS,
  // community_safety:       COMMUNITY_SAFETY_TASKS,
  // workplace_readiness:    WORKPLACE_READINESS_TASKS,
}

const SKILL_NAMES: Record<string, string> = {
  money_transactions:     'Money & Transactions',
  time_planning:          'Time & Planning',
  digital_safety:         'Digital Safety',
  mobile_money:           'Mobile Money & M-Pesa',
  communication_advocacy: 'Communication & Advocacy',
  financial_planning:     'Financial Planning',
  community_safety:       'Community Safety',
  workplace_readiness:    'Workplace Readiness',
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy:         'Easy',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
}

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'intermediate', 'advanced']

type Difficulty = 'easy' | 'intermediate' | 'advanced'

// ── Engine phase ──────────────────────────────────────────────────────────────
type Phase =
  | 'playing'          // normal task flow
  | 'followup'         // 3 targeted follow-up tasks after fail
  | 'transition'       // brief screen between difficulties
  | 'complete'         // all tiers done

// ── Answer record ─────────────────────────────────────────────────────────────
interface AnswerRecord {
  taskId:       string
  topic:        string
  correct:      boolean
  responseTime: number
  hintsUsed:    number
  mastery:      number
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface SimulationEngineV2Props {
  skillId:            string
  learnerId:          string
  tier?:              1 | 2 | 3
  onSessionComplete?: (result: { passed: boolean; mastery: number }) => void
  onGoBack?:          () => void
  settings?:          Record<string, unknown>
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getTasksForDifficulty(
  tasks: Task[],
  tier: 1 | 2 | 3,
  difficulty: Difficulty,
  excludeIds: string[]
): Task[] {
  return tasks.filter(
    t => t.tier === tier && t.difficulty === difficulty && !excludeIds.includes(t.id)
  )
}

function getFollowUpTasks(
  tasks: Task[],
  tier: 1 | 2 | 3,
  difficulty: Difficulty,
  wrongTopics: string[],
  excludeIds: string[]
): Task[] {
  // Prefer tasks from topics the learner got wrong
  const targeted = tasks.filter(
    t => t.tier === tier &&
         t.difficulty === difficulty &&
         wrongTopics.includes(t.topic) &&
         !excludeIds.includes(t.id)
  )
  // Fill up to 3 with any remaining tasks if not enough targeted ones
  const general = tasks.filter(
    t => t.tier === tier &&
         t.difficulty === difficulty &&
         !wrongTopics.includes(t.topic) &&
         !excludeIds.includes(t.id)
  )
  return [...targeted, ...general].slice(0, 3)
}

function nextDifficultyOrTier(
  tier: 1 | 2 | 3,
  diff: Difficulty
): { tier: 1 | 2 | 3; diff: Difficulty } | null {
  const diffIdx = DIFFICULTY_ORDER.indexOf(diff)
  if (diffIdx < DIFFICULTY_ORDER.length - 1) {
    return { tier, diff: DIFFICULTY_ORDER[diffIdx + 1] }
  }
  if (tier < 3) {
    return { tier: (tier + 1) as 1 | 2 | 3, diff: 'easy' }
  }
  return null  // all complete
}

// ── Quit confirmation ─────────────────────────────────────────────────────────
function QuitConfirm({ onStay, onQuit }: { onStay: () => void; onQuit: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      backdropFilter: 'blur(6px)',
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--surface, #1e2130)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, padding: '32px 28px',
        width: 320, textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏸️</div>
        <p style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: 18, fontWeight: 700,
          color: 'var(--text, #f0f1f5)', marginBottom: 8,
        }}>Quit this session?</p>
        <p style={{
          fontSize: 13, color: 'var(--text2, #9da3b8)',
          marginBottom: 24, lineHeight: 1.5,
        }}>Your progress in this round won't be saved.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onStay} style={{
            flex: 1, padding: '12px 0', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent',
            color: 'var(--text, #f0f1f5)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Keep going</button>
          <button onClick={onQuit} style={{
            flex: 1, padding: '12px 0', borderRadius: 12,
            border: 'none', background: 'var(--accent, #6c63ff)',
            color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Quit</button>
        </div>
      </div>
    </div>
  )
}

// ── Feedback popup ────────────────────────────────────────────────────────────
function FeedbackPanel({
  correct, explanation, isLast, onNext,
}: {
  correct: boolean; explanation: string
  isLast: boolean; onNext: () => void
}) {
  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 199,
        backdropFilter: 'blur(6px)',
        background: 'rgba(0,0,0,0.45)',
      }} />
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 200,
        background: correct ? '#0d2318' : '#1a1025',
        border: `1.5px solid ${correct ? '#4ade80' : '#c084fc'}`,
        borderRadius: 24,
        padding: '40px 48px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 16,
        minWidth: 320, maxWidth: 420,
        boxShadow: `0 8px 48px ${correct ? 'rgba(74,222,128,0.3)' : 'rgba(192,132,252,0.2)'}`,
        animation: 'popIn 0.25s ease',
      }}>
        <span style={{ fontSize: 52 }}>{correct ? '✅' : '❌'}</span>
        <span style={{
          fontSize: 22, fontWeight: 700, textAlign: 'center',
          color: correct ? '#4ade80' : '#c084fc',
        }}>
          {correct ? 'Correct!' : 'Good try, however:'}
        </span>
        <p style={{
          fontSize: 13, color: 'rgba(240,234,255,0.65)',
          textAlign: 'center', lineHeight: 1.6, margin: 0,
        }}>
          {explanation}
        </p>
        <button onClick={onNext} style={{
          width: '100%', padding: '14px 0',
          borderRadius: 12, border: 'none',
          background: correct ? '#4ade80' : '#6c63ff',
          color: correct ? '#0d2318' : '#fff',
          fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4,
        }}>
          {isLast ? 'Finish 🎉' : 'Next →'}
        </button>
      </div>
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  )
}

// ── Celebration popup (on pass) ───────────────────────────────────────────────
function CelebrationPopup({ onContinue, nextLabel }: { onContinue: () => void; nextLabel: string }) {
  useEffect(() => {
    const t = setTimeout(onContinue, 5000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 299,
        backdropFilter: 'blur(8px)',
        background: 'rgba(0,0,0,0.5)',
      }} />
      {/* Confetti dots */}
      {['#4ade80','#a855f7','#60a5fa','#fbbf24','#f472b6'].map((c, i) => (
        <div key={i} style={{
          position: 'fixed',
          top: `${10 + i * 12}%`,
          left: `${10 + i * 18}%`,
          width: 10, height: 10,
          borderRadius: '50%',
          background: c,
          zIndex: 298,
          animation: `confettiFall${i} 2s ease forwards`,
        }} />
      ))}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 300,
        background: '#0d1f14',
        border: '1.5px solid #4ade80',
        borderRadius: 28,
        padding: '48px 52px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 14,
        minWidth: 300, maxWidth: 400,
        boxShadow: '0 8px 64px rgba(74,222,128,0.35)',
        animation: 'popIn 0.3s ease',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: 64 }}>🎉</span>
        <span style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: 26, fontWeight: 800,
          color: '#4ade80',
        }}>Well done!</span>
        <p style={{
          fontSize: 14, color: 'rgba(240,234,255,0.7)',
          lineHeight: 1.6, margin: 0,
        }}>
          You passed this level. {nextLabel}
        </p>
        <button onClick={onContinue} style={{
          marginTop: 8,
          padding: '12px 32px',
          borderRadius: 12, border: 'none',
          background: '#4ade80',
          color: '#0d1f14',
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>
          Let's go! →
        </button>
      </div>
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  )
}

// ── Transition screen (between difficulties) ──────────────────────────────────
function TransitionScreen({
  tier, difficulty, onReady,
}: {
  tier: 1 | 2 | 3; difficulty: Difficulty; onReady: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onReady, 3500)
    return () => clearTimeout(t)
  }, [])

  const emoji = difficulty === 'easy' ? '🟢' : difficulty === 'intermediate' ? '🟡' : '🟣'
  const label = DIFFICULTY_LABEL[difficulty]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'var(--bg, #0a0b0f)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 20, animation: 'fadeIn 0.4s ease',
    }}>
      <span style={{ fontSize: 56 }}>{emoji}</span>
      <p style={{
        fontFamily: 'var(--font-display, sans-serif)',
        fontSize: 28, fontWeight: 800,
        color: 'var(--text, #f0f1f5)',
      }}>
        Starting {label}!
      </p>
      <p style={{ fontSize: 14, color: 'var(--text2, #9da3b8)' }}>
        Tier {tier} · Tasks are {
          difficulty === 'easy' ? 'straightforward' :
          difficulty === 'intermediate' ? 'getting more challenging' :
          'real-world and complex'
        }
      </p>
      {/* Journey dots */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {DIFFICULTY_ORDER.map(d => (
          <div key={d} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: DIFFICULTY_ORDER.indexOf(d) <= DIFFICULTY_ORDER.indexOf(difficulty)
              ? '#4ade80'
              : 'rgba(255,255,255,0.15)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// ── Follow-up message (after fail) ────────────────────────────────────────────
function FollowUpBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 250,
      background: 'var(--surface, #1e2130)',
      border: '1px solid rgba(168,85,247,0.3)',
      borderRadius: 16, padding: '14px 24px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      animation: 'slideUp 0.3s ease',
      maxWidth: 360,
    }}>
      <span style={{ fontSize: 22 }}>💪</span>
      <p style={{
        fontSize: 13, color: 'var(--text, #f0f1f5)',
        lineHeight: 1.5, margin: 0, flex: 1,
      }}>
        Let's practise a couple more!
      </p>
      <button onClick={onDismiss} style={{
        background: 'none', border: 'none',
        color: 'var(--text3, #6b7290)', cursor: 'pointer', fontSize: 16,
      }}>✕</button>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Gentle forward message (after follow-up) ──────────────────────────────────
function GentleForwardBanner({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 250,
      background: 'var(--surface, #1e2130)',
      border: '1px solid rgba(168,85,247,0.3)',
      borderRadius: 16, padding: '14px 24px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      animation: 'slideUp 0.3s ease',
      maxWidth: 400,
    }}>
      <span style={{ fontSize: 22 }}>💪</span>
      <p style={{
        fontSize: 13, color: 'var(--text, #f0f1f5)',
        lineHeight: 1.5, margin: 0,
      }}>
        This one was tricky — let's keep going and come back to it later!
      </p>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Main engine ───────────────────────────────────────────────────────────────
export default function SimulationEngineV2({
  skillId,
  learnerId,
  tier = 1,
  onSessionComplete,
  onGoBack,
}: SimulationEngineV2Props) {

  const allTasks  = SKILL_TASK_MAP[skillId] ?? MONEY_TRANSACTIONS_TASKS
  const skillName = SKILL_NAMES[skillId] ?? skillId

  // ── State ──────────────────────────────────────────────────────────────────
  const [currentTier, setCurrentTier] = useState<1 | 2 | 3>(tier)
  const [currentDiff, setCurrentDiff] = useState<Difficulty>('easy')
  const [phase,       setPhase]       = useState<Phase>('playing')
  const [taskQueue,   setTaskQueue]   = useState<Task[]>([])
  const [taskIndex,   setTaskIndex]   = useState(0)
  const [doneIds,     setDoneIds]     = useState<string[]>([])
  const [answers,     setAnswers]     = useState<AnswerRecord[]>([])
  const [showQuit,    setShowQuit]    = useState(false)
  const [feedback,    setFeedback]    = useState<{ correct: boolean; mastery: number } | null>(null)
  const [logging,     setLogging]     = useState(false)
  const [consecutiveWrong, setConsecutiveWrong] = useState(0)
  const [showFollowUpBanner, setShowFollowUpBanner] = useState(false)
  const [showGentleBanner,   setShowGentleBanner]   = useState(false)
  const [showCelebration,    setShowCelebration]     = useState(false)
  const [nextTransition,     setNextTransition]      = useState<{ tier: 1|2|3; diff: Difficulty } | null>(null)
  const [showTransition,     setShowTransition]      = useState(false)

  const taskStartTime    = useRef<number>(Date.now())
  const sessionAnswers   = useRef<AnswerRecord[]>([])  // all answers this session

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    startSession(learnerId).then(ok => {
      if (!ok) console.warn('Session start failed — running offline')
    })
    loadQueue(currentTier, currentDiff, [])
  }, [])

  useEffect(() => {
    taskStartTime.current = Date.now()
  }, [taskIndex])

  // ── Load task queue ────────────────────────────────────────────────────────
  function loadQueue(t: 1 | 2 | 3, d: Difficulty, exclude: string[], followUp = false, currentAnswers: AnswerRecord[] = []) {
    let tasks: Task[]
    if (followUp) {
      const wrongTopics = currentAnswers
        .filter(a => !a.correct)
        .map(a => a.topic)
      tasks = getFollowUpTasks(allTasks, t, d, wrongTopics, exclude)
    } else {
      tasks = getTasksForDifficulty(allTasks, t, d, exclude)
    }
    const sliced = tasks.slice(0, followUp ? 3 : 7)
    console.log('loadQueue:', t, d, 'found:', sliced.length)
    setTaskQueue(sliced)
    setTaskIndex(0)
    setFeedback(null)
    setConsecutiveWrong(0)
    taskStartTime.current = Date.now()
  }

  // ── Current task ───────────────────────────────────────────────────────────
  const currentTask = taskQueue[taskIndex] ?? null
  const totalTasks  = taskQueue.length
  const taskNumber  = taskIndex + 1
  const isLast      = taskIndex + 1 >= taskQueue.length

  // ── Answer handler ─────────────────────────────────────────────────────────
  async function handleAnswer(correct: boolean, responseTime: number, hintsUsed: number) {
    if (!currentTask || feedback || logging) return
    setLogging(true)

    let mastery = 0.15
    try {
      const response = await logAttempt({
        learner_id:      learnerId,
        simulation_type: 'skill_simulation',
        task_type:       currentTask.type,
        success:         correct,
        skill:           skillId,
        response_type:   correct ? 'correct' : 'incorrect',
        hints_used:      hintsUsed,
        quit_signal:     false,
        response_time:   responseTime,
        attempt_number:  taskIndex + 1,
      })
      if (response) {
        mastery = (response as any).adaptation?.mastery ?? response.mastery ?? 0.15
      }
    } catch (e) {
      console.warn('BKT log failed — using fallback mastery')
    }

    const record: AnswerRecord = {
      taskId:  currentTask.id,
      topic:   currentTask.topic,
      correct,
      responseTime,
      hintsUsed,
      mastery,
    }

    setAnswers(prev => [...prev, record])
    sessionAnswers.current = [...sessionAnswers.current, record]
    setDoneIds(prev => [...prev, currentTask.id])
    setFeedback({ correct, mastery })

    // Track consecutive wrong for guided mode lite
    if (!correct) {
      setConsecutiveWrong(prev => prev + 1)
    } else {
      setConsecutiveWrong(0)
    }

    setLogging(false)
  }

  // ── Evaluate set after all tasks done ──────────────────────────────────────
  function evaluateSet(currentAnswers: AnswerRecord[]) {
    const avgMastery = currentAnswers.length > 0
      ? currentAnswers.reduce((s, a) => s + a.mastery, 0) / currentAnswers.length
      : 0.15
    const passed = avgMastery >= 0.70
    return { passed, avgMastery }
  }

  // ── Next task / end of set logic ───────────────────────────────────────────
  function handleNext() {
    setFeedback(null)

    if (!isLast) {
      setTaskIndex(i => i + 1)
      return
    }

    // End of set — evaluate
    const currentAnswers = [...answers]
    const { passed, avgMastery } = evaluateSet(currentAnswers)

    if (phase === 'playing') {
      if (passed) {
        // Show celebration then transition to next difficulty
        const next = nextDifficultyOrTier(currentTier, currentDiff)
        if (next) {
          setNextTransition(next)
          setShowCelebration(true)
        } else {
          // All tiers complete
          onSessionComplete?.({ passed: true, mastery: avgMastery })
        }
      } else {
        // Failed — load 3 follow-up tasks
        setPhase('followup')
        setShowFollowUpBanner(true)
        setAnswers([])  // reset answers for follow-up evaluation
        loadQueue(currentTier, currentDiff, [...doneIds], true)
      }
    } else if (phase === 'followup') {
      // After follow-up — move forward regardless
      setShowGentleBanner(true)
      const next = nextDifficultyOrTier(currentTier, currentDiff)
      setTimeout(() => {
        setShowGentleBanner(false)
        if (next) {
          setNextTransition(next)
          setShowTransition(true)
        } else {
          onSessionComplete?.({ passed: false, mastery: avgMastery })
        }
      }, 3500)
    }
  }

  // ── Celebration done → show transition ────────────────────────────────────
  function handleCelebrationDone() {
    setShowCelebration(false)
    if (nextTransition) {
      setShowTransition(true)
    }
  }

  // ── Transition done → load next difficulty ────────────────────────────────
  function handleTransitionDone() {
    if (nextTransition) {
      const next = nextTransition
      const tasks = getTasksForDifficulty(allTasks, next.tier, next.diff, [])
      const sliced = tasks.slice(0, 7)
      console.log('transition to:', next.tier, next.diff, 'tasks:', sliced.length)
      setTaskQueue(sliced)
      setTaskIndex(0)
      setFeedback(null)
      setConsecutiveWrong(0)
      taskStartTime.current = Date.now()
      setCurrentTier(next.tier)
      setCurrentDiff(next.diff)
      setPhase('playing')
      setAnswers([])
      setNextTransition(null)
      setShowTransition(false)
    }
  }

  // ── Render interaction ─────────────────────────────────────────────────────
  function renderInteraction(task: Task) {
    // Guided mode lite: highlight hint after 3 consecutive wrong
    const guidedHint = consecutiveWrong >= 3
    const commonProps = {
      task,
      learnerId,
      onAnswer:     handleAnswer,
      hintsAllowed: true,
    }
    switch (task.type) {
      case 'tap_select':       return <TapSelect       {...commonProps} />
      case 'true_false':       return <TrueFalse       {...commonProps} />
      case 'fill_blank':       return <FillBlank       {...commonProps} />
      case 'scenario_choice':  return <ScenarioChoice  {...commonProps} />
      case 'sequential_steps': return <SequentialSteps {...commonProps} />
      case 'drag_drop':        return <DragDrop        {...commonProps} />
      default:                 return <TapSelect       {...commonProps} />
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!currentTask && !showTransition && !showCelebration) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', color: 'var(--text2, #9da3b8)', fontSize: 15,
      }}>
        Loading tasks…
      </div>
    )
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg, #0a0b0f)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* ── Overlays ── */}
      {showQuit && (
        <QuitConfirm
          onStay={() => setShowQuit(false)}
          onQuit={() => { setShowQuit(false); onGoBack?.() }}
        />
      )}

      {feedback && currentTask && (
        <FeedbackPanel
          correct={feedback.correct}
          explanation={currentTask.explanation}
          isLast={isLast}
          onNext={handleNext}
        />
      )}

      {showCelebration && (
        <CelebrationPopup
          onContinue={handleCelebrationDone}
          nextLabel={
            nextTransition
              ? `Starting ${DIFFICULTY_LABEL[nextTransition.diff]}!`
              : 'Session complete!'
          }
        />
      )}

      {showTransition && nextTransition && (
        <TransitionScreen
          tier={nextTransition.tier}
          difficulty={nextTransition.diff}
          onReady={handleTransitionDone}
        />
      )}

      {showFollowUpBanner && (
        <FollowUpBanner onDismiss={() => setShowFollowUpBanner(false)} />
      )}

      {showGentleBanner && (
        <GentleForwardBanner onDismiss={() => setShowGentleBanner(false)} />
      )}

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <button onClick={() => setShowQuit(true)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text2, #9da3b8)', fontSize: 20, padding: 4, lineHeight: 1,
        }}>←</button>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: 15, fontWeight: 700, color: 'var(--text, #f0f1f5)',
          }}>{skillName}</div>
          <div style={{ fontSize: 11, color: 'var(--text3, #6b7290)', marginTop: 2 }}>
            Tier {currentTier} · {DIFFICULTY_LABEL[currentDiff]}
            {phase === 'followup' ? ' · Follow-up' : ''}
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text3, #6b7290)', minWidth: 36, textAlign: 'right' }}>
          {logging ? '…' : `${taskNumber}/${totalTasks}`}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{
          height: '100%',
          width: `${(taskNumber / totalTasks) * 100}%`,
          background: phase === 'followup' ? '#a855f7' : 'var(--accent, #6c63ff)',
          borderRadius: 2, transition: 'width 0.35s ease',
        }} />
      </div>

      {/* ── Guided mode lite banner ── */}
      {consecutiveWrong >= 3 && (
        <div style={{
          background: 'rgba(168,85,247,0.1)',
          border: '1px solid rgba(168,85,247,0.3)',
          padding: '8px 20px',
          fontSize: 12, color: '#c084fc',
          textAlign: 'center',
        }}>
          💡 Tip: Look carefully at the hint before answering
        </div>
      )}

      {/* ── Content ── */}
      {currentTask && (
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '24px 20px 40px',
          width: '100%', boxSizing: 'border-box',
        }}>
          {renderInteraction(currentTask)}
        </div>
      )}
    </div>
  )
}
