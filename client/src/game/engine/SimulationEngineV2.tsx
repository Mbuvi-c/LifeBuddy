// SimulationEngineV2.tsx
// Stage 1 — Task display and navigation ✅
// Stage 2 — Real BKT mastery recording ✅
// Stage 3 — Promotion, follow-up tasks, guided mode lite ✅
// Stage 4 — Progress report, session summary, skill recommendation ✅

import { useState, useEffect, useRef } from 'react'
import { MONEY_TRANSACTIONS_TASKS } from '../tasks/taskData_money'
import { TIME_PLANNING_TASKS } from '../tasks/taskData_time'
import { DAILY_ROUTINE_TASKS } from '../tasks/taskData_routine'
import { startSession, logAttempt, endSession, getNextSkill, getAdaptation } from './adaptiveClient'
import TapSelect       from './interactions/TapSelect'
import TrueFalse       from './interactions/TrueFalse'
import FillBlank       from './interactions/FillBlank'
import ScenarioChoice  from './interactions/ScenarioChoice'
import SequentialSteps from './interactions/SequentialSteps'
import DragDrop        from './interactions/DragDrop'
import type { Task }   from '../tasks/types'

const SKILL_TASK_MAP: Record<string, Task[]> = {
  money_transactions: MONEY_TRANSACTIONS_TASKS,
  time_planning: TIME_PLANNING_TASKS,
  daily_routine: DAILY_ROUTINE_TASKS,
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

const SKILL_ICONS: Record<string, string> = {
  money_transactions: '💰', time_planning: '⏰', digital_safety: '📱',
  mobile_money: '📲', communication_advocacy: '🤝',
  financial_planning: '📊', community_safety: '🛡️', workplace_readiness: '💼',
}

const SKILL_DESCRIPTIONS: Record<string, string> = {
  money_transactions:     'Coins, notes & making change',
  time_planning:          'Clocks, schedules & telling time',
  digital_safety:         'Passwords, scams & smart digital habits',
  mobile_money:           'Send, receive & manage M-Pesa',
  communication_advocacy: 'Speak up, ask for help & communicate needs',
  financial_planning:     'Budgeting, saving & planning ahead',
  community_safety:       'Staying safe in your community',
  workplace_readiness:    'Job skills & professional behaviour',
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy', intermediate: 'Intermediate', advanced: 'Advanced',
}
const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'intermediate', 'advanced']
type Difficulty = 'easy' | 'intermediate' | 'advanced'
type Phase = 'playing' | 'followup'

interface AnswerRecord {
  taskId: string; topic: string; correct: boolean
  responseTime: number; hintsUsed: number
  mastery: number; prevMastery: number; frustrationDelta: number
}

interface DifficultyReport {
  tier: 1|2|3; difficulty: Difficulty; passed: boolean
  avgMastery: number; correct: number; total: number
  hintsUsed: number; avgResponse: number
  answers: AnswerRecord[]
  promotedWithRemediation: boolean
}

interface SimulationEngineV2Props {
  skillId: string; learnerId: string; tier?: 1|2|3; initialDifficulty?: Difficulty
  onSessionComplete?: (result: { passed: boolean; mastery: number }) => void
  onGoBack?: () => void; onBackToSkill?: () => void; settings?: Record<string, unknown>
}

function getTasksForDifficulty(tasks: Task[], tier: 1|2|3, difficulty: Difficulty, excludeIds: string[]): Task[] {
  return tasks.filter(t => t.tier === tier && t.difficulty === difficulty && !excludeIds.includes(t.id))
}

function getFollowUpTasks(tasks: Task[], tier: 1|2|3, difficulty: Difficulty, wrongTopics: string[], excludeIds: string[]): Task[] {
  const targeted = tasks.filter(t => t.tier === tier && t.difficulty === difficulty && wrongTopics.includes(t.topic) && !excludeIds.includes(t.id))
  const general  = tasks.filter(t => t.tier === tier && t.difficulty === difficulty && !wrongTopics.includes(t.topic) && !excludeIds.includes(t.id))
  return [...targeted, ...general].slice(0, 3)
}

function nextDifficultyOrTier(tier: 1|2|3, diff: Difficulty): { tier: 1|2|3; diff: Difficulty } | null {
  const idx = DIFFICULTY_ORDER.indexOf(diff)
  if (idx < DIFFICULTY_ORDER.length - 1) return { tier, diff: DIFFICULTY_ORDER[idx + 1] }
  if (tier < 3) return { tier: (tier + 1) as 1|2|3, diff: 'easy' }
  return null
}

function masteryLabel(m: number) {
  if (m >= 0.85) return 'Excellent! 🏆'
  if (m >= 0.70) return 'Strong! 🔥'
  if (m >= 0.50) return 'Getting there! ⭐'
  return 'Keep going! 💪'
}

function masteryColor(m: number) {
  if (m >= 0.70) return '#4ade80'
  if (m >= 0.50) return '#fbbf24'
  return '#c084fc'
}

function stars(m: number) {
  const filled = m >= 0.85 ? 5 : m >= 0.70 ? 4 : m >= 0.55 ? 3 : m >= 0.40 ? 2 : 1
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ fontSize: 24, color: i < filled ? '#fbbf24' : 'rgba(255,255,255,0.12)' }}>★</span>
  ))
}

