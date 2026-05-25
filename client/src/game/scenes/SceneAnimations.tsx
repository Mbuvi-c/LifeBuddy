// sceneAnimations.tsx
// Maps animationType strings from sceneData.ts → React animation components.
// 8 real animations built. 26 stubs show a calm placeholder.
// Replace stubs one at a time — ScenePlayer picks them up automatically.

import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Keyframes — injected once into <head>
// ─────────────────────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes lb-fall {
  0%   { transform: translateY(-80px) rotate(-12deg); opacity: 0; }
  65%  { transform: translateY(6px)   rotate(3deg);   opacity: 1; }
  100% { transform: translateY(0)     rotate(0deg);   opacity: 1; }
}
@keyframes lb-spread {
  0%   { transform: translateX(-50px) rotate(-6deg) scale(0.8); opacity: 0; }
  70%  { transform: translateX(4px)   rotate(1deg)  scale(1.02); opacity: 1; }
  100% { transform: translateX(0)     rotate(0deg)  scale(1);    opacity: 1; }
}
@keyframes lb-count-pop {
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1);    opacity: 1; }
}
@keyframes lb-minute-hand {
  from { transform: rotate(0deg);   }
  to   { transform: rotate(360deg); }
}
@keyframes lb-second-hand {
  from { transform: rotate(0deg);   }
  to   { transform: rotate(360deg); }
}
@keyframes lb-flash {
  0%, 100% { opacity: 1;    }
  45%, 55% { opacity: 0.08; }
}
@keyframes lb-bar-grow {
  0%   { width: 0%;   }
  100% { width: 72%;  }
}
@keyframes lb-bar-grow2 {
  0%   { width: 0%;   }
  100% { width: 48%;  }
}
@keyframes lb-lock-shackle {
  0%,100% { transform: translateY(0);   }
  40%     { transform: translateY(-10px); }
  70%     { transform: translateY(0);   }
}
@keyframes lb-phone-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
  50%      { box-shadow: 0 0 0 18px rgba(74,222,128,0.18); }
}
@keyframes lb-bubble-in {
  0%   { transform: scale(0.5) translateY(14px); opacity: 0; }
  65%  { transform: scale(1.04) translateY(-2px); opacity: 1; }
  100% { transform: scale(1) translateY(0);       opacity: 1; }
}
@keyframes lb-send-fly {
  0%   { transform: translate(0,0)         scale(1);   opacity: 1; }
  100% { transform: translate(52px,-38px)  scale(0.4); opacity: 0; }
}
@keyframes lb-shield-rise {
  0%   { transform: translateY(28px) scale(0.88); opacity: 0; }
  70%  { transform: translateY(-4px) scale(1.04); opacity: 1; }
  100% { transform: translateY(0)    scale(1);    opacity: 1; }
}
@keyframes lb-voice-wave {
  0%, 100% { transform: scaleY(0.3); opacity: 0.4; }
  50%      { transform: scaleY(1);   opacity: 1;   }
}
@keyframes lb-stub-pulse {
  0%, 100% { opacity: 0.2; }
  50%      { opacity: 0.6; }
}
@keyframes lb-float {
  0%, 100% { transform: translateY(0px);  }
  50%      { transform: translateY(-7px); }
}
`

let injected = false
function injectKeyframes() {
  if (injected || typeof document === 'undefined') return
  const s = document.createElement('style')
  s.textContent = KEYFRAMES
  document.head.appendChild(s)
  injected = true
}

// ─────────────────────────────────────────────────────────────────────────────
// Stub — shown for every unbuilt animation
// ─────────────────────────────────────────────────────────────────────────────

function AnimStub({ label }: { label: string }) {
  useEffect(() => { injectKeyframes() }, [])
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 14,
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: i === 1 || i === 2 ? 14 : 9,
            height: i === 1 || i === 2 ? 14 : 9,
            borderRadius: '50%',
            background: 'var(--lb-accent)',
            animation: `lb-stub-pulse 1.6s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <span style={{
        fontSize: 10, letterSpacing: '0.12em',
        textTransform: 'uppercase', opacity: 0.35,
        color: 'var(--lb-accent)',
      }}>{label}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ① coins-fall — Money & Transactions
