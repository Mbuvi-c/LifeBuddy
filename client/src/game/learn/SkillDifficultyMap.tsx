import { useState, useEffect } from 'react'
import { MONEY_LEARN_DATA } from './learnData_money'
import { getLearnData } from './learnDataRegistry'
import LearnModule from './LearnModule'

type Difficulty = 'easy' | 'intermediate' | 'advanced'

interface DifficultyState {
  learnDone: boolean
  practiceDone: boolean
  stars: number
}

interface SkillDifficultyMapProps {
  skillId: string
  skillName: string
  skillIcon: string
  skillDesc: string
  learnerId: string
  onStartPractice: (difficulty: Difficulty, tier: number) => void
  onGoBack: () => void
}

const DIFFICULTIES: { key: Difficulty; label: string; desc: string }[] = [
  { key: 'easy',         label: 'Easy',         desc: 'Start here — build your foundation' },
  { key: 'intermediate', label: 'Intermediate',  desc: 'Apply what you have learned' },
  { key: 'advanced',     label: 'Advanced',      desc: 'Real-world money decisions' },
]

const TIER_CONFIG = [
  { tier: 1 as const, label: 'Foundation', sublabel: 'Tier 1' },
  { tier: 2 as const, label: 'Growing',     sublabel: 'Tier 2' },
  { tier: 3 as const, label: 'Independent', sublabel: 'Tier 3' },
]

function storageKey(skillId: string, difficulty: Difficulty, field: string, tier: number = 1) {
  return `lb_${skillId}_t${tier}_${difficulty}_${field}`
}

function loadState(skillId: string, difficulty: Difficulty, tier: number = 1): DifficultyState {
  const learnDone    = localStorage.getItem(storageKey(skillId, difficulty, 'learnDone', tier)) === 'true'
  const practiceDone = localStorage.getItem(storageKey(skillId, difficulty, 'practiceDone', tier)) === 'true'
  const stars        = parseInt(localStorage.getItem(storageKey(skillId, difficulty, 'stars', tier)) ?? '0', 10)
  return { learnDone, practiceDone, stars }
}

function saveLearnDone(skillId: string, difficulty: Difficulty, tier: number = 1) {
  localStorage.setItem(storageKey(skillId, difficulty, 'learnDone', tier), 'true')
}

export function savePracticeResult(skillId: string, difficulty: Difficulty, stars: number, tier: number = 1) {
  localStorage.setItem(storageKey(skillId, difficulty, 'practiceDone', tier), 'true')
  const existing = parseInt(localStorage.getItem(storageKey(skillId, difficulty, 'stars', tier)) ?? '0', 10)
  if (stars > existing) {
    localStorage.setItem(storageKey(skillId, difficulty, 'stars', tier), String(stars))
  }
}

function StarRow({ stars }: { stars: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{ fontSize: 15, color: i <= stars ? '#f59e0b' : 'rgba(255,255,255,0.15)' }}>★</span>
      ))}
    </div>
  )
}

