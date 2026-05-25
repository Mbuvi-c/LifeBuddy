// SimulationEngineV2.tsx
// Stage 1 — Task display and navigation
// Stage 2 — BKT mastery recording (next)
// Stage 3 — Promotion / retry / guided mode (next)
// Stage 4 — Session summary (next)

import { useState, useEffect, useRef } from 'react'
import { MONEY_TRANSACTIONS_TASKS } from '../tasks/taskData_money'
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
  // Uncomment as task files are built:
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

// ── Answer record (Stage 2 will add mastery here) ─────────────────────────────
interface AnswerRecord {
  taskId:       string
  correct:      boolean
  responseTime: number
  hintsUsed:    number
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
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--surface, #1e2130)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: '32px 28px',
        width: 320,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏸️</div>
        <p style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: 18, fontWeight: 700,
          color: 'var(--text, #f0f1f5)',
          marginBottom: 8,
        }}>
          Quit this session?
        </p>
        <p style={{
          fontSize: 13,
          color: 'var(--text2, #9da3b8)',
          marginBottom: 24, lineHeight: 1.5,
        }}>
          Your progress in this round won't be saved.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onStay} style={{
            flex: 1, padding: '12px 0',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent',
            color: 'var(--text, #f0f1f5)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Keep going
          </button>
          <button onClick={onQuit} style={{
            flex: 1, padding: '12px 0',
            borderRadius: 12,
            border: 'none',
            background: 'var(--accent, #6c63ff)',
            color: '#fff',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Quit
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Feedback panel ────────────────────────────────────────────────────────────
function FeedbackPanel({
  correct,
  explanation,
  isLast,
  onNext,
}: {
  correct:     boolean
  explanation: string
  isLast:      boolean
  onNext:      () => void
}) {
  return (
    <>
      {/* Blur backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 199,
        backdropFilter: 'blur(6px)',
        background: 'rgba(0,0,0,0.45)',
      }}/>

      {/* Centered popup */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 200,
        background: correct ? '#0d2318' : '#2a0d0d',
        border: `1.5px solid ${correct ? '#4ade80' : '#f87171'}`,
        borderRadius: 24,
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        minWidth: 320,
        maxWidth: 420,
        boxShadow: `0 8px 48px ${correct ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
        animation: 'popIn 0.25s ease',
      }}>
        <span style={{ fontSize: 52 }}>{correct ? '✅' : '❌'}</span>
        <span style={{
          fontSize: 22, fontWeight: 700,
          color: correct ? '#4ade80' : '#f87171',
          textAlign: 'center',
        }}>
          {correct ? 'Correct!' : 'Try again!'}
        </span>
        <p style={{
          fontSize: 13,
          color: 'rgba(240,234,255,0.65)',
          textAlign: 'center',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {explanation}
        </p>
        <button onClick={onNext} style={{
          width: '100%',
          padding: '14px 0',
          borderRadius: 12,
          border: 'none',
          background: correct ? '#4ade80' : '#6c63ff',
          color: correct ? '#0d2318' : '#fff',
          fontSize: 15, fontWeight: 700,
          cursor: 'pointer',
          marginTop: 4,
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
  const [showQuit,    setShowQuit]    = useState(false)
  const [feedback,    setFeedback]    = useState<{ correct: boolean } | null>(null)
  const taskStartTime = useRef<number>(Date.now())

  // ── Load task queue ────────────────────────────────────────────────────────
  function loadQueue(t: 1 | 2 | 3, d: Difficulty, exclude: string[]) {
    const tasks = getTasksForDifficulty(allTasks, t, d, exclude)
    setTaskQueue(tasks.slice(0, 7))
    setTaskIndex(0)
    setFeedback(null)
    taskStartTime.current = Date.now()
  }

  useEffect(() => {
    loadQueue(currentTier, currentDiff, doneIds)
  }, [])

  // Reset timer when task changes
  useEffect(() => {
    taskStartTime.current = Date.now()
  }, [taskIndex])

  // ── Current task ───────────────────────────────────────────────────────────
  const currentTask = taskQueue[taskIndex] ?? null
  const totalTasks  = taskQueue.length
  const taskNumber  = taskIndex + 1
  const isLast      = taskIndex + 1 >= taskQueue.length

  // ── Answer handler ─────────────────────────────────────────────────────────
  function handleAnswer(correct: boolean, responseTime: number, hintsUsed: number) {
    if (!currentTask || feedback) return   // prevent double-fire
    const record: AnswerRecord = {
      taskId:       currentTask.id,
      correct,
      responseTime,
      hintsUsed,
    }
    setAnswers(prev => [...prev, record])
    setDoneIds(prev => [...prev, currentTask.id])
    setFeedback({ correct })
  }

  // ── Next task ──────────────────────────────────────────────────────────────
  function handleNext() {
    setFeedback(null)
    if (!isLast) {
      setTaskIndex(i => i + 1)
    } else {
      // Stage 3 will add promotion logic here
      // For now pass a placeholder result
      const passCount = answers.filter(a => a.correct).length + (feedback?.correct ? 1 : 0)
      const passed    = passCount / totalTasks >= 0.7
      onSessionComplete?.({ passed, mastery: passed ? 0.75 : 0.45 })
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
        height: '100vh',
        color: 'var(--text2, #9da3b8)', fontSize: 15,
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    }}>
      {/* Quit confirmation */}
      {showQuit && (
        <QuitConfirm
          onStay={() => setShowQuit(false)}
          onQuit={() => { setShowQuit(false); onGoBack?.() }}
        />
      )}

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <button
          onClick={() => setShowQuit(true)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text2, #9da3b8)',
            fontSize: 20, padding: 4,
            lineHeight: 1,
          }}
        >
          ←
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontSize: 15, fontWeight: 700,
            color: 'var(--text, #f0f1f5)',
          }}>
            {skillName}
          </div>
          <div style={{
            fontSize: 11,
            color: 'var(--text3, #6b7290)',
            marginTop: 2,
          }}>
            Tier {currentTier} · {DIFFICULTY_LABEL[currentDiff]}
          </div>
        </div>

        <div style={{
          fontSize: 12,
          color: 'var(--text3, #6b7290)',
          minWidth: 36, textAlign: 'right',
        }}>
          {taskNumber}/{totalTasks}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', flexShrink: 0, width: '100%' }}>
        <div style={{
          height: '100%',
          width: `${(taskNumber / totalTasks) * 100}%`,
          background: 'var(--accent, #6c63ff)',
          borderRadius: 2,
          transition: 'width 0.35s ease',
        }} />
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 0,
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
       

        {/* Interaction component */}
        {renderInteraction(currentTask)}

        {/* Feedback panel — shown after answer */}
        {feedback && (
          <FeedbackPanel
            correct={feedback.correct}
            explanation={currentTask.explanation}
            isLast={isLast}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  )
}
