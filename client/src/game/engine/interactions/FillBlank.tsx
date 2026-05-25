// FillBlank.tsx
// A sentence with a missing word. Learner taps the correct word from options.
// Hover/long press → plays option audio
// Click/tap → plays verdict audio then shows result

import { useState, useRef } from 'react'
import type { Task } from '../../tasks/taskData_money'
import { playOptionAudio, playVerdictAudio, stop } from '../audioManager'

interface FillBlankProps {
  task: Task
  learnerId: string
  onAnswer: (correct: boolean, responseTime: number, hintsUsed: number) => void
  hintsAllowed: boolean
}

export default function FillBlank({ task, learnerId, onAnswer, hintsAllowed }: FillBlankProps) {
  const [selected, setSelected]   = useState<string | null>(null)
  const [revealed, setRevealed]   = useState(false)
  const [showHint, setShowHint]   = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const startTime                 = useRef(Date.now())
  const longPressTimer            = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Split question on ___ to render the blank
  const parts = task.question.split('___')
  const selectedLabel = task.options?.find(o => o.id === selected)?.label ?? '___'
  const correctOption = task.options?.find(o => o.correct)

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

      {/* Sentence with blank */}
      <div style={s.sentenceBox}>
        <span style={s.sentenceText}>{parts[0]}</span>
        <span style={{
          ...s.blank,
          ...(revealed && selected
            ? task.options?.find(o => o.id === selected)?.correct
              ? s.blankCorrect
              : s.blankWrong
            : {})
        }}>
          {selected ? selectedLabel : '___'}
        </span>
        {parts[1] && <span style={s.sentenceText}>{parts[1]}</span>}
      </div>

      {task.context && <div style={s.context}>{task.context}</div>}

      {/* Options */}
      <div style={s.options}>
        {task.options?.map(option => (
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
            {option.label}
            {revealed && option.correct && <span style={s.tick}> ✓</span>}
            {revealed && selected === option.id && !option.correct && <span style={s.cross}> ✗</span>}
          </button>
        ))}
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
    display: 'flex', flexDirection: 'column', gap: 16,
    padding: '0 4px',
  },
  sentenceBox: {
    fontSize: 17, fontWeight: 500, color: '#f0eaff',
    lineHeight: 1.8, padding: '16px 20px', borderRadius: 16,
    background: 'rgba(168,85,247,0.06)',
    border: '1px solid rgba(168,85,247,0.15)',
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6,
    fontFamily: "'DM Sans', sans-serif",
  },
  sentenceText: { lineHeight: 1.8 },
  blank: {
    display: 'inline-block',
    minWidth: 80, padding: '2px 12px',
    borderRadius: 8, fontWeight: 700,
    background: 'rgba(168,85,247,0.15)',
    border: '1px dashed rgba(168,85,247,0.5)',
    color: '#a855f7', transition: 'all 0.3s',
    textAlign: 'center',
  },
  blankCorrect: {
    background: 'rgba(74,222,128,0.15)',
    border: '1px solid #4ade80',
    color: '#4ade80',
  },
  blankWrong: {
    background: 'rgba(248,113,113,0.15)',
    border: '1px solid #f87171',
    color: '#f87171',
  },
  context: {
    fontSize: 13, color: 'rgba(240,234,255,0.55)',
    lineHeight: 1.6, fontStyle: 'italic',
  },
  options: {
    display: 'flex', flexDirection: 'row',
    flexWrap: 'wrap', gap: 10,
  },
  option: {
    padding: '12px 20px', borderRadius: 12,
    background: 'rgba(168,85,247,0.08)',
    border: '1px solid rgba(168,85,247,0.2)',
    color: '#f0eaff', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  optionCorrect: {
    background: 'rgba(74,222,128,0.15)',
    border: '1px solid #4ade80',
    color: '#4ade80',
    boxShadow: '0 0 12px rgba(74,222,128,0.2)',
  },
  optionWrong: {
    background: 'rgba(248,113,113,0.15)',
    border: '1px solid #f87171',
    color: '#f87171',
  },
  optionCorrectDim: {
    background: 'rgba(74,222,128,0.08)',
    border: '1px solid rgba(74,222,128,0.4)',
    color: '#4ade80',
  },
  tick:  { color: '#4ade80', fontWeight: 800 },
  cross: { color: '#f87171', fontWeight: 800 },
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