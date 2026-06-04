// SessionSummary.tsx
// End of session results screen.
// Animated mastery bar from previous to current value.
// Shows: mastery gain, accuracy, weak topics, optional challenge prompt.
// Frustration level intentionally hidden from learner.

import { useState, useEffect, useRef } from 'react'

interface WeakTopic {
  topic: string
  mastery: number
}

interface HighPerformerGap {
  topic: string
  mastery: number
}

interface SessionSummaryProps {
  skillId: string
  skillName: string
  tierCompleted: number
  mastery: number
  previousMastery: number
  tasksAttempted: number
  tasksCorrect: number
  weakTopics: WeakTopic[]
  highPerformerGaps: HighPerformerGap[]
  followUpTriggered: boolean
  promotedWithRemediation: boolean
  onContinue: () => void
  onOptionalChallenge: () => void
  onHome: () => void
}

const TIER_NAMES: Record<number, string> = {
  1: 'Foundation',
  2: 'Application',
  3: 'Independence',
}

// Upgrade sound — plays when mastery bar animates
function playUpgradeSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const notes = [523, 659, 784, 1047] // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12)
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.12 + 0.05)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.12 + 0.25)
      osc.start(ctx.currentTime + i * 0.12)
      osc.stop(ctx.currentTime + i * 0.12 + 0.3)
    })
  } catch {
    // Audio not supported — fail silently
  }
}