export default function SkillDifficultyMap({
  skillId, skillName, skillIcon, skillDesc,
  learnerId, onStartPractice, onGoBack,
}: SkillDifficultyMapProps) {

  const [activeTier, setActiveTier] = useState<1|2|3>(1)
  const [states, setStates] = useState<Record<Difficulty, DifficultyState>>(() => ({
    easy:         loadState(skillId, 'easy', 1),
    intermediate: loadState(skillId, 'intermediate', 1),
    advanced:     loadState(skillId, 'advanced', 1),
  }))

  const [activeLearning, setActiveLearning] = useState<Difficulty | null>(null)
  const [replayMenu, setReplayMenu] = useState<Difficulty | null>(null)

  useEffect(() => {
    refresh()
  }, [activeLearning])

  function refresh() {
    setStates({
      easy:         loadState(skillId, 'easy', activeTier),
      intermediate: loadState(skillId, 'intermediate', activeTier),
      advanced:     loadState(skillId, 'advanced', activeTier),
    })
  }

  function isUnlocked(diff: Difficulty): boolean {
    if (diff === 'easy') return true
    if (diff === 'intermediate') return states.easy.practiceDone
    if (diff === 'advanced') return states.intermediate.practiceDone
    return false
  }

  function getMaxUnlockedTier(): 1 | 2 | 3 {
    const t1AdvDone = loadState(skillId, 'advanced').practiceDone
    const t2AdvDone = localStorage.getItem(`lb_${skillId}_t2_advanced_practiceDone`) === 'true'
    if (t1AdvDone && t2AdvDone) return 3
    if (t1AdvDone) return 2
    return 1
  }

  function handleLearnComplete(diff: Difficulty) {
    saveLearnDone(skillId, diff, activeTier)
    setActiveLearning(null)
    refresh()
  }

  const crownEarned = [1,2,3].every(t =>
    ['easy','intermediate','advanced'].every(d =>
      loadState(skillId, d as Difficulty, t).stars === 3
    )
  )

  const learnData = getLearnData(skillId)
  const learnModule = learnData ? learnData[activeLearning ?? ''] : undefined

  if (activeLearning && learnModule) {
    return (
      <LearnModule
        module={learnModule}
        onComplete={() => handleLearnComplete(activeLearning)}
      />
    )
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', width: '100%',
      background: 'var(--bg, #0e0f1a)',
      fontFamily: 'var(--font-display, sans-serif)',
      boxSizing: 'border-box',
      position: 'relative',
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 20px 0' }}>
        <button onClick={onGoBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#9da3b8', fontSize: 20, padding: 4, lineHeight: 1,
        }}>←</button>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>{skillIcon}</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f1f5' }}>{skillName}</div>
          <div style={{ fontSize: 12, color: '#6b7290' }}>{skillDesc}</div>
        </div>
      </div>

      {TIER_CONFIG.filter(tc => tc.tier <= getMaxUnlockedTier()).map(tc => (
        <div key={tc.tier}>
          <div style={{
            margin: tc.tier === 1 ? '24px 20px 12px' : '32px 20px 12px',
            fontSize: 11, fontWeight: 700,
            color: tc.tier === activeTier ? '#7c6ffa' : '#6b7290',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {tc.label} — {tc.sublabel}
            {tc.tier > 1 && (
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 10,
                background: 'rgba(34,197,94,0.15)', color: '#4ade80',
              }}>Unlocked</span>
            )}
          </div>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DIFFICULTIES.map(({ key, label, desc }) => {
              const state = loadState(skillId, key, tc.tier)
              const unlocked = tc.tier === 1
                ? (key === 'easy' ? true : key === 'intermediate' ? loadState(skillId, 'easy', 1).practiceDone : loadState(skillId, 'intermediate', 1).practiceDone)
                : (key === 'easy' ? true : key === 'intermediate' ? loadState(skillId, 'easy', tc.tier).practiceDone : loadState(skillId, 'intermediate', tc.tier).practiceDone)
              const learnAvailable = unlocked && !state.learnDone
              const practiceAvailable = unlocked && state.learnDone && !state.practiceDone
              const done = state.practiceDone

              return (
                <div key={key} style={{
                  borderRadius: 16,
                  border: practiceAvailable ? '1.5px solid #7c6ffa'
                    : done ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(255,255,255,0.06)',
                  background: unlocked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                  padding: '16px 18px',
                  opacity: unlocked ? 1 : 0.4,
                  transition: 'opacity 0.2s ease',
                  cursor: done ? 'pointer' : 'default',
                }}
                onClick={done ? () => setReplayMenu(key) : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: key === 'easy' ? 'rgba(124,111,250,0.15)'
                        : key === 'intermediate' ? 'rgba(20,184,166,0.15)'
                        : 'rgba(245,158,11,0.15)',
                      color: key === 'easy' ? '#a78bfa'
                        : key === 'intermediate' ? '#2dd4bf'
                        : '#fbbf24',
                    }}>{label}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#f0f1f5' }}>{desc}</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {done && <StarRow stars={state.stars} />}
                      {!unlocked && <span style={{ fontSize: 16, color: '#6b7290' }}>🔒</span>}
                      {practiceAvailable && (
                        <button onClick={(e) => { e.stopPropagation(); onStartPractice(key, tc.tier); }} style={{
                          background: '#7c6ffa', color: '#fff', border: 'none',
                          borderRadius: 20, padding: '6px 16px',
                          fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        }}>Try it out</button>
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, color: '#6b7290' }}>
                    {!unlocked && `Complete ${key === 'intermediate' ? 'Easy' : 'Intermediate'} practice to unlock`}
                    {learnAvailable && (
                      <span onClick={(e) => { e.stopPropagation(); setActiveTier(tc.tier); setActiveLearning(key); }}
                        style={{ color: '#7c6ffa', fontWeight: 600, cursor: 'pointer' }}>
                        ✦ Start learning first
                      </span>
                    )}
                    {practiceAvailable && <span>Learning done ✓ — ready to practise</span>}
                    {done && (
                      <span>
                        {state.stars < 3 && (
                          <span onClick={(e) => { e.stopPropagation(); onStartPractice(key, tc.tier); }}
                            style={{ color: '#7c6ffa', cursor: 'pointer', marginLeft: 8 }}>
                            Replay to earn {state.stars + 1}★ ↗
                          </span>
                        )}
                        {state.stars === 3 && <span style={{ color: '#22c55e' }}>Mastered ✓</span>}
                      </span>
                    )}
                  </div>
                  <div style={{
                    marginTop: 10, height: 5,
                    background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 3,
                      background: done ? '#22c55e' : practiceAvailable ? '#7c6ffa' : 'transparent',
                      width: done
                        ? `${state.stars === 3 ? 100 : state.stars === 2 ? 72 : 40}%`
                        : practiceAvailable ? '5%' : '0%',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {replayMenu && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 24px',
        }}>
          <div style={{
            background: '#1a1b2e', borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '28px 24px', width: '100%', maxWidth: 340,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f1f5', marginBottom: 6 }}>
              {DIFFICULTIES.find(d => d.key === replayMenu)?.label} — what would you like to do?
            </div>
            <div style={{ fontSize: 13, color: '#6b7290', marginBottom: 24 }}>
              You have already mastered this level.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => { setReplayMenu(null); setActiveLearning(replayMenu); }}
                style={{
                  background: 'rgba(124,111,250,0.15)', border: '1px solid #7c6ffa',
                  borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                  textAlign: 'left',
                }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#a78bfa' }}>Review learning</div>
                <div style={{ fontSize: 12, color: '#6b7290', marginTop: 2 }}>Go through the slides again</div>
              </button>
              <button
                onClick={() => { setReplayMenu(null); onStartPractice(replayMenu, activeTier); }}
                style={{
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.4)',
                  borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                  textAlign: 'left',
                }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#4ade80' }}>Practise again</div>
                <div style={{ fontSize: 12, color: '#6b7290', marginTop: 2 }}>Try to improve your stars</div>
              </button>
              <button
                onClick={() => setReplayMenu(null)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: '#6b7290', padding: '8px 0',
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{
        margin: '20px 20px 40px', borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.03)',
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{ fontSize: 24 }}>{crownEarned ? '👑' : '🏆'}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f1f5' }}>
            {crownEarned ? 'Crown earned! You mastered this skill.' : 'Crown: get 3 stars on all difficulties'}
          </div>
          <div style={{ fontSize: 12, color: '#6b7290', marginTop: 2 }}>
            Easy: {states.easy.stars}★ &nbsp;·&nbsp;
            Intermediate: {states.intermediate.stars}★ &nbsp;·&nbsp;
            Advanced: {states.advanced.stars}★
          </div>
        </div>
      </div>

    </div>
  )
}
