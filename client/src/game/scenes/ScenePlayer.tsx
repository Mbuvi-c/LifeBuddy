// ScenePlayer.tsx — LifeBuddy Learning Module
// Deep black + violet neon aesthetic. Full-bleed animation top half.
// PWA responsive: mobile-first, caps at 480px on desktop.

import { useState, useEffect, useRef, useCallback } from 'react'
import { ANIMATION_REGISTRY } from './sceneAnimations'

interface Scene {
  id: string
  title: string
  narration: string
  example: string
  tip: string
  keyFacts: string[]
  animation: string
  duration: number
}

interface ScenePlayerProps {
  skillId: string
  scenes: Scene[]
  onComplete: () => void
}

// ---------------------------------------------------------------------------
// Skill display names
// ---------------------------------------------------------------------------
const SKILL_LABELS: Record<string, string> = {
  money_transactions:     'Money & Transactions',
  time_planning:          'Time & Planning',
  digital_safety:         'Digital Safety',
  mobile_money:           'Mobile Money',
  communication_advocacy: 'Self-Advocacy',
  financial_planning:     'Financial Planning',
  community_safety:       'Community Safety',
  workplace_readiness:    'Workplace Readiness',
}

// ---------------------------------------------------------------------------
// Global CSS — injected once into <head>
// ---------------------------------------------------------------------------
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lb-root {
    --accent:       #a855f7;
    --accent-dim:   rgba(168, 85, 247, 0.18);
    --accent-glow:  rgba(168, 85, 247, 0.35);
    --bg:           #06040d;
    --surface:      #0e0a1a;
    --surface2:     #16102a;
    --border:       rgba(168, 85, 247, 0.15);
    --text:         #f0eaff;
    --text-muted:   #7a6f9a;
    --text-dim:     #3d3560;

    font-family: 'DM Sans', system-ui, sans-serif;
    background: var(--bg);
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text);
    overflow: hidden;
    position: relative;
  }

  /* Ambient background glow */
  .lb-root::before {
    content: '';
    position: fixed;
    top: -30%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 65%);
    pointer-events: none;
    z-index: 0;
  }

  /* Phone shell — full screen on mobile, capped on desktop */
  .lb-shell {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 100%;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: var(--surface);
    overflow: hidden;
  }

  @media (min-width: 500px) {
    .lb-root {
      padding: 24px;
      align-items: center;
    }
    .lb-shell {
      min-height: unset;
      border-radius: 32px;
      border: 1px solid var(--border);
      box-shadow:
        0 0 0 1px rgba(168,85,247,0.08),
        0 32px 80px rgba(0,0,0,0.6),
        0 0 60px rgba(168,85,247,0.08);
    }
  }

  /* ── TOP VISUAL AREA ── */
 .lb-visual {
    position: relative;
    width: 200%;
    height: 50vh;
    min-height: 260px;
    max-height: 380px;
    flex-shrink: 0;
    background: #000;
    overflow: hidden;
  }

  /* Violet glow bleeding from animation area */
  .lb-visual::after {
    content: '';
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 80px;
    background: radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Noise overlay on visual */
  .lb-visual-noise {
    position: absolute;
    inset: 0;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 2;
  }

  .lb-anim-wrap {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  /* Gradient fade at bottom of visual into surface */
  .lb-visual-fade {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(to bottom, transparent, var(--surface));
    z-index: 3;
    pointer-events: none;
  }

  /* Progress arc + scene count top overlay */
  .lb-visual-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 4;
    padding: 18px 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(to bottom, rgba(6,4,13,0.7) 0%, transparent 100%);
  }

  .lb-skill-pill {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 5px 12px;
    border-radius: 20px;
    background: rgba(168,85,247,0.15);
    border: 1px solid rgba(168,85,247,0.3);
    font-family: 'Syne', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
  }

  .lb-skill-pill-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
    animation: lb-pulse 2s ease-in-out infinite;
  }

  .lb-scene-badge {
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: rgba(240,234,255,0.5);
    letter-spacing: 0.05em;
  }

  /* ── PROGRESS BAR ── */
  .lb-progress-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 4;
    padding: 0 20px 16px;
  }

  .lb-progress-dots {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .lb-pdot {
    height: 3px;
    border-radius: 2px;
    transition: all 0.4s cubic-bezier(.4,0,.2,1);
    flex: 1;
  }

  .lb-pdot-done   { background: rgba(168,85,247,0.4); }
  .lb-pdot-active { background: var(--accent); box-shadow: 0 0 8px var(--accent-glow); }
  .lb-pdot-future { background: rgba(255,255,255,0.08); }

  /* Timer strip below dots */
  .lb-timer {
    height: 1.5px;
    background: rgba(255,255,255,0.06);
    border-radius: 1px;
    margin-top: 8px;
    overflow: hidden;
  }

  .lb-timer-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), #c084fc);
    border-radius: 1px;
    transition: width 0.1s linear;
    box-shadow: 0 0 6px var(--accent-glow);
  }

  /* ── CONTENT AREA ── */
  .lb-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px 22px 0;
    gap: 14px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .lb-content::-webkit-scrollbar { display: none; }

 .lb-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

 .lb-narration {
    font-size: 14.5px;
    line-height: 1.7;
    color: rgba(255,255,255,0.75);
    font-weight: 400;
  }

  /* ── PILLS ── */
  .lb-pills {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .lb-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 24px;
    border: 1px solid var(--border);
    background: rgba(168,85,247,0.05);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
    letter-spacing: 0.01em;
  }

  .lb-pill:hover {
    border-color: rgba(168,85,247,0.35);
    color: var(--accent);
    background: rgba(168,85,247,0.1);
  }

  .lb-pill.open {
    border-color: rgba(168,85,247,0.5);
    background: rgba(168,85,247,0.12);
    color: var(--accent);
    box-shadow: 0 0 12px rgba(168,85,247,0.15);
  }

  .lb-pill-icon {
    width: 14px;
    height: 14px;
    opacity: 0.7;
  }

  .lb-pill-content {
    padding: 12px 16px;
    border-radius: 14px;
    background: var(--surface2);
    border-left: 2px solid var(--accent);
    font-size: 13px;
    line-height: 1.65;
    color: var(--text-muted);
    animation: lb-reveal 0.22s ease both;
  }

  /* ── KEY FACTS ── */
  .lb-facts {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 4px;
  }

  .lb-fact {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    animation: lb-reveal 0.3s ease both;
  }

  .lb-fact-bullet {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent-dim);
    border: 1px solid rgba(168,85,247,0.3);
    flex-shrink: 0;
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lb-fact-bullet::after {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
  }

 .lb-fact-text {
    font-size: 13px;
    line-height: 1.55;
    color: rgba(255,255,255,0.65);
  }

  /* ── NAV ── */
  .lb-nav {
    padding: 16px 22px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    gap: 12px;
  }

  .lb-back-btn {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    font-family: inherit;
  }

  .lb-back-btn:hover:not(:disabled) {
    border-color: rgba(168,85,247,0.4);
    color: var(--accent);
    background: var(--accent-dim);
  }

  .lb-back-btn:disabled {
    opacity: 0.2;
    cursor: default;
  }

  .lb-next-btn {
    flex: 1;
    height: 52px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 60%, #c084fc 100%);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(168,85,247,0.3);
  }

  .lb-next-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(168,85,247,0.45);
  }

  .lb-next-btn:active {
    transform: translateY(0);
  }

  .lb-next-btn.last {
    background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #a855f7 100%);
  }

  /* ── SCENE TRANSITION ── */
  .lb-scene-in {
    animation: lb-scene-slide 0.3s cubic-bezier(.4,0,.2,1) both;
  }

  /* ── KEYFRAMES ── */
  @keyframes lb-reveal {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes lb-scene-slide {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes lb-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.7); }
  }

  /* ── EMPTY STATE ── */
  .lb-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--text-dim);
    text-align: center;
    padding: 40px;
  }