export default function SessionSummary({
  skillId,
  skillName,
  tierCompleted,
  mastery,
  previousMastery,
  tasksAttempted,
  tasksCorrect,
  weakTopics,
  highPerformerGaps,
  followUpTriggered,
  promotedWithRemediation,
  onContinue,
  onOptionalChallenge,
  onHome,
}: SessionSummaryProps) {
  const [barWidth, setBarWidth]             = useState(previousMastery * 100)
  const [showStats, setShowStats]           = useState(false)
  const [showWeakTopics, setShowWeakTopics] = useState(false)
  const [showChallenge, setShowChallenge]   = useState(false)
  const [challengeDecided, setChallengeDecided] = useState(false)
  const hasGaps = highPerformerGaps.length > 0 && mastery >= 0.7 && mastery < 1.0
  const soundPlayed = useRef(false)

  const masteryGain    = mastery - previousMastery
  const accuracy       = tasksAttempted > 0
    ? Math.round((tasksCorrect / tasksAttempted) * 100)
    : 0
  const masteryPercent = Math.round(mastery * 100)
  const prevPercent    = Math.round(previousMastery * 100)

  // Sequence: bar animates → stats appear → weak topics → challenge prompt
  useEffect(() => {
    // Step 1 — animate bar after short delay
    const barTimer = setTimeout(() => {
      setBarWidth(mastery * 100)
      if (!soundPlayed.current) {
        soundPlayed.current = true
        playUpgradeSound()
      }
    }, 600)

    // Step 2 — show stats
    const statsTimer = setTimeout(() => setShowStats(true), 1800)

    // Step 3 — show weak topics
    const weakTimer = setTimeout(() => setShowWeakTopics(true), 2400)

    // Step 4 — show challenge prompt if applicable
    const challengeTimer = setTimeout(() => {
      if (hasGaps) setShowChallenge(true)
    }, 3200)

    return () => {
      clearTimeout(barTimer)
      clearTimeout(statsTimer)
      clearTimeout(weakTimer)
      clearTimeout(challengeTimer)
    }
  }, [])

  return (
    <div style={s.root}>
      <div style={s.card}>

        {/* ── Header ── */}
        <div style={s.header}>
          <div style={s.headerIcon}>
            {tierCompleted === 3 ? '🎉' : '⭐'}
          </div>
          <div style={s.headerText}>
            <div style={s.tierBadge}>
              Tier {tierCompleted} — {TIER_NAMES[tierCompleted]} Complete
            </div>
            <div style={s.skillName}>{skillName}</div>
          </div>
        </div>

        {/* ── Mastery bar ── */}
        <div style={s.masterySection}>
          <div style={s.masteryRow}>
            <span style={s.masteryLabel}>Mastery</span>
            <span style={s.masteryValue}>{masteryPercent}%</span>
          </div>

          {/* Track */}
          <div style={s.track}>
            {/* Previous mastery marker */}
            <div style={{
              ...s.prevMarker,
              left: `${prevPercent}%`,
            }}>
              <div style={s.prevMarkerLine} />
              <div style={s.prevMarkerLabel}>{prevPercent}%</div>
            </div>

            {/* Animated fill */}
            <div style={{
              ...s.fill,
              width: `${barWidth}%`,
            }} />

            {/* Gain label rides the bar */}
            {masteryGain > 0 && barWidth > prevPercent + 2 && (
              <div style={{
                ...s.gainLabel,
                left: `${barWidth}%`,
              }}>
                +{Math.round(masteryGain * 100)}%
              </div>
            )}
          </div>

          <div style={s.masterySubrow}>
            <span style={s.masteryPrev}>Was {prevPercent}%</span>
            {masteryGain > 0 && (
              <span style={s.masteryGain}>
                +{Math.round(masteryGain * 100)}% gained
              </span>
            )}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{
          ...s.statsRow,
          opacity: showStats ? 1 : 0,
          transform: showStats ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.4s ease',
        }}>
          <div style={s.statCard}>
            <div style={s.statValue}>{accuracy}%</div>
            <div style={s.statLabel}>Accuracy</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statValue}>{tasksCorrect}</div>
            <div style={s.statLabel}>Correct</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statValue}>{tasksAttempted}</div>
            <div style={s.statLabel}>Attempted</div>
          </div>
          {followUpTriggered && (
            <div style={{ ...s.statCard, ...s.statCardGuided }}>
              <div style={s.statValue}>{promotedWithRemediation ? '💪' : '💡'}</div>
              <div style={s.statLabel}>{promotedWithRemediation ? 'Extra practice done' : 'Follow-up given'}</div>
            </div>
          )}
        </div>

        {/* ── Weak topics ── */}
        {weakTopics.length > 0 && showWeakTopics && (
          <div style={{
            ...s.weakBox,
            opacity: showWeakTopics ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}>
            <div style={s.weakTitle}>📋 Topics to revisit</div>
            <div style={s.weakList}>
              {weakTopics.map((t, i) => (
                <div key={i} style={s.weakItem}>
                  <div style={s.weakItemDot} />
                  <span style={s.weakItemText}>
                    {t.topic}
                    <span style={s.weakItemMastery}>
                      {Math.round(t.mastery * 100)}% mastery
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <div style={s.weakNote}>
              Your caregiver has been notified to help you practise these.
            </div>
          </div>
        )}

        {/* ── Optional challenge prompt ── */}
        {showChallenge && !challengeDecided && (
          <div style={s.challengeBox}>
            <div style={s.challengeTitle}>
              You did amazing! 🌟
            </div>
            <div style={s.challengeText}>
              There are a few areas where you could get even better.
              Would you like a quick challenge?
            </div>
            <div style={s.challengeBtns}>
              <button
                style={s.challengeYes}
                onClick={() => {
                  setChallengeDecided(true)
                  onOptionalChallenge()
                }}
              >
                Yes, let's go!
              </button>
              <button
                style={s.challengeLater}
                onClick={() => setChallengeDecided(true)}
              >
                Maybe later
              </button>
            </div>
          </div>
        )}

        {/* ── Gentle message if follow-up was triggered ── */}
        {followUpTriggered && showStats && (
          <div style={s.gentleMessage}>
            {promotedWithRemediation
              ? 'Great effort on the extra practice — that\'s how you grow! 💪'
              : 'This one was tricky — let\'s keep going and come back to it later! 💪'}
          </div>
        )}

        {/* ── Nav buttons ── */}
        {(!showChallenge || challengeDecided) && (
          <div style={s.navRow}>
            <button style={s.homeBtn} onClick={onHome}>
              Home
            </button>
            <button style={s.continueBtn} onClick={onContinue}>
              {tierCompleted === 3 ? 'Next Skill' : 'Next Tier'} →
            </button>
          </div>
        )}

      </div>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: '#f0eaff',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#0e0a1a',
    border: '1px solid rgba(168,85,247,0.15)',
    borderRadius: 28,
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    boxShadow: '0 0 60px rgba(168,85,247,0.08)',
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  headerIcon: {
    fontSize: 40,
    flexShrink: 0,
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  tierBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#a855f7',
  },
  skillName: {
    fontSize: 18,
    fontWeight: 700,
    color: '#f0eaff',
    fontFamily: "'Syne', sans-serif",
    lineHeight: 1.2,
  },

  // Mastery bar
  masterySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '18px 20px',
    borderRadius: 18,
    background: 'rgba(168,85,247,0.05)',
    border: '1px solid rgba(168,85,247,0.12)',
  },
  masteryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masteryLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(240,234,255,0.5)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  masteryValue: {
    fontSize: 28,
    fontWeight: 800,
    color: '#a855f7',
    fontFamily: "'Syne', sans-serif",
  },
  track: {
    height: 16,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.06)',
    overflow: 'visible',
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: 8,
    background: 'linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)',
    transition: 'width 1.2s cubic-bezier(.4,0,.2,1)',
    boxShadow: '0 0 16px rgba(168,85,247,0.5)',
    position: 'relative',
  },
  prevMarker: {
    position: 'absolute',
    top: -6,
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
  },
  prevMarkerLine: {
    width: 2,
    height: 28,
    background: 'rgba(255,255,255,0.25)',
    borderRadius: 1,
  },
  prevMarkerLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.35)',
    marginTop: 2,
    whiteSpace: 'nowrap',
  },
  gainLabel: {
    position: 'absolute',
    top: -22,
    transform: 'translateX(-50%)',
    fontSize: 11,
    fontWeight: 700,
    color: '#c084fc',
    whiteSpace: 'nowrap',
    transition: 'left 1.2s cubic-bezier(.4,0,.2,1)',
  },
  masterySubrow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  masteryPrev: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  },
  masteryGain: {
    fontSize: 12,
    fontWeight: 700,
    color: '#c084fc',
  },

  // Stats
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },
  statCard: {
    padding: '14px 10px',
    borderRadius: 14,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  statCardGuided: {
    gridColumn: '1 / -1',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    padding: '10px 16px',
    background: 'rgba(251,191,36,0.05)',
    border: '1px solid rgba(251,191,36,0.15)',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 800,
    color: '#f0eaff',
    fontFamily: "'Syne', sans-serif",
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(240,234,255,0.4)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  // Weak topics
  weakBox: {
    padding: '14px 16px',
    borderRadius: 14,
    background: 'rgba(251,191,36,0.05)',
    border: '1px solid rgba(251,191,36,0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  weakTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#fbbf24',
  },
  weakList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  weakItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  weakItemDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#fbbf24',
    flexShrink: 0,
  },
  weakItemText: {
    fontSize: 13,
    color: 'rgba(240,234,255,0.7)',
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  weakItemMastery: {
    fontSize: 11,
    color: 'rgba(251,191,36,0.6)',
    fontWeight: 600,
  },
  weakNote: {
    fontSize: 11,
    color: 'rgba(251,191,36,0.5)',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },

  // Challenge
  challengeBox: {
    padding: '18px 20px',
    borderRadius: 18,
    background: 'rgba(168,85,247,0.08)',
    border: '1px solid rgba(168,85,247,0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#f0eaff',
    fontFamily: "'Syne', sans-serif",
  },
  challengeText: {
    fontSize: 13,
    color: 'rgba(240,234,255,0.65)',
    lineHeight: 1.6,
  },
  challengeBtns: {
    display: 'flex',
    gap: 10,
    marginTop: 4,
  },
  challengeYes: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: 'none',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 4px 16px rgba(168,85,247,0.3)',
  },
  challengeLater: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 12,
    background: 'transparent',
    border: '1px solid rgba(168,85,247,0.25)',
    color: 'rgba(240,234,255,0.6)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },

  // Gentle message
  gentleMessage: {
    padding: '12px 16px',
    borderRadius: 12,
    background: 'rgba(168,85,247,0.06)',
    border: '1px solid rgba(168,85,247,0.15)',
    fontSize: 14,
    color: 'rgba(240,234,255,0.7)',
    lineHeight: 1.6,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Nav
  navRow: {
    display: 'flex',
    gap: 12,
    marginTop: 4,
  },
  homeBtn: {
    padding: '12px 20px',
    borderRadius: 12,
    background: 'transparent',
    border: '1px solid rgba(168,85,247,0.2)',
    color: 'rgba(240,234,255,0.5)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  continueBtn: {
    flex: 1,
    padding: '14px 20px',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: 'none',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 4px 20px rgba(168,85,247,0.3)',
  },
}
