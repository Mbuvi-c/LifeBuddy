// SimulationEngineV2.tsx
// Stage 1 — Task display and navigation ✅
// Stage 2 — Real BKT mastery recording ✅
// Stage 3 — Promotion / retry / guided mode (next)
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

type Difficulty = 'easy' | 'intermediate' | 'advanced'

// ── Answer record — now includes real BKT mastery ─────────────────────────────
interface AnswerRecord {
  taskId:       string
  correct:      boolean
  responseTime: number
  hintsUsed:    number
  mastery:      number   // real BKT mastery from backend
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

  const [currentTier, setCurrentTier] = useState<1 | 2 | 3>(tier)
  const [currentDiff, setCurrentDiff] = useState<Difficulty>('easy')
  const [taskQueue,   setTaskQueue]   = useState<Task[]>([])
  const [taskIndex,   setTaskIndex]   = useState(0)
  const [doneIds,     setDoneIds]     = useState<string[]>([])
  const [answers,     setAnswers]     = useState<AnswerRecord[]>([])
  const [sessionStartMastery, setSessionStartMastery] = useState<number>(0.15)
  const [showQuit,    setShowQuit]    = useState(false)
  const [feedback,    setFeedback]    = useState<{ correct: boolean; mastery: number } | null>(null)
  const [logging,     setLogging]     = useState(false)   // true while API call in flight
  const taskStartTime = useRef<number>(Date.now())

  // ── Init: start backend session ────────────────────────────────────────────
  useEffect(() => {
    startSession(learnerId).then(ok => {
      if (!ok) console.warn('Session start failed — running offline')
    })
    loadQueue(currentTier, currentDiff, [])
  }, [])

  // Reset timer on task change
  useEffect(() => {
    taskStartTime.current = Date.now()
  }, [taskIndex])

  // ── Load task queue ────────────────────────────────────────────────────────
  function loadQueue(t: 1 | 2 | 3, d: Difficulty, exclude: string[]) {
    const tasks = getTasksForDifficulty(allTasks, t, d, exclude)
    setTaskQueue(tasks.slice(0, 7))
    setTaskIndex(0)
    setFeedback(null)
    taskStartTime.current = Date.now()
  }

  // ── Current task ───────────────────────────────────────────────────────────
  const currentTask = taskQueue[taskIndex] ?? null
  const totalTasks  = taskQueue.length
  const taskNumber  = taskIndex + 1
  const isLast      = taskIndex + 1 >= taskQueue.length

  // ── Answer handler — logs to BKT backend BEFORE saving record ─────────────
  async function handleAnswer(correct: boolean, responseTime: number, hintsUsed: number) {
    if (!currentTask || feedback || logging) return
    setLogging(true)

    // Call backend and get real mastery back
    let mastery = 0.15  // fallback if API fails
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
        setSessionStartMastery(prev => prev === 0.15 ? mastery : prev)
      }
    } catch (e) {
      console.warn('BKT log failed — using fallback mastery')
    }

    // Save record AFTER API responds — this is the Stage 2 bug fix
    const record: AnswerRecord = {
      taskId: currentTask.id,
      correct,
      responseTime,
      hintsUsed,
      mastery,  // real value, not 0
    }
    setAnswers(prev => [...prev, record])
    setDoneIds(prev => [...prev, currentTask.id])
    setFeedback({ correct, mastery })
    setLogging(false)
  }

  // ── Next task ──────────────────────────────────────────────────────────────
  function handleNext() {
    setFeedback(null)
    if (!isLast) {
      setTaskIndex(i => i + 1)
    } else {
      // Stage 3 will add full promotion logic here
      const allAnswers = [...answers]
      const avgMastery = allAnswers.length > 0
        ? allAnswers.reduce((s, a) => s + a.mastery, 0) / allAnswers.length
        : 0.15
      const passed = avgMastery >= 0.70
      onSessionComplete?.({ passed, mastery: avgMastery })
    }
  }

  // ── Render interaction ─────────────────────────────────────────────────────
  function renderInteraction(task: Task) {
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
  if (!currentTask) {
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
      {/* Overlays */}
      {showQuit && (
        <QuitConfirm
          onStay={() => setShowQuit(false)}
          onQuit={() => { setShowQuit(false); onGoBack?.() }}
        />
      )}
      {feedback && (
        <FeedbackPanel
          correct={feedback.correct}
          explanation={currentTask.explanation}
          isLast={isLast}
          onNext={handleNext}
        />
      )}

      {/* Header */}
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
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text3, #6b7290)', minWidth: 36, textAlign: 'right' }}>
          {logging ? '…' : `${taskNumber}/${totalTasks}`}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{
          height: '100%',
          width: `${(taskNumber / totalTasks) * 100}%`,
          background: 'var(--accent, #6c63ff)',
          borderRadius: 2, transition: 'width 0.35s ease',
        }} />
      </div>

      {/* Content */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '24px 20px 40px',
        width: '100%', boxSizing: 'border-box',
      }}>
        {renderInteraction(currentTask)}
      </div>
    </div>
  )
}