`

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ScenePlayer({ skillId, scenes, onComplete }: ScenePlayerProps) {
  const [index, setIndex]       = useState(0)
  const [animKey, setAnimKey]   = useState(0)
  const [openPill, setOpenPill] = useState<'example' | 'tip' | null>(null)
  const [progress, setProgress] = useState(0)
  const [sceneKey, setSceneKey] = useState(0)
  const timerRef                = useRef<ReturnType<typeof setInterval> | null>(null)
  const styleRef                = useRef(false)

  const scene  = scenes[index]
  const isLast = index === scenes.length - 1
  const label  = SKILL_LABELS[skillId] ?? skillId.replace(/_/g, ' ')

  // Inject CSS once
  useEffect(() => {
    if (styleRef.current || typeof document === 'undefined') return
    styleRef.current = true
    const s = document.createElement('style')
    s.textContent = GLOBAL_CSS
    document.head.appendChild(s)
  }, [])

  // Auto-advance timer
  useEffect(() => {
    setProgress(0)
    setOpenPill(null)
    if (timerRef.current) clearInterval(timerRef.current)

    const total   = scene?.duration ?? 15000
    const interval = 100
    let elapsed   = 0

    timerRef.current = setInterval(() => {
      elapsed += interval
      const pct = Math.min((elapsed / total) * 100, 100)
      setProgress(pct)
      if (elapsed >= total) {
        clearInterval(timerRef.current!)
        handleNext()
      }
    }, interval)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [index])

  const handleNext = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (isLast) {
      onComplete()
    } else {
      setIndex(i => i + 1)
      setAnimKey(k => k + 1)
      setSceneKey(k => k + 1)
    }
  }, [isLast, onComplete])

  const handlePrev = useCallback(() => {
    if (index === 0) return
    if (timerRef.current) clearInterval(timerRef.current)
    setIndex(i => i - 1)
    setAnimKey(k => k + 1)
    setSceneKey(k => k + 1)
  }, [index])

  const AnimComponent = scene
    ? (ANIMATION_REGISTRY[scene.animation] ?? (() => <DefaultAnim />))
    : () => <DefaultAnim />

  if (!scenes.length) {
    return (
      <div className="lb-root">
        <div className="lb-shell">
          <div className="lb-empty">No content found for this skill yet.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="lb-root">
      <div className="lb-shell">

        {/* ── TOP VISUAL ── */}
        <div className="lb-visual">
          <div className="lb-anim-wrap">
            <div key={animKey} style={{ width: '100%', height: '100%' }}>
              <AnimComponent />
            </div>
          </div>
          <div className="lb-visual-noise" />
          <div className="lb-visual-fade" />

          {/* Header overlay */}
          <div className="lb-visual-header">
            <div className="lb-skill-pill">
              <div className="lb-skill-pill-dot" />
              {label}
            </div>
            <div className="lb-scene-badge">{index + 1} / {scenes.length}</div>
          </div>

          {/* Progress dots + timer */}
          <div className="lb-progress-wrap">
            <div className="lb-progress-dots">
              {scenes.map((_, i) => (
                <div key={i} className={`lb-pdot ${
                  i < index    ? 'lb-pdot-done'   :
                  i === index  ? 'lb-pdot-active'  :
                                 'lb-pdot-future'
                }`} />
              ))}
            </div>
            <div className="lb-timer">
              <div className="lb-timer-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="lb-content" key={sceneKey}>
          <h2 className="lb-title lb-scene-in">{scene.title}</h2>
          <p className="lb-narration lb-scene-in" style={{ animationDelay: '0.05s' }}>
            {scene.narration}
          </p>

          {/* Pills */}
          <div className="lb-pills lb-scene-in" style={{ animationDelay: '0.1s' }}>
            <button
              className={`lb-pill ${openPill === 'example' ? 'open' : ''}`}
              onClick={() => setOpenPill(p => p === 'example' ? null : 'example')}
            >
              <svg className="lb-pill-icon" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Example
            </button>
            <button
              className={`lb-pill ${openPill === 'tip' ? 'open' : ''}`}
              onClick={() => setOpenPill(p => p === 'tip' ? null : 'tip')}
            >
              <svg className="lb-pill-icon" viewBox="0 0 14 14" fill="none">
                <path d="M7 1a4 4 0 0 1 2 7.46V10H5V8.46A4 4 0 0 1 7 1zM5 11h4M6 13h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Tip
            </button>
          </div>

          {openPill === 'example' && (
            <div className="lb-pill-content">{scene.example}</div>
          )}
          {openPill === 'tip' && (
            <div className="lb-pill-content">💡 {scene.tip}</div>
          )}

          {/* Key facts */}
          <div className="lb-facts">
            {scene.keyFacts.map((fact, i) => (
              <div
                key={i}
                className="lb-fact"
                style={{ animationDelay: `${0.12 + i * 0.07}s` }}
              >
                <div className="lb-fact-bullet" />
                <span className="lb-fact-text">{fact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── NAV ── */}
        <div className="lb-nav">
          <button
            className="lb-back-btn"
            onClick={handlePrev}
            disabled={index === 0}
            aria-label="Previous"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9l5-5" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            className={`lb-next-btn ${isLast ? 'last' : ''}`}
            onClick={handleNext}
            aria-label={isLast ? 'Start activity' : 'Next scene'}
          >
            {isLast ? "I'm Ready" : 'Next'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  )
}

function DefaultAnim() {
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 60%, rgba(168,85,247,0.15) 0%, transparent 70%)',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        border: '2px solid rgba(168,85,247,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 40px rgba(168,85,247,0.2)',
      }}>
        <div style={{
          width: 12, height: 12, borderRadius: '50%',
          background: '#a855f7',
          boxShadow: '0 0 20px rgba(168,85,247,0.8)',
        }} />
      </div>
    </div>
  )
}