// ─────────────────────────────────────────────────────────────────────────────

const COINS = [
  { v: '1',  fill: '#b8973a', stroke: '#8a6e22', x: 0,   delay: 0.05 },
  { v: '5',  fill: '#a0a0a0', stroke: '#707070', x: 56,  delay: 0.20 },
  { v: '10', fill: '#c8b830', stroke: '#9a8c18', x: 112, delay: 0.00 },
  { v: '20', fill: '#d4a020', stroke: '#a07010', x: 168, delay: 0.28 },
  { v: '50', fill: '#c07828', stroke: '#8a5010', x: 224, delay: 0.12 },
]

export function CoinsFall() {
  useEffect(() => { injectKeyframes() }, [])
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 24 }}>
      <div style={{ position: 'relative', width: 272, height: 160 }}>
        {COINS.map((c) => (
          <div key={c.v} style={{
            position: 'absolute', bottom: 0, left: c.x,
            animation: `lb-fall 0.65s cubic-bezier(.2,.7,0,1.15) ${c.delay}s both`,
          }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" fill={c.fill} stroke={c.stroke} strokeWidth="2" />
              <circle cx="24" cy="24" r="17" fill="none" stroke={c.stroke} strokeWidth="1" opacity="0.5" />
              <text x="24" y="29" textAnchor="middle" fill={c.stroke}
                style={{ fontSize: c.v.length > 1 ? 11 : 14, fontWeight: 700, fontFamily: 'system-ui' }}>
                {c.v}
              </text>
            </svg>
          </div>
        ))}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
          background: 'var(--lb-accent)', borderRadius: 2, opacity: 0.3,
        }} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ② notes-spread — Kenyan banknotes fanning out
// ─────────────────────────────────────────────────────────────────────────────

const NOTES = [
  { v: '50',   color: '#3a7a3a', delay: 0.00, rotate: -18, tx: -90 },
  { v: '100',  color: '#7a3a3a', delay: 0.10, rotate: -9,  tx: -45 },
  { v: '200',  color: '#3a4a8a', delay: 0.18, rotate: 0,   tx: 0   },
  { v: '500',  color: '#7a6a20', delay: 0.26, rotate: 9,   tx: 45  },
  { v: '1000', color: '#4a2a7a', delay: 0.34, rotate: 18,  tx: 90  },
]

