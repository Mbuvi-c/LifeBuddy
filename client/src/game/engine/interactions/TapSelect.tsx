// TapSelect.tsx
// Learner taps the correct answer from a list of options.
// Hover/long press → plays option audio
// Click/tap → plays verdict audio then shows result

import { useState, useRef } from 'react'
import type { Task } from '../../tasks/taskData_money'
import { playOptionAudio, playVerdictAudio, stop } from '../audioManager'

interface TapSelectProps {
  task: Task
  learnerId: string
  onAnswer: (correct: boolean, responseTime: number, hintsUsed: number) => void
  hintsAllowed: boolean
  showHint?: boolean
}

export default function TapSelect({ task, learnerId, onAnswer, hintsAllowed, showHint: followUpHint = false }: TapSelectProps) {
  const [selected, setSelected]     = useState<string | null>(null)
  const [revealed, setRevealed]     = useState(false)
  const [showHint, setShowHint]     = useState(false)
  const [hintsUsed, setHintsUsed]   = useState(0)
  const startTime                   = useRef(Date.now())
  const longPressTimer               = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleHoverStart = (optionId: string) => {
    if (revealed) return
    playOptionAudio(task.id, task.skill, optionId)
  }

  const handleHoverEnd = () => {
    if (revealed) return
    stop()
  }

  // Mobile long press
  const handleTouchStart = (optionId: string) => {
    longPressTimer.current = setTimeout(() => {
      playOptionAudio(task.id, task.skill, optionId)
    }, 400)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
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

  const handleHint = () => {
    setShowHint(true)
    setHintsUsed(h => h + 1)
  }

  return (
    <div style={s.wrap}>
      <style>{`
        @keyframes pulseHint { 0%,100% { opacity:1; transform:translateX(0); } 50% { opacity:0.4; transform:translateX(-4px); } }
        .pulse-hint { animation: pulseHint 0.8s ease-in-out infinite !important; }
      `}</style>
      
      {/* Question */}
      <div style={s.question}>{task.question}</div>
      {task.context && <div style={s.context}>{task.context}</div>}

      {/* Options */}
      <div style={s.options}>
        {task.options?.map(option => {
          const isSelected = selected === option.id
          const isCorrect  = option.correct
          let bg = 'rgba(168,85,247,0.05)'
          let border = 'rgba(168,85,247,0.15)'
          let color = '#f0eaff'
          if (revealed && isSelected && isCorrect)  { bg = 'rgba(74,222,128,0.15)'; border = '#4ade80'; color = '#4ade80' }
          if (revealed && isSelected && !isCorrect) { bg = 'rgba(248,113,113,0.15)'; border = '#f87171'; color = '#f87171' }
          if (revealed && !isSelected && isCorrect) { bg = 'rgba(74,222,128,0.08)'; border = 'rgba(74,222,128,0.4)'; color = '#4ade80' }

          return (
            <button
              key={option.id}
              style={{ ...s.option, background: bg, border: `1px solid ${border}`, color }}
              onMouseEnter={() => handleHoverStart(option.id)}
              onMouseLeave={handleHoverEnd}
              onTouchStart={() => handleTouchStart(option.id)}
              onTouchEnd={handleTouchEnd}
              onClick={() => handleSelect(option.id)}
              disabled={revealed}
            >
              <span style={s.optionDot(isSelected, revealed, isCorrect)} />
              <span style={s.optionLabel}>{option.label}</span>
              {revealed && isSelected && (
                <span style={s.verdict}>{isCorrect ? '✓' : '✗'}</span>
              )}
              {revealed && !isSelected && isCorrect && (
                <span style={s.verdict}>✓</span>
              )}
              {!revealed && followUpHint && isCorrect && (
                <span style={{
                  fontSize: 18,
                  display: 'inline-block',
                  animation: 'none',
                  opacity: 1,
                }} className="pulse-hint">👈</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Hint */}
      {hintsAllowed && !revealed && !showHint && (
        <button style={s.hintBtn} onClick={handleHint}>
          💡 Show hint
        </button>
      )}
      {showHint && (
        <div style={s.hintBox}>{task.hint}</div>
      )}

      {/* Explanation after answer */}
      {revealed && (
        <div style={s.explanation}>{task.explanation}</div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const s: Record<string, any> = {
  wrap: {
    display: 'flex', flexDirection: 'column', gap: 16,
    padding: '0 4px',
  },
  question: {
    fontSize: 17, fontWeight: 600, color: '#f0eaff',
    lineHeight: 1.5, fontFamily: "'Syne', sans-serif",
  },
  context: {
    fontSize: 13, color: 'rgba(240,234,255,0.55)',
    lineHeight: 1.6, fontStyle: 'italic',
  },
  options: {
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  option: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 16px', borderRadius: 14,
    cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.2s ease', fontFamily: 'inherit',
    fontSize: 14, lineHeight: 1.4,
  },
  optionDot: (selected: boolean, revealed: boolean, correct: boolean) => ({
    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
    background: revealed && correct ? '#4ade80' :
                revealed && selected ? '#f87171' :
                selected ? '#a855f7' : 'rgba(168,85,247,0.3)',
    transition: 'all 0.2s',
  }),
  optionLabel: { flex: 1 },
  verdict: {
    fontSize: 16, fontWeight: 700, flexShrink: 0,
  },
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