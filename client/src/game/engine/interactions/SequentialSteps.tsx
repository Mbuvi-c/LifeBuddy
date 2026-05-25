// SequentialSteps.tsx
// Learner taps steps in the correct order one by one.
// Each tap locks that step into the sequence.
// Wrong order → highlights mistake, learner tries again.
// Hover/long press → plays option audio
// All correct → plays verdict audio

import { useState, useRef } from 'react'
import type { Task } from '../../tasks/taskData_money'
import { playOptionAudio, playVerdictAudio, stop } from '../audioManager'

interface SequentialStepsProps {
  task: Task
  learnerId: string
  onAnswer: (correct: boolean, responseTime: number, hintsUsed: number) => void
  hintsAllowed: boolean
}

export default function SequentialSteps({ task, learnerId, onAnswer, hintsAllowed }: SequentialStepsProps) {
  const steps = task.steps ?? []
  const totalSteps = steps.length

  // Track the order learner tapped
  const [tappedOrder, setTappedOrder]   = useState<string[]>([])
  const [wrongStep, setWrongStep]       = useState<string | null>(null)
  const [completed, setCompleted]       = useState(false)
  const [showHint, setShowHint]         = useState(false)
  const [hintsUsed, setHintsUsed]       = useState(0)
  const [mistakes, setMistakes]         = useState(0)
  const startTime                       = useRef(Date.now())
  const longPressTimer                  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Correct order sorted by step.order
  const correctOrder = [...steps].sort((a, b) => a.order - b.order)

  const isTapped = (stepId: string) => tappedOrder.includes(stepId)

  const getExpectedNext = () => {
    const nextIndex = tappedOrder.length
    return correctOrder[nextIndex]?.id ?? null
  }

  const handleHoverStart = (stepId: string) => {
    if (completed || isTapped(stepId)) return
    playOptionAudio(task.id, task.skill, stepId)
  }

  const handleHoverEnd = () => {
    if (completed) return
    stop()
  }

  const handleTouchStart = (stepId: string) => {
    longPressTimer.current = setTimeout(() => {
      if (!isTapped(stepId)) playOptionAudio(task.id, task.skill, stepId)
    }, 400)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }

  const handleTap = (stepId: string) => {
    if (completed || isTapped(stepId)) return

    const expected = getExpectedNext()

    if (stepId === expected) {
      // Correct step
      setWrongStep(null)
      const newOrder = [...tappedOrder, stepId]
      setTappedOrder(newOrder)

      if (newOrder.length === totalSteps) {
        // All steps completed
        setCompleted(true)
        const correct = mistakes === 0
        const responseTime = Date.now() - startTime.current
        playVerdictAudio(correct, () => {
          onAnswer(correct, responseTime, hintsUsed)
        })
      }
    } else {
      // Wrong step
      setWrongStep(stepId)
      setMistakes(m => m + 1)
      setTimeout(() => setWrongStep(null), 800)
    }
  }

  const getStepStyle = (stepId: string) => {
    const tappedIndex = tappedOrder.indexOf(stepId)
    const isTappedStep = tappedIndex !== -1
    const isWrong = wrongStep === stepId

    if (isWrong) return { ...s.step, ...s.stepWrong }
    if (isTappedStep) return { ...s.step, ...s.stepDone }
    if (completed) return { ...s.step, opacity: 0.5 }
    return s.step
  }

  return (
    <div style={s.wrap}>
      {/* Instruction */}
      <div style={s.question}>{task.question}</div>

      {/* Progress indicator */}
      <div style={s.progress}>
        <div style={s.progressTrack}>
          <div style={{
            ...s.progressFill,
            width: `${(tappedOrder.length / totalSteps) * 100}%`,
          }} />
        </div>
        <span style={s.progressLabel}>
          {tappedOrder.length} of {totalSteps} steps placed
        </span>
      </div>

      {/* Steps — shown scrambled (original order from task data) */}
      <div style={s.steps}>
        {steps.map((step, i) => {
          const tappedIndex = tappedOrder.indexOf(step.id)
          const isTappedStep = tappedIndex !== -1

          return (
            <button
              key={step.id}
              style={getStepStyle(step.id)}
              onMouseEnter={() => handleHoverStart(step.id)}
              onMouseLeave={handleHoverEnd}
              onTouchStart={() => handleTouchStart(step.id)}
              onTouchEnd={handleTouchEnd}
              onClick={() => handleTap(step.id)}
              disabled={completed || isTappedStep}
            >
              {/* Position badge */}
              <span style={{
                ...s.badge,
                background: isTappedStep
                  ? completed && mistakes === 0
                    ? 'rgba(74,222,128,0.3)'
                    : 'rgba(168,85,247,0.3)'
                  : 'rgba(168,85,247,0.1)',
                color: isTappedStep ? '#f0eaff' : '#a855f7',
                border: isTappedStep
                  ? '1px solid rgba(168,85,247,0.5)'
                  : '1px solid rgba(168,85,247,0.2)',
              }}>
                {isTappedStep ? tappedIndex + 1 : '?'}
              </span>

              <span style={s.stepText}>{step.label}</span>

              {isTappedStep && (
                <span style={s.checkmark}>✓</span>
              )}
              {wrongStep === step.id && (
                <span style={s.wrongMark}>✗</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Hint */}
      {hintsAllowed && !completed && !showHint && (
        <button style={s.hintBtn} onClick={() => { setShowHint(true); setHintsUsed(h => h + 1) }}>
          💡 Show hint
        </button>
      )}
      {showHint && <div style={s.hintBox}>{task.hint}</div>}

      {/* Explanation after completion */}
      {completed && (
        <div style={{
          ...s.explanation,
          borderColor: mistakes === 0
            ? 'rgba(74,222,128,0.2)'
            : 'rgba(255,255,255,0.06)',
        }}>
          {mistakes === 0
            ? '🎉 Perfect order! '
            : `✓ Completed with ${mistakes} mistake${mistakes > 1 ? 's' : ''}. `}
          {task.explanation}
        </div>
      )}
    </div>
  )
}

const s: Record<string, any> = {
  wrap: {
    display: 'flex', flexDirection: 'column', gap: 14,
    padding: '0 4px',
  },
  question: {
    fontSize: 16, fontWeight: 600, color: '#f0eaff',
    lineHeight: 1.5, fontFamily: "'Syne', sans-serif",
  },
  progress: {
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  progressTrack: {
    height: 3, borderRadius: 2,
    background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: 2,
    background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
    transition: 'width 0.4s ease',
    boxShadow: '0 0 8px rgba(168,85,247,0.4)',
  },
  progressLabel: {
    fontSize: 11, color: 'rgba(240,234,255,0.4)',
    letterSpacing: '0.05em',
  },
  steps: {
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  step: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 14px', borderRadius: 14,
    background: 'rgba(168,85,247,0.05)',
    border: '1px solid rgba(168,85,247,0.15)',
    color: '#f0eaff', fontSize: 13, lineHeight: 1.5,
    cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.2s', fontFamily: 'inherit',
  },
  stepDone: {
    background: 'rgba(168,85,247,0.12)',
    border: '1px solid rgba(168,85,247,0.4)',
    cursor: 'default',
  },
  stepWrong: {
    background: 'rgba(248,113,113,0.12)',
    border: '1px solid #f87171',
    animation: 'shake 0.3s ease',
  },
  badge: {
    width: 28, height: 28, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, flexShrink: 0,
    transition: 'all 0.3s',
  },
  stepText: { flex: 1 },
  checkmark: { color: '#a855f7', fontWeight: 800, flexShrink: 0 },
  wrongMark: { color: '#f87171', fontWeight: 800, flexShrink: 0 },
  hintBtn: {
    alignSelf: 'flex-start', padding: '8px 16px',
    background: 'transparent', border: '1px solid rgba(168,85,247,0.3)',
    borderRadius: 20, color: 'rgba(168,85,247,0.8)',
    fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
  },
  hintBox: {
    padding: '12px 16px', borderRadius: 12,
    background: 'rgba(168,85,247,0.08)',
    border: '1px solid rgba(168,85,247,0.2)',
    fontSize: 13, color: 'rgba(240,234,255,0.7)', lineHeight: 1.6,
  },
  explanation: {
    padding: '12px 16px', borderRadius: 12,
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.06)',
    fontSize: 13, color: 'rgba(240,234,255,0.65)', lineHeight: 1.6,
  },
}