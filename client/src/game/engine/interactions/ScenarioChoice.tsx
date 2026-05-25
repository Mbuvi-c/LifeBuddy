// ScenarioChoice.tsx
// Learner reads a real-world scenario and picks the best response.
// Options are longer descriptive choices — not short answers.
// Hover/long press → plays option audio
// Click/tap → plays verdict audio then shows result

import { useState, useRef } from 'react'
import type { Task } from '../../tasks/taskData_money'
import { playOptionAudio, playVerdictAudio, stop } from '../audioManager'

interface ScenarioChoiceProps {
  task: Task
  learnerId: string
  onAnswer: (correct: boolean, responseTime: number, hintsUsed: number) => void
  hintsAllowed: boolean
}

export default function ScenarioChoice({ task, learnerId, onAnswer, hintsAllowed }: ScenarioChoiceProps) {
  const [selected, setSelected]   = useState<string | null>(null)
  const [revealed, setRevealed]   = useState(false)
  const [showHint, setShowHint]   = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const startTime                 = useRef(Date.now())
  const longPressTimer            = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleHoverStart = (optionId: string) => {
    if (revealed) return
    playOptionAudio(task.id, task.skill, optionId)
  }

  const handleHoverEnd = () => {
    if (revealed) return
    stop()
  }

  const handleTouchStart = (optionId: string) => {
    longPressTimer.current = setTimeout(() => {
      playOptionAudio(task.id, task.skill, optionId)
    }, 400)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }

  const handleSelect = (optionId: string) => {
    if (revealed) return
    const correct = task.options?.find(o => o.id === optionId)?.correct ?? false
    setSelected(optionId)
    setRevealed(true)
    const responseTime = Date.now() - startTime.current
    playVerdictAudio(correct, () => {
      onAnswer(correct, responseTime, hintsUsed)
    })
  }

  const getOptionStyle = (optionId: string) => {
    const isSelected = selected === optionId
    const isCorrect  = task.options?.find(o => o.id === optionId)?.correct ?? false
    if (!revealed) return s.option
    if (isSelected && isCorrect)  return { ...s.option, ...s.optionCorrect }
    if (isSelected && !isCorrect) return { ...s.option, ...s.optionWrong }
    if (!isSelected && isCorrect) return { ...s.option, ...s.optionCorrectDim }
    return { ...s.option, opacity: 0.4 }
  }

  return (
    <div style={s.wrap}>

      {/* Scenario context box */}
      {task.context && (
        <div style={s.contextBox}>
          <div style={s.contextLabel}>Situation</div>
          <div style={s.contextText}>{task.context}</div>
        </div>
      )}

      {/* Question */}
      <div style={s.question}>{task.question}</div>

      {/* Options */}
      <div style={s.options}>
        {task.options?.map((option, i) => {
          const isSelected = selected === option.id
          const isCorrect  = option.correct
          return (
            <button
              key={option.id}
              style={getOptionStyle(option.id)}
              onMouseEnter={() => handleHoverStart(option.id)}
              onMouseLeave={handleHoverEnd}
              onTouchStart={() => handleTouchStart(option.id)}
              onTouchEnd={handleTouchEnd}
              onClick={() => handleSelect(option.id)}
              disabled={revealed}
            >
              <span style={s.optionLetter}>{String.fromCharCode(65 + i)}</span>
              <span style={s.optionText}>{option.label}</span>
              {revealed && isSelected && (
                <span style={isCorrect ? s.tick : s.cross}>
                  {isCorrect ? '✓' : '✗'}
                </span>
              )}
              {revealed && !isSelected && isCorrect && (
                <span style={s.tick}>✓</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Hint */}
      {hintsAllowed && !revealed && !showHint && (
        <button style={s.hintBtn} onClick={() => { setShowHint(true); setHintsUsed(h => h + 1) }}>
          💡 Show hint
        </button>
      )}
      {showHint && <div style={s.hintBox}>{task.hint}</div>}

      {/* Explanation */}
      {revealed && <div style={s.explanation}>{task.explanation}</div>}
    </div>
  )
}

const s: Record<string, any> = {
  wrap: {
    display: 'flex', flexDirection: 'column', gap: 14,
    padding: '0 4px',
  },
  contextBox: {
    padding: '14px 16px', borderRadius: 14,
    background: 'rgba(168,85,247,0.06)',
    border: '1px solid rgba(168,85,247,0.2)',
  },
  contextLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: '#a855f7',
    marginBottom: 6,
  },
  contextText: {
    fontSize: 14, color: 'rgba(240,234,255,0.75)',
    lineHeight: 1.65,
  },
  question: {
    fontSize: 16, fontWeight: 600, color: '#f0eaff',
    lineHeight: 1.5, fontFamily: "'Syne', sans-serif",
  },
  options: {
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  option: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: '14px 16px', borderRadius: 14,
    background: 'rgba(168,85,247,0.05)',
    border: '1px solid rgba(168,85,247,0.15)',
    color: '#f0eaff', fontSize: 14, lineHeight: 1.5,
    cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.2s', fontFamily: 'inherit',
  },
  optionCorrect: {
    background: 'rgba(74,222,128,0.12)',
    border: '1px solid #4ade80',
    color: '#4ade80',
    boxShadow: '0 0 16px rgba(74,222,128,0.15)',
  },
  optionWrong: {
    background: 'rgba(248,113,113,0.12)',
    border: '1px solid #f87171',
    color: '#f87171',
  },
  optionCorrectDim: {
    background: 'rgba(74,222,128,0.06)',
    border: '1px solid rgba(74,222,128,0.35)',
    color: '#4ade80',
  },
  optionLetter: {
    width: 24, height: 24, borderRadius: '50%',
    background: 'rgba(168,85,247,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: '#a855f7',
    flexShrink: 0,
  },
  optionText: { flex: 1 },
  tick:  { color: '#4ade80', fontWeight: 800, fontSize: 16, flexShrink: 0 },
  cross: { color: '#f87171', fontWeight: 800, fontSize: 16, flexShrink: 0 },
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