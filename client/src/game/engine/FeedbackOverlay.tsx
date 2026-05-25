// FeedbackOverlay.tsx
// Brief animated overlay shown after each task attempt.
// Correct → green checkmark + encouraging message
// Wrong → red X + gentle redirect message
// Auto-dismisses after 1.5 seconds

import { useEffect, useState } from 'react'

interface FeedbackOverlayProps {
  correct: boolean
  onDismiss: () => void
  guidedMode?: boolean
}

const CORRECT_MESSAGES = [
  'Vizuri sana! Well done.',
  'Excellent! Keep going.',
  'Ndio! That is right.',
  'Perfect! You got it.',
  'Great work! 🎉',
]

const WRONG_MESSAGES = [
  'Jaribu tena — try again.',
  'Not quite — keep trying.',
  'Karibu — you are close.',
  'Almost there — try once more.',
]

const GUIDED_MESSAGE = 'Look at the answer and tap it to continue.'

export default function FeedbackOverlay({ correct, onDismiss, guidedMode }: FeedbackOverlayProps) {
  const [visible, setVisible] = useState(false)

  const message = guidedMode
    ? GUIDED_MESSAGE
    : correct
      ? CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)]
      : WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)]

  useEffect(() => {
    // Fade in
    const showTimer = setTimeout(() => setVisible(true), 50)
    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, guidedMode ? 2500 : 1500)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(dismissTimer)
    }
  }, [])

  return (
    <div style={{
      ...s.overlay,
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.92)',
    }}>
      <div style={{
        ...s.card,
        borderColor: guidedMode
          ? 'rgba(251,191,36,0.4)'
          : correct
            ? 'rgba(74,222,128,0.4)'
            : 'rgba(248,113,113,0.4)',
        boxShadow: guidedMode
          ? '0 0 40px rgba(251,191,36,0.15)'
          : correct
            ? '0 0 40px rgba(74,222,128,0.15)'
            : '0 0 40px rgba(248,113,113,0.15)',
      }}>

        {/* Icon */}
        <div style={{
          ...s.iconWrap,
          background: guidedMode
            ? 'rgba(251,191,36,0.15)'
            : correct
              ? 'rgba(74,222,128,0.15)'
              : 'rgba(248,113,113,0.15)',
        }}>
          <span style={s.icon}>
            {guidedMode ? '💡' : correct ? '✓' : '✗'}
          </span>
        </div>

        {/* Message */}
        <div style={{
          ...s.message,
          color: guidedMode
            ? '#fbbf24'
            : correct ? '#4ade80' : '#f87171',
        }}>
          {message}
        </div>

      </div>
    </div>
  )
}

const s: Record<string, any> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    background: 'rgba(6,4,13,0.7)',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: '32px 40px',
    borderRadius: 24,
    background: 'rgba(14,10,26,0.95)',
    border: '1px solid',
    maxWidth: 280,
    width: '80%',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 36,
    fontWeight: 800,
  },
  message: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: 1.5,
    fontFamily: "'Syne', sans-serif",
  },
}