function Ring({ value, color, size = 160, label, sub }: { value: number; color: string; size?: number; label: string; sub: string }) {
  const r = size * 0.40
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - value)
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={size * 0.07} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size * 0.07}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
        <text x={size/2} y={size/2 + 2} textAnchor="middle" fontSize={size * 0.20} fontWeight="800" fill="#ffffff">
          {Math.round(value * 100)}%
        </text>
        <text x={size/2} y={size/2 + size * 0.16} textAnchor="middle" fontSize={size * 0.09} fill={color}>
          {sub}
        </text>
      </svg>
      <div style={{ fontSize: 13, color: '#f0f1f5', marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

// ── Learner Progress Report ───────────────────────────────────────────────────
function LearnerProgressReport({ report, skillName, overallMastery, nextLabel, onContinue }: {
  report: DifficultyReport; skillName: string; overallMastery: number
  nextLabel: string; onContinue: () => void
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: '#0a0b0f',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Green glass hero */}
      <div style={{
        background: 'rgba(13,35,24,0.98)',
        borderBottom: '1px solid rgba(74,222,128,0.15)',
        padding: '36px 24px 28px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 10, color: 'rgba(74,222,128,0.55)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>
          Level {report.tier} · {DIFFICULTY_LABEL[report.difficulty]} · Complete
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#4ade80', marginBottom: 4 }}>
          {report.passed ? 'Excellent!' : 'Good effort!'}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{skillName}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>
          {stars(report.avgMastery)}
        </div>
      </div>

      {/* Dual rings */}
      <div style={{ flex: 1, padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <Ring value={report.avgMastery} color={masteryColor(report.avgMastery)} label="This session" sub="session" />
          <div style={{ width: 1, height: 90, background: 'rgba(255,255,255,0.07)' }} />
          <Ring value={overallMastery} color="#a855f7" label="Overall skill" sub="overall" />
        </div>

        {/* Encouragement */}
        <div style={{
          background: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.15)',
          borderRadius: 14, padding: '16px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#4ade80', marginBottom: 4 }}>
            {masteryLabel(report.avgMastery)}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
            {report.passed
              ? `You're ready for ${nextLabel}. Keep building!`
              : "Every session makes you stronger. Keep going!"}
          </div>
        </div>

        {/* Continue */}
        <button onClick={onContinue} style={{
          width: '60%', padding: '16px 0', border: 'none',
          borderRadius: 14, background: '#4ade80',
          color: '#0d2318', fontSize: 16, fontWeight: 800, cursor: 'pointer',
          marginTop: 'auto', display: 'block', marginLeft: 'auto', marginRight: 'auto',
        }}>
          {nextLabel} →
        </button>
      </div>
    </div>
  )
}

// ── Developer Progress Report ─────────────────────────────────────────────────
function DevProgressReport({ report, skillName, overallMastery, nextLabel, onContinue }: {
  report: DifficultyReport; skillName: string; overallMastery: number
  nextLabel: string; onContinue: () => void
}) {
  const localColor = masteryColor(report.avgMastery)
  const ringSize = 120



  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: '#0a0b0f',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'monospace',
      width: '100%',
      height: '100vh',
    }}>
      {/* Green glass hero */}
      <div style={{
        background: 'rgba(13,35,24,0.98)',
        borderBottom: '1px solid rgba(74,222,128,0.15)',
        padding: '12px 20px 10px',
      }}>
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 18, color: 'rgba(74,222,128,0.5)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            session report · L{report.tier} · {DIFFICULTY_LABEL[report.difficulty]}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f0f1f5' }}>{skillName}</div>
            <span style={{
              fontSize: 10,
              color: report.promotedWithRemediation ? '#fbbf24' : report.passed ? '#4ade80' : '#c084fc',
              background: report.promotedWithRemediation ? 'rgba(251,191,36,0.1)' : report.passed ? 'rgba(74,222,128,0.1)' : 'rgba(192,132,252,0.1)',
              border: `1px solid ${report.promotedWithRemediation ? 'rgba(251,191,36,0.2)' : report.passed ? 'rgba(74,222,128,0.2)' : 'rgba(192,132,252,0.2)'}`,
              borderRadius: 4, padding: '3px 10px', fontWeight: 600,
            }}>
              {report.promotedWithRemediation ? 'Follow-up given' : report.passed ? 'Promoted ✓' : 'Follow-up given'}
            </span>
          </div>
        </div>

        {/* Rings side by side, centered */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <Ring value={report.avgMastery} color={localColor} size={ringSize} label="Local BKT" sub="local" />
            <div style={{ fontSize: 11, color: '#f0f1f5', marginTop: 2, fontFamily: 'monospace' }}>
              {report.avgMastery.toFixed(3)}
            </div>
          </div>
          <div style={{ width: 1, height: 80, background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ textAlign: 'center' }}>
            <Ring value={overallMastery} color="#a855f7" size={ringSize} label="Overall" sub="overall" />
            <div style={{ fontSize: 11, color: '#f0f1f5', marginTop: 2, fontFamily: 'monospace' }}>
              {overallMastery.toFixed(3)}
            </div>
          </div>
        </div>
      </div>
{/* Per-question table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 20px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>
          Per-question BKT progression
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '4%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Q','Topic','✓/✗','Hints','Time','BKT','Δ BKT','Frust Δ'].map((h,i) => (
                <th key={h} style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 500, padding: '4px 4px 8px', textAlign: i <= 1 ? 'left' : 'right' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {report.answers.map((a, i) => {
              const prevBkt = i === 0 ? 0.15 : report.answers[i-1].mastery
              const delta = a.mastery - prevBkt
              return (
                <tr key={`${a.taskId}-${i}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: !a.correct ? 'rgba(248,113,113,0.06)' : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  <td style={{ fontSize: 10, color: '#f0f1f5', padding: '9px 4px' }}>{i+1}</td>
                  <td style={{ fontSize: 11, color: '#f0f1f5', padding: '9px 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.topic}</td>
                  <td style={{ fontSize: 13, color: a.correct ? '#4ade80' : '#f87171', padding: '9px 4px', textAlign: 'right' }}>{a.correct ? '✓' : '✗'}</td>
                  <td style={{ fontSize: 10, color: a.hintsUsed > 0 ? '#fbbf24' : '#f0f1f5', padding: '9px 4px', textAlign: 'right' }}>{a.hintsUsed}</td>
                  <td style={{ fontSize: 10, color: a.responseTime > 6000 ? '#fbbf24' : '#f0f1f5', padding: '9px 4px', textAlign: 'right' }}>{(a.responseTime/1000).toFixed(1)}s</td>
                  <td style={{ fontSize: 10, color: a.correct ? '#4ade80' : '#f87171', padding: '9px 4px', textAlign: 'right', fontWeight: 600 }}>{a.mastery.toFixed(3)}</td>
                  <td style={{ fontSize: 10, color: delta >= 0 ? '#4ade80' : '#f87171', padding: '9px 4px', textAlign: 'right' }}>{delta >= 0 ? '+' : ''}{delta.toFixed(3)}</td>
                  <td style={{ fontSize: 10, color: a.frustrationDelta > 0 ? '#f87171' : '#f0f1f5', padding: '9px 4px', textAlign: 'right' }}>{a.frustrationDelta > 0 ? '+' : ''}{a.frustrationDelta.toFixed(2)}</td>
                </tr>
              )
            })}
            <tr style={{ background: 'rgba(74,222,128,0.05)', borderTop: '1px solid rgba(74,222,128,0.15)' }}>
              <td style={{ padding: '8px 4px' }} />
              <td style={{ fontSize: 10, color: '#f0f1f5', padding: '8px 4px', fontWeight: 600 }}>Summary</td>
              <td style={{ fontSize: 10, color: '#4ade80', padding: '8px 4px', textAlign: 'right', fontWeight: 600 }}>{report.correct}/{report.total}</td>
              <td style={{ fontSize: 10, color: '#fbbf24', padding: '8px 4px', textAlign: 'right' }}>{report.hintsUsed}</td>
              <td style={{ fontSize: 10, color: '#f0f1f5', padding: '8px 4px', textAlign: 'right' }}>{(report.avgResponse/1000).toFixed(1)}s</td>
              <td style={{ fontSize: 10, color: '#4ade80', padding: '8px 4px', textAlign: 'right', fontWeight: 700 }}>{report.avgMastery.toFixed(3)}</td>
              <td style={{ fontSize: 10, color: '#4ade80', padding: '8px 4px', textAlign: 'right', fontWeight: 600 }}>+{(report.avgMastery - 0.15).toFixed(3)}</td>
              <td style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', padding: '8px 4px', textAlign: 'right' }}>{report.answers.reduce((s,a) => s + a.frustrationDelta, 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      
        <button onClick={onContinue} style={{
          width: '60%', padding: '14px 0', border: 'none',
          borderRadius: 12, background: '#6c63ff',
          color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          marginTop: 14, display: 'block', marginLeft: 'auto', marginRight: 'auto',
        }}>
          {nextLabel} →
        </button>
      </div>
    </div>
  )
}

// ── Progress Report wrapper (learner + dev toggle) ────────────────────────────
function ProgressReport({ report, skillName, overallMastery, nextLabel, onContinue }: {
  report: DifficultyReport; skillName: string; overallMastery: number
  nextLabel: string; onContinue: () => void
}) {
  const [devMode, setDevMode] = useState(false)

  return (
    <>
      {devMode
        ? <DevProgressReport report={report} skillName={skillName} overallMastery={overallMastery} nextLabel={nextLabel} onContinue={onContinue} />
        : <LearnerProgressReport report={report} skillName={skillName} overallMastery={overallMastery} nextLabel={nextLabel} onContinue={onContinue} />
      }
      {/* Dev toggle — below hero, not overlapping */}
      <button
        onClick={() => setDevMode(v => !v)}
        style={{
          position: 'fixed', top: 12, right: 12, zIndex: 600,
          background: devMode ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${devMode ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: 8, padding: '6px 12px',
          color: devMode ? '#8b85ff' : 'rgba(255,255,255,0.4)', fontSize: 11,
          cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600,
        }}
      >
        {devMode ? '◉ learner view' : '{ } dev view'}
      </button>
    </>
  )
}

// ── Skill recommendation popup ────────────────────────────────────────────────
function SkillRecommendationPopup({ recommendedSkill, hasTaskData, onAccept, onDecline }: {
  recommendedSkill: string; hasTaskData: boolean; onAccept: () => void; onDecline: () => void
}) {
  const name = SKILL_NAMES[recommendedSkill] ?? recommendedSkill
  const icon = SKILL_ICONS[recommendedSkill] ?? '📚'
  const desc = SKILL_DESCRIPTIONS[recommendedSkill] ?? ''
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 599, backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.5)' }} />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 600,
        background: '#1e2130',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px 24px 0 0',
        padding: '28px 24px 40px',
        animation: 'slideUp 0.35s ease',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto 20px' }} />
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          🎯 Ready for something new?
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: 16, padding: '16px 20px', marginBottom: 12,
        }}>
          <span style={{ fontSize: 36 }}>{icon}</span>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#f0f1f5', marginBottom: 4 }}>{name}</p>
            <p style={{ fontSize: 12, color: '#9da3b8' }}>{desc}</p>
            {!hasTaskData && (
              <span style={{ fontSize: 10, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 4, padding: '2px 6px', marginTop: 6, display: 'inline-block' }}>
                Coming soon
              </span>
            )}
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 20, lineHeight: 1.5 }}>
          Based on your progress, this skill builds on what you just practised.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onDecline} style={{ flex: 1, padding: '14px 0', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#9da3b8', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Maybe later
          </button>
          <button onClick={hasTaskData ? onAccept : onDecline} style={{ flex: 2, padding: '14px 0', borderRadius: 12, border: 'none', background: hasTaskData ? '#6c63ff' : 'rgba(255,255,255,0.06)', color: hasTaskData ? '#fff' : '#6b7290', fontSize: 14, fontWeight: 700, cursor: hasTaskData ? 'pointer' : 'default' }}>
            {hasTaskData ? `Start ${name} →` : 'Coming soon'}
          </button>
        </div>
        <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }`}</style>
      </div>
    </>
  )
}

// ── Session Summary ───────────────────────────────────────────────────────────
function SessionSummaryScreen({ skillName, reports, sessionMastery, overallMastery, onPlayAgain, onTryAnother, onBackToSkill, recommendedSkill, hasTaskData, onAcceptRecommendation }: {
  skillName: string; reports: DifficultyReport[]; sessionMastery: number; overallMastery: number
  onPlayAgain: () => void; onTryAnother: () => void; onBackToSkill?: () => void
  recommendedSkill: string; hasTaskData: boolean; onAcceptRecommendation: () => void
}) {
  const [devMode, setDevMode] = useState(false)
  const [showRec, setShowRec] = useState(false)
  const totalCorrect = reports.reduce((s,r) => s + r.correct, 0)
  const totalTasks   = reports.reduce((s,r) => s + r.total, 0)
  const totalHints   = reports.reduce((s,r) => s + r.hintsUsed, 0)

  useEffect(() => { const t = setTimeout(() => setShowRec(true), 1500); return () => clearTimeout(t) }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: '#0a0b0f', display: 'flex', flexDirection: 'column' }}>
      {/* Dev toggle */}
      <button onClick={() => setDevMode(v => !v)} style={{
        position: 'absolute', top: 12, right: 12, zIndex: 10,
        background: devMode ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${devMode ? 'rgba(108,99,255,0.4)' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 8, padding: '6px 12px',
        color: devMode ? '#8b85ff' : 'rgba(255,255,255,0.4)',
        fontSize: 11, cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600,
      }}>
        {devMode ? '◉ learner view' : '{ } dev view'}
      </button>

      {!devMode ? (
        <>
          {/* Learner summary */}
          <div style={{ background: 'rgba(13,35,24,0.98)', borderBottom: '1px solid rgba(74,222,128,0.15)', padding: '40px 24px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>🏆</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#f0f1f5', marginBottom: 4 }}>Session Complete!</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{skillName}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16 }}>{stars(sessionMastery)}</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Ring value={sessionMastery} color={masteryColor(sessionMastery)} label="This session" sub="session" />
              <div style={{ width: 1, height: 90, background: 'rgba(255,255,255,0.07)', alignSelf: 'center' }} />
              <Ring value={overallMastery} color="#a855f7" label="Overall skill" sub="overall" />
            </div>

            {/* Difficulty breakdown */}
            <div style={{ background: '#1e2130', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>Your journey</div>
              {reports.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < reports.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ fontSize: 13, color: '#9da3b8' }}>L{r.tier} · {DIFFICULTY_LABEL[r.difficulty]}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{r.correct}/{r.total}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: r.promotedWithRemediation ? '#fbbf24' : r.passed ? '#4ade80' : '#c084fc', background: r.promotedWithRemediation ? 'rgba(251,191,36,0.1)' : r.passed ? 'rgba(74,222,128,0.1)' : 'rgba(192,132,252,0.1)', border: `1px solid ${r.promotedWithRemediation ? 'rgba(251,191,36,0.2)' : r.passed ? 'rgba(74,222,128,0.2)' : 'rgba(192,132,252,0.2)'}`, borderRadius: 6, padding: '2px 8px' }}>
                      {r.promotedWithRemediation ? '↑ Follow-up given' : r.passed ? '✓ Passed' : '↑ Follow-up'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={onBackToSkill ?? onTryAnother} style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: '#6c63ff', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>← Back to Skill</button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={onPlayAgain} style={{ flex: 1, padding: '14px 0', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#f0f1f5', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Play Again</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Developer summary
        <div style={{ flex: 1, overflowY: 'auto', padding: '60px 16px 24px', fontFamily: 'monospace' }}>
          <div style={{ fontSize: 10, color: 'rgba(74,222,128,0.5)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 16 }}>full session report · {skillName}</div>

          {reports.map((r, ri) => (
            <div key={ri} style={{ marginBottom: 20, background: '#111217', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(13,35,24,0.98)', padding: '10px 14px', borderBottom: '1px solid rgba(74,222,128,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#4ade80' }}>L{r.tier} · {DIFFICULTY_LABEL[r.difficulty]}</span>
                <span style={{ fontSize: 10, color: r.promotedWithRemediation ? '#fbbf24' : r.passed ? '#4ade80' : '#c084fc' }}>{r.promotedWithRemediation ? 'Follow-up given' : r.passed ? 'Promoted ✓' : 'Follow-up'} · BKT {r.avgMastery.toFixed(3)}</span>
              </div>
              <div style={{ padding: '8px 14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '18px 1fr 28px 28px 36px 40px 40px 46px', gap: 3, padding: '0 2px 5px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>
                  {['Q','Topic','✓','Hints','Time','BKT','Δ','Frust'].map(h => (
                    <div key={h} style={{ fontSize: 7, color: 'rgba(255,255,255,0.2)', textAlign: h === 'Topic' ? 'left' : 'right' }}>{h}</div>
                  ))}
                </div>
                {r.answers.map((a, i) => {
                  const prev = i === 0 ? 0.15 : r.answers[i-1].mastery
                  const d = a.mastery - prev
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '18px 1fr 28px 28px 36px 40px 40px 46px', gap: 3, padding: '4px 2px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center', background: !a.correct ? 'rgba(248,113,113,0.03)' : 'transparent' }}>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', textAlign: 'right' }}>{i+1}</div>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.topic}</div>
                      <div style={{ fontSize: 9, color: a.correct ? '#4ade80' : '#f87171', textAlign: 'right' }}>{a.correct ? '✓' : '✗'}</div>
                      <div style={{ fontSize: 8, color: a.hintsUsed > 0 ? '#fbbf24' : 'rgba(255,255,255,0.3)', textAlign: 'right' }}>{a.hintsUsed}</div>
                      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>{(a.responseTime/1000).toFixed(1)}s</div>
                      <div style={{ fontSize: 8, color: a.correct ? '#4ade80' : '#f87171', textAlign: 'right', fontWeight: 600 }}>{a.mastery.toFixed(3)}</div>
                      <div style={{ fontSize: 8, color: d >= 0 ? '#4ade80' : '#f87171', textAlign: 'right' }}>{d >= 0 ? '+' : ''}{d.toFixed(3)}</div>
                      <div style={{ fontSize: 8, color: a.frustrationDelta > 0 ? '#f87171' : 'rgba(255,255,255,0.2)', textAlign: 'right' }}>{a.frustrationDelta > 0 ? '+' : ''}{a.frustrationDelta.toFixed(2)}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[
              { k: 'session_bkt_avg', v: sessionMastery.toFixed(3), c: masteryColor(sessionMastery) },
              { k: 'overall_mastery', v: overallMastery.toFixed(3), c: '#a855f7' },
              { k: 'total_correct', v: `${totalCorrect}/${totalTasks}`, c: '#f0f1f5' },
              { k: 'total_hints', v: String(totalHints), c: '#f0f1f5' },
            ].map(s => (
              <div key={s.k} style={{ background: '#111217', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>{s.k}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onPlayAgain} style={{ flex: 1, padding: '13px 0', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: '#f0f1f5', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Play Again</button>
            <button onClick={onTryAnother} style={{ flex: 1, padding: '13px 0', borderRadius: 12, border: 'none', background: '#6c63ff', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Try Another</button>
          </div>
        </div>
      )}

      {showRec && (
        <SkillRecommendationPopup
          recommendedSkill={recommendedSkill} hasTaskData={hasTaskData}
          onAccept={onAcceptRecommendation} onDecline={() => setShowRec(false)}
        />
      )}
    </div>
  )
}

// ── Celebration popup ─────────────────────────────────────────────────────────
function CelebrationPopup({ onContinue, nextLabel }: { onContinue: () => void; nextLabel: string }) {
  useEffect(() => { const t = setTimeout(onContinue, 4000); return () => clearTimeout(t) }, [])
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 299, backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.5)' }} />
      {['#4ade80','#a855f7','#60a5fa','#fbbf24','#f472b6'].map((c,i) => (
        <div key={i} style={{ position: 'fixed', top: `${10+i*12}%`, left: `${10+i*18}%`, width: 10, height: 10, borderRadius: '50%', background: c, zIndex: 298 }} />
      ))}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 300, background: '#0d1f14', border: '1.5px solid #4ade80',
        borderRadius: 28, padding: '48px 52px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        minWidth: 300, maxWidth: 400,
        boxShadow: '0 8px 64px rgba(74,222,128,0.35)',
        animation: 'popIn 0.3s ease', textAlign: 'center',
      }}>
        <span style={{ fontSize: 64 }}>🎉</span>
        <span style={{ fontSize: 26, fontWeight: 800, color: '#4ade80' }}>Well done!</span>
        <p style={{ fontSize: 14, color: 'rgba(240,234,255,0.7)', lineHeight: 1.6, margin: 0 }}>You passed this level. {nextLabel}</p>
        <button onClick={onContinue} style={{ marginTop: 8, padding: '12px 32px', borderRadius: 12, border: 'none', background: '#4ade80', color: '#0d1f14', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Let's go! →</button>
      </div>
      <style>{`@keyframes popIn { from { opacity:0; transform:translate(-50%,-50%) scale(0.85); } to { opacity:1; transform:translate(-50%,-50%) scale(1); } }`}</style>
    </>
  )
}

// ── Transition screen ─────────────────────────────────────────────────────────
function TransitionScreen({ tier, difficulty, onReady }: { tier: 1|2|3; difficulty: Difficulty; onReady: () => void }) {
  useEffect(() => { const t = setTimeout(onReady, 3000); return () => clearTimeout(t) }, [])
  const emoji = difficulty === 'easy' ? '🟢' : difficulty === 'intermediate' ? '🟡' : '🟣'
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: '#0a0b0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <span style={{ fontSize: 56 }}>{emoji}</span>
      <p style={{ fontSize: 28, fontWeight: 800, color: '#f0f1f5' }}>Starting {DIFFICULTY_LABEL[difficulty]}!</p>
      <p style={{ fontSize: 14, color: '#9da3b8' }}>
        Level {tier} · Tasks are {difficulty === 'easy' ? 'straightforward' : difficulty === 'intermediate' ? 'getting more challenging' : 'real-world and complex'}
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {DIFFICULTY_ORDER.map(d => (
          <div key={d} style={{ width: 10, height: 10, borderRadius: '50%', background: DIFFICULTY_ORDER.indexOf(d) <= DIFFICULTY_ORDER.indexOf(difficulty) ? '#4ade80' : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>
    </div>
  )
}

// ── Banners ───────────────────────────────────────────────────────────────────
function FollowUpBanner({ onDismiss, difficulty, tier }: { onDismiss: () => void; difficulty: Difficulty; tier: 1|2|3 }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 250, background: '#1e2130', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 16, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12, maxWidth: 360, animation: 'slideUp 0.3s ease' }}>
      <span style={{ fontSize: 22 }}>💪</span>
      <p style={{ fontSize: 13, color: '#f0f1f5', lineHeight: 1.5, margin: 0, flex: 1 }}>{difficulty === 'easy'
        ? "Let's try a couple more — I'll help this time! 💡"
        : difficulty === 'intermediate'
        ? `You're on Intermediate now — let's practise a few together! 💡`
        : `You're on Advanced — these are tough, I'll guide you! 💡`}</p>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: '#6b7290', cursor: 'pointer', fontSize: 16 }}>✕</button>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(16px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
    </div>
  )
}

function GentleForwardBanner({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => { const t = setTimeout(onDismiss, 3500); return () => clearTimeout(t) }, [])
  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 250, background: '#1e2130', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 16, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12, maxWidth: 400, animation: 'slideUp 0.3s ease' }}>
      <span style={{ fontSize: 22 }}>💪</span>
      <p style={{ fontSize: 13, color: '#f0f1f5', lineHeight: 1.5, margin: 0 }}>Good effort! We'll revisit these topics in future sessions. Let's keep moving! 🚀</p>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(16px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
    </div>
  )
}

// ── Feedback popup ────────────────────────────────────────────────────────────
function FeedbackPanel({ correct, explanation, isLast, onNext }: { correct: boolean; explanation: string; isLast: boolean; onNext: () => void }) {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 199, backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.45)' }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 200, background: correct ? '#0d2318' : '#1a1025',
        border: `1.5px solid ${correct ? '#4ade80' : '#c084fc'}`,
        borderRadius: 24, padding: '40px 48px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        minWidth: 320, maxWidth: 420,
        boxShadow: `0 8px 48px ${correct ? 'rgba(74,222,128,0.3)' : 'rgba(192,132,252,0.2)'}`,
        animation: 'popIn 0.25s ease',
      }}>
        <span style={{ fontSize: 52 }}>{correct ? '✅' : '❌'}</span>
        <span style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', color: correct ? '#4ade80' : '#c084fc' }}>
          {correct ? 'Correct!' : 'Good try, however:'}
        </span>
        <p style={{ fontSize: 13, color: 'rgba(240,234,255,0.65)', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>{explanation}</p>
        <button onClick={onNext} style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: correct ? '#4ade80' : '#6c63ff', color: correct ? '#0d2318' : '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>
          {isLast ? 'Finish 🎉' : 'Next →'}
        </button>
      </div>
      <style>{`@keyframes popIn { from { opacity:0; transform:translate(-50%,-50%) scale(0.85); } to { opacity:1; transform:translate(-50%,-50%) scale(1); } }`}</style>
    </>
  )
}

// ── Quit confirmation ─────────────────────────────────────────────────────────
function QuitConfirm({ onStay, onQuit, tier, difficulty }: {
  onStay: () => void; onQuit: () => void; tier: 1|2|3; difficulty: Difficulty
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1e2130', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '32px 28px', width: 320, textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⏸️</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#f0f1f5', marginBottom: 8 }}>Take a break?</p>
        <p style={{ fontSize: 13, color: '#9da3b8', marginBottom: 24, lineHeight: 1.5 }}>
          Your progress will be saved. We will pick up from here next time.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onStay} style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#f0f1f5', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Keep going</button>
          <button onClick={onQuit} style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', background: '#6c63ff', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save & quit</button>
        </div>
      </div>
    </div>
  )
}

// ── Main engine ───────────────────────────────────────────────────────────────
export default function SimulationEngineV2({ skillId, learnerId, tier = 1, initialDifficulty, onSessionComplete, onGoBack }: SimulationEngineV2Props) {
  const resolvedLearnerId = localStorage.getItem('lifebuddy_learner_id') || learnerId

  const allTasks  = SKILL_TASK_MAP[skillId] ?? MONEY_TRANSACTIONS_TASKS
  const skillName = SKILL_NAMES[skillId] ?? skillId

  const [currentTier, setCurrentTier]   = useState<1|2|3>(tier)
  const [currentDiff, setCurrentDiff]   = useState<Difficulty>(initialDifficulty ?? 'easy')
  const [phase,       setPhase]         = useState<Phase>('playing')
  const [taskQueue,   setTaskQueue]     = useState<Task[]>([])
  const [taskIndex,   setTaskIndex]     = useState(0)
  const [doneIds,     setDoneIds]       = useState<string[]>([])
  const [answers,     setAnswers]       = useState<AnswerRecord[]>([])
  const [showQuit,    setShowQuit]      = useState(false)
  const [quitSaving,  setQuitSaving]    = useState(false)
  const [feedback,    setFeedback]      = useState<{ correct: boolean; mastery: number } | null>(null)
  const [logging,     setLogging]       = useState(false)
  const [consecutiveWrong, setConsecutiveWrong] = useState(0)
  const [showFollowUpBanner, setShowFollowUpBanner] = useState(false)
  const [followUpDiff, setFollowUpDiff] = useState<Difficulty>('easy')
  const [showGentleBanner,   setShowGentleBanner]   = useState(false)
  const [showCelebration,    setShowCelebration]     = useState(false)
  const [nextTransition,     setNextTransition]      = useState<{ tier: 1|2|3; diff: Difficulty } | null>(null)
  const [showTransition,     setShowTransition]      = useState(false)
  const [showProgressReport, setShowProgressReport]  = useState(false)
  const [currentReport,      setCurrentReport]       = useState<DifficultyReport | null>(null)
  const [showSummary,        setShowSummary]         = useState(false)
  const [difficultyReports,  setDifficultyReports]   = useState<DifficultyReport[]>([])
  const [overallMastery,     setOverallMastery]      = useState(0.15)
  const [prevMastery,        setPrevMastery]         = useState(0.15)
  const [recommendedSkill,   setRecommendedSkill]    = useState('time_planning')

  const taskStartTime    = useRef<number>(Date.now())
  const sessionAnswers   = useRef<AnswerRecord[]>([])
  const answeredIds      = useRef<Set<string>>(new Set())
  const queueSize        = useRef<number>(7)
  const originalAnswers  = useRef<AnswerRecord[]>([])
  const mainAnswers      = useRef<AnswerRecord[]>([])
  const isHandlingAnswer = useRef(false)

  useEffect(() => {
    startSession(resolvedLearnerId).then(ok => { if (!ok) console.warn('Session start failed') })
    getAdaptation(resolvedLearnerId).then(adaptation => {
      if (adaptation?.mastery) {
        setOverallMastery(adaptation.mastery)
        setPrevMastery(adaptation.mastery)
      }
    })
    mainAnswers.current = []
    loadQueue(currentTier, currentDiff, [])
  }, [])

  useEffect(() => { taskStartTime.current = Date.now() }, [taskIndex])

  function loadQueue(t: 1|2|3, d: Difficulty, exclude: string[], followUp = false, currentAnswers: AnswerRecord[] = []) {
    let tasks: Task[]
    if (followUp) {
      const wrongTopics = currentAnswers.filter(a => !a.correct).map(a => a.topic)
      tasks = getFollowUpTasks(allTasks, t, d, wrongTopics, exclude)
    } else {
      tasks = getTasksForDifficulty(allTasks, t, d, exclude)
    }
    const sliced = tasks.slice(0, followUp ? 3 : 7)
    queueSize.current = sliced.length
    setTaskQueue(sliced)
    setTaskIndex(0); setFeedback(null); setConsecutiveWrong(0)
    taskStartTime.current = Date.now()
    answeredIds.current = new Set()
  }

  const currentTask = taskQueue[taskIndex] ?? null
  const totalTasks  = taskQueue.length
  const taskNumber  = taskIndex + 1
  const isLast      = taskIndex + 1 >= queueSize.current

  async function handleAnswer(correct: boolean, responseTime: number, hintsUsed: number) {
    if (isHandlingAnswer.current) return
    isHandlingAnswer.current = true
    if (!currentTask || feedback || logging) { isHandlingAnswer.current = false; return }
    setLogging(true)
    let mastery = prevMastery
    let frustrationDelta = 0
    try {
      const response = await logAttempt({
        learner_id: resolvedLearnerId, simulation_type: 'skill_simulation',
        task_type: currentTask.type, success: correct, skill: skillId,
        response_type: correct ? 'correct' : 'incorrect',
        hints_used: hintsUsed, quit_signal: false,
        response_time: responseTime, attempt_number: taskIndex + 1,
      })
      if (response) {
        const adaptation = (response as any).adaptation ?? response
        mastery = adaptation?.mastery ?? prevMastery
        frustrationDelta = correct ? -0.01 : 0.05
        setOverallMastery(mastery)
      }
    } catch { console.warn('BKT log failed') }

    const record: AnswerRecord = {
      taskId: currentTask.id, topic: currentTask.topic,
      correct, responseTime, hintsUsed,
      mastery, prevMastery, frustrationDelta,
    }
    setPrevMastery(mastery)
    const nextAnswers = [...mainAnswers.current, record]
    mainAnswers.current = nextAnswers
    setAnswers(nextAnswers)
    sessionAnswers.current = [...sessionAnswers.current, record]
    setDoneIds(prev => [...prev, currentTask.id])
    setLogging(false)
    setConsecutiveWrong(correct ? 0 : consecutiveWrong + 1)
    setFeedback({ correct, mastery })
    isHandlingAnswer.current = false
  }

  function evaluateSet(currentAnswers: AnswerRecord[]) {
    const avgMastery = currentAnswers.length > 0
      ? currentAnswers.reduce((s, a) => s + a.mastery, 0) / currentAnswers.length : 0.15
    return { passed: avgMastery >= 0.70, avgMastery }
  }

  function buildReport(ans: AnswerRecord[], tier: 1|2|3, diff: Difficulty, passed: boolean, avgMastery: number, promotedWithRemediation = false): DifficultyReport {
    ans = ans.slice(0, 7)
    return {
      tier, difficulty: diff, passed, avgMastery, answers: ans,
      correct:     ans.filter(a => a.correct).length,
      total:       ans.length,
      hintsUsed:   ans.reduce((s, a) => s + a.hintsUsed, 0),
      avgResponse: ans.length > 0 ? ans.reduce((s, a) => s + a.responseTime, 0) / ans.length : 0,
      promotedWithRemediation,
    }
  }

  async function fetchNextSkill() {
    try {
      const res = await getNextSkill(resolvedLearnerId)
      if (res) setRecommendedSkill(res)
    } catch { /* use default */ }
  }

  function handleNext() {
    setFeedback(null)
    if (!isLast) { setTaskIndex(i => i + 1); return }

    const currentAnswers = mainAnswers.current
    const finalMastery = currentAnswers.length > 0 ? currentAnswers[currentAnswers.length - 1]?.mastery ?? 0 : 0
    const accuracy = currentAnswers.filter(a => a.correct).length / (currentAnswers.length || 1)
    const promotionScore = (finalMastery * 0.70) + (accuracy * 0.30)
    const passed = promotionScore >= 0.50
    const avgMastery = currentAnswers.reduce((s, a) => s + a.mastery, 0) / (currentAnswers.length || 1)
    const report = buildReport(currentAnswers, currentTier, currentDiff, passed, avgMastery)

    if (phase === 'playing') {
      if (passed) {
        setDifficultyReports(prev => [...prev, report])
        setCurrentReport(report)
        setShowProgressReport(true)
      } else {
        originalAnswers.current = [...mainAnswers.current]
        mainAnswers.current = []
        const followUpExcludeIds = [...answeredIds.current]
        setPhase('followup')
        setFollowUpDiff(currentDiff)
        setShowFollowUpBanner(true)
        setAnswers([])
        answeredIds.current = new Set()
        loadQueue(currentTier, currentDiff, followUpExcludeIds, true, originalAnswers.current)
      }
    } else if (phase === 'followup') {
      const remediationReport = buildReport(originalAnswers.current, currentTier, currentDiff, passed, avgMastery, true)
      setDifficultyReports(prev => [...prev, remediationReport])
      setShowGentleBanner(true)
      setTimeout(() => {
        setShowGentleBanner(false)
        setCurrentReport(remediationReport)
        setShowProgressReport(true)
      }, 3500)
    }
  }

  function handleProgressReportContinue() {
    setShowProgressReport(false)
    if (nextTransition) setShowCelebration(true)
    else handleSessionComplete()
  }

  function handleCelebrationDone() {
    setShowCelebration(false)
    if (nextTransition) setShowTransition(true)
    else handleSessionComplete()
  }

  function handleTransitionDone() {
    if (nextTransition) {
      const next = nextTransition
      mainAnswers.current = []
      loadQueue(next.tier, next.diff, [])
      setCurrentTier(next.tier); setCurrentDiff(next.diff)
      setPhase('playing'); setAnswers([])
      setNextTransition(null); setShowTransition(false)
      setShowFollowUpBanner(false)
    }
  }

  async function handleSessionComplete() {
    await fetchNextSkill()
    try { await endSession(resolvedLearnerId, difficultyReports.some(r => r.promotedWithRemediation)) } catch { /* ignore */ }
    setShowSummary(true)
    const sessionMastery = sessionAnswers.current.length > 0
      ? sessionAnswers.current.reduce((s, a) => s + a.mastery, 0) / sessionAnswers.current.length : 0.15
    onSessionComplete?.({ passed: true, mastery: sessionMastery })
  }

  function renderInteraction(task: Task) {
    const commonProps = { task, learnerId: resolvedLearnerId, onAnswer: handleAnswer, hintsAllowed: true, showHint: phase === 'followup' }
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

  // ── Screen routing ──────────────────────────────────────────────────────────
  if (showSummary) {
    const sessionMastery = sessionAnswers.current.length > 0
      ? sessionAnswers.current.reduce((s, a) => s + a.mastery, 0) / sessionAnswers.current.length : 0.15
    return (
      <SessionSummaryScreen
        skillName={skillName} reports={difficultyReports}
        sessionMastery={sessionMastery} overallMastery={overallMastery}
        onPlayAgain={() => { setShowSummary(false); setAnswers([]); sessionAnswers.current = []; mainAnswers.current = []; setDifficultyReports([]); setPhase('playing'); loadQueue(1,'easy',[]) }}
        onTryAnother={() => onGoBack?.()}
        onBackToSkill={() => onGoBack?.()}
        recommendedSkill={recommendedSkill}
        hasTaskData={!!SKILL_TASK_MAP[recommendedSkill]}
        onAcceptRecommendation={() => onGoBack?.()}
      />
    )
  }

  if (showProgressReport && currentReport) {
    const next = nextTransition
    return (
      <ProgressReport
        report={currentReport} skillName={skillName} overallMastery={overallMastery}
        nextLabel={next ? `Continue to ${DIFFICULTY_LABEL[next.diff]}` : 'Session complete'}
        onContinue={handleProgressReportContinue}
      />
    )
  }

  if (!currentTask && !showTransition && !showCelebration) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#9da3b8', fontSize: 15 }}>
        Loading tasks…
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0f', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {quitSaving && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 100,
          background: 'var(--bg, #0e0f1a)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 20,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTop: '3px solid #7c6ffa',
            animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{ fontSize: 15, color: '#9da3b8' }}>Saving your progress…</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      {showQuit && <QuitConfirm onStay={() => setShowQuit(false)} onQuit={() => { setShowQuit(false); setQuitSaving(true); setTimeout(() => { onGoBack?.(); }, 3000); }} tier={currentTier} difficulty={currentDiff} />}
      {feedback && currentTask && <FeedbackPanel correct={feedback.correct} explanation={currentTask.explanation} isLast={isLast} onNext={handleNext} />}
      {showCelebration && <CelebrationPopup onContinue={handleCelebrationDone} nextLabel={nextTransition ? `Starting ${DIFFICULTY_LABEL[nextTransition.diff]}!` : 'Session complete!'} />}
      {showTransition && nextTransition && <TransitionScreen tier={nextTransition.tier} difficulty={nextTransition.diff} onReady={handleTransitionDone} />}
      {showFollowUpBanner && <FollowUpBanner onDismiss={() => setShowFollowUpBanner(false)} difficulty={followUpDiff} tier={currentTier} />}
      {showGentleBanner && <GentleForwardBanner onDismiss={() => setShowGentleBanner(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <button onClick={() => setShowQuit(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9da3b8', fontSize: 20, padding: 4, lineHeight: 1 }}>←</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f1f5' }}>{skillName}</div>
          <div style={{ fontSize: 11, color: '#6b7290', marginTop: 2 }}>
            Level {currentTier} · {DIFFICULTY_LABEL[currentDiff]}{phase === 'followup' ? ' · Follow-up' : ''}
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#6b7290', minWidth: 36, textAlign: 'right' }}>
          {logging ? '…' : `${taskNumber}/${totalTasks}`}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{ height: '100%', width: `${(taskNumber/totalTasks)*100}%`, background: phase === 'followup' ? '#a855f7' : '#6c63ff', borderRadius: 2, transition: 'width 0.35s ease' }} />
      </div>

      {/* Guided mode lite */}
      {consecutiveWrong >= 3 && (
        <div style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', padding: '8px 20px', fontSize: 12, color: '#c084fc', textAlign: 'center' }}>
          💡 Tip: Look carefully at the hint before answering
        </div>
      )}

      {/* Content */}
      {currentTask && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 40px', width: '100%', boxSizing: 'border-box' }}>
          <div key={`${currentTask.id}-${taskIndex}-${phase}`}>
            {renderInteraction(currentTask)}
          </div>
        </div>
      )}
    </div>
  )
}