export function NotesSpread() {
  useEffect(() => { injectKeyframes() }, [])
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 200, height: 120 }}>
        {NOTES.map((n) => (
          <div key={n.v} style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: `translateX(calc(-50% + ${n.tx}px)) translateY(-50%) rotate(${n.rotate}deg)`,
            animation: `lb-spread 0.6s cubic-bezier(.2,.7,0,1.1) ${n.delay}s both`,
            transformOrigin: 'bottom center',
          }}>
            <svg width="80" height="40" viewBox="0 0 80 40" style={{ display: 'block' }}>
              <rect x="1" y="1" width="78" height="38" rx="4"
                fill={n.color} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <rect x="6" y="6" width="68" height="28" rx="2"
                fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <text x="40" y="25" textAnchor="middle"
                fill="rgba(255,255,255,0.9)"
                style={{ fontSize: 12, fontWeight: 700, fontFamily: 'system-ui' }}>
                KES {n.v}
              </text>
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ③ count-coins — arithmetic / change calculation
// ─────────────────────────────────────────────────────────────────────────────

export function CountCoins() {
  useEffect(() => { injectKeyframes() }, [])
  const items = [
    { label: 'KES 200', sub: 'given',    delay: 0.00, color: '#4a7a4a' },
    { label: '−',       sub: '',         delay: 0.15, color: 'var(--lb-text-muted)' },
    { label: 'KES 130', sub: 'price',    delay: 0.25, color: '#7a4a4a' },
    { label: '=',       sub: '',         delay: 0.38, color: 'var(--lb-text-muted)' },
    { label: 'KES 70',  sub: 'change ✓', delay: 0.50, color: 'var(--lb-accent)' },
  ]
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            animation: `lb-count-pop 0.5s cubic-bezier(.2,.7,0,1.2) ${item.delay}s both`,
          }}>
            <span style={{
              fontSize: item.label.length === 1 ? 28 : 16,
              fontWeight: 700, color: item.color,
              fontFamily: 'system-ui',
            }}>{item.label}</span>
            {item.sub && (
              <span style={{ fontSize: 10, color: 'var(--lb-text-muted)', letterSpacing: '0.05em' }}>
                {item.sub}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ④ clock-tick — analogue clock with sweeping minute hand
// ─────────────────────────────────────────────────────────────────────────────

export function ClockTick() {
  useEffect(() => { injectKeyframes() }, [])
  const ticks = Array.from({ length: 12 }, (_, i) => i)
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {/* Face */}
        <circle cx="80" cy="80" r="76" fill="var(--lb-card-bg)" stroke="var(--lb-accent)" strokeWidth="2.5" />
        <circle cx="80" cy="80" r="70" fill="none" stroke="var(--lb-accent)" strokeWidth="0.5" opacity="0.2" />
        {/* Hour marks */}
        {ticks.map(i => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2
          const r1 = i % 3 === 0 ? 60 : 64
          const r2 = 70
          return (
            <line key={i}
              x1={80 + r1 * Math.cos(a)} y1={80 + r1 * Math.sin(a)}
              x2={80 + r2 * Math.cos(a)} y2={80 + r2 * Math.sin(a)}
              stroke="var(--lb-accent)" strokeWidth={i % 3 === 0 ? 2.5 : 1}
              strokeLinecap="round" opacity={i % 3 === 0 ? 0.8 : 0.35}
            />
          )
        })}
        {/* Hour numbers */}
        {[12, 3, 6, 9].map((n, i) => {
          const a = (i / 4) * Math.PI * 2 - Math.PI / 2
          return (
            <text key={n} x={80 + 52 * Math.cos(a)} y={80 + 52 * Math.sin(a) + 4}
              textAnchor="middle" fill="var(--lb-accent)"
              style={{ fontSize: 11, fontWeight: 600, fontFamily: 'system-ui' }}>
              {n}
            </text>
          )
        })}
        {/* Hour hand — fixed at ~3:00 */}
        <line x1="80" y1="80" x2="116" y2="80"
          stroke="var(--lb-text)" strokeWidth="4" strokeLinecap="round" />
        {/* Minute hand — animates full rotation */}
        <g style={{ transformOrigin: '80px 80px', animation: 'lb-minute-hand 8s linear infinite' }}>
          <line x1="80" y1="80" x2="80" y2="22"
            stroke="var(--lb-accent)" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Centre dot */}
        <circle cx="80" cy="80" r="4" fill="var(--lb-accent)" />
        <circle cx="80" cy="80" r="2" fill="var(--lb-card-bg)" />
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑤ warning-flash — pulsing alert icon
// ─────────────────────────────────────────────────────────────────────────────

export function WarningFlash() {
  useEffect(() => { injectKeyframes() }, [])
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ animation: 'lb-flash 1.8s ease-in-out infinite' }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <polygon points="60,10 112,105 8,105"
            fill="rgba(234,179,8,0.15)" stroke="#eab308" strokeWidth="3"
            strokeLinejoin="round" />
          <line x1="60" y1="42" x2="60" y2="74"
            stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
          <circle cx="60" cy="88" r="3.5" fill="#eab308" />
        </svg>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑥ budget-bar — spending vs budget progress bars
// ─────────────────────────────────────────────────────────────────────────────

export function BudgetBar() {
  useEffect(() => { injectKeyframes() }, [])
  const rows = [
    { label: 'Food',       pct: '62%', color: '#4ade80', delay: '0.0s' },
    { label: 'Transport',  pct: '38%', color: '#60a5fa', delay: '0.15s' },
    { label: 'Airtime',    pct: '20%', color: '#a78bfa', delay: '0.28s' },
    { label: 'Savings',    pct: '15%', color: '#fbbf24', delay: '0.40s' },
  ]
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', gap: 14, padding: '0 24px',
    }}>
      {rows.map(r => (
        <div key={r.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: 'var(--lb-text-muted)', fontFamily: 'system-ui' }}>{r.label}</span>
            <span style={{ fontSize: 12, color: r.color, fontWeight: 600, fontFamily: 'system-ui' }}>{r.pct}</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4, background: r.color,
              width: r.pct,
              animation: `lb-bar-grow 1s cubic-bezier(.4,0,.2,1) ${r.delay} both`,
            }} />
          </div>
        </div>
      ))}
      <div style={{
        marginTop: 4, padding: '8px 12px', borderRadius: 8,
        background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)',
        fontSize: 12, color: '#4ade80', fontFamily: 'system-ui',
        animation: `lb-count-pop 0.5s ease 0.6s both`,
      }}>
        ✓ Within budget — KES 380 of 500
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑦ lock-close — security / privacy
// ─────────────────────────────────────────────────────────────────────────────

