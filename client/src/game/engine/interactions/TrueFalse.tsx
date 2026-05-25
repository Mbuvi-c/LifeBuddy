// TrueFalse.tsx
// A statement is shown. Learner taps True or False.
// Hover/long press → plays option audio
// Click/tap → plays verdict audio then shows result

import { useState, useRef } from 'react'
import type { Task } from '../../tasks/taskData_money'
import { playOptionAudio, playVerdictAudio, stop } from '../audioManager'

interface TrueFalseProps {
  task: Task
  learnerId: string
  onAnswer: (correct: boolean, responseTime: number, hintsUsed: number) => void
  hintsAllowed: boolean
}

export default function TrueFalse({ task, learnerId, onAnswer, hintsAllowed }: TrueFalseProps) {
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

  const trueOption  = task.options?.find(o => o.id === 'true')
  const falseOption = task.options?.find(o => o.id === 'false')
  const correctId   = task.options?.find(o => o.correct)?.id

  const getStyle = (optionId: string) => {
    const isSelected = selected === optionId
    const isCorrect  = correctId === optionId
    if (!revealed) return optionId === 'true' ? s.trueBtn : s.falseBtn
    if (isSelected && isCorrect)  return { ...s.trueBtn,  ...s.correct }
    if (isSelected && !isCorrect) return { ...s.trueBtn,  ...s.wrong }
    if (!isSelected && isCorrect) return { ...(optionId === 'true' ? s.trueBtn : s.falseBtn), ...s.correctDim }
    return optionId === 'true' ? s.trueBtn : s.falseBtn
  }

  return (
    <div style={s.wrap}>
      {/* Statement */}
      <div style={s.statement}>{task.question}</div>

      {/* True / False buttons */}
      <div style={s.btnRow}>
        <button
          style={getStyle('true')}
          onMouseEnter={() => handleHoverStart('true')}
          onMouseLeave={handleHoverEnd}
          onTouchStart={() => handleTouchStart('true')}
          onTouchEnd={handleTouchEnd}
          onClick={() => handleSelect('true')}
          disabled={revealed}
        >
          <span style={s.tfIcon}>✓</span>
          <span>True</span>
          {revealed && selected === 'true' && (
            <span style={s.verdict}>{correctId === 'true' ? '✓' : '✗'}</span>
          )}
        </button>

        <button
          style={getStyle('false')}
          onMouseEnter={() => handleHoverStart('false')}
          onMouseLeave={handleHoverEnd}
          onTouchStart={() => handleTouchStart('false')}
          onTouchEnd={handleTouchEnd}
          onClick={() => handleSelect('false')}
          disabled={revealed}
        >
          <span style={s.tfIcon}>✗</span>
          <span>False</span>
          {revealed && selected === 'false' && (
            <span style={s.verdict}>{correctId === 'false' ? '✓' : '✗'}</span>
          )}
        </button>
      </div>

      {/* Hint */}
      {hintsAllowed && !revealed && !showHint && (
        <button style={s.hintBtn} onClick={() => { setShowHint(true); setHintsUsed(h => h + 1) }}>
          💡 Show hint
        </button>
      )}
      {showHint && (
        <div style={s.hintBox}>{task.hint}</div>
      )}

      {/* Explanation */}
      {revealed && (
        <div style={s.explanation}>{task.explanation}</div>
      )}
    </div>
  )
}

const s: Record<string, any> = {
  wrap: {
    display: 'flex', flexDirection: 'column', gap: 20,
    padding: '0 4px',
  },
  statement: {
    fontSize: 17, fontWeight: 600, color: '#f0eaff',
    lineHeight: 1.6, fontFamily: "'Syne', sans-serif",
    padding: '16px 20px', borderRadius: 16,
    background: 'rgba(168,85,247,0.06)',
    border: '1px solid rgba(168,85,247,0.15)',
  },
  btnRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
  },
  trueBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 8, padding: '24px 16px', borderRadius: 18,
    background: 'rgba(74,222,128,0.08)',
    border: '1px solid rgba(74,222,128,0.25)',
    color: '#4ade80', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
  },
  falseBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 8, padding: '24px 16px', borderRadius: 18,
    background: 'rgba(248,113,113,0.08)',
    border: '1px solid rgba(248,113,113,0.25)',
    color: '#f87171', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
  },
  correct: {
    background: 'rgba(74,222,128,0.2)',
    border: '2px solid #4ade80',
    boxShadow: '0 0 20px rgba(74,222,128,0.2)',
  },
  wrong: {
    background: 'rgba(248,113,113,0.2)',
    border: '2px solid #f87171',
    boxShadow: '0 0 20px rgba(248,113,113,0.2)',
  },
  correctDim: {
    background: 'rgba(74,222,128,0.1)',
    border: '1px solid rgba(74,222,128,0.5)',
  },
  tfIcon: { fontSize: 28 },
  verdict: { fontSize: 20, fontWeight: 800 },
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