export function LockClose() {
  useEffect(() => { injectKeyframes() }, [])
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="110" height="140" viewBox="0 0 110 140">
        {/* Shackle */}
        <g style={{ animation: 'lb-lock-shackle 2s ease-in-out 0.3s 2 forwards' }}>
          <path d="M30 68 Q30 24 55 24 Q80 24 80 68"
            fill="none" stroke="var(--lb-accent)" strokeWidth="8"
            strokeLinecap="round" />
        </g>
        {/* Body */}
        <rect x="14" y="62" width="82" height="62" rx="10"
          fill="var(--lb-accent)" opacity="0.15" stroke="var(--lb-accent)" strokeWidth="2" />
        {/* Keyhole */}
        <circle cx="55" cy="89" r="9" fill="var(--lb-accent)" opacity="0.7" />
        <rect x="51" y="94" width="8" height="14" rx="2" fill="var(--lb-accent)" opacity="0.7" />
        {/* Glow ring */}
        <circle cx="55" cy="89" r="20" fill="none"
          stroke="var(--lb-accent)" strokeWidth="1"
          opacity="0.2"
          style={{ animation: 'lb-phone-glow 2s ease-in-out infinite' }}
        />
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑧ phone-glow — phone / digital device
// ─────────────────────────────────────────────────────────────────────────────

export function PhoneGlow() {
  useEffect(() => { injectKeyframes() }, [])
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', animation: 'lb-float 3s ease-in-out infinite' }}>
        <svg width="90" height="160" viewBox="0 0 90 160">
          {/* Phone body */}
          <rect x="5" y="5" width="80" height="150" rx="14"
            fill="var(--lb-card-bg)" stroke="var(--lb-accent)" strokeWidth="2" />
          {/* Screen */}
          <rect x="12" y="22" width="66" height="108" rx="6"
            fill="rgba(74,222,128,0.08)" stroke="var(--lb-accent)" strokeWidth="1" opacity="0.5" />
          {/* M-Pesa / app icon suggestion */}
          <rect x="29" y="48" width="32" height="32" rx="8"
            fill="var(--lb-accent)" opacity="0.2" />
          <text x="45" y="70" textAnchor="middle"
            fill="var(--lb-accent)" opacity="0.8"
            style={{ fontSize: 14, fontWeight: 700, fontFamily: 'system-ui' }}>M</text>
          {/* Status lines */}
          <rect x="22" y="96" width="46" height="5" rx="2.5" fill="var(--lb-accent)" opacity="0.15" />
          <rect x="28" y="107" width="34" height="4" rx="2" fill="var(--lb-accent)" opacity="0.10" />
          {/* Home bar */}
          <rect x="32" y="142" width="26" height="4" rx="2" fill="var(--lb-accent)" opacity="0.4" />
          {/* Notch */}
          <rect x="30" y="9" width="30" height="7" rx="3.5" fill="var(--lb-accent)" opacity="0.25" />
        </svg>
        {/* Glow effect */}
        <div style={{
          position: 'absolute', inset: -12,
          borderRadius: 28,
          animation: 'lb-phone-glow 2.4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Remaining stubs — replace with real components as you go
// ─────────────────────────────────────────────────────────────────────────────

export function HandPay()         { return <AnimStub label="hand-pay" /> }
export function SunMoon()         { return <AnimStub label="sun-moon" /> }
export function ScheduleReveal()  { return <AnimStub label="schedule-reveal" /> }
export function ClockReverse()    { return <AnimStub label="clock-reverse" /> }
export function LateRush()        { return <AnimStub label="late-rush" /> }
export function CallShield()      { return <AnimStub label="call-shield" /> }
export function ChatBubble()      { return <AnimStub label="chat-bubble" /> }
export function MpesaLogo()       { return <AnimStub label="mpesa-logo" /> }
export function SendMoney()       { return <AnimStub label="send-money" /> }
export function TillPay()         { return <AnimStub label="till-pay" /> }
export function BalanceReveal()   { return <AnimStub label="balance-reveal" /> }
export function VoiceRise()       { return <AnimStub label="voice-rise" /> }
export function HandRaised()      { return <AnimStub label="hand-raised" /> }
export function TwoPeople()       { return <AnimStub label="two-people" /> }
export function ShieldRise()      { return <AnimStub label="shield-rise" /> }
export function IncomeFlow()      { return <AnimStub label="income-flow" /> }
export function ExpenseTrack()    { return <AnimStub label="expense-track" /> }
export function NeedsWants()      { return <AnimStub label="needs-wants" /> }
export function SavingsGrow()     { return <AnimStub label="savings-grow" /> }
export function HealthCheck()     { return <AnimStub label="health-check" /> }
export function PrescriptionRead(){ return <AnimStub label="prescription-read" /> }
export function EmergencyCall()   { return <AnimStub label="emergency-call" /> }
export function CommunityMap()    { return <AnimStub label="community-map" /> }
export function WorkScene()       { return <AnimStub label="work-scene" /> }
export function PayslipReveal()   { return <AnimStub label="payslip-reveal" /> }
export function MpesaAlert()      { return <AnimStub label="mpesa-alert" /> }

// ─────────────────────────────────────────────────────────────────────────────
// Registry — ScenePlayer imports this and looks up by animationType string
// ─────────────────────────────────────────────────────────────────────────────

export const ANIMATION_REGISTRY: Record<string, () => JSX.Element> = {
  'coins-fall':        CoinsFall,
  'notes-spread':      NotesSpread,
  'count-coins':       CountCoins,
  'clock-tick':        ClockTick,
  'warning-flash':     WarningFlash,
  'budget-bar':        BudgetBar,
  'lock-close':        LockClose,
  'phone-glow':        PhoneGlow,
  'hand-pay':          HandPay,
  'sun-moon':          SunMoon,
  'schedule-reveal':   ScheduleReveal,
  'clock-reverse':     ClockReverse,
  'late-rush':         LateRush,
  'call-shield':       CallShield,
  'chat-bubble':       ChatBubble,
  'mpesa-logo':        MpesaLogo,
  'send-money':        SendMoney,
  'till-pay':          TillPay,
  'balance-reveal':    BalanceReveal,
  'voice-rise':        VoiceRise,
  'hand-raised':       HandRaised,
  'two-people':        TwoPeople,
  'shield-rise':       ShieldRise,
  'income-flow':       IncomeFlow,
  'expense-track':     ExpenseTrack,
  'needs-wants':       NeedsWants,
  'savings-grow':      SavingsGrow,
  'health-check':      HealthCheck,
  'prescription-read': PrescriptionRead,
  'emergency-call':    EmergencyCall,
  'community-map':     CommunityMap,
  'work-scene':        WorkScene,
  'payslip-reveal':    PayslipReveal,
  'mpesa-alert':       MpesaAlert,
}
