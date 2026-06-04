import SimulationEngine from './game/engine/SimulationEngineV2';
import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
// VOICE HELPER — human-like speech
// ─────────────────────────────────────────────
function speak(text, rate = 0.92, pitch = 1.05) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate; u.pitch = pitch; u.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.name.includes("Samantha") || v.name.includes("Karen") ||
    v.name.includes("Daniel") || v.name.includes("Google UK") ||
    v.name.includes("Google US") || v.name.includes("Microsoft")
  );
  if (preferred) u.voice = preferred;
  window.speechSynthesis.speak(u);
}
function stopSpeech() { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Nunito:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  :root {
    --font-display:'Syne',sans-serif;
    --font-body:'DM Sans',sans-serif;
    --bg:#0a0b0f; --bg2:#111217; --bg3:#16181f; --bg4:#1c1f2a;
    --surface:#1e2130; --surface2:#252840;
    --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.13);
    --text:#f0f1f5; --text2:#9da3b8; --text3:#6b7290;
    --accent:#6c63ff; --accent2:#8b85ff; --accent3:#4f46e5;
    --accent-glow:rgba(108,99,255,0.22);
    --green:#22c97a; --green-dim:rgba(34,201,122,0.14);
    --amber:#f59e0b; --amber-dim:rgba(245,158,11,0.14);
    --purple:#a855f7; --purple-dim:rgba(168,85,247,0.14);
    --red:#ef4444; --red-dim:rgba(239,68,68,0.12);
    --radius:12px; --radius-sm:8px; --radius-lg:20px;
    --shadow:0 4px 24px rgba(0,0,0,0.4);
    --transition:0.2s cubic-bezier(0.4,0,0.2,1);
  }

  .app-light {
    --bg:#eef0f7; --bg2:#e2e4ef; --bg3:#d5d8ea; --bg4:#c8cce0;
    --surface:#f8f9ff; --surface2:#eceef8;
    --border:rgba(0,0,0,0.11); --border2:rgba(0,0,0,0.20);
    --text:#0d0f24; --text2:#2e3352; --text3:#5a607a;
    --accent:#4a40d4; --accent2:#5b52ee; --accent3:#3730a3;
    --accent-glow:rgba(74,64,212,0.22);
    --green:#146b38; --green-dim:rgba(20,107,56,0.14);
    --amber:#954d00; --amber-dim:rgba(149,77,0,0.13);
    --purple:#6d28d9; --purple-dim:rgba(109,40,217,0.13);
    --red:#991b1b; --red-dim:rgba(153,27,27,0.11);
    --shadow:0 4px 24px rgba(0,0,0,0.14);
  }
  .app-light { color: #0d0f24; }
  .app-light .nav-logo { color: #0d0f24; }
  .app-light .btn-ghost { color: #2e3352; border-color: rgba(0,0,0,0.22); }
  .app-light .btn-ghost:hover { background: #e2e4ef; color: #0d0f24; }
  .app-light .input-field { background: #eef0f7; color: #0d0f24; border-color: rgba(0,0,0,0.22); }
  .app-light .input-field:focus { background: #f8f9ff; }
  .app-light .game-option { background: #e2e4ef; color: #0d0f24; border-color: rgba(0,0,0,0.18); }
  .app-light .game-option:hover:not(:disabled) { background: rgba(74,64,212,0.10); border-color: #4a40d4; color: #0d0f24; }
  .app-light .sort-chip { background: #d5d8ea; color: #0d0f24; border-color: rgba(0,0,0,0.18); }
  .app-light .sort-chip:hover { background: #4a40d4; color: #fff; }
  .app-light .routine-step { background: #e2e4ef; color: #0d0f24; border-color: rgba(0,0,0,0.18); }
  .app-light .tab-btn:not(.active) { color: #5a607a; }
  .app-light .tab-btn.active { background: #d5d8ea; color: #0d0f24; }
  .app-light .nav { border-bottom: 1px solid rgba(0,0,0,0.12); }
  .app-light .sort-zone { border-color: rgba(0,0,0,0.20); }
  .app-light .hygiene-item { background: #e2e4ef; color: #0d0f24; border-color: rgba(0,0,0,0.18); }
  .app-light .clock-face { background: #f0f2f8; }
  .app-light .coin { color: #fff; }
  .app-light code { background: #d5d8ea !important; color: #2e3352 !important; }
  .app-light .voice-btn { color: #5a607a; }
  .app-light .voice-btn:hover { background: #d5d8ea; color: #2e3352; }

  html,body,#root { height:100%; background:var(--bg); color:var(--text); font-family:var(--font-body); }
  ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:var(--surface2);border-radius:2px}

  .btn { display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:var(--font-body);font-size:15px;font-weight:500;padding:13px 28px;border-radius:100px;border:none;cursor:pointer;transition:all var(--transition);text-decoration:none;white-space:nowrap; }
  .btn-primary { background:var(--accent);color:#fff; }
  .btn-primary:hover { background:var(--accent2);transform:translateY(-1px);box-shadow:0 4px 20px var(--accent-glow); }
  .btn-ghost { background:transparent;color:var(--text2);border:1.5px solid var(--border2); }
  .btn-ghost:hover { background:var(--surface);color:var(--text); }
  .btn-outline { background:transparent;color:var(--accent);border:1.5px solid var(--accent3); }
  .btn-outline:hover { background:rgba(108,99,255,0.1); }
  .btn-danger { background:var(--red-dim);color:var(--red);border:1.5px solid rgba(239,68,68,0.3); }
  .btn-danger:hover { background:rgba(239,68,68,0.2); }
  .btn-success { background:var(--green-dim);color:var(--green);border:1.5px solid rgba(34,201,122,0.3); }
  .btn-success:hover { background:rgba(34,201,122,0.22); }
  .btn-lg { padding:16px 36px;font-size:16px; }
  .btn-sm { padding:8px 16px;font-size:13px; }

  .card { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;transition:all var(--transition); }
  .card:hover { border-color:var(--border2); }
  .card-interactive { cursor:pointer; }
  .card-interactive:hover { transform:translateY(-2px);border-color:rgba(108,99,255,0.3);box-shadow:var(--shadow); }

  .input-wrap { display:flex;flex-direction:column;gap:6px; }
  .input-label { font-size:12px;font-weight:600;color:var(--text2);letter-spacing:0.06em;text-transform:uppercase; }
  .input-field { width:100%;padding:13px 16px;background:var(--bg3);border:1.5px solid var(--border2);border-radius:var(--radius-sm);color:var(--text);font-family:var(--font-body);font-size:15px;transition:all var(--transition);outline:none; }
  .input-field:focus { border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow); }
  .input-field::placeholder { color:transparent; }
  select.input-field option { background:var(--bg3);color:var(--text); }
  textarea.input-field { resize:vertical;min-height:96px; }

  .badge { display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:4px 10px;border-radius:100px;letter-spacing:0.03em; }
  .badge-green { background:var(--green-dim);color:var(--green); }
  .badge-amber { background:var(--amber-dim);color:var(--amber); }
  .badge-purple { background:var(--purple-dim);color:var(--purple); }
  .badge-accent { background:rgba(108,99,255,0.15);color:var(--accent2); }

  .page-enter { animation:pageIn 0.3s ease forwards; }
  @keyframes pageIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes starPop { 0%{transform:scale(0) rotate(-20deg);opacity:0} 60%{transform:scale(1.35) rotate(5deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes correctPulse { 0%,100%{transform:scale(1)} 40%{transform:scale(1.04)} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
  @keyframes bounceY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes fadeGreen { 0%,100%{background:transparent} 30%{background:rgba(34,201,122,0.10)} }
  @keyframes fadeRed { 0%,100%{background:transparent} 30%{background:rgba(239,68,68,0.08)} }
  @keyframes lineGrow { from{stroke-dashoffset:2000} to{stroke-dashoffset:0} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes pulseRing { 0%{box-shadow:0 0 0 0 var(--accent-glow)} 70%{box-shadow:0 0 0 10px rgba(108,99,255,0)} 100%{box-shadow:0 0 0 0 rgba(108,99,255,0)} }

  .progress-bar { height:4px;background:var(--bg4);border-radius:2px;overflow:hidden; }
  .progress-fill { height:100%;border-radius:2px;transition:width 0.6s cubic-bezier(0.4,0,0.2,1);background:var(--accent); }

  /* FIX: nav z-index and proper stacking */
  .nav { position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 28px;height:64px;background:rgba(10,11,15,0.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--border); }
  .app-light .nav { background:rgba(240,242,248,0.97); }
  .nav-logo { font-family:var(--font-display);font-size:20px;font-weight:800;color:var(--text);cursor:pointer;display:flex;align-items:center;gap:8px; }
  .nav-logo span { color:var(--accent2); }

  .divider { height:1px;background:var(--border);margin:20px 0; }
  .glow-orb { position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0; }

  .tab-bar { display:flex;gap:4px;background:var(--bg2);border-radius:var(--radius);padding:4px;overflow-x:auto; }
  .tab-btn { flex:1;min-width:fit-content;padding:9px 14px;border-radius:var(--radius-sm);border:none;cursor:pointer;font-size:13px;font-weight:500;font-family:var(--font-body);transition:all 0.15s;white-space:nowrap; }
  .tab-btn.active { background:var(--surface2);color:var(--text); }
  .tab-btn:not(.active) { background:transparent;color:var(--text3); }
  .tab-btn:not(.active):hover { color:var(--text2); }

  .modal-backdrop { position:fixed;inset:0;background:rgba(0,0,0,0.72);display:flex;align-items:center;justify-content:center;z-index:300;padding:16px;backdrop-filter:blur(4px); }

  .game-option { background:var(--bg3);border:2px solid var(--border2);color:var(--text);font-size:16px;padding:16px 18px;border-radius:var(--radius);width:100%;cursor:pointer;transition:all 0.15s;font-family:var(--font-body);text-align:left;display:flex;align-items:center;gap:12px; }
  .game-option:hover:not(:disabled) { border-color:var(--accent);background:rgba(108,99,255,0.07);transform:translateX(4px); }
  .game-option.correct { border-color:var(--green)!important;background:var(--green-dim)!important;animation:correctPulse 0.4s ease; }
  .game-option.wrong { border-color:var(--red)!important;background:var(--red-dim)!important;animation:shake 0.35s ease; }
  .game-option:disabled { cursor:default; }

  .clock-face { width:160px;height:160px;border-radius:50%;border:4px solid var(--accent2);position:relative;margin:0 auto 24px;background:var(--bg2);box-shadow:0 0 0 8px var(--bg4),0 0 40px var(--accent-glow); }
  .clock-hand { position:absolute;bottom:50%;left:50%;transform-origin:bottom center;border-radius:4px; }

  .sort-zone { min-height:90px;border:2px dashed var(--border2);border-radius:var(--radius);padding:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start;transition:border-color 0.2s; }
  .sort-chip { padding:8px 14px;background:var(--surface2);border:1px solid var(--border2);border-radius:100px;font-size:14px;cursor:pointer;user-select:none;transition:all 0.15s;color:var(--text); }
  .sort-chip:hover { background:var(--accent3);border-color:var(--accent);color:#fff; }

  .routine-step { display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--bg3);border:1.5px solid var(--border2);border-radius:var(--radius);cursor:default;transition:all 0.15s;margin-bottom:8px;color:var(--text); }

  .coin { width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.15s;border:2.5px solid transparent;flex-shrink:0;user-select:none; }
  .coin:hover { transform:scale(1.12);border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow); }
  .coin.selected { border-color:var(--green)!important;box-shadow:0 0 0 3px var(--green-dim)!important;animation:pulseRing 1s ease; }

  .hygiene-item { padding:14px;background:var(--bg3);border:2px solid var(--border2);border-radius:var(--radius);cursor:pointer;transition:all 0.15s;text-align:center;color:var(--text); }
  .hygiene-item:hover { border-color:var(--accent);transform:scale(1.05); }
  .hygiene-item.selected { border-color:var(--green);background:var(--green-dim); }
  .hygiene-item.wrong-pick { border-color:var(--red);background:var(--red-dim); }

  /* FIX: Tooltip now appears BELOW the element and is visible */
  .tooltip-wrap { position:relative;display:inline-flex;align-items:center; }
  .tooltip {
    position:absolute;
    top:calc(100% + 8px);
    left:50%;
    transform:translateX(-50%);
    background:#1a1c28;
    border:1px solid var(--border2);
    color:var(--text);
    font-size:12px;
    line-height:1.5;
    padding:8px 12px;
    border-radius:var(--radius-sm);
    white-space:nowrap;
    max-width:260px;
    white-space:normal;
    pointer-events:none;
    opacity:0;
    transition:opacity 0.2s;
    z-index:500;
    box-shadow:0 4px 16px rgba(0,0,0,0.4);
    text-align:center;
  }
  .app-light .tooltip { background:#ffffff; box-shadow:0 4px 16px rgba(0,0,0,0.15); color:#0d0f24; border-color:rgba(0,0,0,0.18); }
  .tooltip-wrap:hover .tooltip { opacity:1; }
  /* Arrow pointing UP (tooltip is below) */
  .tooltip::before {
    content:'';
    position:absolute;
    bottom:100%;
    left:50%;
    transform:translateX(-50%);
    border:5px solid transparent;
    border-bottom-color:#1a1c28;
  }
  .app-light .tooltip::before { border-bottom-color:#ffffff; }

  /* Settings-specific inline hint — appears ABOVE the icon, fixed so never clipped */
  .setting-hint {
    display:inline-flex;
    align-items:center;
    gap:4px;
    position:relative;
    cursor:help;
  }
  .setting-hint-icon {
    width:18px;height:18px;border-radius:50%;
    background:var(--surface2);border:1px solid var(--border2);
    color:var(--text3);font-size:11px;font-weight:700;
    display:inline-flex;align-items:center;justify-content:center;
    cursor:help;flex-shrink:0;
  }
  .setting-hint-popup {
    position:fixed;
    bottom:auto;
    left:auto;
    min-width:220px;max-width:300px;
    background:#1e2233;
    border:1px solid rgba(255,255,255,0.18);
    color:#f0f1f5;
    font-size:12px;line-height:1.6;
    padding:10px 14px;
    border-radius:var(--radius-sm);
    box-shadow:0 -4px 24px rgba(0,0,0,0.6);
    z-index:9999;
    pointer-events:none;
    opacity:0;
    transition:opacity 0.15s;
    white-space:normal;
    transform:translateY(-8px);
  }
  .app-light .setting-hint-popup { background:#fff; color:#0d0f24; border-color:rgba(0,0,0,0.18); box-shadow:0 -4px 20px rgba(0,0,0,0.18); }
  .setting-hint:hover .setting-hint-popup { opacity:1; }

  .avatar { border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-family:var(--font-display);flex-shrink:0;cursor:pointer;transition:all 0.2s;border:2px solid transparent; }
  .avatar:hover { border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow); }

  .tier-easy { background:var(--green-dim);color:var(--green);border:1px solid var(--green); }
  .tier-inter { background:var(--amber-dim);color:var(--amber);border:1px solid var(--amber); }
  .tier-adv { background:var(--purple-dim);color:var(--purple);border:1px solid var(--purple); }

  .fab { position:fixed;bottom:24px;right:24px;z-index:200;width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:22px;transition:all 0.2s;box-shadow:0 4px 20px var(--accent-glow),0 2px 8px rgba(0,0,0,0.4);background:var(--accent);color:#fff;animation:float 3s ease infinite; }
  .fab:hover { transform:scale(1.14);box-shadow:0 6px 28px var(--accent-glow); }

  .voice-btn { background:none;border:none;cursor:pointer;font-size:18px;padding:4px 6px;border-radius:6px;transition:all 0.15s;color:var(--text3); }
  .voice-btn:hover { background:var(--surface2);color:var(--accent2); }

  @media(max-width:640px){.nav{padding:0 14px}.hide-mobile{display:none!important}.nav-mobile-menu{display:flex!important}}
  .nav-mobile-menu{display:none;}
  .chart-col{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;}
  .chart-bar-wrap{width:100%;display:flex;flex-direction:column;justify-content:flex-end;height:120px;}
  .chart-bar-inner{border-radius:4px 4px 0 0;width:100%;transition:height 0.6s cubic-bezier(0.4,0,0.2,1);}
  .chart-label{font-size:11px;color:var(--text3);}
  .line-chart-path{stroke-dasharray:2000;stroke-dashoffset:2000;animation:lineGrow 1.4s ease forwards 0.2s;}
`;

// ─────────────────────────────────────────────
// TIER CONFIG
// ─────────────────────────────────────────────
const TIER_CFG = {
  1:{ label:"Easy Tier",         short:"Easy",  cls:"badge-green",  tierCls:"tier-easy", color:"var(--green)",  name:"Easy",         emoji:"🟢" },
  2:{ label:"Intermediate Tier", short:"Inter", cls:"badge-amber",  tierCls:"tier-inter", color:"var(--amber)",  name:"Intermediate", emoji:"🟡" },
  3:{ label:"Advanced Tier",     short:"Adv",   cls:"badge-purple", tierCls:"tier-adv",   color:"var(--purple)", name:"Advanced",     emoji:"🟣" },
};

// ─────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────
const SKILLS = [
 { key:"finance",   icon:"💰", name:"Money & Transactions",      mastery:33, tier:1, recommended:true,  locked:false, desc:"Coins, notes & M-Pesa payments",      tooltip:"Identify coins and notes, count money, and make purchases with change." },
  { key:"time",      icon:"⏰", name:"Time & Planning",           mastery:72, tier:1, recommended:false, locked:false, desc:"Clocks, schedules & telling time",     tooltip:"Learn to read clocks, plan schedules, and understand time in daily life." },
  { key:"routine",   icon:"📋", name:"Daily Routine",             mastery:88, tier:1, recommended:false, locked:false, desc:"Morning, meals & bedtime sequences",   tooltip:"Arrange daily activities like morning routines and bedtime in the right order." },
  { key:"sorting",   icon:"📊", name:"Financial Planning",        mastery:55, tier:1, recommended:false, locked:false, desc:"Budgeting, saving & planning ahead",   tooltip:"Learn to plan and manage money for everyday needs and future goals." },
  { key:"digital",   icon:"📱", name:"Digital Safety",            mastery:0,  tier:1, recommended:false, locked:true,  desc:"Coming soon",                         tooltip:"Stay safe online — passwords, scams, and smart digital habits." },
  { key:"mobile",    icon:"📲", name:"Mobile Money & M-Pesa",     mastery:0,  tier:1, recommended:false, locked:true,  desc:"Coming soon",                         tooltip:"Send, receive and manage money using M-Pesa and mobile banking." },
  { key:"advocacy",  icon:"🤝", name:"Communication & Advocacy",  mastery:0,  tier:1, recommended:false, locked:true,  desc:"Coming soon",                         tooltip:"Speak up for yourself, ask for help, and communicate your needs clearly." },
  { key:"workplace", icon:"💼", name:"Workplace Readiness",       mastery:0,  tier:1, recommended:false, locked:true,  desc:"Coming soon",                         tooltip:"Job skills, workplace behaviour, and professional communication." },
];

// Render a skill's icon — uses HygieneSkillIcon SVG for hygiene, emoji for others
function SkillIcon({ sim, size = 36 }) {
  if (sim.svgIcon && sim.key === "hygiene") return <HygieneSkillIcon size={size}/>;
  return <span style={{fontSize: size}}>{sim.icon}</span>;
}

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────
const SETTINGS_DEFAULT = {
  darkMode:true, colorTheme:"purple", fontStyle:"default", fontSize:"md",
  fontWeight:"normal", lineSpacing:"normal", letterSpacing:"normal",
  contrastMode:"normal", saturation:"normal", reduceMotion:false,
  colourBlind:"none", borderRadius:"rounded", density:"normal",
  buttonSize:"normal", audioEnabled:true, autoReadQuestions:false,
  hintAutoShow:false, largeTargets:false, focusHighlight:false,
  reduceClutter:false, showProgressNumbers:true,
};

const FONT_MAP = { default:"'DM Sans',sans-serif", dyslexic:"'Comic Sans MS','Chalkboard SE',cursive", rounded:"'Nunito','Varela Round',sans-serif", mono:"'Fira Code','Courier New',monospace", serif:"'Georgia','Times New Roman',serif" };
const FONT_SIZE_MAP    = { sm:"13px", md:"15px", lg:"17px", xl:"20px", xxl:"24px" };
const FONT_WEIGHT_MAP  = { normal:"400", medium:"500", bold:"700" };
const LINE_SPACING_MAP = { compact:"1.3", normal:"1.6", relaxed:"1.9", loose:"2.3" };
const LETTER_SPACING_MAP = { tight:"-0.02em", normal:"0em", wide:"0.04em", wider:"0.08em" };
const RADIUS_MAP       = { sharp:"2px", rounded:"12px", pill:"28px" };
const DENSITY_MAP      = { compact:"14px", normal:"24px", spacious:"38px" };
const BTN_PAD_MAP      = { small:"8px 16px", normal:"13px 28px", large:"18px 38px", xl:"22px 52px" };
const BTN_FONT_MAP     = { small:"13px", normal:"15px", large:"17px", xl:"20px" };
const COLOR_THEMES = {
  purple:{ accent:"#6c63ff",accent2:"#8b85ff",accent3:"#4f46e5",glow:"rgba(108,99,255,0.22)" },
  blue:  { accent:"#3b82f6",accent2:"#60a5fa",accent3:"#2563eb",glow:"rgba(59,130,246,0.22)"  },
  green: { accent:"#10b981",accent2:"#34d399",accent3:"#059669",glow:"rgba(16,185,129,0.22)"  },
  orange:{ accent:"#f97316",accent2:"#fb923c",accent3:"#ea580c",glow:"rgba(249,115,22,0.22)"  },
  pink:  { accent:"#ec4899",accent2:"#f472b6",accent3:"#db2777",glow:"rgba(236,72,153,0.22)"  },
  yellow:{ accent:"#eab308",accent2:"#fbbf24",accent3:"#ca8a04",glow:"rgba(234,179,8,0.22)"   },
};
const CB_SVG = `<svg style="position:absolute;width:0;height:0" xmlns="http://www.w3.org/2000/svg"><defs><filter id="deuteranopia"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/></filter><filter id="protanopia"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/></filter><filter id="tritanopia"><feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/></filter></defs></svg>`;

function buildSettingsCSS(s) {
  const theme = COLOR_THEMES[s.colorTheme] || COLOR_THEMES.purple;
  const bgBase = s.darkMode
    ? (s.contrastMode==="ultra"?"#000":s.contrastMode==="high"?"#050507":"#0a0b0f")
    : (s.contrastMode==="ultra"?"#fff":s.contrastMode==="high"?"#e8eaf4":"#f0f2f8");
  const textBase = s.darkMode
    ? (s.contrastMode==="ultra"?"#fff":s.contrastMode==="high"?"#f8f8ff":"#f0f1f5")
    : (s.contrastMode==="ultra"?"#000":s.contrastMode==="high"?"#080812":"#12142a");
  const rBase = parseInt(RADIUS_MAP[s.borderRadius]||"12");
  return `
    :root{
      --font-body:${FONT_MAP[s.fontStyle]||FONT_MAP.default};
      --radius:${RADIUS_MAP[s.borderRadius]};
      --radius-sm:${Math.max(2,rBase-4)}px;
      --radius-lg:${rBase+8}px;
      --transition:${s.reduceMotion?"0.001s":"0.2s"} cubic-bezier(0.4,0,0.2,1);
      --accent:${theme.accent};--accent2:${theme.accent2};--accent3:${theme.accent3};--accent-glow:${theme.glow};
      --bg:${bgBase};--text:${textBase};
    }
    .app-content{font-size:${FONT_SIZE_MAP[s.fontSize]||"15px"};line-height:${LINE_SPACING_MAP[s.lineSpacing]};letter-spacing:${LETTER_SPACING_MAP[s.letterSpacing]};font-family:${FONT_MAP[s.fontStyle]||FONT_MAP.default};font-weight:${FONT_WEIGHT_MAP[s.fontWeight]};}
    .app-content .btn{padding:${BTN_PAD_MAP[s.buttonSize]};font-size:${BTN_FONT_MAP[s.buttonSize]};font-family:${FONT_MAP[s.fontStyle]||FONT_MAP.default};}
    .app-content .btn-sm{padding:8px 14px;font-size:13px;}
    .app-content .btn-lg{padding:18px 40px;font-size:17px;}
    .app-content .card{padding:${DENSITY_MAP[s.density]};border-radius:var(--radius-lg);}
    .app-content .input-field{font-size:${FONT_SIZE_MAP[s.fontSize]||"15px"};font-family:${FONT_MAP[s.fontStyle]||FONT_MAP.default};}
    ${s.focusHighlight?".app-content *:focus{outline:3px solid var(--accent)!important;outline-offset:3px!important;}":""}
    ${s.reduceMotion?".app-content *,.app-content *::before,.app-content *::after{animation-duration:0.001s!important;transition-duration:0.001s!important;}":""}
    ${s.largeTargets?".app-content .btn,.app-content .game-option,.app-content .hygiene-item,.app-content .sort-chip,.app-content .coin{min-height:56px!important;min-width:56px!important;}":""}
    ${s.reduceClutter?".app-content .glow-orb{display:none!important;}":""}
    ${s.saturation==="muted"?".app-content{filter:saturate(60%)}":s.saturation==="vivid"?".app-content{filter:saturate(150%)}":""}
    ${s.contrastMode!=="normal"?".app-content .card{border-width:2px!important;}.app-content .btn-ghost{border-width:2px!important;}":""}
  `;
}

// ─────────────────────────────────────────────
// APP ICON / LOGO SVG — Concept C: Learning Spark
// Person + open book + amber lightbulb spark above head
// ─────────────────────────────────────────────
function AppIcon({ size = 28, style = {} }) {
  const s = size / 32;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      {/* Rounded square background */}
      <rect width="32" height="32" rx="8.5" fill="var(--accent)"/>
      {/* Subtle inner border */}
      <rect width="32" height="32" rx="8.5" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>

      {/* Person — head */}
      <circle cx="16" cy="11" r="4.2" fill="white" opacity="0.96"/>

      {/* Open book — lower half of icon */}
      {/* Left page */}
      <path d="M5 28 Q5 20 16 18 L16 28 Z" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.55)" strokeWidth="0.9" strokeLinejoin="round"/>
      {/* Right page */}
      <path d="M27 28 Q27 20 16 18 L16 28 Z" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.55)" strokeWidth="0.9" strokeLinejoin="round"/>
      {/* Book spine */}
      <line x1="16" y1="18" x2="16" y2="28" stroke="rgba(255,255,255,0.55)" strokeWidth="1"/>
      {/* Left page text lines */}
      <line x1="8"  y1="22" x2="14" y2="21.2" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="7.5" y1="24.5" x2="14" y2="23.7" stroke="rgba(255,255,255,0.3)"  strokeWidth="0.8" strokeLinecap="round"/>
      {/* Right page text lines */}
      <line x1="18" y1="21.2" x2="24" y2="22"   stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="18" y1="23.7" x2="24.5" y2="24.5" stroke="rgba(255,255,255,0.3)"  strokeWidth="0.8" strokeLinecap="round"/>

      {/* Lightbulb spark above head */}
      {/* Glow halo */}
      <circle cx="16" cy="4.8" r="3.6" fill="rgba(251,191,36,0.28)"/>
      {/* Bulb */}
      <circle cx="16" cy="4.8" r="2.4" fill="#fbbf24"/>
      {/* Rays */}
      <line x1="16"   y1="1.2" x2="16"   y2="0"   stroke="#fbbf24" strokeWidth="1"   strokeLinecap="round"/>
      <line x1="19.2" y1="2.1" x2="20.2" y2="1.1" stroke="#fbbf24" strokeWidth="1"   strokeLinecap="round"/>
      <line x1="12.8" y1="2.1" x2="11.8" y2="1.1" stroke="#fbbf24" strokeWidth="1"   strokeLinecap="round"/>
      <line x1="20.6" y1="4.8" x2="22"   y2="4.8" stroke="#fbbf24" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="11.4" y1="4.8" x2="10"   y2="4.8" stroke="#fbbf24" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  );
}

// ─────────────────────────────────────────────
// HYGIENE SKILL ICON — replaces 🪥 emoji for the skill card/nav
// Shows hands being washed with water drops
// ─────────────────────────────────────────────
function HygieneSkillIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left hand */}
      <path d="M4 22 Q4 16 8 14 L10 13 Q11 12 12 13 L12 20" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Right hand / palm */}
      <path d="M12 20 Q12 12 14 11 Q15 10 16 11 L16 18" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M16 18 Q16 10 18 9 Q19 8 20 9 L20 17" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M20 17 Q20 11 22 10 Q23 9 24 10 L24 18" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Palm base */}
      <path d="M4 22 Q4 27 10 28 L22 28 Q28 28 28 22 L24 18 L20 17 L16 18 L12 20 L4 22Z" fill="#e0e7ff" stroke="#6c63ff" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Water drops */}
      <ellipse cx="10" cy="6" rx="1.5" ry="2.2" fill="#60a5fa" opacity="0.9"/>
      <ellipse cx="16" cy="4" rx="1.5" ry="2.2" fill="#60a5fa" opacity="0.9"/>
      <ellipse cx="22" cy="6" rx="1.5" ry="2.2" fill="#60a5fa" opacity="0.9"/>
      {/* Shine on drops */}
      <ellipse cx="9.4" cy="5.2" rx="0.5" ry="0.7" fill="white" opacity="0.7"/>
      <ellipse cx="15.4" cy="3.2" rx="0.5" ry="0.7" fill="white" opacity="0.7"/>
      <ellipse cx="21.4" cy="5.2" rx="0.5" ry="0.7" fill="white" opacity="0.7"/>
    </svg>
  );
}
function ToothbrushIcon({ size = 32 }) {
  // Rotated toothbrush: handle bottom-right, bristle head top-left
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <rect x="16" y="14" width="5" height="15" rx="2.5" fill="#c7d2fe" stroke="#6c63ff" strokeWidth="1.2"/>
      {/* Neck */}
      <rect x="16.5" y="9.5" width="4" height="5.5" rx="1" fill="#a5b4fc" stroke="#6c63ff" strokeWidth="1"/>
      {/* Brush head */}
      <rect x="9" y="1" width="12" height="9.5" rx="3" fill="#6c63ff"/>
      {/* Bristles — 4 tufts pointing up */}
      <rect x="11" y="1.5" width="2" height="5" rx="1" fill="white" opacity="0.9"/>
      <rect x="14" y="1.5" width="2" height="5" rx="1" fill="white" opacity="0.9"/>
      <rect x="17" y="1.5" width="2" height="5" rx="1" fill="white" opacity="0.9"/>
      {/* Stripe on handle */}
      <rect x="17.5" y="17" width="2" height="7" rx="1" fill="#818cf8" opacity="0.45"/>
    </svg>
  );
}

function SoapIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="12" width="24" height="16" rx="4" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
      <text x="16" y="22" textAnchor="middle" fontSize="7" fill="#92400e" fontFamily="sans-serif" fontWeight="bold">SOAP</text>
      <ellipse cx="16" cy="8" rx="5" ry="3" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.2"/>
      <path d="M16 5 Q18 2 20 4" stroke="#f59e0b" strokeWidth="1" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function ShowerIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4 Q6 18 18 18" stroke="#6c63ff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="18" cy="18" r="4" fill="#8b85ff" stroke="#6c63ff" strokeWidth="1.5"/>
      <circle cx="16" cy="24" r="1.5" fill="#60a5fa" opacity="0.8"/>
      <circle cx="20" cy="25" r="1.5" fill="#60a5fa" opacity="0.8"/>
      <circle cx="14" cy="27" r="1.5" fill="#60a5fa" opacity="0.6"/>
      <circle cx="18" cy="28" r="1.5" fill="#60a5fa" opacity="0.6"/>
      <circle cx="22" cy="27" r="1.5" fill="#60a5fa" opacity="0.6"/>
    </svg>
  );
}

function WaterDropIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3 C16 3 6 16 6 21 C6 26.5 10.5 29 16 29 C21.5 29 26 26.5 26 21 C26 16 16 3 16 3Z" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1.5"/>
      <path d="M11 22 Q13 18 16 20" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

function TowelIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="18" rx="3" fill="#fecdd3" stroke="#f43f5e" strokeWidth="1.5"/>
      <rect x="4" y="6" width="24" height="4" rx="2" fill="#f43f5e" opacity="0.6"/>
      <path d="M8 16 h16 M8 20 h12" stroke="#f43f5e" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <rect x="13" y="24" width="6" height="4" rx="1" fill="#fecdd3" stroke="#f43f5e" strokeWidth="1"/>
    </svg>
  );
}

function ToothpasteIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="12" height="20" rx="3" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5"/>
      <rect x="8" y="4" width="12" height="6" rx="2" fill="#3b82f6" opacity="0.7"/>
      <rect x="17" y="7" width="5" height="4" rx="1" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1"/>
      <path d="M22 9 Q25 9 25 12" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="25" cy="13" r="2" fill="white" stroke="#3b82f6" strokeWidth="1"/>
      <path d="M10 14 h8 M10 18 h6" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

// Map emoji strings to realistic SVG icons where applicable
function RealisticIcon({ label, size = 32 }) {
  if (label === "Toothbrush" || label === "🪥 Toothbrush") return <ToothbrushIcon size={size}/>;
  if (label === "Toothpaste" || label === "🧴 Toothpaste") return <ToothpasteIcon size={size}/>;
  if (label === "Soap" || label === "🧼 Soap" || label === "Body wash") return <SoapIcon size={size}/>;
  if (label === "Shower" || label === "🚿 Shower") return <ShowerIcon size={size}/>;
  if (label === "Water" || label === "💧 Water") return <WaterDropIcon size={size}/>;
  if (label === "Towel" || label === "🧻 Towel") return <TowelIcon size={size}/>;
  // Fallback: extract emoji from label
  const emoji = label.match(/\p{Emoji}/u)?.[0] || label.slice(0,2);
  return <span style={{fontSize: size * 0.8, lineHeight: 1}}>{emoji}</span>;
}

// ─────────────────────────────────────────────
// TOOLTIP — pure CSS, anchored directly to element, zero drift
// placement="above" (default) or placement="below" (for nav/top elements)
// ─────────────────────────────────────────────
function Tip({ label, children, placement = "above" }) {
  if (!label) return <>{children}</>;
  const above = placement === "above";
  return (
    <span style={{display:"inline-flex",alignItems:"center",position:"relative"}} className="tip-wrap">
      {children}
      <span style={{
        position:"absolute",
        // Horizontal: centre over the element
        left:"50%",
        transform: above ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(0)",
        // Vertical: above or below
        ...(above
          ? { bottom:"calc(100% + 8px)", top:"auto" }
          : { top:"calc(100% + 8px)",   bottom:"auto" }),
        // Box
        minWidth:160, maxWidth:240,
        background:"#1a1c2e",
        border:"1.5px solid rgba(139,133,255,0.35)",
        color:"#e8eaf2",
        fontSize:12, lineHeight:1.6,
        padding:"8px 12px",
        borderRadius:10,
        boxShadow: above
          ? "0 -2px 16px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.4)"
          : "0 4px 20px rgba(0,0,0,0.55)",
        zIndex:9999,
        pointerEvents:"none",
        whiteSpace:"normal",
        textAlign:"center",
        // Hidden by default, shown on hover via CSS
        opacity:0,
        visibility:"hidden",
        transition:"opacity 0.08s ease, visibility 0.08s ease",
      }} className="tip-box">
        {label}
        {/* Arrow */}
        <span style={{
          position:"absolute",
          left:"50%",
          transform:"translateX(-50%)",
          ...(above
            ? { top:"100%",    borderTopColor:"rgba(139,133,255,0.35)", borderBottomColor:"transparent" }
            : { bottom:"100%", borderBottomColor:"rgba(139,133,255,0.35)", borderTopColor:"transparent" }),
          width:0, height:0,
          border:"5px solid transparent",
          display:"block",
        }}/>
      </span>
      <style>{`.tip-wrap:hover .tip-box { opacity:1 !important; visibility:visible !important; }`}</style>
    </span>
  );
}

// Settings hint — same pure-CSS approach, always above the ? icon
function SettingHint({ text }) {
  return (
    <span style={{display:"inline-flex",alignItems:"center",position:"relative",cursor:"help"}} className="tip-wrap">
      <span style={{
        width:18, height:18, borderRadius:"50%",
        background:"var(--surface2)", border:"1px solid var(--border2)",
        color:"var(--text3)", fontSize:11, fontWeight:700,
        display:"inline-flex", alignItems:"center", justifyContent:"center",
        flexShrink:0, userSelect:"none",
      }}>?</span>
      <span style={{
        position:"absolute",
        left:"50%",
        bottom:"calc(100% + 8px)",
        top:"auto",
        transform:"translateX(-50%)",
        minWidth:200, maxWidth:300,
        background:"#1a1c2e",
        border:"1.5px solid rgba(139,133,255,0.35)",
        color:"#e8eaf2",
        fontSize:12, lineHeight:1.6,
        padding:"10px 14px",
        borderRadius:12,
        boxShadow:"0 -2px 16px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.4)",
        zIndex:9999,
        pointerEvents:"none",
        whiteSpace:"normal",
        textAlign:"left",
        opacity:0,
        visibility:"hidden",
        transition:"opacity 0.08s ease, visibility 0.08s ease",
      }} className="tip-box">
        {text}
        <span style={{
          position:"absolute", top:"100%", left:"50%",
          transform:"translateX(-50%)",
          width:0, height:0,
          border:"5px solid transparent",
          borderTopColor:"rgba(139,133,255,0.35)",
          display:"block",
        }}/>
      </span>
    </span>
  );
}
// ─────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────
function Avatar({ name = "?", size = 36, onClick, color = "var(--accent)" }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div className="avatar" onClick={onClick} style={{ width:size, height:size, background:color, color:"#fff", fontSize:size*0.38 }}>
      {initials}
    </div>
  );
}

// ─────────────────────────────────────────────
// MINI LINE CHART
// ─────────────────────────────────────────────
function LineChart({ data, labels, color="var(--accent)" }) {
  const W=400, H=110, pad=10;
  const mn=Math.min(...data), mx=Math.max(...data), rng=mx-mn||1;
  const pts = data.map((v,i) => ({ x:pad+(i/(data.length-1))*(W-pad*2), y:H-pad-((v-mn)/rng)*(H-pad*2) }));
  const pD = "M "+pts.map(p=>`${p.x},${p.y}`).join(" L ");
  const aD = `M ${pts[0].x},${pts[0].y} ${pts.map(p=>`L ${p.x},${p.y}`).join(" ")} L ${W-pad},${H} L ${pad},${H} Z`;
  const uid = color.replace(/[^a-z0-9]/gi,"_");
  return (
    <div style={{width:"100%",overflow:"hidden"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto"}}>
        <defs><linearGradient id={`g${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.22"/><stop offset="100%" stopColor={color} stopOpacity="0.01"/></linearGradient></defs>
        <path d={aD} fill={`url(#g${uid})`}/>
        <path d={pD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="line-chart-path"/>
        {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color}/>)}
      </svg>
      {labels && <div style={{display:"flex",justifyContent:"space-between",padding:"2px 10px 0"}}>{labels.map((l,i)=><span key={i} style={{fontSize:10,color:"var(--text3)"}}>{l}</span>)}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// SIMULATION TASKS — PER TIER
// ─────────────────────────────────────────────
const SIM_TASKS = {
  time: {
    1: [
      { hour:3,  min:0,  q:"What time does this clock show?",              opts:["3:00","4:00","2:00"],           c:0 },
      { hour:8,  min:0,  q:"School starts at this time. What time is it?", opts:["7:00","8:00","9:00"],           c:1 },
      { hour:12, min:0,  q:"What time does this clock show?",              opts:["12:00","11:00","1:00"],         c:0 },
      { hour:6,  min:0,  q:"What time is shown on the clock?",             opts:["6:00","7:00","5:00"],           c:0 },
    ],
    2: [
      { hour:6,  min:30, q:"What time does this clock show?",              opts:["6:30","5:30","7:00"],           c:0 },
      { hour:10, min:15, q:"What time is quarter past ten?",               opts:["10:15","10:45","9:15"],         c:0 },
      { hour:3,  min:45, q:"What time does this clock show?",              opts:["3:45","4:15","2:45"],           c:0 },
      { hour:9,  min:30, q:"You have a class at this time. When is it?",   opts:["9:30","8:30","10:30"],          c:0 },
    ],
    3: [
      { hour:7,  min:48, q:"What time does this clock show?",              opts:["7:48","8:12","7:52"],           c:0 },
      { hour:11, min:53, q:"How many minutes until noon?",                 opts:["7 min","53 min","17 min"],      c:0 },
      { hour:2,  min:37, q:"If it's this time now and class lasts 45 mins, when does it end?", opts:["3:22","3:07","3:37"], c:0 },
      { hour:4,  min:22, q:"What time will it be in 20 minutes?",          opts:["4:42","4:22","5:02"],           c:0 },
    ],
  },
  finance: {
    1: [
      { type:"select", instruction:"Tap coins to make exactly 25¢", target:25, hint:"One 25¢ coin is all you need!" },
      { type:"choice", instruction:"You have $1. A candy costs 50¢. Do you have enough?", opts:["Yes, I have enough!","No, I don't have enough","I need more money"], c:0 },
      { type:"select", instruction:"Tap coins to make exactly 10¢", target:10, hint:"One dime (10¢) works!" },
      { type:"choice", instruction:"Which coin is worth 25 cents?", opts:["Quarter 🟡","Dime ⚪","Nickel ⚪"], c:0 },
    ],
    2: [
      { type:"select", instruction:"Tap coins to make exactly 50¢ — you can use the same coin twice!", target:50, hint:"Try two 25¢ coins!" },
      { type:"select", instruction:"Make exactly 30¢ using coins", target:30, hint:"Try a 25¢ and a 5¢" },
      { type:"change", instruction:"You pay $1 for a 65¢ item. How much change do you get?", opts:["35¢","25¢","45¢","15¢"], c:0 },
      { type:"compare", instruction:"Which items can you afford with 75¢?", budget:75, items:[{n:"Candy 🍬",p:40},{n:"Juice 🧃",p:90},{n:"Chips 🍟",p:65},{n:"Cookie 🍪",p:120}], c:[0,2] },
    ],
    3: [
      { type:"select", instruction:"Make exactly 87¢ using as few coins as possible", target:87, hint:"Try: 25+25+25+10+1+1 = 87¢" },
      { type:"total",  instruction:"You buy 3 items: Apple 45¢, Juice 80¢, Snack 35¢. What is the total?", opts:["$1.60","$1.45","$2.00","$1.80"], c:0 },
      { type:"change", instruction:"You pay $5 for items costing $3.47. What is your change?", opts:["$1.53","$1.63","$2.53","$1.43"], c:0 },
      { type:"compare", instruction:"You have $2. Buy as many items as possible — select all you can afford!", budget:200, items:[{n:"Apple 🍎",p:45},{n:"Water 💧",p:80},{n:"Chips 🍟",p:65},{n:"Chocolate 🍫",p:120},{n:"Juice 🧃",p:90},{n:"Cracker 🍘",p:35}], c:[0,1,2,5] },
    ],
  },
};

// ─────────────────────────────────────────────
// SIM: TIME MANAGEMENT
// ─────────────────────────────────────────────
function SimTime({ tier, onTaskComplete, onSessionEnd, taskCount, settings, onGoBack }) {
  const tasks = SIM_TASKS.time[tier] || SIM_TASKS.time[1];
  const TOTAL = taskCount || 4;
  const [idx, setIdx]       = useState(0);
  const [picked, setPicked] = useState(null);
  const scoreRef = useRef(0);

  const task = tasks[idx % tasks.length];
  const hourDeg = ((task.hour%12)/12)*360 + (task.min/60)*30;
  const minDeg  = (task.min/60)*360;

  const clockHint = `The short thick hand (hour hand) points to the hour. The long thin hand (minute hand) shows the minutes. ${task.min === 0 ? "When the long hand points straight up, it is exactly on the hour." : `The long hand is at the ${task.min} minute mark.`}`;

  useEffect(() => {
    if (settings?.autoReadQuestions && settings?.audioEnabled) speak(task.q);
  }, [idx]);

  const choose = (i) => {
    if (picked !== null) return;
    const ok = i === task.c;
    setPicked(i);
    if (ok) scoreRef.current += 1;
    if (settings?.audioEnabled) speak(ok ? "Correct! Well done!" : "Not quite. Let's try the next one.");
    onTaskComplete?.(ok);
    setTimeout(() => {
      setPicked(null);
      const next = idx + 1;
      if (next >= TOTAL) onSessionEnd(scoreRef.current, TOTAL);
      else setIdx(next);
    }, 1200);
  };

  const goBack = () => {
    if (idx === 0) { onGoBack?.(); return; }
    if (scoreRef.current > 0) scoreRef.current -= 1;
    setPicked(null);
    setIdx(idx - 1);
    onGoBack?.();
  };

  return (
    <div style={{textAlign:"center"}}>
      {idx > 0 && picked === null && (
        <button className="btn btn-ghost btn-sm" style={{marginBottom:12,fontSize:12}} onClick={goBack}>
          ← Back to task {idx}
        </button>
      )}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:16}}>
        <p style={{fontSize:17,fontWeight:500,color:"var(--text)"}}>{task.q}</p>
        {settings?.audioEnabled && <button className="voice-btn" onClick={() => speak(task.q)} title="Read question aloud">🔊</button>}
      </div>
      <Tip label={clockHint}>
        <div className="clock-face" style={{cursor:"help"}}>
          {[...Array(12)].map((_,i) => (
            <div key={i} style={{position:"absolute",top:"50%",left:"50%",width:2,height:i%3===0?10:6,background:"var(--text3)",borderRadius:1,transformOrigin:"0 0",transform:`rotate(${i*30}deg) translate(-1px,-78px)`}}/>
          ))}
          {[[0,"12"],[90,"3"],[180,"6"],[270,"9"]].map(([deg, num]) => {
            const rad = (deg - 90) * Math.PI / 180;
            return <div key={num} style={{position:"absolute",top:`calc(50% + ${Math.sin(rad)*58}px - 7px)`,left:`calc(50% + ${Math.cos(rad)*58}px - 7px)`,fontSize:9,color:"var(--text2)",width:14,textAlign:"center",fontWeight:700}}>{num}</div>;
          })}
          <div className="clock-hand" style={{width:5,height:44,background:"var(--text)",transform:`translateX(-50%) rotate(${hourDeg}deg)`,marginLeft:"-2.5px"}}/>
          <div className="clock-hand" style={{width:3,height:62,background:"var(--accent2)",transform:`translateX(-50%) rotate(${minDeg}deg)`,marginLeft:"-1.5px"}}/>
          <div style={{position:"absolute",top:"50%",left:"50%",width:10,height:10,background:"var(--accent)",borderRadius:"50%",transform:"translate(-50%,-50%)"}}/>
        </div>
      </Tip>
      <p style={{fontSize:11,color:"var(--text3)",marginBottom:14}}>🕐 Short hand = hours · Long hand = minutes · Hover clock for help</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {task.opts.map((opt, i) => {
          // Parse the option to build a meaningful description
          const parts = opt.split(":");
          const h = parts[0] ? parseInt(parts[0]) : null;
          const m = parts[1] ? parseInt(parts[1]) : 0;
          const ampm = h !== null ? (h < 12 || h === 24 ? "in the morning" : "in the afternoon") : "";
          const desc = h !== null
            ? `If you choose ${opt}, you are saying the short hand points to ${h > 12 ? h-12 : h || 12} and the long hand points to ${m === 0 ? "12 (top)" : `the ${m} minute mark`}`
            : `Choose ${opt} if that matches what you see on the clock`;
          return (
            <Tip key={i} label={desc} placement="above">
              <button disabled={picked !== null}
                className={`game-option ${picked!==null&&i===task.c?"correct":picked===i&&i!==task.c?"wrong":""}`}
                onClick={() => choose(i)} style={{width:"100%"}}>
                <span style={{fontSize:20}}>🕐</span> {opt}
              </button>
            </Tip>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIM: OBJECT SORTING — FIXED (no blank screen)
// ─────────────────────────────────────────────
const SORT_ROUNDS = {
  1: [
    { inst:"Sort these items — food vs tools", items:["🍎 Apple","🔨 Hammer","🥕 Carrot","🪛 Screwdriver","🍌 Banana","🪚 Saw"], zones:[{label:"🍽️ Food",accept:["🍎 Apple","🥕 Carrot","🍌 Banana"]},{label:"🔧 Tools",accept:["🔨 Hammer","🪛 Screwdriver","🪚 Saw"]}] },
    { inst:"Sort into recycling or compost", items:["📰 Newspaper","🍌 Banana peel","🥤 Plastic bottle","☕ Coffee grounds","📦 Cardboard","🍎 Apple core"], zones:[{label:"♻️ Recycling",accept:["📰 Newspaper","🥤 Plastic bottle","📦 Cardboard"]},{label:"🌱 Compost",accept:["🍌 Banana peel","☕ Coffee grounds","🍎 Apple core"]}] },
    { inst:"Sort clothes or kitchen items", items:["👕 T-shirt","🍳 Frying pan","🧦 Socks","🥄 Spoon","🧥 Jacket","🍴 Fork"], zones:[{label:"👗 Clothes",accept:["👕 T-shirt","🧦 Socks","🧥 Jacket"]},{label:"🍴 Kitchen",accept:["🍳 Frying pan","🥄 Spoon","🍴 Fork"]}] },
    { inst:"Sort animals or vehicles", items:["🐶 Dog","🚗 Car","🐱 Cat","✈️ Plane","🐸 Frog","🚢 Ship"], zones:[{label:"🐾 Animals",accept:["🐶 Dog","🐱 Cat","🐸 Frog"]},{label:"🚀 Vehicles",accept:["🚗 Car","✈️ Plane","🚢 Ship"]}] },
  ],
  2: [
    { inst:"Sort by size — small or large", items:["🐜 Ant","🐘 Elephant","🐝 Bee","🦒 Giraffe","🪲 Bug","🐋 Whale"], zones:[{label:"🔬 Small",accept:["🐜 Ant","🐝 Bee","🪲 Bug"]},{label:"🏔️ Large",accept:["🐘 Elephant","🦒 Giraffe","🐋 Whale"]}] },
    { inst:"Sort clothes by weather", items:["🧥 Coat","👙 Swimsuit","🧤 Gloves","🩳 Shorts","🧣 Scarf","🕶️ Sunglasses"], zones:[{label:"❄️ Cold Weather",accept:["🧥 Coat","🧤 Gloves","🧣 Scarf"]},{label:"☀️ Warm Weather",accept:["👙 Swimsuit","🩳 Shorts","🕶️ Sunglasses"]}] },
    { inst:"Sort by living vs non-living", items:["🐕 Dog","🪑 Chair","🌸 Flower","🖥️ Computer","🐟 Fish","📚 Book"], zones:[{label:"🌱 Living",accept:["🐕 Dog","🌸 Flower","🐟 Fish"]},{label:"🔩 Non-Living",accept:["🪑 Chair","🖥️ Computer","📚 Book"]}] },
    { inst:"Sort healthy vs unhealthy food", items:["🥦 Broccoli","🍔 Burger","🥕 Carrot","🍟 Fries","🍎 Apple","🍩 Doughnut"], zones:[{label:"✅ Healthy",accept:["🥦 Broccoli","🥕 Carrot","🍎 Apple"]},{label:"⚠️ Unhealthy",accept:["🍔 Burger","🍟 Fries","🍩 Doughnut"]}] },
  ],
  3: [
    { inst:"Sort into correct meal times", items:["🥞 Pancakes","🥗 Salad","🍕 Pizza","🥣 Cereal","🍝 Pasta","🧇 Waffles"], zones:[{label:"🌅 Breakfast",accept:["🥞 Pancakes","🥣 Cereal","🧇 Waffles"]},{label:"🌙 Dinner",accept:["🥗 Salad","🍕 Pizza","🍝 Pasta"]}] },
    { inst:"Sort emergency vs non-emergency", items:["🔥 Fire","📺 Broken TV","🚨 Someone hurt","🎮 Dead battery","💊 Wrong medicine","🐈 Loud cat"], zones:[{label:"🚨 Emergency",accept:["🔥 Fire","🚨 Someone hurt","💊 Wrong medicine"]},{label:"⏳ Not Urgent",accept:["📺 Broken TV","🎮 Dead battery","🐈 Loud cat"]}] },
    { inst:"Sort school supplies or sports gear", items:["📏 Ruler","⚽ Football","📐 Compass","🏀 Basketball","✏️ Pencil","🏸 Racket"], zones:[{label:"✏️ School",accept:["📏 Ruler","📐 Compass","✏️ Pencil"]},{label:"⚽ Sports",accept:["⚽ Football","🏀 Basketball","🏸 Racket"]}] },
    { inst:"Sort day time or night time activities", items:["☀️ Jogging","🌙 Sleeping","🏫 School","💤 Dreaming","🍳 Breakfast","🛁 Bedtime bath"], zones:[{label:"☀️ Daytime",accept:["☀️ Jogging","🏫 School","🍳 Breakfast"]},{label:"🌙 Nighttime",accept:["🌙 Sleeping","💤 Dreaming","🛁 Bedtime bath"]}] },
  ],
};

function SimSorting({ tier, onTaskComplete, onSessionEnd, taskCount, settings, onGoBack }) {
  const rounds = SORT_ROUNDS[tier] || SORT_ROUNDS[1];
  const TOTAL = taskCount || 4;
  const [rIdx, setRIdx]       = useState(0);
  const [zones, setZones]     = useState([[],[]]);
  const [remaining, setRem]   = useState(() => [...rounds[0].items]);
  const [checked, setChecked] = useState(false);
  const [result, setResult]   = useState(null);
  const scoreRef              = useRef(0);
  const [done, setDone]       = useState(false);

  const round = rounds[rIdx % rounds.length];

  const resetRound = (ri) => {
    const r = rounds[ri % rounds.length];
    setZones([[],[]]); setRem([...r.items]); setChecked(false); setResult(null);
  };

  const drop = (item, zi) => {
    setRem(r => r.filter(x => x !== item));
    setZones(z => { const n = [...z]; n[zi] = [...n[zi], item]; return n; });
  };

  const back = (item, zi) => {
    setZones(z => { const n = [...z]; n[zi] = n[zi].filter(x => x !== item); return n; });
    setRem(r => [...r, item]);
  };

  const goBack = () => {
    if (rIdx === 0) { onGoBack?.(); return; }
    if (scoreRef.current > 0) scoreRef.current -= 1;
    onGoBack?.();
    setRIdx(rIdx - 1);
    resetRound(rIdx - 1);
  };

  const check = () => {
    if (remaining.length > 0 || checked) return;
    let ok = true;
    round.zones.forEach((z, zi) => {
      if ([...zones[zi]].sort().join() !== [...z.accept].sort().join()) ok = false;
    });
    setChecked(true);
    setResult(ok ? "correct" : "wrong");
    if (ok) scoreRef.current += 1;
    if (settings?.audioEnabled) speak(ok ? "Excellent sorting! That's correct!" : "Not quite right, but good try!");
    onTaskComplete?.(ok);
    setTimeout(() => {
      const next = rIdx + 1;
      if (next >= TOTAL) { setDone(true); onSessionEnd(scoreRef.current, TOTAL); }
      else { setRIdx(next); resetRound(next); }
    }, 1600);
  };

  if (done) return null;

  return (
    <div>
      {rIdx > 0 && !result && (
        <button className="btn btn-ghost btn-sm" style={{marginBottom:12,fontSize:12}} onClick={goBack}>
          ← Back to task {rIdx}
        </button>
      )}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,justifyContent:"center"}}>
        <p style={{fontSize:16,fontWeight:500,textAlign:"center"}}>{round.inst}</p>
        {settings?.audioEnabled && <button className="voice-btn" onClick={() => speak(round.inst)}>🔊</button>}
      </div>

      {/* Remaining items */}
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16,minHeight:48,background:"var(--bg3)",borderRadius:"var(--radius)",padding:10,border:"1px solid var(--border2)"}}>
        {remaining.length === 0
          ? <span style={{color:"var(--text3)",fontSize:13}}>All placed — check your answer!</span>
          : remaining.map(item => (
            <div key={item} style={{display:"flex",gap:4}}>
              {round.zones.map((z, zi) => (
                <Tip key={zi} label={`Move "${item}" into the ${z.label} group`}>
                  <button className="sort-chip" onClick={() => !checked && drop(item, zi)} style={{fontSize:13}}>
                    {item} → {z.label.split(" ")[0]}
                  </button>
                </Tip>
              ))}
            </div>
          ))
        }
      </div>

      {/* Drop zones */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        {round.zones.map((z, zi) => {
          const allCorrect = checked && zones[zi].length === z.accept.length && zones[zi].every(i => z.accept.includes(i));
          return (
            <div key={zi}>
              <div style={{fontSize:13,fontWeight:600,color:"var(--text2)",marginBottom:6}}>{z.label}</div>
              <div className="sort-zone" style={{
                borderColor: checked ? (allCorrect ? "var(--green)" : "var(--red)") : undefined,
                background:  checked ? (allCorrect ? "var(--green-dim)" : "var(--red-dim)") : undefined,
              }}>
                {zones[zi].map(item => (
                  <Tip key={item} label={checked ? (z.accept.includes(item) ? `✓ Correct — ${item} belongs here` : `✗ Wrong — ${item} does not belong here`) : `Tap to move "${item}" back to the items list`}>
                    <div className="sort-chip" style={{background:"var(--accent3)",color:"#fff"}} onClick={() => !checked && back(item, zi)}>
                      {item}
                    </div>
                  </Tip>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {remaining.length === 0 && !checked && (
        <button className="btn btn-primary" style={{width:"100%"}} onClick={check}>✅ Check My Answer</button>
      )}
      {result && (
        <div style={{textAlign:"center",fontSize:48,marginTop:12}}>
          {result === "correct" ? "🎉" : "💡"}
          <div style={{fontSize:14,color:result==="correct"?"var(--green)":"var(--amber)",marginTop:6}}>
            {result === "correct" ? "Correct! Great work!" : "Good try! See the highlighted zones above."}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SIM: DAILY ROUTINE
// ─────────────────────────────────────────────
const ROUTINE_DATA = {
  1:[
    { title:"Morning Routine", desc:"Simple wake-up and breakfast sequence",
      steps:[{id:"a",icon:"⏰",l:"Wake up & stretch"},{id:"b",icon:"🚽",l:"Use the toilet"},{id:"c",icon:"🪥",l:"Brush teeth"},{id:"d",icon:"👕",l:"Get dressed"},{id:"e",icon:"🍳",l:"Eat breakfast"}],
      order:["a","b","c","d","e"] },
    { title:"Bedtime Routine", desc:"Wind down and sleep sequence",
      steps:[{id:"a",icon:"🍽️",l:"Clear dinner dishes"},{id:"b",icon:"👕",l:"Change to pyjamas"},{id:"c",icon:"🪥",l:"Brush teeth"},{id:"d",icon:"💡",l:"Turn off lights"},{id:"e",icon:"🛏️",l:"Go to sleep"}],
      order:["a","b","c","d","e"] },
    { title:"Getting Ready for School", desc:"School preparation sequence",
      steps:[{id:"a",icon:"⏰",l:"Wake up on time"},{id:"b",icon:"🚿",l:"Wash face"},{id:"c",icon:"🍞",l:"Eat breakfast"},{id:"d",icon:"🎒",l:"Pack school bag"},{id:"e",icon:"👟",l:"Put on shoes & go"}],
      order:["a","b","c","d","e"] },
    { title:"After Dinner Routine", desc:"Evening wind-down steps",
      steps:[{id:"a",icon:"🍽️",l:"Clear the table"},{id:"b",icon:"🧹",l:"Tidy the kitchen"},{id:"c",icon:"📺",l:"Relax for a bit"},{id:"d",icon:"🪥",l:"Brush teeth"},{id:"e",icon:"🛏️",l:"Get ready for bed"}],
      order:["a","b","c","d","e"] },
  ],
  2:[
    { title:"After School Routine", desc:"Arrival and homework sequence",
      steps:[{id:"a",icon:"🏠",l:"Arrive home"},{id:"b",icon:"👟",l:"Remove shoes & bag"},{id:"c",icon:"🧤",l:"Wash hands"},{id:"d",icon:"🥪",l:"Have a snack"},{id:"e",icon:"📚",l:"Do homework"},{id:"f",icon:"🎮",l:"Free time / play"}],
      order:["a","b","c","d","e","f"] },
    { title:"Preparing a Simple Meal", desc:"Kitchen and cooking sequence",
      steps:[{id:"a",icon:"🧼",l:"Wash hands first"},{id:"b",icon:"🥘",l:"Get ingredients out"},{id:"c",icon:"🔪",l:"Prepare & chop food"},{id:"d",icon:"🍳",l:"Cook the food"},{id:"e",icon:"🍽️",l:"Serve the meal"},{id:"f",icon:"🫙",l:"Store leftovers safely"}],
      order:["a","b","c","d","e","f"] },
    { title:"Weekend Morning Routine", desc:"A relaxed but structured morning",
      steps:[{id:"a",icon:"🛏️",l:"Wake up naturally"},{id:"b",icon:"🚿",l:"Shower & freshen up"},{id:"c",icon:"👕",l:"Get dressed (casual)"},{id:"d",icon:"🍳",l:"Make & eat breakfast"},{id:"e",icon:"🧹",l:"Tidy your room"},{id:"f",icon:"📞",l:"Check in with family"}],
      order:["a","b","c","d","e","f"] },
    { title:"Getting Ready for an Appointment", desc:"Preparing for a doctor or outing",
      steps:[{id:"a",icon:"⏰",l:"Check appointment time"},{id:"b",icon:"🚿",l:"Shower & dress neatly"},{id:"c",icon:"🍌",l:"Eat a light snack"},{id:"d",icon:"🪥",l:"Brush teeth"},{id:"e",icon:"👜",l:"Pack what you need"},{id:"f",icon:"🚗",l:"Leave on time"}],
      order:["a","b","c","d","e","f"] },
  ],
  3:[
    { title:"Emergency Evacuation", desc:"Safety response sequence",
      steps:[{id:"a",icon:"🚨",l:"Stay calm — don't panic"},{id:"b",icon:"📞",l:"Call for help (999/911)"},{id:"c",icon:"🚪",l:"Exit safely via stairs"},{id:"d",icon:"📍",l:"Go to designated safe point"},{id:"e",icon:"🧑‍🚒",l:"Wait for emergency help"},{id:"f",icon:"✅",l:"Report all clear to leader"}],
      order:["a","b","c","d","e","f"] },
    { title:"Evening Self-Care Routine", desc:"Complete self-care and wellness sequence",
      steps:[{id:"a",icon:"🚿",l:"Shower thoroughly"},{id:"b",icon:"🧴",l:"Moisturise skin"},{id:"c",icon:"💊",l:"Take any medication"},{id:"d",icon:"📖",l:"Wind down — read or journal"},{id:"e",icon:"📵",l:"No screens 30 mins before bed"},{id:"f",icon:"🛏️",l:"Sleep by set bedtime"}],
      order:["a","b","c","d","e","f"] },
    { title:"Job Application Process", desc:"Multi-step life skill sequence",
      steps:[{id:"a",icon:"🔍",l:"Research the job role"},{id:"b",icon:"📝",l:"Write your CV/resume"},{id:"c",icon:"📧",l:"Write a cover letter"},{id:"d",icon:"📤",l:"Submit the application"},{id:"e",icon:"📞",l:"Prepare for interview"},{id:"f",icon:"✅",l:"Follow up after interview"}],
      order:["a","b","c","d","e","f"] },
    { title:"Managing a Budget", desc:"Financial planning sequence",
      steps:[{id:"a",icon:"💰",l:"List all income sources"},{id:"b",icon:"📝",l:"List monthly expenses"},{id:"c",icon:"🔢",l:"Calculate what's left over"},{id:"d",icon:"🎯",l:"Set a savings goal"},{id:"e",icon:"🛍️",l:"Limit unnecessary spending"},{id:"f",icon:"📊",l:"Review budget at month end"}],
      order:["a","b","c","d","e","f"] },
  ],
};

function SimRoutine({ tier, onTaskComplete, onSessionEnd, taskCount, settings, onGoBack }) {
  const routines = ROUTINE_DATA[tier] || ROUTINE_DATA[1];
  const TOTAL = taskCount || 4;
  const [rIdx, setRIdx]       = useState(0);
  const [order, setOrder]     = useState(() => [...routines[0].steps].sort(() => Math.random() - 0.5));
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const scoreRef              = useRef(0);
  const [done, setDone]       = useState(false);
  const routine = routines[rIdx % routines.length];

  const moveUp   = (i) => { if(i===0) return; const o=[...order]; [o[i-1],o[i]]=[o[i],o[i-1]]; setOrder(o); };
  const moveDown = (i) => { if(i===order.length-1) return; const o=[...order]; [o[i],o[i+1]]=[o[i+1],o[i]]; setOrder(o); };

  const goBack = () => {
    if (rIdx === 0) { onGoBack?.(); return; }
    if (scoreRef.current > 0) scoreRef.current -= 1;
    onGoBack?.();
    const prev = rIdx - 1;
    setRIdx(prev);
    setOrder([...routines[prev % routines.length].steps].sort(() => Math.random() - 0.5));
    setChecked(false); setCorrect(false);
  };

  const check = () => {
    const ok = order.every((s, i) => s.id === routine.order[i]);
    setChecked(true); setCorrect(ok);
    if (ok) scoreRef.current += 1;
    if (settings?.audioEnabled) speak(ok ? "Perfect! That's the right order!" : "Not quite — the correct order is shown in green.");
    onTaskComplete?.(ok);
    setTimeout(() => {
      const next = rIdx + 1;
      if (next >= TOTAL) { setDone(true); onSessionEnd(scoreRef.current, TOTAL); }
      else {
        setRIdx(next);
        const nextR = routines[next % routines.length];
        setOrder([...nextR.steps].sort(() => Math.random() - 0.5));
        setChecked(false); setCorrect(false);
      }
    }, 1700);
  };

  if (done) return null;

  return (
    <div>
      {rIdx > 0 && !checked && (
        <button className="btn btn-ghost btn-sm" style={{marginBottom:12,fontSize:12}} onClick={goBack}>
          ← Back to task {rIdx}
        </button>
      )}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,justifyContent:"center"}}>
        <p style={{fontSize:16,fontWeight:500}}>{routine.title}</p>
        {settings?.audioEnabled && <button className="voice-btn" onClick={() => speak(`Arrange the steps for ${routine.title} in the correct order`)}>🔊</button>}
      </div>
      <p style={{fontSize:12,color:"var(--text3)",textAlign:"center",marginBottom:16}}>Use ↑ ↓ to put the steps in the right order</p>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {order.map((step, i) => (
          <div key={step.id} className="routine-step"
            style={{background:checked?(step.id===routine.order[i]?"var(--green-dim)":"var(--red-dim)"):"var(--bg3)",
              border:`1.5px solid ${checked?(step.id===routine.order[i]?"var(--green)":"var(--red)"):"var(--border2)"}`}}>
            <span style={{fontSize:22}}>{step.icon}</span>
            <span style={{flex:1,fontSize:14}}>{step.l}</span>
            <div style={{display:"flex",gap:4}}>
              <Tip label={i===0?"Already at the top — can't move up further":`Move "${step.l}" one step earlier in the sequence`}>
                <button className="btn btn-ghost btn-sm" style={{padding:"4px 8px"}} onClick={() => moveUp(i)} disabled={i===0||checked}>↑</button>
              </Tip>
              <Tip label={i===order.length-1?"Already at the bottom — can't move down further":`Move "${step.l}" one step later in the sequence`}>
                <button className="btn btn-ghost btn-sm" style={{padding:"4px 8px"}} onClick={() => moveDown(i)} disabled={i===order.length-1||checked}>↓</button>
              </Tip>
            </div>
          </div>
        ))}
      </div>
      {!checked && <button className="btn btn-primary" style={{width:"100%",marginTop:16}} onClick={check}>✅ Check Order</button>}
      {checked && <div style={{textAlign:"center",fontSize:40,marginTop:14}}>{correct ? "🎉 Perfect!" : "💡 Keep practising!"}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// SIM: FINANCE — FIXED (no blank screen, correct task counting)
// ─────────────────────────────────────────────
function SimFinance({ tier, onTaskComplete, onSessionEnd, taskCount, settings, onGoBack }) {
  const COINS = [
    {label:"1¢",   value:1,   color:"#b87333"},
    {label:"5¢",   value:5,   color:"#a8a9ad"},
    {label:"10¢",  value:10,  color:"#8c8c8c"},
    {label:"25¢",  value:25,  color:"#b0b0b0"},
    {label:"$1",   value:100, color:"#d4a017"},
  ];

  const tasks = SIM_TASKS.finance[tier] || SIM_TASKS.finance[1];
  const TOTAL = taskCount || 4;
  const [idx, setIdx]             = useState(0);
  const [coinStack, setCoinStack] = useState([]);
  const [picked, setPicked]       = useState(null);
  const [multiPick, setMultiPick] = useState([]);
  const [feedback, setFeedback]   = useState(null);
  const [done, setDone]           = useState(false);
  // Use ref for score so closures always see the latest value
  const scoreRef = useRef(0);
  const task = tasks[idx % tasks.length];
  const total = coinStack.reduce((a, v) => a + v, 0);
  const feedbackRef = useRef(false); // prevent double-fire even across async

  useEffect(() => {
    if (settings?.autoReadQuestions && settings?.audioEnabled) speak(task.instruction);
  }, [idx]);

  const advance = (ok) => {
    if (feedbackRef.current) return;
    feedbackRef.current = true;
    if (ok) scoreRef.current += 1;
    setFeedback(ok ? "correct" : "wrong");
    if (settings?.audioEnabled) speak(ok ? "Great job! That's correct!" : "Good try! Let's continue.");
    onTaskComplete?.(ok);
    setTimeout(() => {
      feedbackRef.current = false;
      setFeedback(null);
      setCoinStack([]);
      setPicked(null);
      setMultiPick([]);
      const next = idx + 1;
      if (next >= TOTAL) { setDone(true); onSessionEnd(scoreRef.current, TOTAL); }
      else setIdx(next);
    }, 1400);
  };

  const goBack = () => {
    if (idx === 0) { onGoBack?.(); return; }
    if (scoreRef.current > 0) scoreRef.current -= 1;
    feedbackRef.current = false;
    setFeedback(null); setCoinStack([]); setPicked(null); setMultiPick([]);
    onGoBack?.();
    setIdx(idx - 1);
  };

  const addCoin = (val) => { if (feedback) return; setCoinStack(s => [...s, val]); };
  const removeLast = () => { setCoinStack(s => s.slice(0, -1)); };

  if (done) return null;

  return (
    <div>
      {idx > 0 && !feedback && (
        <button className="btn btn-ghost btn-sm" style={{marginBottom:12,fontSize:12}} onClick={goBack}>
          ← Back to task {idx}
        </button>
      )}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,justifyContent:"center"}}>
        <p style={{fontSize:16,fontWeight:500,textAlign:"center",lineHeight:1.5}}>{task.instruction}</p>
        {settings?.audioEnabled && <button className="voice-btn" onClick={() => speak(task.instruction)}>🔊</button>}
      </div>

      {/* COIN PICKER */}
      {task.type === "select" && (
        <>
          <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap",marginBottom:16}}>
            {COINS.map((c, i) => (
              <Tip key={i} label={`${c.label} coin — tap to add ${c.label} to your total`}>
                <div className="coin"
                  style={{background:c.color,color:"#fff",boxShadow:"inset 0 -3px 0 rgba(0,0,0,0.25),0 2px 8px rgba(0,0,0,0.3)"}}
                  onClick={() => addCoin(c.value)}>
                  {c.label}
                </div>
              </Tip>
            ))}
          </div>

          <div style={{background:"var(--bg3)",borderRadius:"var(--radius)",padding:"16px 20px",marginBottom:14,textAlign:"center",
            border:`2px solid ${total === task.target ? "var(--green)" : "var(--border2)"}`}}>
            <div style={{fontSize:11,color:"var(--text3)",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Your selection</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",minHeight:32,marginBottom:10}}>
              {coinStack.length === 0
                ? <span style={{color:"var(--text3)",fontSize:13}}>Tap coins above to add them</span>
                : coinStack.map((v, i) => (
                  <span key={i} style={{background:"var(--surface2)",borderRadius:100,padding:"3px 10px",fontSize:13,fontWeight:600,color:"var(--text)"}}>
                    {COINS.find(c => c.value === v)?.label}
                  </span>
                ))
              }
            </div>
            <div style={{fontSize:28,fontWeight:800,color:total===task.target?"var(--green)":"var(--text)",marginBottom:4}}>
              {total}¢ <span style={{fontSize:16,color:"var(--text3)"}}>/ {task.target}¢</span>
            </div>
            {total > task.target && <div style={{color:"var(--red)",fontSize:13}}>Too much! Remove some coins.</div>}
          </div>

          <div style={{display:"flex",gap:10,marginBottom:14}}>
            {coinStack.length > 0 && (
              <button className="btn btn-ghost btn-sm" style={{flex:1}} onClick={removeLast}>← Remove last</button>
            )}
            {coinStack.length > 0 && (
              <button className="btn btn-danger btn-sm" style={{flex:1}} onClick={() => setCoinStack([])}>Clear all</button>
            )}
          </div>

          <p style={{fontSize:12,color:"var(--text3)",textAlign:"center",marginBottom:14}}>💡 {task.hint}</p>

          {coinStack.length > 0 && !feedback && (
            <button className={`btn ${total===task.target?"btn-success":"btn-primary"} btn-lg`} style={{width:"100%"}}
              onClick={() => advance(total === task.target)}>
              {total === task.target ? "✅ Submit — That's the right amount!" : "Submit Answer"}
            </button>
          )}
        </>
      )}

      {/* MULTIPLE CHOICE */}
      {(task.type === "change" || task.type === "total") && (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {task.opts.map((opt, i) => (
            <button key={i} disabled={!!feedback}
              className={`game-option ${feedback&&i===task.c?"correct":feedback&&picked===i&&i!==task.c?"wrong":""}`}
              onClick={() => { setPicked(i); advance(i === task.c); }} style={{width:"100%"}}>
              <span style={{fontSize:22}}>💰</span>{opt}
            </button>
          ))}
        </div>
      )}

      {/* CHOICE (yes/no or identification) */}
      {task.type === "choice" && (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {task.opts.map((opt, i) => (
            <button key={i} disabled={!!feedback}
              className={`game-option ${feedback&&i===task.c?"correct":feedback&&picked===i&&i!==task.c?"wrong":""}`}
              onClick={() => { setPicked(i); advance(i === task.c); }} style={{width:"100%"}}>
              <span style={{fontSize:22}}>💰</span>{opt}
            </button>
          ))}
        </div>
      )}

      {/* AFFORDABLE ITEMS */}
      {task.type === "compare" && (
        <>
          <p style={{fontSize:13,color:"var(--text2)",textAlign:"center",marginBottom:14}}>
            Budget: <strong style={{color:"var(--green)"}}>{task.budget >= 100 ? `$${(task.budget/100).toFixed(2)}` : `${task.budget}¢`}</strong> — tap all items you can afford
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {task.items.map((item, i) => (
              <div key={i} className="hygiene-item"
                style={{padding:"14px 10px",background:multiPick.includes(i)?"rgba(108,99,255,0.12)":"var(--bg3)",
                  borderColor:multiPick.includes(i)?"var(--accent)":"var(--border2)"}}
                onClick={() => !feedback && setMultiPick(p => p.includes(i) ? p.filter(x=>x!==i) : [...p, i])}>
                <div style={{fontSize:26,marginBottom:4}}>{item.n.split(" ").slice(1).join(" ")||"🛒"}</div>
                <div style={{fontWeight:600,fontSize:14}}>{item.p >= 100 ? `$${(item.p/100).toFixed(2)}` : `${item.p}¢`}</div>
                <div style={{fontSize:11,color:item.p<=task.budget?"var(--green)":"var(--red)"}}>
                  {item.p <= task.budget ? "✓ Affordable" : "✗ Too much"}
                </div>
              </div>
            ))}
          </div>
          {!feedback && (
            <button className="btn btn-primary" style={{width:"100%"}} onClick={() => {
              const ok = task.c.every(i => multiPick.includes(i)) && multiPick.every(i => task.c.includes(i));
              advance(ok);
            }}>✅ Confirm My Selection</button>
          )}
        </>
      )}

      {feedback && <div style={{textAlign:"center",fontSize:52,marginTop:16}}>{feedback==="correct"?"🎉":"💡"}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// SIM: HYGIENE — with realistic icons
// ─────────────────────────────────────────────
const HYGIENE_DATA = {
  1:[
    { type:"pick", inst:"Which items do you need to brush your teeth?",
      items:[
        {icon:"Toothbrush",label:"Toothbrush",ok:true},
        {icon:"Toothpaste",label:"Toothpaste",ok:true},
        {icon:"🍌",label:"Banana",ok:false},
        {icon:"Water",label:"Water",ok:true},
        {icon:"Soap",label:"Soap",ok:false},
        {icon:"📚",label:"Book",ok:false}
      ]},
    { type:"choice", inst:"How often should you brush your teeth?", opts:["Twice a day","Once a week","Once a month","Never"], c:0 },
    { type:"choice", inst:"What do you use to wash your hands?", opts:["Soap and water","Sand","Just water","Paper"], c:0 },
    { type:"pick", inst:"Which items belong in a bathroom?",
      items:[
        {icon:"Toothbrush",label:"Toothbrush",ok:true},
        {icon:"Towel",label:"Towel",ok:true},
        {icon:"🍕",label:"Pizza",ok:false},
        {icon:"Soap",label:"Soap",ok:true},
        {icon:"🎮",label:"Game controller",ok:false},
        {icon:"Shower",label:"Shower",ok:true}
      ]},
  ],
  2:[
    { type:"sequence", inst:"Put hand-washing steps in order",
      steps:[{id:"a",icon:"Shower",l:"Turn on tap"},{id:"b",icon:"Soap",l:"Apply soap"},{id:"c",icon:"🤲",l:"Scrub 20 secs"},{id:"d",icon:"Water",l:"Rinse well"},{id:"e",icon:"Towel",l:"Dry hands"}],
      order:["a","b","c","d","e"] },
    { type:"pick", inst:"Select everything needed for a shower",
      items:[
        {icon:"Shower",label:"Shower",ok:true},
        {icon:"🧴",label:"Shampoo",ok:true},
        {icon:"Soap",label:"Body wash",ok:true},
        {icon:"Towel",label:"Towel",ok:true},
        {icon:"🍕",label:"Pizza",ok:false},
        {icon:"📺",label:"TV remote",ok:false}
      ]},
    { type:"choice", inst:"When is the best time to wash hands?", opts:["Before eating","After the toilet","Both of these!","Only when visibly dirty"], c:2 },
    { type:"choice", inst:"How long should you scrub when washing hands?", opts:["20 seconds","2 seconds","5 minutes","1 hour"], c:0 },
  ],
  3:[
    { type:"sequence", inst:"Arrange complete shower routine in order",
      steps:[{id:"a",icon:"🌡️",l:"Check water temp"},{id:"b",icon:"Shower",l:"Rinse body"},{id:"c",icon:"🧴",l:"Shampoo hair"},{id:"d",icon:"Soap",l:"Wash body"},{id:"e",icon:"Water",l:"Rinse fully"},{id:"f",icon:"Towel",l:"Dry off"}],
      order:["a","b","c","d","e","f"] },
    { type:"choice", inst:"Why is it important to dry between your toes?", opts:["To prevent fungal infections","It feels nice","To save water","No reason"], c:0 },
    { type:"choice", inst:"How often should you change your underwear?", opts:["Every day","Once a week","Once a month","Only when dirty"], c:0 },
    { type:"pick", inst:"Which are signs of good hygiene?",
      items:[
        {icon:"Toothbrush",label:"Brushed teeth",ok:true},
        {icon:"🧴",label:"Clean hair",ok:true},
        {icon:"😷",label:"Body odour",ok:false},
        {icon:"Towel",label:"Fresh clothes",ok:true},
        {icon:"🦷",label:"Dirty nails",ok:false},
        {icon:"Water",label:"Washed hands",ok:true}
      ]},
  ],
};

// Helper to render a hygiene icon — either SVG or emoji
function HygieneIcon({ icon, size = 28 }) {
  const svgIcons = ["Toothbrush","Toothpaste","Soap","Shower","Water","Towel","Body wash"];
  if (svgIcons.includes(icon)) {
    return <RealisticIcon label={icon} size={size}/>;
  }
  return <span style={{fontSize:size * 0.85}}>{icon}</span>;
}

function SimHygiene({ tier, onTaskComplete, onSessionEnd, taskCount, settings, onGoBack }) {
  const tasks = HYGIENE_DATA[tier] || HYGIENE_DATA[1];
  const TOTAL = taskCount || 4;
  const [idx, setIdx]         = useState(0);
  const [order, setOrder]     = useState(() => tasks[0].steps ? [...tasks[0].steps].sort(() => Math.random()-0.5) : []);
  const [picks, setPicks]     = useState([]);
  const [choice, setChoice]   = useState(null);
  const [checked, setChecked] = useState(false);
  const [result, setResult]   = useState(null);
  const scoreRef              = useRef(0);
  const [done, setDone]       = useState(false);
  const task = tasks[idx % tasks.length];

  useEffect(() => {
    if (task.steps) setOrder([...task.steps].sort(() => Math.random()-0.5));
    setPicks([]); setChoice(null); setChecked(false); setResult(null);
  }, [idx]);

  const next = (ok) => {
    if (result) return;
    setResult(ok ? "correct" : "wrong");
    if (ok) scoreRef.current += 1;
    if (settings?.audioEnabled) speak(ok ? "Well done! Correct!" : "Good effort! Keep going.");
    onTaskComplete?.(ok);
    setTimeout(() => {
      setResult(null); setChecked(false); setPicks([]); setChoice(null);
      const n = idx + 1;
      if (n >= TOTAL) { setDone(true); onSessionEnd(scoreRef.current, TOTAL); }
      else setIdx(n);
    }, 1500);
  };

  const goBack = () => {
    if (idx === 0) { onGoBack?.(); return; }
    if (scoreRef.current > 0) scoreRef.current -= 1;
    onGoBack?.();
    setIdx(idx - 1);
  };

  const moveUp   = (i) => { if(i===0) return; const o=[...order]; [o[i-1],o[i]]=[o[i],o[i-1]]; setOrder(o); };
  const moveDown = (i) => { if(i===order.length-1) return; const o=[...order]; [o[i],o[i+1]]=[o[i+1],o[i]]; setOrder(o); };

  if (done) return null;

  // Item descriptions for pick tasks
  const itemDesc = (item) => item.ok
    ? `✓ Yes — ${item.label} is needed for this hygiene task. Tap to select it.`
    : `✗ No — ${item.label} is not needed here. Don't tap this one.`;

  // Step descriptions for sequence tasks
  const stepDesc = (step, i, isChecked) => {
    if (!isChecked) return `Tap ↑ or ↓ to move "${step.l}" up or down in the sequence`;
    return step.id === task.order[i]
      ? `✓ Correct — "${step.l}" is in the right position`
      : `✗ Wrong position — check where "${step.l}" should go`;
  };

  return (
    <div>
      {/* Back button */}
      {idx > 0 && !result && (
        <button className="btn btn-ghost btn-sm" style={{marginBottom:12,fontSize:12}} onClick={goBack}>
          ← Back to task {idx}
        </button>
      )}

      <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center",marginBottom:16}}>
        <p style={{fontSize:16,fontWeight:500,textAlign:"center",lineHeight:1.5}}>{task.inst}</p>
        {settings?.audioEnabled && <button className="voice-btn" onClick={() => speak(task.inst)}>🔊</button>}
      </div>

      {/* SEQUENCE */}
      {task.type === "sequence" && (
        <>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {order.map((step, i) => (
              <Tip key={step.id} label={stepDesc(step, i, checked)} placement="above">
                <div className="routine-step" style={{width:"100%",
                  background:checked?(step.id===task.order[i]?"var(--green-dim)":"var(--red-dim)"):"var(--bg3)",
                  border:`1.5px solid ${checked?(step.id===task.order[i]?"var(--green)":"var(--red)"):"var(--border2)"}`}}>
                  <HygieneIcon icon={step.icon} size={28}/>
                  <span style={{flex:1,fontSize:14}}>{step.l}</span>
                  <div style={{display:"flex",gap:4}}>
                    <button className="btn btn-ghost btn-sm" style={{padding:"4px 8px"}} onClick={() => moveUp(i)} disabled={i===0||checked} title="Move this step earlier">↑</button>
                    <button className="btn btn-ghost btn-sm" style={{padding:"4px 8px"}} onClick={() => moveDown(i)} disabled={i===order.length-1||checked} title="Move this step later">↓</button>
                  </div>
                </div>
              </Tip>
            ))}
          </div>
          {!checked && (
            <button className="btn btn-primary" style={{width:"100%",marginTop:16}} onClick={() => {
              const ok = order.every((s, i) => s.id === task.order[i]);
              setChecked(true); next(ok);
            }}>✅ Check Order</button>
          )}
        </>
      )}

      {/* PICK */}
      {task.type === "pick" && (
        <>
          <p style={{fontSize:12,color:"var(--text3)",textAlign:"center",marginBottom:10}}>
            Tap all the items you need — hover each one for a hint
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
            {task.items.map((item, i) => (
              <Tip key={i} label={itemDesc(item)} placement="above">
                <div className="hygiene-item" style={{width:"100%",
                  borderColor:picks.includes(item.label)?"var(--accent)":"var(--border2)",
                  background:picks.includes(item.label)?"rgba(108,99,255,0.10)":"var(--bg3)"}}
                  onClick={() => !checked && setPicks(p => p.includes(item.label) ? p.filter(x=>x!==item.label) : [...p,item.label])}>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>
                    <HygieneIcon icon={item.icon} size={32}/>
                  </div>
                  <div style={{fontSize:11}}>{item.label}</div>
                  {picks.includes(item.label) && <div style={{fontSize:10,color:"var(--accent2)",marginTop:2}}>✓ Selected</div>}
                </div>
              </Tip>
            ))}
          </div>
          {picks.length > 0 && !checked && (
            <button className="btn btn-primary" style={{width:"100%"}} onClick={() => {
              const correct = task.items.filter(i => i.ok).map(i => i.label);
              const ok = correct.every(c => picks.includes(c)) && picks.every(s => correct.includes(s));
              setChecked(true); next(ok);
            }}>✅ Check Selection</button>
          )}
        </>
      )}

      {/* CHOICE */}
      {task.type === "choice" && (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {task.opts.map((opt, i) => (
            <Tip key={i} label={
              i === task.c
                ? `✓ This is correct — ${opt}`
                : `Think carefully — is this really the best hygiene practice?`
            } placement="above">
              <button disabled={!!result}
                className={`game-option ${result&&i===task.c?"correct":result&&choice===i&&i!==task.c?"wrong":""}`}
                onClick={() => { setChoice(i); next(i === task.c); }} style={{width:"100%"}}>
                <span style={{fontSize:22}}>🪥</span>{opt}
              </button>
            </Tip>
          ))}
        </div>
      )}

      {result && <div style={{textAlign:"center",fontSize:48,marginTop:14}}>{result==="correct"?"🎉":"💡"}</div>}
    </div>
  );
}

const SKILL_ID_MAP = {
  finance:   "money_transactions",
  time:      "time_planning",
  routine:   "time_planning",
  sorting:   "financial_planning",
  digital:   "digital_safety",
  mobile:    "mobile_money",
  advocacy:  "communication_advocacy",
  workplace: "workplace_readiness",
};


function BridgedSim({ skillKey, tier, onTaskComplete, onSessionEnd, taskCount, settings, onGoBack }) {
  const skillId = SKILL_ID_MAP[skillKey] || "money_transactions";
  return (
    <SimulationEngine
      skillId={skillId}
      learnerId="8312fa0c-9b5f-46d6-94df-40552fc6cc7c"
      tier={tier || 1}
      onSessionComplete={onSessionEnd}
      onGoBack={onGoBack}
      settings={settings}
    />
  );
}
const SIM_COMPONENTS = {
  time:    (props) => <BridgedSim skillKey="time"    {...props} />,
  sorting: (props) => <BridgedSim skillKey="sorting" {...props} />,
  routine: (props) => <BridgedSim skillKey="routine" {...props} />,
  finance: (props) => <BridgedSim skillKey="finance" {...props} />,
};
// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [page, setPage]       = useState("landing");
  const [user, setUser]       = useState(null);
  const [tierData, setTierData] = useState({time:1,sorting:1,routine:1,finance:1,digital:1,mobile:1,advocacy:1,workplace:1});
  const [activeSkill, setActiveSkill] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);
  const [settings, setSettings] = useState(() => {
    try { const s=localStorage.getItem("lb_settings"); return s ? JSON.parse(s) : SETTINGS_DEFAULT; } catch { return SETTINGS_DEFAULT; }
  });

  const updateSetting = (k, v) => setSettings(s => {
    const n = {...s, [k]:v};
    try { localStorage.setItem("lb_settings", JSON.stringify(n)); } catch {}
    return n;
  });

  const nav = (p) => { setPage(p); window.scrollTo(0, 0); stopSpeech(); };

  const ThemeToggle = () => (
    <button onClick={() => updateSetting("darkMode", !settings.darkMode)} className="btn btn-ghost btn-sm" style={{padding:"9px 12px",fontSize:16}} title={settings.darkMode?"Switch to Light Mode":"Switch to Dark Mode"}>
      {settings.darkMode ? "☀️" : "🌙"}
    </button>
  );

  const sharedProps = { nav, user, tierData, setTierData, settings, updateSetting, ThemeToggle };
  const cbFilter = settings.colourBlind==="greyscale" ? "grayscale(100%)" : settings.colourBlind!=="none" ? `url(#${settings.colourBlind})` : "none";

  return (
    <div className={settings.darkMode ? "" : "app-light"} style={{minHeight:"100vh",filter:cbFilter}}>
      <style>{BASE_STYLES}</style>
      <style>{buildSettingsCSS(settings)}</style>
      <div dangerouslySetInnerHTML={{__html:CB_SVG}}/>

      {page === "landing" && <Landing nav={nav} darkMode={settings.darkMode} ThemeToggle={ThemeToggle}/>}

      {page !== "landing" && (
        <div className="app-content">
          {page==="signup"      && <Signup      nav={nav} setUser={setUser}/>}
          {page==="login"       && <Login       nav={nav} setUser={setUser}/>}
          {page==="assessment"  && <Assessment  nav={nav} settings={settings} user={user} setTierData={setTierData}/>}
          {page==="home"        && <Home        {...sharedProps}/>}
          {page==="simulations" && <Simulations nav={nav} tierData={tierData} setActiveSkill={setActiveSkill} settings={settings}/>}
          {page==="game"        && <GameScreen  nav={nav} skill={activeSkill} tierData={tierData} setSessionResult={setSessionResult} settings={settings}/>}
          {page==="results"     && <Results     nav={nav} skill={activeSkill} result={sessionResult}/>}
          {page==="dashboard"   && <Dashboard   {...sharedProps}/>}
          {page==="settings"    && <SettingsPage nav={nav} settings={settings} updateSetting={updateSetting} user={user}/>}
          {page==="profile"     && <ProfilePage  nav={nav} user={user} setUser={setUser} tierData={tierData} settings={settings}/>}
          {page==="planner"     && <PlannerPage  nav={nav} user={user} settings={settings}/>}
          {page==="calm"        && <CalmPage     nav={nav} user={user} settings={settings}/>}

          {page !== "settings" && (
            <button className="fab" onClick={() => nav("settings")} title="Personalise LifeBuddy — fonts, colours, accessibility">⚙️</button>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────
function Landing({ nav, darkMode, ThemeToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const features = [
    {icon:"🧠",title:"Adaptive AI Engine",desc:"BKT-powered difficulty that adjusts in real time to each learner's pace and mastery level."},
    {icon:"🎮",title:"True Skill Simulations",desc:"5 fully interactive games — clocks, coins, sorting zones, routine ordering, and hygiene steps."},
    {icon:"📊",title:"Caregiver Dashboard",desc:"Deep analytics, tier history, BKT adaptation logs, and full manual override controls."},
    {icon:"♿",title:"Accessibility First",desc:"Large touch targets, audio instructions, visual hints, and non-punitive feedback throughout."},
    {icon:"🔄",title:"Real-Time Adaptation",desc:"Every task response feeds the engine — difficulty shifts mid-session, not just between sessions."},
    {icon:"⭐",title:"Motivating Rewards",desc:"Stars, celebrations, and mastery bars keep learners engaged without exposing failure metrics."},
  ];
  return (
    <div style={{minHeight:"100vh",background:darkMode?"#0a0b0f":"#f0f2f8",color:darkMode?"#f0f1f5":"#12142a",overflowX:"hidden",fontFamily:"'DM Sans',sans-serif"}}>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",height:64,background:darkMode?"rgba(10,11,15,0.95)":"rgba(240,242,248,0.97)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${darkMode?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.10)"}`}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,display:"flex",alignItems:"center",gap:8}}>
          <AppIcon size={28}/> Life<span style={{color:"#8b85ff"}}>Buddy</span>
        </div>
        <div className="hide-mobile" style={{display:"flex",gap:12,alignItems:"center"}}>
          <ThemeToggle/>
          <button style={{background:"transparent",color:darkMode?"#9da3b8":"#3a3f5c",border:`1.5px solid ${darkMode?"rgba(255,255,255,0.13)":"rgba(0,0,0,0.18)"}`,padding:"9px 18px",borderRadius:100,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500}} onClick={() => nav("login")}>Log In</button>
          <button style={{background:"#6c63ff",color:"#fff",border:"none",padding:"9px 18px",borderRadius:100,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500}} onClick={() => nav("signup")}>Get Started</button>
        </div>
        <button style={{display:"none",background:"transparent",border:`1.5px solid ${darkMode?"rgba(255,255,255,0.13)":"rgba(0,0,0,0.18)"}`,color:darkMode?"#9da3b8":"#3a3f5c",padding:"8px 12px",borderRadius:8,cursor:"pointer",fontSize:18}} className="nav-mobile-menu" onClick={() => setMenuOpen(o=>!o)}>☰</button>
      </nav>
      {menuOpen && (
        <div style={{position:"fixed",top:64,left:0,right:0,background:darkMode?"#111217":"#e4e6f0",borderBottom:`1px solid ${darkMode?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.10)"}`,padding:20,zIndex:99,display:"flex",flexDirection:"column",gap:12}}>
          <ThemeToggle/>
          <button style={{background:"transparent",color:darkMode?"#9da3b8":"#3a3f5c",border:`1.5px solid ${darkMode?"rgba(255,255,255,0.13)":"rgba(0,0,0,0.18)"}`,padding:12,borderRadius:100,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={() => {nav("login");setMenuOpen(false);}}>Log In</button>
          <button style={{background:"#6c63ff",color:"#fff",border:"none",padding:12,borderRadius:100,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={() => {nav("signup");setMenuOpen(false);}}>Get Started</button>
        </div>
      )}
      <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 24px 80px",overflow:"hidden"}}>
        <div style={{position:"absolute",width:700,height:700,borderRadius:"50%",background:darkMode?"rgba(108,99,255,0.10)":"rgba(108,99,255,0.07)",top:-150,left:"50%",transform:"translateX(-50%)",filter:"blur(80px)",pointerEvents:"none"}}/>
        <div style={{maxWidth:760,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}} className="page-enter">
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:darkMode?"rgba(108,99,255,0.15)":"rgba(108,99,255,0.10)",border:`1px solid ${darkMode?"rgba(108,99,255,0.3)":"rgba(108,99,255,0.25)"}`,borderRadius:100,padding:"5px 14px",fontSize:13,color:"#8b85ff",marginBottom:28,fontWeight:600}}>✦ Adaptive Learning for Every Learner</div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(44px,8vw,82px)",fontWeight:800,lineHeight:1.05,marginBottom:24,letterSpacing:"-0.02em",color:darkMode?"#f0f1f5":"#12142a"}}>
            Life Skills,{" "}<span style={{color:"#8b85ff"}}>Learned Your Way</span>
          </h1>
          <p style={{fontSize:"clamp(15px,2.5vw,18px)",color:darkMode?"#9da3b8":"#3a3f5c",lineHeight:1.75,maxWidth:540,margin:"0 auto 48px"}}>
            LifeBuddy is an AI-powered companion for learners with special needs — delivering personalised, interactive simulations that adapt to every learner, every session.
          </p>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:64}}>
            <button style={{background:"#6c63ff",color:"#fff",border:"none",padding:"16px 36px",borderRadius:100,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:500}} onClick={() => nav("signup")}>Start for Free →</button>
            <button style={{background:"transparent",color:darkMode?"#9da3b8":"#3a3f5c",border:`1.5px solid ${darkMode?"rgba(255,255,255,0.13)":"rgba(0,0,0,0.18)"}`,padding:"16px 36px",borderRadius:100,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:500}} onClick={() => nav("login")}>Sign In</button>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            {SKILLS.map(s => (
              <div key={s.key} style={{background:darkMode?"#1e2130":"#ffffff",border:`1px solid ${darkMode?"rgba(255,255,255,0.13)":"rgba(0,0,0,0.14)"}`,borderRadius:100,padding:"8px 16px",fontSize:13,color:darkMode?"#9da3b8":"#3a3f5c",display:"flex",gap:7,alignItems:"center"}}>
                {s.icon} {s.name}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{padding:"80px 24px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(28px,5vw,44px)",fontWeight:700,marginBottom:14,letterSpacing:"-0.02em",color:darkMode?"#f0f1f5":"#12142a"}}>Built for Real Outcomes</h2>
          <p style={{color:darkMode?"#9da3b8":"#3a3f5c",fontSize:16,maxWidth:460,margin:"0 auto"}}>Every feature exists to help learners grow and caregivers understand progress.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:20}}>
          {features.map(f => (
            <div key={f.title} style={{background:darkMode?"#1e2130":"#ffffff",border:`1px solid ${darkMode?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.10)"}`,borderRadius:20,padding:24}}>
              <div style={{fontSize:30,marginBottom:14}}>{f.icon}</div>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700,marginBottom:8,color:darkMode?"#f0f1f5":"#12142a"}}>{f.title}</h3>
              <p style={{color:darkMode?"#9da3b8":"#3a3f5c",fontSize:14,lineHeight:1.65}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section style={{padding:"80px 24px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",width:500,height:300,borderRadius:"50%",background:darkMode?"rgba(108,99,255,0.09)":"rgba(108,99,255,0.06)",top:0,left:"50%",transform:"translateX(-50%)",filter:"blur(80px)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(26px,5vw,42px)",fontWeight:700,marginBottom:16,color:darkMode?"#f0f1f5":"#12142a"}}>Ready to Begin?</h2>
          <p style={{color:darkMode?"#9da3b8":"#3a3f5c",marginBottom:32,fontSize:16}}>Create a learner profile in under 2 minutes.</p>
          <button style={{background:"#6c63ff",color:"#fff",border:"none",padding:"16px 36px",borderRadius:100,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:500}} onClick={() => nav("signup")}>Create Free Account</button>
        </div>
      </section>
      <footer style={{borderTop:`1px solid ${darkMode?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.10)"}`,padding:"24px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,display:"flex",alignItems:"center",gap:8,color:darkMode?"#f0f1f5":"#12142a"}}>
          <AppIcon size={22}/> Life<span style={{color:"#8b85ff"}}>Buddy</span>
        </div>
        <p style={{color:darkMode?"#6b7290":"#6b7090",fontSize:13}}>© 2025 LifeBuddy. Built for every learner.</p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────
// AUTH LAYOUT
// ─────────────────────────────────────────────
function AuthLayout({ title, subtitle, children, footerText, footerLabel, onFooter }) {
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:"var(--bg)",position:"relative",overflow:"hidden"}}>
      <div className="glow-orb" style={{width:500,height:500,background:"rgba(108,99,255,0.07)",top:"-100px",right:"-100px"}}/>
      <div className="glow-orb" style={{width:400,height:400,background:"rgba(34,201,122,0.04)",bottom:"-50px",left:"-50px"}}/>
      <div className="page-enter" style={{width:"100%",maxWidth:480,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:20}}>
            <AppIcon size={36}/>
            <span style={{fontFamily:"var(--font-display)",fontSize:22,fontWeight:800,color:"var(--text)"}}>Life<span style={{color:"var(--accent2)"}}>Buddy</span></span>
          </div>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:26,fontWeight:700,marginBottom:6,color:"var(--text)"}}>{title}</h1>
          <p style={{color:"var(--text2)",fontSize:15}}>{subtitle}</p>
        </div>
        <div className="card" style={{padding:32}}>{children}</div>
        <p style={{textAlign:"center",color:"var(--text3)",fontSize:14,marginTop:20}}>
          {footerText}{" "}<span style={{color:"var(--accent2)",cursor:"pointer",fontWeight:500}} onClick={onFooter}>{footerLabel}</span>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIGNUP — Multi-screen onboarding flow
// Screen 1: Role picker  →  Screen 2: Caregiver form (4 steps)
// ─────────────────────────────────────────────
function Signup({ nav, setUser }) {
  const [role,         setRole]         = useState(null);      // null | "caregiver" | "learner"
  const [welcomeStep,  setWelcomeStep]  = useState("welcome"); // "welcome" | "who"
  const [step,    setStep]    = useState(1);           // 1-4 caregiver steps
  const [form,    setForm]    = useState({
    learnerName:"", dob:"", diagnosis:"",
    independenceLevel:"", communicationStyle:"", readingLevel:"",
    goals:[], consent:"pre-approved",
    caregiverName:"", email:"",
  });
  const set = (k, v) => setForm(f => ({...f, [k]:v}));
  const toggleGoal = (g) => set("goals", form.goals.includes(g) ? form.goals.filter(x=>x!==g) : [...form.goals, g]);

  const ALL_GOALS = [
 {key:"finance",   icon:"💰", label:"Money & Transactions"},
    {key:"time",      icon:"⏰", label:"Time & Planning"},
    {key:"routine",   icon:"📋", label:"Daily Routine"},
    {key:"sorting",   icon:"📊", label:"Financial Planning"},
    {key:"digital",   icon:"📱", label:"Digital Safety"},
    {key:"mobile",    icon:"📲", label:"Mobile Money & M-Pesa"},
    {key:"advocacy",  icon:"🤝", label:"Communication & Advocacy"},
    {key:"workplace", icon:"💼", label:"Workplace Readiness"},

  ]

  const COMM_STYLES  = ["Verbal speech","AAC device","Sign language","Picture symbols","Written text"];
  const READ_LEVELS  = ["Pre-reader","Emerging reader","Independent reader","Supported reader"];
  const INDEP_LEVELS = ["Needs full support","Needs prompting","Mostly independent","Fully independent"];

  const progressPct = ((step-1)/3)*100;

  // ── SCREEN 1: Welcome ──
  if (!role && welcomeStep === "welcome") return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      padding:24,background:"var(--bg)",position:"relative",overflow:"hidden"}}>
      <div className="glow-orb" style={{width:500,height:500,background:"rgba(108,99,255,0.08)",top:"-80px",left:"50%",transform:"translateX(-50%)"}}/>
      <div className="page-enter" style={{width:"100%",maxWidth:480,position:"relative",zIndex:1,textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:32}}>
          <AppIcon size={40}/>
          <span style={{fontFamily:"var(--font-display)",fontSize:26,fontWeight:800,color:"var(--text)"}}>Life<span style={{color:"var(--accent2)"}}>Buddy</span></span>
        </div>
        <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(26px,5vw,38px)",fontWeight:800,marginBottom:10,color:"var(--text)",letterSpacing:"-0.02em"}}>Welcome to LifeBuddy</h1>
        <p style={{color:"var(--text3)",fontSize:15,marginBottom:36,lineHeight:1.6}}>Personalised life skills learning</p>
        <button className="btn btn-primary btn-lg" style={{width:"100%",marginBottom:16}} onClick={() => setWelcomeStep("who")}>
          Get Started →
        </button>
        <p style={{color:"var(--text3)",fontSize:13}}>
          Already have an account?{" "}
          <span style={{color:"var(--accent2)",cursor:"pointer",fontWeight:500}} onClick={() => nav("login")}>Log in</span>
        </p>
      </div>
    </div>
  );

  // ── SCREEN 2: Who is this for ──
  if (!role) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      padding:24,background:"var(--bg)",position:"relative",overflow:"hidden"}}>
      <div className="glow-orb" style={{width:500,height:500,background:"rgba(108,99,255,0.08)",top:"-80px",left:"50%",transform:"translateX(-50%)"}}/>
      <div className="page-enter" style={{width:"100%",maxWidth:520,position:"relative",zIndex:1,textAlign:"center"}}>
        <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(22px,4vw,32px)",fontWeight:800,marginBottom:10,color:"var(--text)",letterSpacing:"-0.02em"}}>Let's get started</h1>
        <p style={{color:"var(--text3)",fontSize:14,marginBottom:32,lineHeight:1.6}}>LifeBuddy works best when set up together with the learner present.</p>
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <button onClick={() => setRole("caregiver")} style={{
            background:"var(--surface)",border:"2px solid var(--border2)",borderRadius:"var(--radius-lg)",
            padding:"32px 40px",cursor:"pointer",textAlign:"center",transition:"all 0.2s",fontFamily:"var(--font-body)",
            maxWidth:280,width:"100%",
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.transform="translateY(-3px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.transform="translateY(0)";}}>
            <div style={{fontSize:52,marginBottom:14}}>👩‍⚕️</div>
            <div style={{fontFamily:"var(--font-display)",fontSize:17,fontWeight:700,color:"var(--text)",marginBottom:6}}>Set up a learner profile</div>
            <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.5}}>Takes about 20 minutes — have the learner with you</div>
          </button>
        </div>
        <p style={{fontSize:12,color:"var(--text3)",lineHeight:1.6,maxWidth:360,margin:"0 auto 20px",textAlign:"center"}}>
          We recommend having a caregiver, teacher, or support worker present during setup to get the best results for the learner.
        </p>
        <p style={{color:"var(--text3)",fontSize:13}}>
          <span style={{color:"var(--accent2)",cursor:"pointer",fontWeight:500}} onClick={() => setWelcomeStep("welcome")}>← Back</span>
        </p>
      </div>
    </div>
  );

  // ── SCREEN 2: Caregiver form — 4 steps ──
  const canNext = [
    form.learnerName.trim().length > 0,                          // step 1
    form.independenceLevel && form.communicationStyle && form.readingLevel, // step 2
    form.caregiverName.trim().length > 0,                         // step 3
  ];

  const handleFinish = () => {
    const goals = ALL_GOALS.map(g => g.key);
    setUser({
      learnerName: form.learnerName || "Learner",
      caregiverName: form.caregiverName || "Caregiver",
      condition: form.diagnosis || "Not specified",
      dob: form.dob,
      independenceLevel: form.independenceLevel,
      communicationStyle: form.communicationStyle,
      readingLevel: form.readingLevel,
      goals,
      consent: form.consent,
      email: form.email,
      joinDate: new Date().toLocaleDateString("en-GB",{month:"short",year:"numeric"}),
      bio: "",
    });
    nav("assessment");
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      padding:24,background:"var(--bg)",position:"relative",overflow:"hidden"}}>
      <div className="glow-orb" style={{width:500,height:400,background:"rgba(108,99,255,0.07)",top:"-60px",right:"-80px"}}/>
      <div className="page-enter" style={{width:"100%",maxWidth:520,position:"relative",zIndex:1}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16}}>
            <AppIcon size={32}/><span style={{fontFamily:"var(--font-display)",fontSize:20,fontWeight:800,color:"var(--text)"}}>Life<span style={{color:"var(--accent2)"}}>Buddy</span></span>
          </div>
          <div style={{fontSize:12,color:"var(--text3)",marginBottom:10,letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:600}}>
            Step {step} of 3 — {["Learner Details","Learning Profile","Caregiver & Consent"][step-1]}
          </div>
          {/* Progress bar */}
          <div style={{height:5,background:"var(--bg4)",borderRadius:3,overflow:"hidden",maxWidth:360,margin:"0 auto 4px"}}>
            <div style={{height:"100%",background:"var(--accent)",borderRadius:3,width:`${progressPct + 25}%`,transition:"width 0.4s"}}/>
          </div>
          <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:10}}>
            {[1,2,3,4].map(s=>(
              <div key={s} style={{width:s<=step?32:24,height:5,borderRadius:3,transition:"all 0.3s",
                background:s<step?"var(--green)":s===step?"var(--accent)":"var(--bg4)"}}/>
            ))}
          </div>
        </div>

        <div className="card" style={{padding:28}}>

          {/* ── STEP 1: Learner Details ── */}
          {step === 1 && (
            <div style={{display:"flex",flexDirection:"column",gap:18}}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:24}}>👤</span>
                <h2 style={{fontFamily:"var(--font-display)",fontSize:18,fontWeight:700,color:"var(--text)"}}>About the Learner</h2>
              </div>
              <div className="input-wrap">
                <label className="input-label">Learner's First Name *</label>
                <input className="input-field" placeholder="e.g. Alex" value={form.learnerName} onChange={e=>set("learnerName",e.target.value)} autoFocus/>
              </div>
              <div className="input-wrap">
                <label className="input-label">Date of Birth</label>
                <input className="input-field" type="date" value={form.dob} onChange={e=>set("dob",e.target.value)}/>
              </div>
              <div className="input-wrap">
                <label className="input-label">Diagnosis / Condition <span style={{color:"var(--text3)",fontWeight:400,textTransform:"none",fontSize:11}}>(optional)</span></label>
                <select className="input-field" value={form.diagnosis} onChange={e=>set("diagnosis",e.target.value)}>
                  <option value="">Prefer not to say</option>
                  <option>ASD — Autism Spectrum Disorder</option>
                  <option>Down Syndrome</option>
                  <option>Intellectual Disability</option>
                  <option>ADHD</option>
                  <option>Cerebral Palsy</option>
                  <option>Sensory Processing Disorder</option>
                  <option>Multiple Disabilities</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          )}

          {/* ── STEP 2: Learning Profile ── */}
          {step === 2 && (
            <div style={{display:"flex",flexDirection:"column",gap:18}}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:24}}>🧩</span>
                <h2 style={{fontFamily:"var(--font-display)",fontSize:18,fontWeight:700,color:"var(--text)"}}>Learning Profile</h2>
              </div>
              <div className="input-wrap">
                <label className="input-label">Independence Level *</label>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
                  {INDEP_LEVELS.map(lvl=>(
                    <label key={lvl} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"10px 14px",borderRadius:"var(--radius-sm)",border:`1.5px solid ${form.independenceLevel===lvl?"var(--accent)":"var(--border2)"}`,background:form.independenceLevel===lvl?"rgba(108,99,255,0.08)":"transparent",transition:"all 0.15s"}}>
                      <input type="radio" name="indep" value={lvl} checked={form.independenceLevel===lvl} onChange={()=>set("independenceLevel",lvl)} style={{accentColor:"var(--accent)"}}/>
                      <span style={{fontSize:13,color:"var(--text)"}}>{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="input-wrap">
                <label className="input-label">Communication Style *</label>
                <select className="input-field" value={form.communicationStyle} onChange={e=>set("communicationStyle",e.target.value)}>
                  <option value="">Select style...</option>
                  {COMM_STYLES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="input-wrap">
                <label className="input-label">Reading Level *</label>
                <select className="input-field" value={form.readingLevel} onChange={e=>set("readingLevel",e.target.value)}>
                  <option value="">Select level...</option>
                  {READ_LEVELS.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── STEP 3: Caregiver & Consent ── */}
          {step === 3 && (
            <div style={{display:"flex",flexDirection:"column",gap:18}}>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:24}}>🔐</span>
                <h2 style={{fontFamily:"var(--font-display)",fontSize:18,fontWeight:700,color:"var(--text)"}}>Caregiver & Consent</h2>
              </div>
              <div className="input-wrap">
                <label className="input-label">Your Name (Caregiver) *</label>
                <input className="input-field" placeholder="e.g. Sarah" value={form.caregiverName} onChange={e=>set("caregiverName",e.target.value)}/>
              </div>
              <div className="input-wrap">
                <label className="input-label">Email <span style={{color:"var(--text3)",fontWeight:400,textTransform:"none",fontSize:11}}>(optional)</span></label>
                <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e=>set("email",e.target.value)}/>
              </div>
              <div style={{background:"rgba(34,201,122,0.08)",border:"1px solid rgba(34,201,122,0.25)",borderRadius:"var(--radius-sm)",padding:"10px 14px",fontSize:12,color:"var(--green)",lineHeight:1.5}}>
                🔒 No data is shared with third parties. Everything stays on this device.
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div style={{display:"flex",gap:10,marginTop:24}}>
            <button className="btn btn-ghost btn-sm" style={{flex:1}} onClick={() => step===1 ? setRole(null) : setStep(s=>s-1)}>
              {step===1?"← Role":"← Back"}
            </button>
            {step < 3 ? (
              <button className="btn btn-primary btn-sm" style={{flex:2}} onClick={() => setStep(s=>s+1)} disabled={!canNext[step-1]}>
                Continue →
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" style={{flex:2}} onClick={handleFinish} disabled={!canNext[2]}>
                Start Assessment →
              </button>
            )}
          </div>
        </div>

        <p style={{textAlign:"center",color:"var(--text3)",fontSize:13,marginTop:16}}>
          Already have an account?{" "}
          <span style={{color:"var(--accent2)",cursor:"pointer",fontWeight:500}} onClick={()=>nav("login")}>Log in</span>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LOGIN — with social login options
// ─────────────────────────────────────────────
function Login({ nav, setUser }) {
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [showEmail, setShowEmail] = useState(false);

  const quickLogin = (who) => {
    const profiles = {
      google:   {learnerName:"Alex",caregiverName:"Google User",condition:"ASD",age:14,email:"user@gmail.com",joinDate:"May 2025",bio:"",goals:["finance","time","routine","sorting"]},
      apple:    {learnerName:"Alex",caregiverName:"Apple User", condition:"ASD",age:14,email:"user@icloud.com",joinDate:"May 2025",bio:"",goals:["finance","time","routine","sorting"]},
      facebook: {learnerName:"Alex",caregiverName:"Facebook User",condition:"ASD",age:14,email:"user@facebook.com",joinDate:"May 2025",bio:"",goals:["finance","time","routine","sorting"]},
      demo:     {learnerName:"Alex",caregiverName:"Demo Caregiver",condition:"ASD",age:14,email:"demo@lifebuddy.app",joinDate:"May 2025",bio:"This is a demo account.",goals:["finance","time","routine","sorting"]},
    };
    setUser(profiles[who]);
    nav("home");
  };

  const emailLogin = () => {
    setUser({learnerName:name||"Learner",caregiverName:name||"Caregiver",condition:"ASD",age:14,email,joinDate:"May 2025",bio:"",goals:["finance","time","routine","sorting"]});
    nav("home");
  };

  const SocialBtn = ({icon, label, color, bg, border, onClick}) => (
    <button onClick={onClick} style={{
      display:"flex",alignItems:"center",justifyContent:"center",gap:10,
      width:"100%",padding:"13px 20px",borderRadius:100,
      background:bg||"var(--bg3)",border:`1.5px solid ${border||"var(--border2)"}`,
      color:color||"var(--text)",fontSize:14,fontWeight:500,
      cursor:"pointer",fontFamily:"var(--font-body)",transition:"all 0.15s",
    }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.25)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
      <span style={{fontSize:18}}>{icon}</span>
      {label}
    </button>
  );

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      padding:24,background:"var(--bg)",position:"relative",overflow:"hidden"}}>
      <div className="glow-orb" style={{width:500,height:500,background:"rgba(108,99,255,0.07)",top:"-100px",right:"-100px"}}/>
      <div className="glow-orb" style={{width:400,height:400,background:"rgba(34,201,122,0.04)",bottom:"-50px",left:"-50px"}}/>
      <div className="page-enter" style={{width:"100%",maxWidth:420,position:"relative",zIndex:1}}>

        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16}}>
            <AppIcon size={36}/>
            <span style={{fontFamily:"var(--font-display)",fontSize:22,fontWeight:800,color:"var(--text)"}}>Life<span style={{color:"var(--accent2)"}}>Buddy</span></span>
          </div>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:24,fontWeight:700,marginBottom:6,color:"var(--text)"}}>Welcome back</h1>
          <p style={{color:"var(--text3)",fontSize:14}}>Sign in to continue your learner's journey</p>
        </div>

        <div className="card" style={{padding:28}}>

          {/* Social login buttons */}
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
            <SocialBtn
              icon={<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
              label="Continue with Google"
              onClick={() => quickLogin("google")}
            />
            <SocialBtn
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>}
              label="Continue with Apple"
              bg="#000" color="#fff" border="#000"
              onClick={() => quickLogin("apple")}
            />
            <SocialBtn
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
              label="Continue with Facebook"
              onClick={() => quickLogin("facebook")}
            />
          </div>

          {/* Divider */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div style={{flex:1,height:1,background:"var(--border2)"}}/>
            <span style={{fontSize:12,color:"var(--text3)",whiteSpace:"nowrap"}}>or sign in with email</span>
            <div style={{flex:1,height:1,background:"var(--border2)"}}/>
          </div>

          {/* Email/name entry */}
          {!showEmail ? (
            <button className="btn btn-ghost" style={{width:"100%",marginBottom:12}} onClick={()=>setShowEmail(true)}>
              📧 Use email instead
            </button>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:12}}>
              <div className="input-wrap">
                <label className="input-label">Your Name</label>
                <input className="input-field" placeholder="e.g. Sarah" value={name} onChange={e=>setName(e.target.value)} autoFocus/>
              </div>
              <div className="input-wrap">
                <label className="input-label">Email</label>
                <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
              </div>
              <button className="btn btn-primary" style={{width:"100%"}} onClick={emailLogin}>
                Sign In →
              </button>
            </div>
          )}

          {/* Demo */}
          <button className="btn btn-ghost btn-sm" style={{width:"100%",fontSize:12,opacity:0.7}} onClick={()=>quickLogin("demo")}>
            👀 Quick Demo — skip login
          </button>
        </div>

        <p style={{textAlign:"center",color:"var(--text3)",fontSize:13,marginTop:16}}>
          New here?{" "}
          <span style={{color:"var(--accent2)",cursor:"pointer",fontWeight:500}} onClick={() => nav("signup")}>Create an account</span>
        </p>
        <p style={{textAlign:"center",color:"var(--text3)",fontSize:11,marginTop:10,lineHeight:1.5}}>
          By continuing you agree to LifeBuddy's terms of use and privacy policy.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ASSESSMENT — Learner Baseline
// phase: "skills" | "processing" | "recommendation" | "consent"
// ─────────────────────────────────────────────

const ASSESSMENT_SKILLS_LIST = [
  { id:"money_transactions",     name:"Money & Transactions",           icon:"💰" },
  { id:"time_planning",          name:"Time & Planning",                icon:"⏰" },
  { id:"digital_safety",         name:"Digital Safety & Communication", icon:"📱" },
  { id:"mobile_money",           name:"Mobile Money & M-Pesa",          icon:"📲" },
  { id:"communication_advocacy", name:"Communication & Self-Advocacy",  icon:"🤝" },
  { id:"financial_planning",     name:"Financial Planning",             icon:"📊" },
  { id:"community_safety",       name:"Community & Personal Safety",    icon:"🛡️" },
  { id:"workplace_readiness",    name:"Workplace Readiness",            icon:"💼" },
]

const ASSESSMENT_CG_QUESTIONS = {
  money_transactions:     ["Can they identify coins and notes?","Have they paid for something independently?","Do they understand change?"],
  time_planning:          ["Can they read a clock?","Do they follow a daily schedule?","Do they understand morning/afternoon/evening?"],
  digital_safety:         ["Do they use a phone independently?","Do they know not to share passwords?","Can they identify suspicious messages?"],
  mobile_money:           ["Have they seen M-Pesa used?","Do they know what a PIN is?","Can they identify an M-Pesa scam?"],
  communication_advocacy: ["Can they express their needs?","Do they ask for help when needed?","Do they know their basic rights?"],
  financial_planning:     ["Do they understand saving?","Can they make simple budget choices?","Do they understand income vs expenses?"],
  community_safety:       ["Do they know emergency contacts?","Can they navigate to a clinic independently?","Do they know community services available?"],
  workplace_readiness:    ["Have they had any work experience?","Can they follow multi-step instructions?","Do they understand a payslip?"],
}

const ASSESSMENT_SELF_QUESTIONS = {
  money_transactions:     ["Can you identify coins and notes?","Have you paid for something independently?","Do you understand change?"],
  time_planning:          ["Can you read a clock?","Do you follow a daily schedule?","Do you understand morning/afternoon/evening?"],
  digital_safety:         ["Do you use a phone independently?","Do you know not to share passwords?","Can you identify suspicious messages?"],
  mobile_money:           ["Have you seen M-Pesa used?","Do you know what a PIN is?","Can you identify an M-Pesa scam?"],
  communication_advocacy: ["Can you express your needs?","Do you ask for help when needed?","Do you know your basic rights?"],
  financial_planning:     ["Do you understand saving?","Can you make simple budget choices?","Do you understand income vs expenses?"],
  community_safety:       ["Do you know emergency contacts?","Can you navigate to a clinic independently?","Do you know community services available?"],
  workplace_readiness:    ["Have you had any work experience?","Can you follow multi-step instructions?","Do you understand a payslip?"],
}

const ASSESSMENT_TASKS = {
  money_transactions: [
    { q:"Which coin is worth KES 20?", opts:["KES 5 — small silver coin","KES 20 — large gold coin","KES 1 — very small coin"], correct:1 },
    { q:"Which note is worth KES 200?", opts:["KES 50 note — red","KES 200 note — green","KES 500 note — purple"], correct:1 },
    { q:"You pay KES 100 for something that costs KES 60. How much change do you get?", opts:["KES 40","KES 60","KES 160"], correct:0 },
  ],
  time_planning: [
    { q:"What time does the clock show when the short hand points to 3?", opts:["3:00","4:00","2:00"], correct:0 },
    { q:"Which activity happens in the morning?", opts:["Eating breakfast","Watching the sunset","Going to sleep"], correct:0 },
    { q:"Put these in order — which comes first?", opts:["Wake up","Brush teeth","Eat breakfast"], correct:0 },
  ],
  digital_safety: [
    { q:"You get a message: 'You won KES 50,000! Click here!' What do you do?", opts:["Click immediately","Tell a trusted adult — looks like a scam","Share with friends"], correct:1 },
    { q:"Which is a safe password?", opts:["123456","Your name","Xk9#mP2!"], correct:2 },
    { q:"Someone online asks for your home address. What do you do?", opts:["Give it to them","Tell a trusted adult","Post it publicly"], correct:1 },
  ],
  mobile_money: [
    { q:"What does M-Pesa use to confirm transactions?", opts:["Your name","A PIN number","Your photo"], correct:1 },
    { q:"You get an M-Pesa message asking for your PIN. What do you do?", opts:["Send your PIN","Ignore and tell someone","Reply with your ID"], correct:1 },
    { q:"Lipa na M-Pesa is used for?", opts:["Sending messages","Making payments at shops","Calling friends"], correct:1 },
  ],
  communication_advocacy: [
    { q:"You need help but don't know who to ask. What do you do?", opts:["Stay quiet","Ask someone you trust","Give up"], correct:1 },
    { q:"Which is the best way to express you are not feeling well?", opts:["Stay silent","Tell a trusted person how you feel","Pretend everything is fine"], correct:1 },
    { q:"You disagree with a decision made for you. What do you do?", opts:["Accept it without question","Calmly express your feelings","Get angry immediately"], correct:1 },
  ],
  financial_planning: [
    { q:"You earn KES 1000 and spend KES 800. How much is left to save?", opts:["KES 200","KES 800","KES 1800"], correct:0 },
    { q:"Which is an example of saving?", opts:["Buying something immediately","Putting money aside for later","Spending all your money"], correct:1 },
    { q:"What is a budget?", opts:["A type of food","A plan for spending and saving money","A bank account"], correct:1 },
  ],
  community_safety: [
    { q:"What number do you call in an emergency in Kenya?", opts:["999","911","112"], correct:0 },
    { q:"Where do you go when you are sick?", opts:["Supermarket","Health clinic or hospital","Police station"], correct:1 },
    { q:"Which organisation helps people in your community?", opts:["A cinema","A community health centre","A shopping mall"], correct:1 },
  ],
  workplace_readiness: [
    { q:"Your work schedule says you start at 8am. What time should you arrive?", opts:["9am — a bit late is fine","8am — on time","7am — very early always"], correct:1 },
    { q:"Your supervisor gives you 3 instructions. What do you do?", opts:["Do only the first one","Listen carefully and do all three","Ask them to repeat forever"], correct:1 },
    { q:"What does a payslip show?", opts:["Your shopping list","How much you earned and any deductions","Your work schedule"], correct:1 },
  ],
}

const ASSESSMENT_CONSENT_OPTIONS = [
  { val:"pre_approved",      label:"Pre-approved",      desc:"All selected skills are unlocked now" },
  { val:"approve_per_skill", label:"Approve per skill", desc:"Caregiver approves each new skill" },
  { val:"approve_per_tier",  label:"Approve per tier",  desc:"Caregiver approves each tier advance" },
]

function Assessment({ nav, settings, user, setTierData }) {
  const [phase,           setPhase]           = useState("skills")
  const [skillIndex,      setSkillIndex]      = useState(0)
  const [questionIndex,   setQuestionIndex]   = useState(0)
  const [taskIndex,       setTaskIndex]       = useState(0)
  const [subPhase,        setSubPhase]        = useState("caregiver")
  const [caregiverScores, setCaregiverScores] = useState({})
  const [learnerScores,   setLearnerScores]   = useState({})
  const [taskFeedback,    setTaskFeedback]    = useState(null)
  const [pl0Results,      setPl0Results]      = useState({})
  const [recommendedSkill, setRecommendedSkill] = useState("")
  const [consentType,     setConsentType]     = useState("pre_approved")
  const [enabledSkills,   setEnabledSkills]   = useState(ASSESSMENT_SKILLS_LIST.map(s => s.id))

  const taskStartTime      = useRef(Date.now())
  const caregiverScoresRef = useRef({})
  const learnerScoresRef   = useRef({})

  const currentSkill = ASSESSMENT_SKILLS_LIST[skillIndex]
  const skillId      = currentSkill?.id
  const isCgMode     = !user?.selfDirected
  const questions    = (user?.selfDirected ? ASSESSMENT_SELF_QUESTIONS : ASSESSMENT_CG_QUESTIONS)[skillId] || []
  const tasks        = ASSESSMENT_TASKS[skillId] || []

  useEffect(() => { taskStartTime.current = Date.now() }, [skillIndex, subPhase, taskIndex])

  useEffect(() => {
    if (subPhase !== "cg_to_learner") return
    const t = setTimeout(() => setSubPhase("learner"), 5000)
    return () => clearTimeout(t)
  }, [subPhase])

  useEffect(() => {
    if (subPhase !== "skill_complete") return
    const t = setTimeout(() => {
      setSkillIndex(si => si + 1)
      setTaskIndex(0)
      setSubPhase("caregiver")
    }, 7000)
    return () => clearTimeout(t)
  }, [subPhase])

  useEffect(() => {
    if (phase !== "processing") return
    const results = {}
    ASSESSMENT_SKILLS_LIST.forEach(s => {
      const cs  = caregiverScoresRef.current[s.id] || 0
      const ls  = learnerScoresRef.current[s.id]  || 0
      const raw = 0.15 + cs * 0.30 + ls * 0.70
      results[s.id] = Math.max(0.15, Math.min(0.45, raw))
    })
    setPl0Results(results)
    const t = setTimeout(() => {
      const best = Object.entries(results).reduce((a, b) => a[1] < b[1] ? a : b)
      setRecommendedSkill(best[0])
      setPhase("recommendation")
    }, 2500)
    return () => clearTimeout(t)
  }, [phase])

  function handleCaregiverAnswer(score) {
    const updated = { ...caregiverScoresRef.current, [skillId]: (caregiverScoresRef.current[skillId] || 0) + score }
    caregiverScoresRef.current = updated
    setCaregiverScores(updated)
    if (questionIndex < 2) {
      setQuestionIndex(qi => qi + 1)
    } else {
      setQuestionIndex(0)
      setSubPhase("cg_to_learner")
    }
  }

  function handleTaskAnswer(i) {
    if (taskFeedback) return
    const task    = tasks[taskIndex]
    const correct = i === task.correct
    const rt      = Date.now() - taskStartTime.current
    const score   = correct ? (rt < 5000 ? 0.08 : 0.03) : 0.00
    const updated = { ...learnerScoresRef.current, [skillId]: (learnerScoresRef.current[skillId] || 0) + score }
    learnerScoresRef.current = updated
    setLearnerScores(updated)
    setTaskFeedback(correct ? "correct" : "wrong")
    setTimeout(() => {
      setTaskFeedback(null)
      if (taskIndex < 2) {
        setTaskIndex(ti => ti + 1)
      } else if (skillIndex < 7) {
        setSubPhase("skill_complete")
      } else {
        setPhase("processing")
      }
    }, 1200)
  }

  async function handleConfirmConsent() {
    try {
      await fetch("http://127.0.0.1:8000/adapt/onboarding/baseline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learner_id:        "8312fa0c-9b5f-46d6-94df-40552fc6cc7c",
          skill_baselines:   pl0Results,
          consent_type:      consentType,
          recommended_skill: recommendedSkill,
          hci_defaults: {
            independence_level:  user?.independence        || "needs_prompting",
            communication_style: user?.communicationStyle  || "verbal",
            reading_level:       user?.readingLevel         || "emerging",
          },
        }),
      })
    } catch (e) {
      console.warn("Baseline POST failed", e)
    }
    setTierData({})
    nav("home")
  }

  // ── Processing ──
  if (phase === "processing") return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:24}}>
      <div style={{fontSize:48}}>⚙️</div>
      <h2 style={{color:"var(--text)",fontFamily:"var(--font-display)",fontSize:24,fontWeight:800}}>Analysing results...</h2>
      <p style={{color:"var(--text2)",fontSize:14}}>Setting up a personalised learning profile.</p>
      <div style={{width:48,height:4,borderRadius:2,background:"var(--accent)",animation:"pulse 1s ease-in-out infinite"}}/>
    </div>
  )

  // ── Recommendation ──
  if (phase === "recommendation") {
    const rec = ASSESSMENT_SKILLS_LIST.find(s => s.id === recommendedSkill)
    return (
      <div style={{minHeight:"100vh",background:"var(--bg)",overflowY:"auto",padding:24}}>
        <div style={{maxWidth:480,margin:"0 auto",paddingTop:40,paddingBottom:40}}>
          <h2 style={{color:"var(--text)",fontFamily:"var(--font-display)",fontSize:22,fontWeight:800,marginBottom:8}}>
            Assessment complete 🎉
          </h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:24}}>Based on the baseline, we recommend starting with:</p>
          <div className="card" style={{padding:24,marginBottom:16,border:"2px solid var(--accent)"}}>
            <div style={{fontSize:40,marginBottom:8}}>{rec?.icon}</div>
            <div style={{fontSize:18,fontWeight:700,color:"var(--text)",marginBottom:4}}>{rec?.name}</div>
            <div style={{fontSize:13,color:"var(--text2)"}}>Baseline P(L₀) = {((pl0Results[recommendedSkill] || 0) * 100).toFixed(1)}%</div>
          </div>
          <button className="btn btn-primary" style={{width:"100%",marginBottom:20}} onClick={() => setPhase("consent")}>
            Start with this skill →
          </button>
          <p style={{fontSize:13,color:"var(--text3)",marginBottom:12,textAlign:"center"}}>Or choose a different starting skill:</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {ASSESSMENT_SKILLS_LIST.filter(s => s.id !== recommendedSkill).map(s => (
              <button key={s.id} className="btn btn-ghost"
                style={{justifyContent:"flex-start",gap:12,textAlign:"left"}}
                onClick={() => { setRecommendedSkill(s.id); setPhase("consent") }}>
                <span style={{fontSize:20}}>{s.icon}</span>
                <span style={{flex:1,fontSize:14}}>{s.name}</span>
                <span style={{fontSize:11,color:"var(--text3)"}}>{((pl0Results[s.id] || 0) * 100).toFixed(1)}%</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Consent ──
  if (phase === "consent") {
    const consentOptions = user?.selfDirected
      ? [
          { val:"pre_approved",      label:"Show me everything",  desc:"Full progress reports after every session" },
          { val:"approve_per_skill", label:"Just the highlights", desc:"Summary at end of each skill" },
          { val:"approve_per_tier",  label:"Keep it simple",      desc:"Just tell me what to do next" },
        ]
      : ASSESSMENT_CONSENT_OPTIONS
    return (
      <div style={{minHeight:"100vh",background:"var(--bg)",overflowY:"auto",padding:24}}>
        <div style={{maxWidth:480,margin:"0 auto",paddingTop:40,paddingBottom:40,display:"flex",flexDirection:"column",gap:20}}>
          <div>
            <h2 style={{color:"var(--text)",fontFamily:"var(--font-display)",fontSize:22,fontWeight:800,marginBottom:6}}>
              {user?.selfDirected ? "Notification Preferences" : "Consent & Skill Access"}
            </h2>
            <p style={{color:"var(--text2)",fontSize:14}}>
              {user?.selfDirected ? "How much detail would you like to see?" : "Choose how skill access is managed for this learner."}
            </p>
          </div>
          <div className="card" style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
            {consentOptions.map(opt => (
              <label key={opt.val} style={{display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer"}}>
                <input type="radio" name="consentType" value={opt.val}
                  checked={consentType === opt.val} onChange={() => setConsentType(opt.val)} style={{marginTop:3}}/>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--text)"}}>{opt.label}</div>
                  <div style={{fontSize:12,color:"var(--text2)"}}>{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
          {!user?.selfDirected && (
            <div className="card" style={{padding:20}}>
              <div style={{fontSize:12,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:14}}>Skills to enable</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {ASSESSMENT_SKILLS_LIST.map(s => (
                  <label key={s.id} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
                    <input type="checkbox" checked={enabledSkills.includes(s.id)}
                      onChange={() => setEnabledSkills(prev =>
                        prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id]
                      )}/>
                    <span style={{fontSize:18}}>{s.icon}</span>
                    <span style={{fontSize:14,color:"var(--text)"}}>{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <button className="btn btn-primary btn-lg" style={{width:"100%"}} onClick={handleConfirmConsent}>
            {user?.selfDirected ? "Start Learning →" : "Confirm & Start Learning →"}
          </button>
        </div>
      </div>
    )
  }

  // ── Transition: caregiver → learner ──
  if (subPhase === "cg_to_learner") return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,gap:20,textAlign:"center"}}>
      <div style={{fontSize:72}}>{currentSkill?.icon}</div>
      <div style={{fontSize:20,fontWeight:700,color:"var(--text)",fontFamily:"var(--font-display)"}}>{currentSkill?.name}</div>
      <p style={{fontSize:15,color:"var(--text2)",maxWidth:360,lineHeight:1.6}}>
        Great! Now let's see what {user?.learnerName || "the learner"} can do 🎯
      </p>
      <div style={{width:"100%",maxWidth:360,height:4,background:"var(--border2)",borderRadius:2,overflow:"hidden"}}>
        <div key={`cgtl-${skillIndex}`} style={{height:"100%",background:"var(--accent)",borderRadius:2,animation:"assessFill 5s linear forwards"}}/>
      </div>
      <style>{`@keyframes assessFill { from { width:0 } to { width:100% } }`}</style>
    </div>
  )

  // ── Transition: skill complete ──
  if (subPhase === "skill_complete") {
    const nextSkill = ASSESSMENT_SKILLS_LIST[skillIndex + 1]
    return (
      <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,gap:16,textAlign:"center"}}>
        <div style={{fontSize:64}}>✅</div>
        <div style={{fontSize:20,fontWeight:700,color:"var(--text)",fontFamily:"var(--font-display)"}}>{currentSkill?.name} complete!</div>
        {nextSkill && (
          <p style={{fontSize:15,color:"var(--text2)"}}>Moving to {nextSkill.icon} {nextSkill.name}...</p>
        )}
        <div style={{fontSize:13,color:"var(--text3)"}}>Skill {skillIndex + 1} of 8</div>
        <div style={{width:"100%",maxWidth:360,height:4,background:"var(--border2)",borderRadius:2,overflow:"hidden"}}>
          <div key={`sc-${skillIndex}`} style={{height:"100%",background:"var(--green)",borderRadius:2,animation:"assessFill7 7s linear forwards"}}/>
        </div>
        <style>{`@keyframes assessFill7 { from { width:0 } to { width:100% } }`}</style>
      </div>
    )
  }

  // ── Skills (main assessment) ──
  const totalSteps  = 48
  const doneSteps   = skillIndex * 6 + (subPhase === "caregiver" ? questionIndex : 3 + taskIndex)
  const progressPct = Math.round((doneSteps / totalSteps) * 100)

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:480}}>
        <div style={{marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:12,color:"var(--text3)"}}>{currentSkill?.icon} {currentSkill?.name}</span>
            <span style={{fontSize:12,color:"var(--text3)"}}>Skill {skillIndex + 1} / {ASSESSMENT_SKILLS_LIST.length}</span>
          </div>
          <div style={{height:4,background:"var(--border2)",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${progressPct}%`,background:"var(--accent)",borderRadius:2,transition:"width 0.3s ease"}}/>
          </div>
        </div>
        <div className="card" style={{padding:28}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:40,marginBottom:6}}>{currentSkill?.icon}</div>
            <div style={{fontSize:10,fontWeight:700,color:"var(--text3)",letterSpacing:"0.1em",textTransform:"uppercase"}}>
              {subPhase === "caregiver"
                ? `${isCgMode ? "Caregiver" : "Self"} · Question ${questionIndex + 1} of 3`
                : `Learner task · ${taskIndex + 1} of 3`}
            </div>
          </div>
          {subPhase === "caregiver" && (
            <div>
              <p style={{fontSize:17,fontWeight:500,color:"var(--text)",lineHeight:1.5,marginBottom:20,textAlign:"center"}}>
                {questions[questionIndex]}
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {["Not yet","Sometimes","Yes"].map((label, i) => (
                  <button key={label} className="btn btn-ghost"
                    style={{justifyContent:"flex-start",fontSize:15,padding:"14px 18px"}}
                    onClick={() => handleCaregiverAnswer([0, 0.01, 0.02][i])}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {subPhase === "learner" && tasks[taskIndex] && (
            <div>
              <p style={{fontSize:16,fontWeight:500,color:"var(--text)",lineHeight:1.5,marginBottom:20,textAlign:"center"}}>
                {tasks[taskIndex].q}
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {tasks[taskIndex].opts.map((opt, i) => {
                  const isCorrect = i === tasks[taskIndex].correct
                  return (
                    <button key={i} disabled={!!taskFeedback} onClick={() => handleTaskAnswer(i)}
                      className="btn"
                      style={{
                        justifyContent:"flex-start",fontSize:14,padding:"14px 16px",
                        textAlign:"left",lineHeight:1.4,
                        background:  taskFeedback && isCorrect  ? "var(--green-dim)"
                                   : taskFeedback && !isCorrect ? "var(--red-dim)" : "var(--bg3)",
                        border: `1.5px solid ${taskFeedback && isCorrect ? "var(--green)"
                                             : taskFeedback && !isCorrect ? "var(--red)" : "var(--border2)"}`,
                        color:"var(--text)",
                      }}>
                      {opt}
                    </button>
                  )
                })}
              </div>
              {taskFeedback && (
                <div style={{textAlign:"center",marginTop:16,fontSize:36}}>
                  {taskFeedback === "correct" ? "✅" : "❌"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


// ─────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────
function Home({ nav, user, tierData, settings, ThemeToggle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const learner   = user?.learnerName || "Alex";
  const caregiver = user?.caregiverName || "Caregiver";
  const recent = [
    {icon:"⏰",skill:"Time Management",date:"Today",tier:1,stars:3},
    {icon:"💰",skill:"Finance",date:"Yesterday",tier:2,stars:2},
    {icon:"📊",skill:"Financial Planning",date:"2 days ago",tier:1,stars:3},
  ];
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",paddingTop:64}}>
      <nav className="nav">
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <AppIcon size={26}/>
          <span className="nav-logo">Life<span>Buddy</span></span>
        </div>
        <div className="hide-mobile" style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{color:"var(--text3)",fontSize:13}}>Hi, {caregiver}</span>
          <ThemeToggle/>
          <Tip label={`View ${learner}'s profile — edit details, see achievements and current skill tiers`} placement="below">
            <Avatar name={learner} size={36} onClick={() => nav("profile")} color="var(--accent)"/>
          </Tip>
          <Tip label="Log out and return to the landing page" placement="below">
            <button className="btn btn-ghost btn-sm" onClick={() => nav("landing")}>Logout</button>
          </Tip>
        </div>
        <button className="nav-mobile-menu btn btn-ghost btn-sm" onClick={() => setMenuOpen(o=>!o)}>☰</button>
      </nav>
      {menuOpen && (
        <div style={{position:"fixed",top:64,left:0,right:0,background:"var(--bg2)",borderBottom:"1px solid var(--border)",padding:16,zIndex:99,display:"flex",flexDirection:"column",gap:10}}>
          <ThemeToggle/>
          <button className="btn btn-ghost btn-sm" onClick={() => nav("profile")}>👤 Profile</button>
          <button className="btn btn-ghost btn-sm" onClick={() => nav("landing")}>Logout</button>
        </div>
      )}
      <div className="page-enter" style={{maxWidth:780,margin:"0 auto",padding:"48px 24px"}}>
        <div style={{marginBottom:40,position:"relative"}}>
          <div className="glow-orb" style={{width:300,height:200,background:"rgba(108,99,255,0.09)",top:-40,right:0}}/>
          <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"flex-start",gap:16,flexWrap:"wrap"}}>
            <Tip label={`View ${learner}'s full profile — edit details, see achievements and skill tiers`} placement="below">
              <Avatar name={learner} size={56} onClick={() => nav("profile")} color="var(--accent)"/>
            </Tip>
            <div style={{flex:1,minWidth:220}}>
              <p style={{color:"var(--text3)",fontSize:13,marginBottom:4}}>Welcome back</p>
              <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(24px,5vw,40px)",fontWeight:800,marginBottom:10,letterSpacing:"-0.02em",color:"var(--text)",lineHeight:1.1}}>
                Hey, {learner}! 👋
              </h1>

              {/* Ability summary banner */}
              {(() => {
                const tiers = Object.values(tierData);
                const avg   = tiers.reduce((a,b)=>a+b,0) / tiers.length;
                const level = avg >= 2.5 ? "Advanced" : avg >= 1.5 ? "Developing" : "Beginner";
                const levelColor = avg >= 2.5 ? "var(--purple)" : avg >= 1.5 ? "var(--amber)" : "var(--green)";
                const levelDim   = avg >= 2.5 ? "var(--purple-dim)" : avg >= 1.5 ? "var(--amber-dim)" : "var(--green-dim)";
                const desc = avg >= 2.5
                  ? "Performing well across most skills — keep challenging yourself!"
                  : avg >= 1.5
                  ? "Building strong foundations — great progress so far!"
                  : "Just getting started — every session builds your skills!";
                return (
                  <div style={{background:levelDim,border:`1px solid ${levelColor}`,borderRadius:"var(--radius)",padding:"10px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:12}}>
                    <div style={{fontSize:24}}>{avg>=2.5?"🚀":avg>=1.5?"📈":"🌱"}</div>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:levelColor,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>
                        Current Ability — {level}
                      </div>
                      <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.4}}>{desc}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Per-skill tier badges */}
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
                {SKILLS.map(s => (
                  <Tip key={s.key} label={`${s.name}: currently on ${TIER_CFG[tierData[s.key]].label}. ${s.tooltip}`}>
                    <span className={`badge ${TIER_CFG[tierData[s.key]].cls}`} style={{cursor:"default",fontSize:11}}>
                      {s.key==="hygiene"
                        ? <span style={{display:"inline-flex",verticalAlign:"middle"}}><HygieneSkillIcon size={13}/></span>
                        : s.icon
                      } {TIER_CFG[tierData[s.key]].short}
                    </span>
                  </Tip>
                ))}
              </div>
              <p style={{color:"var(--text3)",fontSize:12}}>Last session: Today · Keep going! 🚀</p>
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20,marginBottom:24}}>
          <Tip label="Choose from 5 skill simulations — Time, Sorting, Routine, Finance, and Hygiene. The adaptive engine picks up exactly where you left off.">
            <div className="card card-interactive" onClick={() => nav("simulations")} style={{background:"linear-gradient(135deg,var(--surface),#1f2040)",borderColor:"rgba(108,99,255,0.22)",padding:32,position:"relative",overflow:"hidden",width:"100%"}}>
              <div style={{position:"absolute",top:-20,right:-20,fontSize:90,opacity:0.10}}>🎮</div>
              <div style={{fontSize:36,marginBottom:14}}>🎮</div>
              <h2 style={{fontFamily:"var(--font-display)",fontSize:22,fontWeight:700,marginBottom:8,color:"var(--text)"}}>Start Learning</h2>
              <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.6,marginBottom:20}}>Choose a skill, play interactive tasks, and earn stars. The engine adapts the difficulty to match your pace.</p>
              <span className="btn btn-primary btn-sm">Play Now →</span>
            </div>
          </Tip>
          <Tip label="Caregiver view — see mastery charts, session history, tier changes, adaptation decisions, and manually override difficulty tiers.">
            <div className="card card-interactive" onClick={() => nav("dashboard")} style={{padding:32,position:"relative",overflow:"hidden",width:"100%"}}>
              <div style={{position:"absolute",top:-20,right:-20,fontSize:90,opacity:0.05}}>📊</div>
              <div style={{fontSize:36,marginBottom:14}}>📊</div>
              <h2 style={{fontFamily:"var(--font-display)",fontSize:22,fontWeight:700,marginBottom:8,color:"var(--text)"}}>View Dashboard</h2>
              <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.6,marginBottom:20}}>Track progress over time — mastery charts, session history, tier changes, and adaptation logs for each skill.</p>
              <span className="btn btn-ghost btn-sm">Open Dashboard</span>
            </div>
          </Tip>
          <Tip label="Build daily schedules and routines for each day of the week. Set reminders and notifications for tasks and learning sessions.">
            <div className="card card-interactive" onClick={() => nav("planner")} style={{background:"linear-gradient(135deg,var(--surface),#1a2820)",borderColor:"rgba(34,201,122,0.22)",padding:32,position:"relative",overflow:"hidden",width:"100%"}}>
              <div style={{position:"absolute",top:-20,right:-20,fontSize:90,opacity:0.08}}>📅</div>
              <div style={{fontSize:36,marginBottom:14}}>📅</div>
              <h2 style={{fontFamily:"var(--font-display)",fontSize:22,fontWeight:700,marginBottom:8,color:"var(--text)"}}>My Planner</h2>
              <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.6,marginBottom:20}}>Daily schedules, weekly routines, and reminders to keep the learner on track every day.</p>
              <span className="btn btn-success btn-sm">Open Planner →</span>
            </div>
          </Tip>
          <Tip label="Calming sounds, breathing exercises, grounding techniques, and relaxation stories — tools for when a learner feels overwhelmed or overstimulated.">
            <div className="card card-interactive" onClick={() => nav("calm")} style={{background:"linear-gradient(135deg,var(--surface),#1e1a30)",borderColor:"rgba(168,85,247,0.22)",padding:32,position:"relative",overflow:"hidden",width:"100%"}}>
              <div style={{position:"absolute",top:-20,right:-20,fontSize:90,opacity:0.08}}>🌙</div>
              <div style={{fontSize:36,marginBottom:14}}>🌙</div>
              <h2 style={{fontFamily:"var(--font-display)",fontSize:22,fontWeight:700,marginBottom:8,color:"var(--text)"}}>Calm Corner</h2>
              <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.6,marginBottom:20}}>Breathing, grounding, calming sounds, relaxation stories, and focus tools for neurodiverse learners.</p>
              <span className="btn btn-sm" style={{background:"var(--purple-dim)",color:"var(--purple)",border:"1px solid var(--purple)"}}>Find Calm →</span>
            </div>
          </Tip>
        </div>
        <div className="card" style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"16px 24px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <h3 style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Recent Activity</h3>
            {settings?.audioEnabled && <button className="voice-btn" onClick={() => speak("Here are your recent learning sessions.")} title="Read activity aloud">🔊</button>}
          </div>
          {recent.map((a, i) => (
            <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 24px",borderBottom:i<recent.length-1?"1px solid var(--border)":"none",transition:"background 0.15s",cursor:"pointer"}}
              onMouseEnter={e => e.currentTarget.style.background="var(--bg2)"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <div style={{fontSize:22}}>{a.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500,marginBottom:2,color:"var(--text)"}}>{a.skill}</div>
                <div style={{fontSize:12,color:"var(--text3)"}}>{a.date}</div>
              </div>
              <div style={{fontSize:14}}>{"⭐".repeat(a.stars)}{"☆".repeat(3-a.stars)}</div>
              <span className={`badge ${TIER_CFG[a.tier].cls}`}>{TIER_CFG[a.tier].short}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIMULATIONS
// ─────────────────────────────────────────────
function Simulations({ nav, tierData, setActiveSkill, settings }) {
  const [hovered, setHovered] = useState(null);
  const masteryLabel = (m) => m<40?"Starting":m<70?"Developing":"Strong";
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",paddingTop:64}}>
      <nav className="nav">
        <button className="btn btn-ghost btn-sm" onClick={() => nav("home")}>← Home</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <AppIcon size={22}/><span className="nav-logo">Life<span>Buddy</span></span>
        </div>
        <div style={{width:80}}/>
      </nav>
      <div className="page-enter" style={{maxWidth:800,margin:"0 auto",padding:"48px 24px"}}>
        <div style={{marginBottom:32}}>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(24px,5vw,36px)",fontWeight:800,marginBottom:8,letterSpacing:"-0.02em",color:"var(--text)"}}>Choose a Skill</h1>
          <p style={{color:"var(--text2)",fontSize:15}}>Pick a simulation to practise. The engine picks up where you left off.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {SKILLS.map(sim => {
            const tier = tierData[sim.key];
            return (
              <div key={sim.key} className="card card-interactive"
                style={{padding:22,position:"relative",overflow:"hidden",border:sim.recommended?"1.5px solid rgba(108,99,255,0.35)":undefined}}
                onClick={() => { setActiveSkill(sim); nav("game"); }}
                onMouseEnter={() => { setHovered(sim.key); if(settings?.audioEnabled) speak(sim.tooltip||sim.name); }}
                onMouseLeave={() => setHovered(null)}>
                {sim.recommended && (
                  <div style={{position:"absolute",top:0,right:0,background:"var(--accent)",color:"#fff",fontSize:11,fontWeight:700,padding:"4px 14px",borderRadius:"0 var(--radius-lg) 0 var(--radius-sm)",letterSpacing:"0.05em"}}>RECOMMENDED</div>
                )}
                <div style={{display:"flex",alignItems:"center",gap:18}}>
                  <Tip label={sim.tooltip}>
                    <div style={{flexShrink:0,transition:"transform 0.2s",transform:hovered===sim.key?"scale(1.18)":"scale(1)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <SkillIcon sim={sim} size={36}/>
                    </div>
                  </Tip>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}}>
                      <h3 style={{fontFamily:"var(--font-display)",fontSize:17,fontWeight:700,color:"var(--text)"}}>{sim.name}</h3>
                      <span className={`badge ${TIER_CFG[tier].cls}`} style={{cursor:"default"}} title={`Currently on ${TIER_CFG[tier].label}`}>{TIER_CFG[tier].emoji} {TIER_CFG[tier].label}</span>
                    </div>
                    <p style={{color:"var(--text2)",fontSize:13,marginBottom:10}}>{sim.desc}</p>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div className="progress-bar" style={{flex:1,height:5}}>
                        <div className="progress-fill" style={{width:`${sim.mastery}%`,background:sim.mastery>70?"var(--green)":sim.mastery>40?"var(--amber)":"var(--accent)"}}/>
                      </div>
                      <span style={{fontSize:12,color:"var(--text3)",whiteSpace:"nowrap"}}>{masteryLabel(sim.mastery)} · {sim.mastery}%</span>
                    </div>
                  </div>
                  <div style={{color:"var(--text3)",fontSize:22,flexShrink:0}}>›</div>
                </div>
                {hovered === sim.key && (
                  <div style={{marginTop:14,background:"var(--bg3)",borderRadius:"var(--radius-sm)",padding:"10px 14px",fontSize:13,color:"var(--text2)",lineHeight:1.5,border:"1px solid var(--border2)"}}>
                    💡 {sim.tooltip}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GAME SCREEN
// ─────────────────────────────────────────────
function GameScreen({ nav, skill, tierData, setSessionResult, settings }) {
  const skillData   = skill || SKILLS[0];
  const SimComp     = SIM_COMPONENTS[skillData.key] || SimTime;
  const TASK_COUNT  = 4;
  const [tasksDone, setTasksDone]   = useState(0);
  const [paused, setPaused]         = useState(false);
  const [showExit, setShowExit]     = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const sessionStart = useRef(Date.now());
  const hintTimer    = useRef(null);
  const currentTier  = tierData?.[skillData.key] || 1;

  useEffect(() => {
    if (settings?.hintAutoShow) {
      hintTimer.current = setTimeout(() => setHintVisible(true), 5000);
    }
    return () => clearTimeout(hintTimer.current);
  }, [tasksDone, settings?.hintAutoShow]);

  useEffect(() => {
    if (settings?.autoReadQuestions && settings?.audioEnabled) speak(`Starting ${skillData.name}. ${TIER_CFG[currentTier].label}.`);
  }, []);

  const handleTaskComplete = (ok) => {
    setTasksDone(t => t+1);
    clearTimeout(hintTimer.current);
    setHintVisible(false);
  };

  const handleGoBack = () => {
    setTasksDone(t => Math.max(0, t - 1));
  };

  const handleSessionEnd = (result) => {
    if (sessionEnded) return;
    setSessionEnded(true);
    const elapsed = Math.round((Date.now() - sessionStart.current) / 1000);
    const mastery = result?.mastery ?? 0.5;
    const passed  = result?.passed ?? false;
    const stars   = mastery >= 0.85 ? 3 : mastery >= 0.5 ? 2 : 1;
    const score   = passed ? 6 : 3;
    const total   = 7;
    setSessionResult({ skill:skillData, tasks:total, score, stars, duration:elapsed });
    setTimeout(() => nav("results"), 600);
  };

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column"}}>
      {/* Top bar hidden — SimulationEngineV2 has its own header */}
      <div style={{display:"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{display:"flex",alignItems:"center"}}><SkillIcon sim={skillData} size={20}/></span>
          <span style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:14,color:"var(--text)"}}>{skillData.name}</span>
        </div>
        <Tip label={`You are playing at ${TIER_CFG[currentTier].label}. ${currentTier===1?"Tasks are simple and straightforward.":currentTier===2?"Tasks are moderately challenging.":"Tasks are complex and real-world."} The engine adjusts this automatically based on your performance.`} placement="below">
          <span className={`badge ${TIER_CFG[currentTier].cls}`} style={{cursor:"help"}}>{TIER_CFG[currentTier].emoji} {TIER_CFG[currentTier].label}</span>
        </Tip>
        <Tip label={`Session progress — ${tasksDone} of ${TASK_COUNT} tasks completed. Green = done, purple = current, grey = upcoming.`} placement="below">
          <div style={{flex:1}}>
            <div className="progress-bar" style={{height:5}}>
              <div className="progress-fill" style={{width:`${(tasksDone/TASK_COUNT)*100}%`}}/>
            </div>
          </div>
        </Tip>
        {settings?.showProgressNumbers && (
          <Tip label={`Task ${tasksDone + 1} of ${TASK_COUNT}`} placement="below">
            <span style={{fontSize:12,color:"var(--text3)"}}>{tasksDone}/{TASK_COUNT}</span>
          </Tip>
        )}
        {settings?.audioEnabled && (
          <Tip label="Read the current task aloud using your device's voice" placement="below">
            <button className="voice-btn" onClick={() => speak(`You are on task ${tasksDone+1} of ${TASK_COUNT} in ${skillData.name}`)}>🔊</button>
          </Tip>
        )}
        <Tip label={hintVisible ? "Hide the hint banner" : "Show a hint — a helpful tip appears at the top of the screen to guide you"} placement="below">
          <button className="btn btn-ghost btn-sm" onClick={() => setHintVisible(h=>!h)}>💡</button>
        </Tip>
        <Tip label={paused ? "Resume the session and continue where you left off" : "Pause the session — take a break, your progress is saved"} placement="below">
          <button className="btn btn-ghost btn-sm" onClick={() => setPaused(p=>!p)}>{paused?"▶":"⏸"}</button>
        </Tip>
        <Tip label="Exit this session — you will be asked to confirm before leaving" placement="below">
          <button className="btn btn-ghost btn-sm" onClick={() => setShowExit(true)}>✕</button>
        </Tip>
      </div>

      {hintVisible && (
        <div style={{background:"rgba(108,99,255,0.12)",border:"1px solid var(--accent)",padding:"10px 20px",textAlign:"center",fontSize:14,color:"var(--accent2)",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          💡 Read the question carefully and think about what you do in real life!
          {settings?.audioEnabled && <button className="voice-btn" onClick={() => speak("Hint: Read the question carefully and think about what you do in real life.")}>🔊</button>}
          <button style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:16,marginLeft:6}} onClick={() => setHintVisible(false)}>✕</button>
        </div>
      )}

      <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",overflow:"auto",alignItems:"stretch"}}>
        <div className="glow-orb" style={{width:400,height:400,background:"rgba(108,99,255,0.07)",top:"5%",left:"50%",transform:"translateX(-50%)"}}/>
        {paused ? (
          <div style={{textAlign:"center",zIndex:1,position:"relative"}}>
            <div style={{fontSize:64,marginBottom:14}}>⏸</div>
            <h2 style={{fontFamily:"var(--font-display)",fontSize:24,fontWeight:700,marginBottom:8,color:"var(--text)"}}>Paused</h2>
            <p style={{color:"var(--text2)",marginBottom:24}}>Take a break. Resume when ready.</p>
            <button className="btn btn-primary" onClick={() => setPaused(false)}>▶ Resume</button>
          </div>
        ) : (
          <div className="page-enter" style={{width:"100%",maxWidth:"100%",position:"relative",zIndex:1}}>
            <div style={{display:"none",gap:8,justifyContent:"center",marginBottom:20}}>
              {[...Array(TASK_COUNT)].map((_,i) => (
                <Tip key={i} label={i < tasksDone ? `Task ${i+1} — completed ✓` : i === tasksDone ? `Task ${i+1} — in progress` : `Task ${i+1} — coming up`}>
                  <div style={{width:28,height:6,borderRadius:3,background:i<tasksDone?"var(--green)":i===tasksDone?"var(--accent)":"var(--surface2)",transition:"background 0.3s",cursor:"default"}}/>
                </Tip>
              ))}
            </div>
            <SimComp tier={currentTier} taskCount={TASK_COUNT} onTaskComplete={handleTaskComplete} onSessionEnd={handleSessionEnd} onGoBack={() => nav("simulations")} settings={settings}/>
          </div>
        )}
      </div>

      {showExit && (
        <div className="modal-backdrop">
          <div className="card" style={{maxWidth:360,width:"100%",padding:32,textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:14}}>🚪</div>
            <h3 style={{fontFamily:"var(--font-display)",fontSize:20,fontWeight:700,marginBottom:8,color:"var(--text)"}}>Exit Session?</h3>
            <p style={{color:"var(--text2)",fontSize:14,marginBottom:24,lineHeight:1.6}}>Your progress in this session won't be saved if you leave.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button className="btn btn-ghost" onClick={() => setShowExit(false)}>Stay</button>
              <button className="btn btn-danger" onClick={() => nav("simulations")}>Exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// RESULTS
// ─────────────────────────────────────────────
function Results({ nav, skill, result }) {
  const skillData = skill || SKILLS[0];
  const res   = result || {tasks:4, score:4, stars:3, duration:320};
  const stars = res.stars || 3;
  const before = skillData.mastery || 72;
  const gain   = stars===3?8:stars===2?4:2;
  const after  = Math.min(100, before + gain);
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 300); }, []);
  const msgs = ["You did a fantastic job! Every session makes you stronger! 💪","Amazing work today! You are building real skills! 🌟","Brilliant effort! You should be really proud! 🎉","Wonderful session! You are getting better every time! 🚀"];
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <div className="glow-orb" style={{width:600,height:600,background:"rgba(34,201,122,0.06)",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/>
      <div className="page-enter" style={{maxWidth:500,width:"100%",textAlign:"center",position:"relative",zIndex:1}}>
        <div style={{fontSize:80,marginBottom:4,animation:"bounceY 0.6s ease"}}>🎉</div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>
          {[0,1,2].map(i => (
            <span key={i} style={{fontSize:44,display:"inline-block",opacity:i<stars?1:0.2,animation:i<stars?`starPop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.15+i*0.12}s both`:"none"}}>⭐</span>
          ))}
        </div>
        <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(28px,6vw,44px)",fontWeight:800,marginBottom:12,letterSpacing:"-0.02em",color:"var(--text)"}}>
          {stars===3?"Amazing Work!":stars===2?"Great Job!":"Good Effort!"}
        </h1>
        <p style={{color:"var(--text2)",fontSize:16,marginBottom:32,lineHeight:1.65}}>{msgs[Math.floor(Math.random()*msgs.length)]}</p>
        <div className="card" style={{padding:28,marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:24}}>
            {[{label:"Tasks Done",value:`${res.score}/${res.tasks}`},{label:"Stars",value:"⭐".repeat(stars)},{label:"Skill",value:`${skillData.icon} ${skillData.name.split(" ")[0]}`}].map(s => (
              <div key={s.label}><div style={{fontFamily:"var(--font-display)",fontSize:18,fontWeight:800,marginBottom:4,color:"var(--text)"}}>{s.value}</div><div style={{fontSize:11,color:"var(--text3)"}}>{s.label}</div></div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:13,color:"var(--text2)"}}>Mastery Progress</span>
            <span style={{fontSize:13,color:"var(--green)",fontWeight:600}}>+{gain}%</span>
          </div>
          <div style={{position:"relative",height:10,background:"var(--bg4)",borderRadius:5,overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,borderRadius:5,background:"var(--text3)",width:`${before}%`}}/>
            <div style={{position:"absolute",inset:0,borderRadius:5,background:"var(--green)",width:show?`${after}%`:`${before}%`,transition:"width 1s ease 0.4s"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
            <span style={{fontSize:11,color:"var(--text3)"}}>Before: {before}%</span>
            <span style={{fontSize:11,color:"var(--green)",fontWeight:600}}>After: {show?after:before}%</span>
          </div>
        </div>
        <div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"14px 18px",marginBottom:28,textAlign:"left"}}>
          <p style={{fontSize:11,color:"var(--text3)",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.06em"}}>📋 Caregiver Note</p>
          <p style={{fontSize:13,color:"var(--text2)",lineHeight:1.5}}>
            Engine assigned {TIER_CFG[skillData.tier||1].label} for next session.{stars===3?" Excellent performance — consider advancing.":" Continuing at current level for consolidation."}
          </p>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn btn-primary btn-lg" onClick={() => nav("game")}>Play Again</button>
          <button className="btn btn-ghost btn-lg" onClick={() => nav("simulations")}>Next Skill →</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PROFILE PAGE
// ─────────────────────────────────────────────
function ProfilePage({ nav, user, setUser, tierData, settings }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ learnerName:user?.learnerName||"", age:user?.age||"", condition:user?.condition||"ASD", caregiverName:user?.caregiverName||"", email:user?.email||"", bio:user?.bio||"" });
  const set  = (k, v) => setForm(f => ({...f, [k]:v}));
  const save = () => { setUser({...user,...form}); setEditing(false); if(settings?.audioEnabled) speak("Profile saved!"); };

  const stats = [
    {label:"Sessions Completed",value:"23",icon:"🎮"},
    {label:"Skills Practised",value:"5",icon:"📚"},
    {label:"Stars Earned",value:"58",icon:"⭐"},
    {label:"Days Active",value:"14",icon:"📅"},
  ];
  const achievements = [
    {icon:"🏆",title:"First Session",desc:"Completed your first simulation",earned:true},
    {icon:"🔥",title:"3-Day Streak",desc:"Practised 3 days in a row",earned:true},
    {icon:"⭐",title:"Star Collector",desc:"Earned 50 stars total",earned:true},
    {icon:"🧠",title:"All Skills Tried",desc:"Tried all 5 skill areas",earned:true},
    {icon:"🎯",title:"Perfect Score",desc:"100% on a full session",earned:false},
    {icon:"🚀",title:"Advanced Tier",desc:"Reached Advanced Tier in any skill",earned:false},
  ];

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",paddingTop:64}}>
      <nav className="nav">
        <button className="btn btn-ghost btn-sm" onClick={() => nav("home")}>← Home</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}><AppIcon size={22}/><span className="nav-logo">Life<span>Buddy</span></span></div>
        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(e=>!e)}>{editing?"✕ Cancel":"✏️ Edit"}</button>
      </nav>
      <div className="page-enter" style={{maxWidth:720,margin:"0 auto",padding:"48px 24px"}}>
        <div className="card" style={{padding:32,marginBottom:20,position:"relative",overflow:"hidden"}}>
          <div className="glow-orb" style={{width:300,height:200,background:"rgba(108,99,255,0.10)",top:-60,right:-60}}/>
          <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
            <Avatar name={editing?form.learnerName:user?.learnerName||"?"} size={80} color="var(--accent)"/>
            <div style={{flex:1,minWidth:180}}>
              {editing ? (
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <div className="input-wrap"><label className="input-label">Learner Name</label><input className="input-field" value={form.learnerName} onChange={e=>set("learnerName",e.target.value)}/></div>
                    <div className="input-wrap"><label className="input-label">Age</label><input className="input-field" type="number" value={form.age} onChange={e=>set("age",e.target.value)}/></div>
                  </div>
                  <div className="input-wrap">
                    <label className="input-label">Condition</label>
                    <select className="input-field" value={form.condition} onChange={e=>set("condition",e.target.value)}>
                      <option>ASD</option><option>Down Syndrome</option><option>Intellectual Disability</option><option>ADHD</option><option>Other</option>
                    </select>
                  </div>
                  <div className="input-wrap"><label className="input-label">Caregiver Name</label><input className="input-field" value={form.caregiverName} onChange={e=>set("caregiverName",e.target.value)}/></div>
                  <div className="input-wrap"><label className="input-label">Email</label><input className="input-field" type="email" value={form.email} onChange={e=>set("email",e.target.value)}/></div>
                  <div className="input-wrap"><label className="input-label">Bio / Notes</label><textarea className="input-field" rows={2} value={form.bio} onChange={e=>set("bio",e.target.value)}/></div>
                  <button className="btn btn-primary" onClick={save}>💾 Save Profile</button>
                </div>
              ) : (
                <>
                  <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(22px,4vw,32px)",fontWeight:800,marginBottom:4,color:"var(--text)",letterSpacing:"-0.01em"}}>{user?.learnerName||"Learner"}</h1>
                  <p style={{color:"var(--text2)",fontSize:14,marginBottom:8}}>Age {user?.age||"—"} · {user?.condition||"—"} · Caregiver: {user?.caregiverName||"—"}</p>
                  {user?.email && <p style={{color:"var(--text3)",fontSize:13,marginBottom:8}}>📧 {user.email}</p>}
                  {user?.bio && <p style={{color:"var(--text2)",fontSize:14,fontStyle:"italic",marginBottom:8}}>"{user.bio}"</p>}
                  <p style={{color:"var(--text3)",fontSize:12}}>📅 Member since {user?.joinDate||"2025"}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="card" style={{padding:24,marginBottom:20}}>
          <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,marginBottom:16,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Current Skill Tiers</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12}}>
            {SKILLS.map(s => (
              <div key={s.key} style={{background:"var(--bg3)",borderRadius:"var(--radius)",padding:"14px 12px",textAlign:"center",border:"1px solid var(--border)",cursor:"default"}} title={s.tooltip}>
                <div style={{fontSize:26,marginBottom:6}}>{s.icon}</div>
                <div style={{fontSize:11,color:"var(--text3)",marginBottom:6}}>{s.name.split(" ")[0]}</div>
                <span className={`badge ${TIER_CFG[tierData[s.key]].cls}`} style={{fontSize:11}}>{TIER_CFG[tierData[s.key]].label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:14,marginBottom:20}}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{padding:20,textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
              <div style={{fontFamily:"var(--font-display)",fontSize:26,fontWeight:800,color:"var(--accent2)",marginBottom:4}}>{s.value}</div>
              <div style={{fontSize:11,color:"var(--text3)"}}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{padding:24}}>
          <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,marginBottom:16,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Achievements</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
            {achievements.map((a, i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"var(--bg3)",borderRadius:"var(--radius)",border:`1px solid ${a.earned?"var(--accent)":"var(--border2)"}`,opacity:a.earned?1:0.45}}
                title={a.earned?"Achievement unlocked! "+a.desc:"Keep playing to unlock: "+a.desc}>
                <div style={{fontSize:28,filter:a.earned?"none":"grayscale(100%)"}}>{a.icon}</div>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--text)"}}>{a.title}</div>
                  <div style={{fontSize:12,color:"var(--text3)"}}>{a.desc}</div>
                </div>
                {a.earned && <div style={{marginLeft:"auto",color:"var(--green)",fontSize:18}}>✓</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
function Dashboard({ nav, user, tierData, setTierData, settings, ThemeToggle }) {
  const [tab, setTab]                     = useState("overview");
  const [expandedSession, setExpandedSession] = useState(null);
  const [overrideSkill, setOverrideSkill] = useState(null);
  const [feedbackText, setFeedbackText]   = useState("");
  const [feedbackSent, setFeedbackSent]   = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const learner   = user?.learnerName || "Alex";
  const caregiver = user?.caregiverName || "Caregiver";
  const skillKeys   = ["finance","time","routine","sorting"];
  const skillNames  = {time:"Time Mgmt",sorting:"Sorting",routine:"Daily Routine",finance:"Finance",hygiene:"Hygiene"};
  const skillIcons  = {finance:"💰",time:"⏰",routine:"📋",sorting:"📊"};
  const weekLabels  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const masteryHistory = {time:[65,68,70,68,75,72,80],sorting:[40,44,48,50,52,55,57],routine:[78,80,82,85,86,88,90],finance:[20,22,25,28,30,33,35],hygiene:[55,57,59,60,60,61,63]};
  const frustHistory   = [42,38,55,30,28,22,18];
  const completionData = [3,4,2,5,4,3,4];
  const tierHistory    = [{date:"Apr 20",skill:"Hygiene",from:1,to:2},{date:"May 01",skill:"Time",from:1,to:1},{date:"May 10",skill:"Finance",from:2,to:2}];
  const sessions = [
    {id:1,date:"May 13",skill:"Time Management",duration:"18 min",tier:1,tasks:4,score:4,breakdown:[{task:"Clock reading",result:"✅",time:"4s"},{task:"Schedule order",result:"✅",time:"6s"},{task:"Duration",result:"✅",time:"5s"},{task:"Alarm",result:"✅",time:"3s"}]},
    {id:2,date:"May 12",skill:"Finance",duration:"22 min",tier:2,tasks:5,score:3,breakdown:[{task:"Coin recognition",result:"✅",time:"5s"},{task:"Making change",result:"❌",time:"9s"},{task:"Price compare",result:"✅",time:"4s"},{task:"Total count",result:"❌",time:"8s"},{task:"Budget choice",result:"✅",time:"6s"}]},
    {id:3,date:"May 11",skill:"Hygiene",duration:"15 min",tier:1,tasks:4,score:4,breakdown:[{task:"Hand washing",result:"✅",time:"3s"},{task:"Brush teeth",result:"✅",time:"4s"},{task:"Shower routine",result:"✅",time:"5s"},{task:"Nail care",result:"✅",time:"4s"}]},
    {id:4,date:"May 10",skill:"Sorting",duration:"20 min",tier:1,tasks:4,score:3,breakdown:[]},
    {id:5,date:"May 09",skill:"Daily Routine",duration:"17 min",tier:1,tasks:4,score:4,breakdown:[]},
  ];
  const adaptLog = [
    {date:"May 13",skill:"Time Management",trigger:"BKT: P(L) > 0.85",from:1,to:1,note:"Maintained at Easy Tier — mastery threshold met, consolidation phase active."},
    {date:"May 12",skill:"Finance",trigger:"Frustration index > 0.60",from:2,to:2,note:"Held at Intermediate Tier — consecutive errors detected, pacing reduced."},
    {date:"May 11",skill:"Hygiene",trigger:"BKT: P(L) > 0.90 × 3 sessions",from:1,to:2,note:"Advanced to Intermediate Tier — strong performance across 3 consecutive sessions."},
    {date:"May 09",skill:"Sorting",trigger:"BKT: P(L) < 0.40",from:2,to:1,note:"Stepped down to Easy Tier — learner showed confusion on multi-step sorting tasks."},
  ];
  const TABS       = ["overview","progress","sessions","adaptations","controls"];
  const TAB_LABELS = {overview:"Overview",progress:"Progress",sessions:"Sessions",adaptations:"Adaptations",controls:"Controls"};

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",paddingTop:64}}>
      <nav className="nav">
        <button className="btn btn-ghost btn-sm" onClick={() => nav("home")}>← Home</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}><AppIcon size={22}/><span className="nav-logo">Life<span>Buddy</span></span></div>
        <div className="hide-mobile" style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{color:"var(--text3)",fontSize:12}}>{caregiver}</span>
          <ThemeToggle/>
          <Tip label="View learner profile" placement="below">
            <Avatar name={user?.learnerName||"?"} size={32} onClick={() => nav("profile")} color="var(--accent)"/>
          </Tip>
        </div>
        <button className="nav-mobile-menu btn btn-ghost btn-sm" onClick={() => setMenuOpen(o=>!o)}>☰</button>
      </nav>
      {menuOpen && <div style={{position:"fixed",top:64,left:0,right:0,background:"var(--bg2)",borderBottom:"1px solid var(--border)",padding:16,zIndex:99}}><ThemeToggle/></div>}

      <div className="page-enter" style={{maxWidth:960,margin:"0 auto",padding:"36px 24px"}}>
        <div style={{marginBottom:24,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <Avatar name={user?.learnerName||"?"} size={48} color="var(--accent)" onClick={() => nav("profile")}/>
          <div>
            <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(20px,4vw,30px)",fontWeight:800,marginBottom:3,letterSpacing:"-0.02em",color:"var(--text)"}}>{learner}'s Progress</h1>
            <p style={{color:"var(--text3)",fontSize:13}}>Last updated: May 13, 2025 · Age {user?.age||14} · {user?.condition||"ASD"}</p>
          </div>
        </div>

        <div className="tab-bar" style={{marginBottom:24}}>
          {TABS.map(t => <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>{TAB_LABELS[t]}</button>)}
        </div>

        {tab === "overview" && (
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div className="card">
              <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,marginBottom:16,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Current Tiers — All Skills</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
                {skillKeys.map(k => (
                  <div key={k} style={{background:"var(--bg3)",borderRadius:"var(--radius)",padding:"16px 12px",textAlign:"center",border:"1px solid var(--border)",cursor:"default"}} title={`${skillNames[k]}: ${TIER_CFG[tierData[k]].label}`}>
                    <div style={{fontSize:28,marginBottom:8}}>{skillIcons[k]}</div>
                    <div style={{fontSize:11,color:"var(--text3)",marginBottom:6}}>{skillNames[k]}</div>
                    <span className={`badge ${TIER_CFG[tierData[k]].cls}`}>{TIER_CFG[tierData[k]].emoji} {TIER_CFG[tierData[k]].short}</span>
                    <div style={{fontSize:10,color:"var(--text3)",marginTop:4}}>{TIER_CFG[tierData[k]].name}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Frustration Index — 7 Days</h3>
                <span className="badge badge-green">↓ Trending Down</span>
              </div>
              <LineChart data={frustHistory} labels={weekLabels} color="var(--amber)"/>
              <p style={{fontSize:12,color:"var(--text3)",marginTop:8}}>Lower is better — 0 = no frustration detected.</p>
            </div>
          </div>
        )}

        {tab === "progress" && (
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {skillKeys.map(k => (
              <div key={k} className="card">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <h3 style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,color:"var(--text2)"}}>{skillIcons[k]} {skillNames[k]} — Mastery</h3>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:20,fontWeight:800,color:masteryHistory[k][6]>70?"var(--green)":masteryHistory[k][6]>40?"var(--amber)":"var(--accent2)"}}>{masteryHistory[k][6]}%</span>
                    <span className={`badge ${TIER_CFG[tierData[k]].cls}`}>{TIER_CFG[tierData[k]].short}</span>
                  </div>
                </div>
                <LineChart data={masteryHistory[k]} labels={weekLabels} color={masteryHistory[k][6]>70?"var(--green)":masteryHistory[k][6]>40?"var(--amber)":"var(--accent)"}/>
              </div>
            ))}
            <div className="card">
              <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,marginBottom:16,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Sessions Completed Per Day</h3>
              <div style={{display:"flex",gap:8,alignItems:"flex-end",padding:"0 4px"}}>
                {completionData.map((v,i) => (
                  <div key={i} className="chart-col">
                    <div style={{fontSize:11,color:"var(--accent2)",fontWeight:600,marginBottom:2}}>{v}</div>
                    <div className="chart-bar-wrap"><div className="chart-bar-inner" style={{height:`${(v/Math.max(...completionData))*100}%`,background:"var(--accent)",opacity:0.8}}/></div>
                    <div className="chart-label">{weekLabels[i]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,marginBottom:16,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Tier Progression History</h3>
              {tierHistory.map((t,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<tierHistory.length-1?"1px solid var(--border)":"none"}}>
                  <span style={{fontSize:12,color:"var(--text3)",minWidth:58}}>{t.date}</span>
                  <span style={{flex:1,fontSize:14,color:"var(--text)"}}>{t.skill}</span>
                  <span className={`badge ${TIER_CFG[t.from].cls}`}>{TIER_CFG[t.from].short}</span>
                  <span style={{color:"var(--text3)"}}>→</span>
                  <span className={`badge ${TIER_CFG[t.to].cls}`}>{TIER_CFG[t.to].short}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "sessions" && (
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="card" style={{padding:0,overflow:"hidden"}}>
              <div style={{padding:"16px 24px",borderBottom:"1px solid var(--border)"}}>
                <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Session History</h3>
              </div>
              {sessions.map((s, i) => (
                <div key={s.id}>
                  <div style={{padding:"14px 24px",display:"flex",alignItems:"center",gap:14,borderBottom:"1px solid var(--border)",cursor:"pointer",transition:"background 0.15s"}}
                    onClick={() => setExpandedSession(expandedSession===s.id?null:s.id)}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{fontSize:20}}>{skillIcons[s.skill.toLowerCase().split(" ")[0]]||"📋"}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:500,fontSize:14,marginBottom:2,color:"var(--text)"}}>{s.skill}</div>
                      <div style={{fontSize:12,color:"var(--text3)"}}>{s.date} · {s.duration} · {s.tasks} tasks · {s.score}/{s.tasks} correct</div>
                    </div>
                    <span className={`badge ${TIER_CFG[s.tier].cls}`}>{TIER_CFG[s.tier].short}</span>
                    <span style={{color:"var(--text3)",fontSize:16,transition:"transform 0.2s",display:"inline-block",transform:expandedSession===s.id?"rotate(90deg)":"none"}}>›</span>
                  </div>
                  {expandedSession===s.id && s.breakdown.length>0 && (
                    <div style={{background:"var(--bg2)",borderBottom:"1px solid var(--border)"}}>
                      {s.breakdown.map((b,j) => (
                        <div key={j} style={{padding:"10px 24px",display:"flex",alignItems:"center",gap:14,borderBottom:j<s.breakdown.length-1?"1px solid var(--border)":"none"}}>
                          <span style={{fontSize:11,color:"var(--text3)",minWidth:18}}>#{j+1}</span>
                          <span style={{flex:1,fontSize:13,color:"var(--text)"}}>{b.task}</span>
                          <span style={{fontSize:16}}>{b.result}</span>
                          <span style={{fontSize:11,color:"var(--text3)"}}>{b.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "adaptations" && (
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {adaptLog.map((a,i) => (
              <div key={i} className="card" style={{padding:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,gap:12,flexWrap:"wrap"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:14,marginBottom:6,color:"var(--text)"}}>{a.skill} — {a.date}</div>
                    <code style={{fontSize:11,color:"var(--accent2)",background:"var(--bg3)",padding:"3px 8px",borderRadius:4,display:"inline-block"}}>{a.trigger}</code>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span className={`badge ${TIER_CFG[a.from].cls}`}>{TIER_CFG[a.from].label}</span>
                    <span style={{color:"var(--text3)"}}>→</span>
                    <span className={`badge ${TIER_CFG[a.to].cls}`}>{TIER_CFG[a.to].label}</span>
                  </div>
                </div>
                <p style={{fontSize:13,color:"var(--text2)",lineHeight:1.55,marginBottom:14}}>{a.note}</p>
                <button className="btn btn-ghost btn-sm" onClick={() => setOverrideSkill(a.skill.toLowerCase().split(" ")[0])}>✏️ Override Tier</button>
              </div>
            ))}
          </div>
        )}

        {tab === "controls" && (
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div className="card">
              <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,marginBottom:6,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Manual Tier Override</h3>
              <p style={{fontSize:12,color:"var(--text3)",marginBottom:14,lineHeight:1.5}}>Set each skill to Easy, Intermediate, or Advanced. The learner will immediately see tasks matching the new tier on their next session.</p>
              <div style={{background:"rgba(245,158,11,0.10)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:"var(--radius-sm)",padding:"10px 14px",marginBottom:20,fontSize:13,color:"var(--amber)"}}>
                ⚠️ This overrides the adaptive engine. Use it when you feel the learner is ready to move up — or needs to revisit easier content.
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {skillKeys.map((k, ki) => (
                  <div key={k} style={{padding:"16px 0",borderBottom:ki<skillKeys.length-1?"1px solid var(--border)":"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,flexWrap:"wrap"}}>
                      <div style={{fontSize:26}}>{skillIcons[k]}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:2}}>
                          {k==="time"?"Time Management":k==="sorting"?"Object Sorting":k==="routine"?"Daily Routine":k==="finance"?"Financial Transactions":"Personal Hygiene"}
                        </div>
                        <div style={{fontSize:12,color:"var(--text3)"}}>Currently: <span style={{color:({1:"var(--green)",2:"var(--amber)",3:"var(--purple)"})[tierData[k]],fontWeight:600}}>{TIER_CFG[tierData[k]].emoji} {TIER_CFG[tierData[k]].label}</span></div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                      {[1,2,3].map(t => {
                        const active = tierData[k] === t;
                        const bgMap  = {1:"var(--green-dim)",2:"var(--amber-dim)",3:"var(--purple-dim)"};
                        const colMap = {1:"var(--green)",2:"var(--amber)",3:"var(--purple)"};
                        return (
                          <button key={t} onClick={() => setTierData(d => ({...d,[k]:t}))}
                            style={{width:"100%",padding:"10px 8px",borderRadius:"var(--radius-sm)",fontSize:12,fontWeight:600,border:`1.5px solid ${active?colMap[t]:"var(--border2)"}`,cursor:"pointer",fontFamily:"var(--font-body)",transition:"all 0.15s",
                              background:active?bgMap[t]:"transparent",color:active?colMap[t]:"var(--text3)",textAlign:"center"}}>
                            {TIER_CFG[t].emoji}<br/><span style={{fontSize:11}}>{TIER_CFG[t].label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,marginBottom:16,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Session Feedback</h3>
              {feedbackSent ? <div style={{textAlign:"center",padding:"20px 0",color:"var(--green)",fontSize:16}}>✅ Feedback submitted. Thank you!</div> : (
                <>
                  <div className="input-wrap" style={{marginBottom:14}}>
                    <label className="input-label">Your Observations</label>
                    <textarea className="input-field" value={feedbackText} onChange={e=>setFeedbackText(e.target.value)}/>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => { if(feedbackText.trim()) setFeedbackSent(true); }}>Submit Feedback</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {overrideSkill && (
        <div className="modal-backdrop">
          <div className="card" style={{maxWidth:480,width:"100%",padding:0,overflow:"hidden",maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"20px 24px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:28}}>{({finance:"💰",time:"⏰",routine:"📋",sorting:"📊"})[overrideSkill]||"📋"}</div>
                <div>
                  <h3 style={{fontFamily:"var(--font-display)",fontSize:18,fontWeight:700,color:"var(--text)",marginBottom:2}}>Override Tier</h3>
                  <p style={{color:"var(--text3)",fontSize:12,textTransform:"capitalize"}}>{overrideSkill} skill</p>
                </div>
              </div>
            </div>
            <div style={{padding:"20px 24px",overflowY:"auto",flex:1}}>
              <div style={{background:"var(--amber-dim)",border:"1px solid var(--amber)",borderRadius:"var(--radius-sm)",padding:"10px 14px",marginBottom:20,fontSize:13,color:"var(--amber)",lineHeight:1.5}}>
                ⚠️ The learner will see {overrideSkill} tasks at the tier you select from their very next session.
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                {[1,2,3].map(t => {
                  const active = tierData[overrideSkill] === t;
                  const bgMap  = {1:"var(--green-dim)",2:"var(--amber-dim)",3:"var(--purple-dim)"};
                  const colMap = {1:"var(--green)",2:"var(--amber)",3:"var(--purple)"};
                  return (
                    <button key={t} onClick={() => setTierData(d => ({...d,[overrideSkill]:t}))}
                      style={{width:"100%",padding:"14px 16px",borderRadius:"var(--radius)",fontSize:14,border:`2px solid ${active?colMap[t]:"var(--border2)"}`,cursor:"pointer",fontFamily:"var(--font-body)",transition:"all 0.15s",
                        background:active?bgMap[t]:"var(--bg3)",textAlign:"left",display:"flex",gap:14,alignItems:"flex-start"}}>
                      <div style={{fontSize:28,flexShrink:0,marginTop:2}}>{TIER_CFG[t].emoji}</div>
                      <div><div style={{fontWeight:700,color:active?colMap[t]:"var(--text)",marginBottom:4}}>{TIER_CFG[t].label}</div></div>
                      {active && <div style={{marginLeft:"auto",color:colMap[t],fontSize:20,flexShrink:0}}>✓</div>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{padding:"16px 24px",borderTop:"1px solid var(--border)",display:"flex",gap:10,flexShrink:0}}>
              <button className="btn btn-ghost" style={{flex:1}} onClick={() => setOverrideSkill(null)}>Cancel</button>
              <button className="btn btn-primary" style={{flex:1}} onClick={() => {
                setOverrideSkill(null);
                if(settings?.audioEnabled) speak(`${overrideSkill} has been set to ${TIER_CFG[tierData[overrideSkill]].label}.`);
              }}>✅ Confirm Override</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SETTINGS PAGE — with inline SettingHint (? icon)
// ─────────────────────────────────────────────
function SettingsPage({ nav, settings, updateSetting, user }) {
  const [tab, setTab]   = useState("display");
  const [saved, setSaved] = useState(false);
  const TABS       = ["display","text","contrast","layout","learner","preview"];
  const TAB_LABELS = {display:"🎨 Display",text:"🔤 Text",contrast:"🔆 Contrast",layout:"📐 Layout",learner:"♿ Learner Aids",preview:"👁️ Preview"};
  const save  = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); if(settings?.audioEnabled) speak("Settings saved!"); };
  const reset = () => Object.keys(SETTINGS_DEFAULT).forEach(k => updateSetting(k, SETTINGS_DEFAULT[k]));

  // Row component — label + full description shown below + ? icon for quick tooltip
  const Row = ({label, hint, children}) => (
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:20,padding:"18px 0",borderBottom:"1px solid var(--border)"}}>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom: hint ? 5 : 0}}>
          <span style={{fontSize:14,fontWeight:600,color:"var(--text)"}}>{label}</span>
          {hint && <SettingHint text={hint}/>}
        </div>
        {hint && <div style={{fontSize:12.5,color:"var(--text3)",lineHeight:1.6,maxWidth:420}}>{hint}</div>}
      </div>
      <div style={{flexShrink:0,display:"flex",alignItems:"center",paddingTop:2}}>{children}</div>
    </div>
  );

  const Toggle = ({k}) => {
    const on = settings[k];
    return (
      <button onClick={() => updateSetting(k, !on)} style={{width:50,height:28,borderRadius:14,border:"none",cursor:"pointer",background:on?"var(--accent)":"var(--bg4)",position:"relative",transition:"background 0.2s"}}>
        <div style={{position:"absolute",top:4,left:on?26:4,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
      </button>
    );
  };

  const Chips = ({k, opts}) => (
    <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
      {opts.map(o => (
        <button key={o.v} onClick={() => updateSetting(k, o.v)} style={{padding:"6px 13px",borderRadius:100,fontSize:12,fontWeight:600,border:"none",cursor:"pointer",background:settings[k]===o.v?"var(--accent)":"var(--surface2)",color:settings[k]===o.v?"#fff":"var(--text2)",transition:"all 0.15s"}}>{o.l}</button>
      ))}
    </div>
  );

  const Dot = ({color, val, k}) => (
    <button onClick={() => updateSetting(k, val)} style={{width:32,height:32,borderRadius:"50%",background:color,border:"none",cursor:"pointer",boxShadow:settings[k]===val?`0 0 0 3px var(--bg),0 0 0 5px ${color}`:"none",transform:settings[k]===val?"scale(1.15)":"scale(1)",transition:"all 0.15s"}}/>
  );

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",paddingTop:64}}>
      <nav className="nav">
        <button className="btn btn-ghost btn-sm" onClick={() => nav(user?"home":"landing")}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}><AppIcon size={22}/><span className="nav-logo">Life<span>Buddy</span></span></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {saved ? <span style={{color:"var(--green)",fontSize:13,fontWeight:600}}>✅ Saved!</span> : <button className="btn btn-primary btn-sm" onClick={save}>Save</button>}
          <button className="btn btn-ghost btn-sm" onClick={reset} title="Reset all settings to defaults">↺</button>
        </div>
      </nav>
      <div className="page-enter" style={{maxWidth:860,margin:"0 auto",padding:"36px 24px"}}>
        <div style={{marginBottom:28}}>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(20px,4vw,30px)",fontWeight:800,marginBottom:6,letterSpacing:"-0.02em",color:"var(--text)"}}>Personalise LifeBuddy</h1>
          <p style={{color:"var(--text3)",fontSize:13,lineHeight:1.6}}>All changes apply instantly. The public landing page is not affected.</p>
        </div>
        <div className="tab-bar" style={{marginBottom:28}}>
          {TABS.map(t => <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>{TAB_LABELS[t]}</button>)}
        </div>

        {tab === "display" && (
          <div className="card" style={{padding:"0 24px"}}>
            <Row label="Dark Mode" hint="Dark backgrounds reduce eye strain in low-light and can be calming for light-sensitive learners."><Toggle k="darkMode"/></Row>
            <Row label="Colour Theme" hint="Changes the accent colour on buttons, highlights, and interactive elements across the app.">
              <div style={{display:"flex",gap:10}}>{[["purple","#6c63ff"],["blue","#3b82f6"],["green","#10b981"],["orange","#f97316"],["pink","#ec4899"],["yellow","#eab308"]].map(([v,c]) => <Dot key={v} color={c} val={v} k="colorTheme"/>)}</div>
            </Row>
            <Row label="Colour-Blind Mode" hint="Applies a visual filter for colour vision differences. Greyscale removes all colour.">
              <Chips k="colourBlind" opts={[{v:"none",l:"None"},{v:"deuteranopia",l:"Deuteranopia"},{v:"protanopia",l:"Protanopia"},{v:"tritanopia",l:"Tritanopia"},{v:"greyscale",l:"Greyscale"}]}/>
            </Row>
            <Row label="Saturation" hint="Muted reduces intensity for sensory sensitivity. Vivid increases vibrancy for visual engagement.">
              <Chips k="saturation" opts={[{v:"muted",l:"Muted"},{v:"normal",l:"Normal"},{v:"vivid",l:"Vivid"}]}/>
            </Row>
            <Row label="Reduce Motion" hint="Turns off all animations. Essential for vestibular disorders and motion sensitivity."><Toggle k="reduceMotion"/></Row>
            <Row label="Reduce Visual Clutter" hint="Hides glow effects and decorative backgrounds — only essential UI is shown."><Toggle k="reduceClutter"/></Row>
          </div>
        )}

        {tab === "text" && (
          <div className="card" style={{padding:"0 24px"}}>
            <Row label="Font Style" hint="Dyslexic-friendly uses weighted letterforms to reduce character reversal. Rounded is friendly and easy to scan.">
              <Chips k="fontStyle" opts={[{v:"default",l:"Default"},{v:"dyslexic",l:"Dyslexic-Friendly"},{v:"rounded",l:"Rounded"},{v:"mono",l:"Mono"},{v:"serif",l:"Serif"}]}/>
            </Row>
            <Row label="Font Size" hint="Larger text helps learners with visual processing difficulties. XXL suits early readers.">
              <Chips k="fontSize" opts={[{v:"sm",l:"S"},{v:"md",l:"M"},{v:"lg",l:"L"},{v:"xl",l:"XL"},{v:"xxl",l:"XXL"}]}/>
            </Row>
            <Row label="Font Weight" hint="Bold text has stronger stroke contrast and stands out more clearly.">
              <Chips k="fontWeight" opts={[{v:"normal",l:"Normal"},{v:"medium",l:"Medium"},{v:"bold",l:"Bold"}]}/>
            </Row>
            <Row label="Line Spacing" hint="More space between lines reduces crowding — especially helpful for ADHD and dyslexia.">
              <Chips k="lineSpacing" opts={[{v:"compact",l:"Compact"},{v:"normal",l:"Normal"},{v:"relaxed",l:"Relaxed"},{v:"loose",l:"Loose"}]}/>
            </Row>
            <Row label="Letter Spacing" hint="Wider letter spacing reduces visual crowding. Helps with dyslexia and processing difficulties.">
              <Chips k="letterSpacing" opts={[{v:"tight",l:"Tight"},{v:"normal",l:"Normal"},{v:"wide",l:"Wide"},{v:"wider",l:"Wider"}]}/>
            </Row>
            <div style={{padding:"20px 0"}}>
              <div style={{background:"var(--bg3)",borderRadius:"var(--radius)",padding:20,border:"1px solid var(--border2)"}}>
                <p style={{marginBottom:10}}>This is how body text looks with your current settings. It should feel comfortable to read without effort.</p>
                <p style={{fontSize:"0.85em",color:"var(--text3)"}}>Smaller supporting text — used for hints, labels, and progress indicators.</p>
              </div>
            </div>
          </div>
        )}

        {tab === "contrast" && (
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div className="card" style={{padding:"0 24px"}}>
              <Row label="Contrast Mode" hint="High sharpens borders and increases text-background difference. Ultra uses pure black/white.">
                <Chips k="contrastMode" opts={[{v:"normal",l:"Normal"},{v:"high",l:"High"},{v:"ultra",l:"Ultra"}]}/>
              </Row>
            </div>
            <div className="card">
              <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,marginBottom:16,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Live Contrast Preview</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
                {[{bg:"var(--bg)",fg:"var(--text)",label:"Page Background"},{bg:"var(--surface)",fg:"var(--text)",label:"Card Surface"},{bg:"var(--accent)",fg:"#fff",label:"Primary Button"},{bg:"var(--green)",fg:"#fff",label:"Correct Answer"},{bg:"var(--red)",fg:"#fff",label:"Wrong Answer"},{bg:"var(--amber)",fg:"#000",label:"Warning / Tier 2"}].map(s => (
                  <div key={s.label} style={{background:s.bg,borderRadius:"var(--radius)",padding:"14px 12px",border:"1px solid var(--border2)"}}>
                    <div style={{color:s.fg,fontSize:14,fontWeight:700,marginBottom:3}}>Sample Text</div>
                    <div style={{color:s.fg,fontSize:11,opacity:0.8}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "layout" && (
          <div className="card" style={{padding:"0 24px"}}>
            <Row label="Border Radius" hint="Sharp corners look clinical. Rounded is friendlier. Pill gives a modern, bubbly feel.">
              <Chips k="borderRadius" opts={[{v:"sharp",l:"Sharp □"},{v:"rounded",l:"Rounded ▢"},{v:"pill",l:"Pill ○"}]}/>
            </Row>
            <Row label="Layout Density" hint="Spacious adds padding inside cards and between elements — helpful for touch screens and motor difficulties.">
              <Chips k="density" opts={[{v:"compact",l:"Compact"},{v:"normal",l:"Normal"},{v:"spacious",l:"Spacious"}]}/>
            </Row>
            <Row label="Button Size" hint="Larger buttons are easier to tap — essential for motor difficulties or touch screen use.">
              <Chips k="buttonSize" opts={[{v:"small",l:"S"},{v:"normal",l:"M"},{v:"large",l:"L"},{v:"xl",l:"XL"}]}/>
            </Row>
            <div style={{padding:"20px 0"}}>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-ghost">Secondary</button>
                <button className="btn btn-outline">Outline</button>
              </div>
            </div>
          </div>
        )}

        {tab === "learner" && (
          <div>
            <div style={{background:"rgba(108,99,255,0.09)",border:"1px solid rgba(108,99,255,0.22)",borderRadius:"var(--radius)",padding:"14px 18px",marginBottom:20,fontSize:13,color:"var(--accent2)",lineHeight:1.55}}>
              ♿ These settings support learners with <strong>ASD, Down Syndrome, ADHD, Intellectual Disability, dyslexia, motor difficulties,</strong> and <strong>visual impairments</strong>. Adjust to match each learner's needs.
            </div>
            <div className="card" style={{padding:"0 24px"}}>
              <Row label="Audio Instructions" hint="Enables the 🔊 speaker button on game, assessment, and simulation screens."><Toggle k="audioEnabled"/></Row>
              <Row label="Auto-Read Questions" hint="Automatically speaks each question aloud when it appears — no button press needed. Ideal for early or non-readers."><Toggle k="autoReadQuestions"/></Row>
              <Row label="Auto-Show Hints" hint="Shows a hint bubble automatically after 5 seconds of inactivity. Reduces frustration before it builds."><Toggle k="hintAutoShow"/></Row>
              <Row label="Large Touch Targets" hint="Expands all interactive items to 56×56px minimum. Essential for motor difficulties."><Toggle k="largeTargets"/></Row>
              <Row label="Focus Highlight Ring" hint="Bright ring around focused elements — helps keyboard, switch, or eye-gaze device users."><Toggle k="focusHighlight"/></Row>
              <Row label="Reduce Visual Clutter" hint="Removes all decorative backgrounds so only task content is visible."><Toggle k="reduceClutter"/></Row>
              <Row label="Show Progress Numbers" hint="Displays '3/4 tasks done' alongside dots. Some learners find explicit numbers more motivating."><Toggle k="showProgressNumbers"/></Row>
            </div>
          </div>
        )}

        {tab === "preview" && (
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <div style={{background:"rgba(34,201,122,0.09)",border:"1px solid rgba(34,201,122,0.25)",borderRadius:"var(--radius)",padding:"12px 18px",fontSize:13,color:"var(--green)"}}>
              ✅ All changes reflect live in the app. The landing page is not affected.
            </div>
            <div className="card">
              <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,marginBottom:16,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Simulation Preview</h3>
              <div style={{background:"var(--bg3)",borderRadius:"var(--radius)",padding:24,border:"1px solid var(--border2)"}}>
                <p style={{textAlign:"center",fontSize:60,marginBottom:12}}>⏰</p>
                <p style={{textAlign:"center",fontWeight:500,marginBottom:20}}>What time does this clock show?</p>
                {["🕒  3:00","🕓  4:00","🕑  2:00"].map((opt,i) => (
                  <div key={i} className="game-option" style={{marginBottom:8,background:i===0?"var(--green-dim)":"var(--bg3)",borderColor:i===0?"var(--green)":"var(--border2)"}}>{opt}</div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,marginBottom:14,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Hygiene Icons Preview</h3>
              <div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"center",padding:"12px 0"}}>
                {["Toothbrush","Toothpaste","Soap","Shower","Water","Towel"].map(icon => (
                  <div key={icon} style={{textAlign:"center"}}>
                    <RealisticIcon label={icon} size={40}/>
                    <div style={{fontSize:11,color:"var(--text3)",marginTop:6}}>{icon}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,marginBottom:14,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Controls</h3>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
                <button className="btn btn-primary">Play Now</button>
                <button className="btn btn-ghost">Skip →</button>
                <span className="badge badge-green">🟢 Easy Tier</span>
                <span className="badge badge-amber">🟡 Intermediate Tier</span>
                <span className="badge badge-purple">🟣 Advanced Tier</span>
              </div>
            </div>
            <div className="card">
              <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,marginBottom:14,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Active Settings Summary</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
                {[["Mode",settings.darkMode?"🌙 Dark":"☀️ Light"],["Theme",`🎨 ${settings.colorTheme}`],["Font",`🔤 ${settings.fontStyle}`],["Size",`📏 ${settings.fontSize.toUpperCase()}`],["Contrast",`🔆 ${settings.contrastMode}`],["Motion",settings.reduceMotion?"⏸ Reduced":"▶️ Normal"],["Audio",settings.audioEnabled?"🔊 On":"🔇 Off"],["Auto-Read",settings.autoReadQuestions?"✅ On":"❌ Off"],["Large Targets",settings.largeTargets?"✅ On":"❌ Off"]].map(([k,v]) => (
                  <div key={k} style={{background:"var(--bg3)",borderRadius:"var(--radius-sm)",padding:"10px 14px",border:"1px solid var(--border)"}}>
                    <div style={{fontSize:10,color:"var(--text3)",marginBottom:2,textTransform:"uppercase",letterSpacing:"0.05em"}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{marginTop:32,paddingTop:24,borderTop:"1px solid var(--border)",display:"flex",gap:12,justifyContent:"flex-end"}}>
          <button className="btn btn-ghost" onClick={reset}>↺ Reset to Defaults</button>
          <button className="btn btn-primary" onClick={save}>{saved?"✅ Saved!":"💾 Save Settings"}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PLANNER PAGE — Daily schedules, weekly routines, notifications
// ─────────────────────────────────────────────
function PlannerPage({ nav, user, settings }) {
  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const SHORT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const [activeDay, setActiveDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [schedules, setSchedules] = useState(() => {
    try { const s = localStorage.getItem("lb_planner"); return s ? JSON.parse(s) : DAYS.reduce((a,d) => ({...a,[d]:[]}), {}); } catch { return DAYS.reduce((a,d) => ({...a,[d]:[]}), {}); }
  });
  const [notifications, setNotifications] = useState(() => {
    try { const n = localStorage.getItem("lb_notifs"); return n ? JSON.parse(n) : []; } catch { return []; }
  });
  const [addingTask, setAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({title:"",time:"08:00",icon:"⭐",color:"accent",reminder:false});
  const [addingNotif, setAddingNotif] = useState(false);
  const [newNotif, setNewNotif] = useState({title:"",time:"09:00",repeat:"daily",active:true});
  const [notifSaved, setNotifSaved] = useState(false);

  const TASK_ICONS = ["⭐","🎮","📚","🪥","⏰","🍳","🧹","🏃","💊","🧘","🎨","🎵","🛁","👕","🥗","💰","📋","🌳","🐾","📞"];
  const TASK_COLORS = [
    {key:"accent",label:"Purple",bg:"rgba(108,99,255,0.15)",border:"var(--accent)",text:"var(--accent2)"},
    {key:"green", label:"Green", bg:"var(--green-dim)",       border:"var(--green)", text:"var(--green)"},
    {key:"amber", label:"Amber", bg:"var(--amber-dim)",       border:"var(--amber)", text:"var(--amber)"},
    {key:"purple",label:"Violet",bg:"var(--purple-dim)",      border:"var(--purple)",text:"var(--purple)"},
    {key:"red",   label:"Red",   bg:"var(--red-dim)",         border:"var(--red)",   text:"var(--red)"},
  ];

  const save = (updated) => {
    setSchedules(updated);
    try { localStorage.setItem("lb_planner", JSON.stringify(updated)); } catch {}
  };

  const saveNotifs = (updated) => {
    setNotifications(updated);
    try { localStorage.setItem("lb_notifs", JSON.stringify(updated)); } catch {}
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const day = DAYS[activeDay];
    const task = { id: Date.now(), ...newTask };
    const updated = { ...schedules, [day]: [...(schedules[day]||[]), task].sort((a,b) => a.time.localeCompare(b.time)) };
    save(updated);
    setNewTask({title:"",time:"08:00",icon:"⭐",color:"accent",reminder:false});
    setAddingTask(false);
  };

  const deleteTask = (day, id) => {
    const updated = { ...schedules, [day]: schedules[day].filter(t => t.id !== id) };
    save(updated);
  };

  const toggleDone = (day, id) => {
    const updated = { ...schedules, [day]: schedules[day].map(t => t.id === id ? {...t, done:!t.done} : t) };
    save(updated);
  };

  const addNotif = () => {
    if (!newNotif.title.trim()) return;
    const n = { id: Date.now(), ...newNotif };
    const updated = [...notifications, n];
    saveNotifs(updated);
    setNewNotif({title:"",time:"09:00",repeat:"daily",active:true});
    setAddingNotif(false);
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2000);
  };

  const day = DAYS[activeDay];
  const tasks = schedules[day] || [];
  const completedCount = tasks.filter(t => t.done).length;

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",paddingTop:64}}>
      <nav className="nav">
        <button className="btn btn-ghost btn-sm" onClick={() => nav("home")}>← Home</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <AppIcon size={22}/>
          <span className="nav-logo">Life<span>Buddy</span> <span style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font-body)",fontWeight:400}}>/planner</span></span>
        </div>
        <div style={{width:80}}/>
      </nav>

      <div className="page-enter" style={{maxWidth:860,margin:"0 auto",padding:"36px 24px"}}>
        {/* Header */}
        <div style={{marginBottom:28}}>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(22px,4vw,32px)",fontWeight:800,marginBottom:6,color:"var(--text)",letterSpacing:"-0.02em"}}>
            📅 My Planner
          </h1>
          <p style={{color:"var(--text3)",fontSize:13}}>Build daily routines, track tasks, and set reminders to stay on schedule.</p>
        </div>

        {/* Day selector */}
        <div className="tab-bar" style={{marginBottom:24}}>
          {SHORT.map((d,i) => (
            <button key={d} className={`tab-btn ${activeDay===i?"active":""}`} onClick={() => setActiveDay(i)}>
              {d}
              {schedules[DAYS[i]]?.length > 0 && (
                <span style={{marginLeft:5,background:"var(--accent)",color:"#fff",borderRadius:100,fontSize:10,padding:"1px 5px",fontWeight:700}}>
                  {schedules[DAYS[i]].filter(t=>t.done).length}/{schedules[DAYS[i]].length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20,alignItems:"start"}}>
          {/* Schedule column */}
          <div>
            {/* Day summary */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
              <div>
                <h2 style={{fontFamily:"var(--font-display)",fontSize:18,fontWeight:700,color:"var(--text)",marginBottom:3}}>{DAYS[activeDay]}</h2>
                <p style={{fontSize:12,color:"var(--text3)"}}>{tasks.length === 0 ? "No tasks yet — add some below" : `${completedCount} of ${tasks.length} tasks completed`}</p>
              </div>
              {tasks.length > 0 && (
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:80,height:6,background:"var(--bg4)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:`${(completedCount/tasks.length)*100}%`,height:"100%",background:"var(--green)",borderRadius:3,transition:"width 0.4s"}}/>
                  </div>
                  <span style={{fontSize:12,color:"var(--green)",fontWeight:600}}>{Math.round((completedCount/tasks.length)*100)}%</span>
                </div>
              )}
            </div>

            {/* Task list */}
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              {tasks.length === 0 ? (
                <div style={{textAlign:"center",padding:"40px 20px",background:"var(--bg3)",borderRadius:"var(--radius)",border:"2px dashed var(--border2)"}}>
                  <div style={{fontSize:48,marginBottom:12}}>📋</div>
                  <p style={{color:"var(--text3)",fontSize:14,marginBottom:16}}>No tasks for {DAYS[activeDay]} yet</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setAddingTask(true)}>+ Add First Task</button>
                </div>
              ) : (
                tasks.map(task => {
                  const col = TASK_COLORS.find(c => c.key === task.color) || TASK_COLORS[0];
                  return (
                    <div key={task.id} style={{
                      display:"flex",alignItems:"center",gap:14,padding:"14px 18px",
                      background:task.done ? "var(--bg2)" : col.bg,
                      border:`1.5px solid ${task.done ? "var(--border)" : col.border}`,
                      borderRadius:"var(--radius)",
                      opacity:task.done ? 0.6 : 1,
                      transition:"all 0.2s",
                    }}>
                      {/* Checkbox */}
                      <button onClick={() => toggleDone(day, task.id)} style={{
                        width:26,height:26,borderRadius:"50%",border:`2px solid ${task.done?"var(--green)":col.border}`,
                        background:task.done?"var(--green)":"transparent",cursor:"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0,
                        transition:"all 0.2s",
                      }}>{task.done?"✓":""}</button>

                      <span style={{fontSize:22,flexShrink:0}}>{task.icon}</span>

                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:600,color:"var(--text)",textDecoration:task.done?"line-through":"none",marginBottom:2}}>{task.title}</div>
                        <div style={{fontSize:12,color:"var(--text3)",display:"flex",gap:10,alignItems:"center"}}>
                          <span>⏰ {task.time}</span>
                          {task.reminder && <span style={{color:"var(--amber)"}}>🔔 Reminder on</span>}
                          {task.done && <span style={{color:"var(--green)"}}>✓ Done</span>}
                        </div>
                      </div>

                      <Tip label="Remove this task from the schedule" placement="above">
                        <button onClick={() => deleteTask(day, task.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text3)",padding:"4px",borderRadius:6,lineHeight:1}} className="voice-btn">🗑</button>
                      </Tip>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add task button / form */}
            {!addingTask ? (
              <button className="btn btn-ghost" style={{width:"100%"}} onClick={() => setAddingTask(true)}>+ Add Task to {DAYS[activeDay]}</button>
            ) : (
              <div className="card" style={{padding:20}}>
                <h3 style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,marginBottom:16,color:"var(--text)"}}>New Task for {DAYS[activeDay]}</h3>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div className="input-wrap">
                    <label className="input-label">Task Name</label>
                    <input className="input-field" placeholder="e.g. Brush teeth, Take medication..." value={newTask.title} onChange={e=>setNewTask(n=>({...n,title:e.target.value}))}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div className="input-wrap">
                      <label className="input-label">Time</label>
                      <input className="input-field" type="time" value={newTask.time} onChange={e=>setNewTask(n=>({...n,time:e.target.value}))}/>
                    </div>
                    <div className="input-wrap">
                      <label className="input-label">Colour</label>
                      <select className="input-field" value={newTask.color} onChange={e=>setNewTask(n=>({...n,color:e.target.value}))}>
                        {TASK_COLORS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Icon picker */}
                  <div className="input-wrap">
                    <label className="input-label">Icon</label>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
                      {TASK_ICONS.map(ic => (
                        <button key={ic} onClick={() => setNewTask(n=>({...n,icon:ic}))} style={{
                          width:36,height:36,borderRadius:"var(--radius-sm)",border:`1.5px solid ${newTask.icon===ic?"var(--accent)":"var(--border2)"}`,
                          background:newTask.icon===ic?"rgba(108,99,255,0.15)":"var(--bg3)",cursor:"pointer",fontSize:18,
                        }}>{ic}</button>
                      ))}
                    </div>
                  </div>
                  {/* Reminder toggle */}
                  <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13,color:"var(--text2)"}}>
                    <button onClick={() => setNewTask(n=>({...n,reminder:!n.reminder}))} style={{
                      width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",
                      background:newTask.reminder?"var(--amber)":"var(--bg4)",position:"relative",transition:"background 0.2s",
                    }}>
                      <div style={{position:"absolute",top:3,left:newTask.reminder?23:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
                    </button>
                    🔔 Enable reminder for this task
                  </label>
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn btn-ghost btn-sm" style={{flex:1}} onClick={() => setAddingTask(false)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={addTask}>Add Task</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column — Notifications */}
          <div>
            <div className="card" style={{padding:0,overflow:"hidden",marginBottom:16}}>
              <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <h3 style={{fontFamily:"var(--font-display)",fontSize:13,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>🔔 Reminders</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setAddingNotif(true)} style={{padding:"5px 10px",fontSize:12}}>+ Add</button>
              </div>

              {notifications.length === 0 ? (
                <div style={{padding:"24px 18px",textAlign:"center",color:"var(--text3)",fontSize:13}}>
                  No reminders yet.<br/>Add one to stay on track!
                </div>
              ) : (
                notifications.map((n, i) => (
                  <div key={n.id} style={{padding:"12px 18px",borderBottom:i<notifications.length-1?"1px solid var(--border)":"none",display:"flex",alignItems:"center",gap:10}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.title}</div>
                      <div style={{fontSize:11,color:"var(--text3)"}}>{n.time} · {n.repeat}</div>
                    </div>
                    <button onClick={() => {
                      const u = notifications.map(x => x.id===n.id ? {...x,active:!x.active} : x);
                      saveNotifs(u);
                    }} style={{
                      width:36,height:20,borderRadius:10,border:"none",cursor:"pointer",
                      background:n.active?"var(--green)":"var(--bg4)",position:"relative",transition:"background 0.2s",flexShrink:0,
                    }}>
                      <div style={{position:"absolute",top:2,left:n.active?18:2,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
                    </button>
                    <button onClick={() => saveNotifs(notifications.filter(x=>x.id!==n.id))} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"var(--text3)",padding:2}} className="voice-btn">🗑</button>
                  </div>
                ))
              )}
            </div>

            {/* Weekly overview mini */}
            <div className="card" style={{padding:16}}>
              <h3 style={{fontFamily:"var(--font-display)",fontSize:12,fontWeight:700,marginBottom:12,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Week at a Glance</h3>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {DAYS.map((d,i) => {
                  const dTasks = schedules[d] || [];
                  const done = dTasks.filter(t=>t.done).length;
                  const pct  = dTasks.length ? Math.round((done/dTasks.length)*100) : 0;
                  return (
                    <div key={d} onClick={() => setActiveDay(i)} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:"var(--radius-sm)",background:activeDay===i?"var(--bg3)":"transparent",transition:"background 0.15s"}}>
                      <span style={{fontSize:11,color:activeDay===i?"var(--text)":"var(--text3)",minWidth:28,fontWeight:activeDay===i?700:400}}>{SHORT[i]}</span>
                      <div style={{flex:1,height:5,background:"var(--bg4)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:`${pct}%`,height:"100%",background:pct===100?"var(--green)":"var(--accent)",borderRadius:3,transition:"width 0.4s"}}/>
                      </div>
                      <span style={{fontSize:10,color:"var(--text3)",minWidth:28,textAlign:"right"}}>{dTasks.length ? `${done}/${dTasks.length}` : "—"}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {notifSaved && (
              <div style={{marginTop:12,background:"var(--green-dim)",border:"1px solid var(--green)",borderRadius:"var(--radius-sm)",padding:"8px 14px",fontSize:12,color:"var(--green)",textAlign:"center"}}>
                ✅ Reminder saved!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add notification modal */}
      {addingNotif && (
        <div className="modal-backdrop">
          <div className="card" style={{maxWidth:400,width:"100%",padding:28}}>
            <h3 style={{fontFamily:"var(--font-display)",fontSize:18,fontWeight:700,marginBottom:20,color:"var(--text)"}}>🔔 New Reminder</h3>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="input-wrap">
                <label className="input-label">Reminder Title</label>
                <input className="input-field" placeholder="e.g. Time for learning! Take your medication..." value={newNotif.title} onChange={e=>setNewNotif(n=>({...n,title:e.target.value}))}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div className="input-wrap">
                  <label className="input-label">Time</label>
                  <input className="input-field" type="time" value={newNotif.time} onChange={e=>setNewNotif(n=>({...n,time:e.target.value}))}/>
                </div>
                <div className="input-wrap">
                  <label className="input-label">Repeat</label>
                  <select className="input-field" value={newNotif.repeat} onChange={e=>setNewNotif(n=>({...n,repeat:e.target.value}))}>
                    <option value="daily">Every day</option>
                    <option value="weekdays">Weekdays only</option>
                    <option value="weekends">Weekends only</option>
                    <option value="once">Once</option>
                  </select>
                </div>
              </div>
              <div style={{background:"rgba(245,158,11,0.10)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:"var(--radius-sm)",padding:"10px 14px",fontSize:12,color:"var(--amber)",lineHeight:1.5}}>
                🔔 Reminders are saved in the app. For device notifications, allow notifications when your browser asks.
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="btn btn-ghost" style={{flex:1}} onClick={() => setAddingNotif(false)}>Cancel</button>
                <button className="btn btn-primary" style={{flex:1}} onClick={addNotif}>Save Reminder</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CALM CORNER — Focus, relaxation, calming tools for neurodiverse learners
// ─────────────────────────────────────────────
function CalmPage({ nav, user, settings }) {
  const [activeTab, setActiveTab] = useState("breathe");
  const [breathPhase, setBreathPhase] = useState("ready"); // ready, in, hold, out, done
  const [breathCount, setBreathCount] = useState(0);
  const [breathTotal] = useState(5);
  const [breathTimer, setBreathTimer] = useState(null);
  const [playingSound, setPlayingSound] = useState(null);
  const [activeStory, setActiveStory] = useState(null);
  const [groundStep, setGroundStep] = useState(0);
  const [groundActive, setGroundActive] = useState(false);

  const TABS = ["breathe","sounds","ground","stories","focus"];
  const TAB_LABELS = {breathe:"🫁 Breathing",sounds:"🎵 Sounds",ground:"🌿 Grounding",stories:"📖 Stories",focus:"🎯 Focus"};

  // ── BREATHING EXERCISES ──
  const BREATH_EXERCISES = [
    { id:"box",    name:"Box Breathing",       desc:"Equal breath in, hold, out, hold — great for calming nerves", in:4, holdIn:4, out:4, holdOut:4, color:"var(--accent)" },
    { id:"478",    name:"4-7-8 Breathing",     desc:"Slow deep breath in, long hold, extended exhale — promotes sleep and calm", in:4, holdIn:7, out:8, holdOut:0, color:"var(--purple)" },
    { id:"belly",  name:"Belly Breathing",     desc:"Breathe deep into your tummy — simple and effective for any age", in:5, holdIn:1, out:5, holdOut:1, color:"var(--green)" },
    { id:"quick",  name:"Quick Calm",          desc:"Short 3-count breath — use this anywhere, anytime you feel overwhelmed", in:3, holdIn:0, out:3, holdOut:0, color:"var(--amber)" },
  ];
  const [selectedBreath, setSelectedBreath] = useState(BREATH_EXERCISES[0]);
  const [breathRunning, setBreathRunning] = useState(false);
  const [breathSec, setBreathSec] = useState(0);
  const breathRef = useRef(null);
  const breathPhaseRef = useRef("in");
  const breathCountRef = useRef(0);

  const startBreath = () => {
    setBreathRunning(true);
    setBreathPhase("in");
    setBreathCount(0);
    breathPhaseRef.current = "in";
    breathCountRef.current = 0;
    setBreathSec(selectedBreath.in);
    if (settings?.audioEnabled) speak("Breathe in...", 0.7, 0.9);
    let sec = selectedBreath.in;
    breathRef.current = setInterval(() => {
      sec -= 1;
      setBreathSec(sec);
      if (sec <= 0) {
        const ex = selectedBreath;
        const cur = breathPhaseRef.current;
        if (cur === "in") {
          if (ex.holdIn > 0) { breathPhaseRef.current = "holdIn"; setBreathPhase("holdIn"); sec = ex.holdIn; setBreathSec(sec); if(settings?.audioEnabled) speak("Hold...", 0.7, 0.9); }
          else { breathPhaseRef.current = "out"; setBreathPhase("out"); sec = ex.out; setBreathSec(sec); if(settings?.audioEnabled) speak("Breathe out...", 0.7, 0.9); }
        } else if (cur === "holdIn") {
          breathPhaseRef.current = "out"; setBreathPhase("out"); sec = ex.out; setBreathSec(sec); if(settings?.audioEnabled) speak("Breathe out...", 0.7, 0.9);
        } else if (cur === "out") {
          if (ex.holdOut > 0) { breathPhaseRef.current = "holdOut"; setBreathPhase("holdOut"); sec = ex.holdOut; setBreathSec(sec); if(settings?.audioEnabled) speak("Hold...", 0.7, 0.9); }
          else {
            breathCountRef.current += 1;
            setBreathCount(breathCountRef.current);
            if (breathCountRef.current >= breathTotal) { clearInterval(breathRef.current); setBreathRunning(false); setBreathPhase("done"); if(settings?.audioEnabled) speak("Well done! You've completed your breathing exercise. You should feel calmer now.", 0.8, 1.0); }
            else { breathPhaseRef.current = "in"; setBreathPhase("in"); sec = ex.in; setBreathSec(sec); if(settings?.audioEnabled) speak("Breathe in...", 0.7, 0.9); }
          }
        } else if (cur === "holdOut") {
          breathCountRef.current += 1;
          setBreathCount(breathCountRef.current);
          if (breathCountRef.current >= breathTotal) { clearInterval(breathRef.current); setBreathRunning(false); setBreathPhase("done"); if(settings?.audioEnabled) speak("Wonderful. Breathing complete. Feel the calm.", 0.8, 1.0); }
          else { breathPhaseRef.current = "in"; setBreathPhase("in"); sec = ex.in; setBreathSec(sec); if(settings?.audioEnabled) speak("Breathe in...", 0.7, 0.9); }
        }
      }
    }, 1000);
  };

  const stopBreath = () => { clearInterval(breathRef.current); setBreathRunning(false); setBreathPhase("ready"); setBreathCount(0); };
  useEffect(() => () => clearInterval(breathRef.current), []);

  const phaseLabel = { ready:"Ready", in:"Breathe In 🫁", holdIn:"Hold ✋", out:"Breathe Out 💨", holdOut:"Hold ✋", done:"Well Done! 🎉" };
  const phaseColor = { ready:"var(--text3)", in:"var(--accent2)", holdIn:"var(--amber)", out:"var(--green)", holdOut:"var(--purple)", done:"var(--green)" };

  // ── CALMING SOUNDS ──
  const SOUNDS = [
    { id:"rain",     icon:"🌧️", name:"Gentle Rain",        desc:"Soft steady rainfall — helps block out overwhelming noise and promotes calm focus" },
    { id:"ocean",    icon:"🌊", name:"Ocean Waves",         desc:"Rhythmic wave sounds — deeply calming, great for sleep and de-escalation" },
    { id:"forest",   icon:"🌳", name:"Forest Sounds",       desc:"Birds, rustling leaves — grounding connection to nature" },
    { id:"whitenoise",icon:"📻",name:"White Noise",         desc:"Steady neutral sound — reduces sensory overload, helps concentration" },
    { id:"fire",     icon:"🔥", name:"Crackling Fire",      desc:"Warm cosy fireplace sounds — comforting and calming" },
    { id:"bells",    icon:"🎐", name:"Tibetan Bells",       desc:"Gentle chiming tones — good for meditation and focusing attention" },
    { id:"piano",    icon:"🎹", name:"Soft Piano",          desc:"Slow gentle piano — calming background music for study or wind-down" },
    { id:"thunder",  icon:"⛈️", name:"Distant Thunder",     desc:"Low rumbling storm sounds — some neurodiverse learners find this deeply calming" },
    { id:"crickets", icon:"🦗", name:"Night Crickets",      desc:"Peaceful evening sounds — helps transition to sleep or wind-down time" },
    { id:"bowl",     icon:"🫙", name:"Singing Bowl",        desc:"Sustained resonant tones — used in meditation and mindfulness practices" },
  ];

  // ── GROUNDING TECHNIQUES ──
  const GROUND_EXERCISES = [
    {
      id:"54321", name:"5-4-3-2-1 Senses",
      desc:"Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. Brings you back to the present.",
      steps:[
        {n:"5 Things You Can SEE 👁️",inst:"Look around slowly. Name 5 things you can see right now. Say them quietly to yourself.",count:5,sense:"see"},
        {n:"4 Things You Can TOUCH 🤲",inst:"Feel around you. Name 4 things you can touch — your chair, your clothes, the floor, a nearby object.",count:4,sense:"touch"},
        {n:"3 Things You Can HEAR 👂",inst:"Be still and listen. Name 3 sounds you can hear right now, even very quiet ones.",count:3,sense:"hear"},
        {n:"2 Things You Can SMELL 👃",inst:"Breathe gently. Notice 2 smells around you — your room, your clothes, nearby food.",count:2,sense:"smell"},
        {n:"1 Thing You Can TASTE 👅",inst:"Notice what is in your mouth right now. One thing — it might be very faint.",count:1,sense:"taste"},
      ]
    },
    {
      id:"bodycheck", name:"Body Check-In",
      desc:"Slowly notice each part of your body from head to toe. Helps you reconnect with yourself when feeling disconnected.",
      steps:[
        {n:"Head & Face 😌",inst:"Notice your face. Is your jaw tight? Your forehead tense? Let your face soften and relax.",count:null,sense:"body"},
        {n:"Shoulders & Arms 💪",inst:"Notice your shoulders. Are they raised up near your ears? Let them drop down gently. Wiggle your fingers.",count:null,sense:"body"},
        {n:"Chest & Stomach 🫁",inst:"Take one slow breath. Feel your chest and belly rise and fall. Notice how your breathing feels right now.",count:null,sense:"body"},
        {n:"Legs & Feet 🦵",inst:"Feel your legs. Are they tensed? Press your feet flat onto the floor. Feel the solid ground beneath you.",count:null,sense:"body"},
      ]
    },
    {
      id:"colourwalk", name:"Colour Walk",
      desc:"Find one object for each colour. Keeps your eyes moving and your mind gently occupied.",
      steps:[
        {n:"Find something RED 🔴",inst:"Look around the room. Find one thing that is red. Look at it carefully for 5 seconds.",count:null,sense:"see"},
        {n:"Find something BLUE 🔵",inst:"Now find something blue. Look at its shape, size, and texture.",count:null,sense:"see"},
        {n:"Find something GREEN 🟢",inst:"Find something green. It could be a plant, something printed, or anything green.",count:null,sense:"see"},
        {n:"Find something YELLOW 🟡",inst:"Find something yellow. Take your time — it might be small.",count:null,sense:"see"},
        {n:"Find something WHITE ⚪",inst:"Find something white. Notice how many shades of white you can see.",count:null,sense:"see"},
      ]
    },
  ];
  const [selectedGround, setSelectedGround] = useState(GROUND_EXERCISES[0]);

  const startGround = () => { setGroundActive(true); setGroundStep(0); if(settings?.audioEnabled) speak(selectedGround.steps[0].inst, 0.85, 1.0); };
  const nextGround  = () => {
    if (groundStep < selectedGround.steps.length - 1) {
      const next = groundStep + 1;
      setGroundStep(next);
      if(settings?.audioEnabled) speak(selectedGround.steps[next].inst, 0.85, 1.0);
    } else {
      setGroundActive(false);
      setGroundStep(0);
      if(settings?.audioEnabled) speak("You have completed the grounding exercise. Well done. Take a moment to notice how you feel now.", 0.85, 1.0);
    }
  };

  // ── CALMING STORIES ──
  const STORIES = [
    {
      id:"cloud", icon:"☁️", title:"The Friendly Cloud",
      intro:"A gentle story about a cloud who learns that it is okay to feel big feelings.",
      text:`Once there was a little cloud named Nimbus who lived high above the mountains.\n\nNimbus was a very kind cloud. Every morning, Nimbus would float gently across the sky and bring soft rain to the flowers below. The flowers always said thank you, and Nimbus felt warm inside.\n\nBut some days, Nimbus felt very full — full of rain, full of thunder, full of big grey feelings that were hard to explain. On those days, Nimbus would grow very dark and heavy.\n\n"Why do you look so dark today?" asked a passing bird.\n\n"I just feel... too full," said Nimbus quietly. "Like everything is too much."\n\nThe bird sat gently on the edge of the cloud. "That happens to me too," said the bird. "When I feel too full, I fly very slowly. I look at just one tree at a time. I breathe. And slowly — the fullness passes."\n\nNimbus tried this. One breath. One cloud. One soft raindrop at a time. And slowly, the grey began to soften into silver. Then into white. Then into the most beautiful pale blue.\n\nYou do not have to fix all your feelings at once. One breath at a time is enough.`
    },
    {
      id:"turtle", icon:"🐢", title:"The Turtle's Shell",
      intro:"A story about finding your safe place inside yourself when the world feels too loud.",
      text:`Deep in a quiet pond lived a turtle named Teo.\n\nTeo loved his shell. When the world outside got too loud — when the frogs croaked too much, the ducks splashed too hard, and the rain fell too noisily — Teo would pull himself gently inside his shell.\n\nInside, everything was still. Warm. Safe. Quiet.\n\n"Why do you hide?" asked a curious fish one day.\n\n"I am not hiding," said Teo. "I am resting. I am finding myself again. The world is very loud sometimes, and I need to go somewhere quiet so I can feel like me again."\n\nThe fish thought about this. "Where is your quiet place?" she asked.\n\n"Right here," said Teo, tapping his shell gently. "I carry it with me everywhere I go."\n\nYou have a quiet place too. It is inside your own breath. Inside your own heartbeat. You can go there any time the world feels too loud. Close your eyes, take a slow breath, and rest in your own shell for a little while.\n\nIt is always there. It is always yours.`
    },
    {
      id:"star", icon:"⭐", title:"The Star That Felt Different",
      intro:"A story about a star who discovers that being different is exactly right.",
      text:`In a sky full of perfectly round, perfectly bright stars, there lived one star named Siria who glowed a little differently.\n\nWhile the other stars shone in steady white light, Siria shimmered — sometimes purple, sometimes gold, sometimes a soft warm blue that no other star could quite make.\n\n"Why do you keep changing?" asked the stars nearby.\n\n"I do not know," said Siria honestly. "I just feel things differently. The world below affects me more than it affects you. When the children laugh, I turn gold. When the rain falls, I turn silver. When the night is very quiet, I glow the deepest blue."\n\nThe other stars did not understand. But the people below — the ones who lay on their backs in fields and looked up at the night sky — they always found Siria first.\n\n"That is the special one," they would say. "The one that changes. The one that feels everything."\n\nAnd slowly, Siria understood. To feel everything deeply is not a problem. It is a kind of light that the world needs very much.`
    },
    {
      id:"breathe_story", icon:"🌬️", title:"The Wind and the Mountain",
      intro:"A very short, very soothing story about stillness and the power of being present.",
      text:`The mountain had stood for ten thousand years.\n\nWinds had blown over it. Storms had washed it. Snow had covered it in white blankets so thick that not a single stone could be seen.\n\nAnd every single time, the mountain was still there. Patient. Solid. Unmoved.\n\nA small pebble once asked the mountain: "Are you never afraid?"\n\n"Sometimes," said the mountain. "But I know this: the storm always passes. The wind always settles. The snow always melts. And I am still here."\n\n"But what do you do while you wait?" asked the pebble.\n\n"I breathe," said the mountain. "I simply breathe."\n\nYou are the mountain. The big feelings are the storm. They are loud, and they are real — but they will pass. While they pass, you simply breathe. You are still here. You are solid. You are enough.`
    },
  ];
  const [readingStory, setReadingStory] = useState(null);
  const [storyRead, setStoryRead] = useState({});

  // ── FOCUS ROUTINES ──
  const FOCUS_ROUTINES = [
    {
      id:"pomodoro", icon:"🍅", name:"Focus Timer (Pomodoro)",
      desc:"25 minutes of focused work, then a 5 minute break. One of the most effective study techniques for ADHD and neurodiverse learners.",
      steps:["Set one small, clear goal for this focus session","Remove distractions — put phone face down, close other tabs","Work on your goal for 25 minutes — no switching tasks","Take a 5 minute break — stand up, stretch, have water","After 4 rounds, take a longer 20 minute break"]
    },
    {
      id:"startup", icon:"🚀", name:"Learning Warm-Up",
      desc:"A 5-minute routine to prepare your brain before a learning session. Especially helpful for transitions.",
      steps:["Take 3 slow deep breaths to signal to your brain: learning time","Drink a glass of water — your brain works better when hydrated","Write down ONE thing you want to do in this session","Move your body for 2 minutes — jump, stretch, walk around","Sit comfortably, close your eyes for 30 seconds, then begin"]
    },
    {
      id:"sensory", icon:"🎨", name:"Sensory Regulation",
      desc:"Regulate your sensory system before starting tasks. Good for those who feel under or over-stimulated.",
      steps:["Heavy work: push your palms together hard for 10 seconds","Proprioception: press your feet hard into the floor for 10 seconds","Vestibular: rock gently back and forth in your chair 10 times","Oral: have a chewy snack, chew gum, or sip cold water through a straw","Now notice — does your body feel more settled and ready to focus?"]
    },
    {
      id:"wind_down", icon:"🌙", name:"Wind-Down Routine",
      desc:"A calming sequence for after learning sessions or before bed. Helps transition out of high-focus mode.",
      steps:["Close your books and tidy your workspace — a clear space calms the mind","Write 3 things you did today, no matter how small","Stretch your arms above your head, hold for 5 seconds, release","Splash cool water on your face or hands","Sit quietly for 2 minutes with no screen — just rest your eyes and breathe"]
    },
    {
      id:"overwhelm", icon:"🆘", name:"When Overwhelmed",
      desc:"An emergency de-escalation routine for moments of shutdown, meltdown, or extreme overload.",
      steps:["Step away if you safely can — a quiet space makes a big difference","Reduce input: dim lights, lower sounds, remove tight clothing if possible","Apply deep pressure: squeeze your own hands, hug yourself, use a weighted blanket","Breathe: try just 4 counts in, 4 counts out — nothing more complicated","Do not try to solve the problem now. Come back to it when your system is calm","Tell a trusted person: 'I need a moment' — you do not have to explain everything now"]
    },
  ];
  const [expandedRoutine, setExpandedRoutine] = useState(null);

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",paddingTop:64}}>
      <nav className="nav">
        <button className="btn btn-ghost btn-sm" onClick={() => nav("home")}>← Home</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <AppIcon size={22}/>
          <span className="nav-logo">Life<span>Buddy</span> <span style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font-body)",fontWeight:400}}>/calm</span></span>
        </div>
        <div style={{width:80}}/>
      </nav>

      <div className="page-enter" style={{maxWidth:860,margin:"0 auto",padding:"36px 24px"}}>
        <div style={{marginBottom:28}}>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(22px,4vw,32px)",fontWeight:800,marginBottom:6,color:"var(--text)",letterSpacing:"-0.02em"}}>
            🌙 Calm Corner
          </h1>
          <p style={{color:"var(--text3)",fontSize:13,lineHeight:1.6}}>
            Breathing exercises, grounding techniques, calming sounds, relaxation stories, and focus routines — all designed for neurodiverse learners.
          </p>
        </div>

        <div className="tab-bar" style={{marginBottom:28}}>
          {TABS.map(t => <button key={t} className={`tab-btn ${activeTab===t?"active":""}`} onClick={() => setActiveTab(t)}>{TAB_LABELS[t]}</button>)}
        </div>

        {/* ── BREATHING ── */}
        {activeTab === "breathe" && (
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {/* Exercise picker */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12}}>
              {BREATH_EXERCISES.map(ex => (
                <div key={ex.id} onClick={() => { if(!breathRunning){ setSelectedBreath(ex); setBreathPhase("ready"); setBreathCount(0); } }}
                  style={{padding:"16px 14px",borderRadius:"var(--radius)",border:`1.5px solid ${selectedBreath.id===ex.id ? ex.color : "var(--border2)"}`,background:selectedBreath.id===ex.id?"rgba(108,99,255,0.08)":"var(--bg3)",cursor:breathRunning?"default":"pointer",transition:"all 0.15s"}}>
                  <div style={{fontWeight:700,fontSize:14,color:selectedBreath.id===ex.id?ex.color:"var(--text)",marginBottom:4}}>{ex.name}</div>
                  <div style={{fontSize:11,color:"var(--text3)",lineHeight:1.5}}>{ex.desc}</div>
                  <div style={{marginTop:8,fontSize:11,color:ex.color,fontWeight:600}}>
                    {ex.in}s in {ex.holdIn?`· ${ex.holdIn}s hold `:""}{ex.out}s out{ex.holdOut?` · ${ex.holdOut}s hold`:""}
                  </div>
                </div>
              ))}
            </div>

            {/* Breathing animation */}
            <div className="card" style={{textAlign:"center",padding:"40px 28px",position:"relative",overflow:"hidden"}}>
              <div className="glow-orb" style={{width:300,height:300,background:`${selectedBreath.color}18`,top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/>
              <div style={{position:"relative",zIndex:1}}>
                {/* Animated circle */}
                <div style={{
                  width:160,height:160,borderRadius:"50%",margin:"0 auto 28px",
                  border:`4px solid ${selectedBreath.color}`,
                  background:`${selectedBreath.color}15`,
                  display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",
                  transform: breathPhase==="in" ? "scale(1.25)" : breathPhase==="out" ? "scale(0.85)" : "scale(1.05)",
                  transition:`transform ${breathPhase==="in"?selectedBreath.in:breathPhase==="out"?selectedBreath.out:0.3}s ease-in-out`,
                  boxShadow:breathRunning?`0 0 40px ${selectedBreath.color}40`:"none",
                }}>
                  <div style={{fontSize:36,marginBottom:4}}>
                    {breathPhase==="in"?"🫁":breathPhase==="out"?"💨":breathPhase==="done"?"🎉":breathPhase.includes("hold")?"✋":"🌬️"}
                  </div>
                  {breathRunning && <div style={{fontSize:28,fontWeight:800,color:phaseColor[breathPhase]}}>{breathSec}</div>}
                </div>

                <div style={{fontSize:"clamp(20px,4vw,28px)",fontWeight:700,color:phaseColor[breathPhase],marginBottom:8,fontFamily:"var(--font-display)"}}>
                  {phaseLabel[breathPhase]}
                </div>

                {breathRunning && (
                  <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:20}}>
                    {[...Array(breathTotal)].map((_,i) => (
                      <div key={i} style={{width:10,height:10,borderRadius:"50%",background:i<breathCount?"var(--green)":i===breathCount?"var(--accent)":"var(--bg4)",transition:"background 0.3s"}}/>
                    ))}
                  </div>
                )}

                {!breathRunning && breathPhase !== "done" && (
                  <div style={{marginBottom:16,color:"var(--text2)",fontSize:13}}>
                    {selectedBreath.name} · {breathTotal} breaths
                  </div>
                )}

                <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
                  {!breathRunning ? (
                    <button className="btn btn-primary" onClick={startBreath}>
                      {breathPhase==="done"?"🔁 Again":"▶ Start Breathing"}
                    </button>
                  ) : (
                    <button className="btn btn-ghost" onClick={stopBreath}>⏹ Stop</button>
                  )}
                  {settings?.audioEnabled && !breathRunning && (
                    <button className="btn btn-ghost btn-sm" onClick={() => speak(`${selectedBreath.name}. ${selectedBreath.desc}`)}>🔊 Describe</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SOUNDS ── */}
        {activeTab === "sounds" && (
          <div>
            <div style={{background:"rgba(108,99,255,0.08)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:"var(--radius)",padding:"12px 18px",marginBottom:20,fontSize:13,color:"var(--accent2)",lineHeight:1.55}}>
              🎵 These sounds simulate calming audio for relaxation and focus. In a real device build, these would play actual audio files. Tap any sound to "select" it — use these descriptions to play real sounds from YouTube, Spotify, or a sound app.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
              {SOUNDS.map(s => (
                <div key={s.id} onClick={() => setPlayingSound(playingSound===s.id ? null : s.id)}
                  style={{
                    padding:"20px 16px",borderRadius:"var(--radius)",textAlign:"center",cursor:"pointer",
                    border:`1.5px solid ${playingSound===s.id?"var(--accent)":"var(--border2)"}`,
                    background:playingSound===s.id?"rgba(108,99,255,0.10)":"var(--bg3)",
                    transition:"all 0.2s",
                    transform:playingSound===s.id?"translateY(-2px)":"none",
                    boxShadow:playingSound===s.id?"0 4px 20px var(--accent-glow)":"none",
                  }}>
                  <div style={{fontSize:38,marginBottom:10}}>{s.icon}</div>
                  <div style={{fontWeight:700,fontSize:14,color:"var(--text)",marginBottom:6}}>{s.name}</div>
                  <div style={{fontSize:11,color:"var(--text3)",lineHeight:1.55,marginBottom:10}}>{s.desc}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:playingSound===s.id?"var(--green)":"var(--border2)",animation:playingSound===s.id?"pulseRing 1.5s infinite":"none"}}/>
                    <span style={{fontSize:12,color:playingSound===s.id?"var(--green)":"var(--text3)",fontWeight:playingSound===s.id?600:400}}>
                      {playingSound===s.id?"▶ Playing":"Tap to select"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {playingSound && (
              <div style={{marginTop:20,padding:"16px 20px",background:"var(--bg3)",borderRadius:"var(--radius)",border:"1px solid var(--border2)",display:"flex",alignItems:"center",gap:14}}>
                <div style={{fontSize:32}}>{SOUNDS.find(s=>s.id===playingSound)?.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,color:"var(--text)",marginBottom:4}}>{SOUNDS.find(s=>s.id===playingSound)?.name}</div>
                  <div style={{fontSize:12,color:"var(--text3)"}}>Search "{SOUNDS.find(s=>s.id===playingSound)?.name} sounds" on YouTube or Spotify to play this audio.</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setPlayingSound(null)}>✕ Stop</button>
              </div>
            )}
          </div>
        )}

        {/* ── GROUNDING ── */}
        {activeTab === "ground" && (
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {/* Technique picker */}
            {!groundActive && (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,marginBottom:4}}>
                {GROUND_EXERCISES.map(ex => (
                  <div key={ex.id} onClick={() => setSelectedGround(ex)}
                    style={{padding:"18px 16px",borderRadius:"var(--radius)",border:`1.5px solid ${selectedGround.id===ex.id?"var(--green)":"var(--border2)"}`,background:selectedGround.id===ex.id?"var(--green-dim)":"var(--bg3)",cursor:"pointer",transition:"all 0.15s"}}>
                    <div style={{fontWeight:700,fontSize:15,color:"var(--text)",marginBottom:6}}>{ex.name}</div>
                    <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.55}}>{ex.desc}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="card" style={{padding:28}}>
              {!groundActive ? (
                <>
                  <h3 style={{fontFamily:"var(--font-display)",fontSize:16,fontWeight:700,marginBottom:8,color:"var(--text)"}}>{selectedGround.name}</h3>
                  <p style={{fontSize:13,color:"var(--text2)",marginBottom:20,lineHeight:1.6}}>{selectedGround.desc}</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                    {selectedGround.steps.map((step, i) => (
                      <div key={i} style={{display:"flex",gap:12,padding:"10px 14px",background:"var(--bg3)",borderRadius:"var(--radius-sm)"}}>
                        <span style={{fontSize:20,flexShrink:0}}>{step.n.match(/[^\s]+/)?.[0] || "👆"}</span>
                        <div>
                          <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:2}}>{step.n}</div>
                          <div style={{fontSize:12,color:"var(--text3)"}}>{step.inst}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary" style={{width:"100%"}} onClick={startGround}>Start Grounding Exercise</button>
                </>
              ) : (
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:13,color:"var(--text3)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600}}>
                    Step {groundStep+1} of {selectedGround.steps.length}
                  </div>
                  <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:24}}>
                    {selectedGround.steps.map((_,i) => (
                      <div key={i} style={{width:32,height:5,borderRadius:3,background:i<groundStep?"var(--green)":i===groundStep?"var(--accent)":"var(--bg4)",transition:"background 0.3s"}}/>
                    ))}
                  </div>
                  <div style={{fontSize:42,marginBottom:16}}>{selectedGround.steps[groundStep].n.split(" ").slice(-1)[0]}</div>
                  <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(18px,3vw,24px)",fontWeight:700,marginBottom:16,color:"var(--text)"}}>{selectedGround.steps[groundStep].n}</h2>
                  <div style={{background:"var(--bg3)",borderRadius:"var(--radius)",padding:"20px 24px",marginBottom:24,lineHeight:1.7,fontSize:15,color:"var(--text2)"}}>
                    {selectedGround.steps[groundStep].inst}
                    {settings?.audioEnabled && (
                      <button className="voice-btn" style={{marginLeft:8}} onClick={() => speak(selectedGround.steps[groundStep].inst, 0.85, 1.0)}>🔊</button>
                    )}
                  </div>
                  <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                    <button className="btn btn-ghost" onClick={() => { setGroundActive(false); setGroundStep(0); }}>Stop</button>
                    <button className="btn btn-primary" onClick={nextGround}>
                      {groundStep < selectedGround.steps.length - 1 ? "Next Step →" : "✅ Finish"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STORIES ── */}
        {activeTab === "stories" && (
          <div>
            {!readingStory ? (
              <>
                <p style={{fontSize:13,color:"var(--text3)",marginBottom:20,lineHeight:1.6}}>
                  Short, soothing stories written for neurodiverse learners — for winding down, managing big feelings, or finding calm before sleep.
                </p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
                  {STORIES.map(s => (
                    <div key={s.id} className="card card-interactive" onClick={() => setReadingStory(s)}
                      style={{padding:22,border:`1px solid ${storyRead[s.id]?"var(--green)":"var(--border)"}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                        <div style={{fontSize:36}}>{s.icon}</div>
                        <div>
                          <div style={{fontFamily:"var(--font-display)",fontSize:16,fontWeight:700,color:"var(--text)",marginBottom:3}}>{s.title}</div>
                          {storyRead[s.id] && <span style={{fontSize:11,color:"var(--green)",fontWeight:600}}>✓ Read</span>}
                        </div>
                      </div>
                      <p style={{fontSize:12,color:"var(--text3)",lineHeight:1.6,marginBottom:14}}>{s.intro}</p>
                      <span className="btn btn-ghost btn-sm">Read Story →</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="card" style={{padding:"36px 32px",maxWidth:680,margin:"0 auto"}}>
                <button className="btn btn-ghost btn-sm" style={{marginBottom:20}} onClick={() => setReadingStory(null)}>← Back to Stories</button>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:8}}>
                  <div style={{fontSize:44}}>{readingStory.icon}</div>
                  <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(20px,4vw,28px)",fontWeight:800,color:"var(--text)",letterSpacing:"-0.01em"}}>{readingStory.title}</h2>
                </div>
                <p style={{fontSize:13,color:"var(--text3)",fontStyle:"italic",marginBottom:24,paddingBottom:20,borderBottom:"1px solid var(--border)"}}>{readingStory.intro}</p>
                {settings?.audioEnabled && (
                  <div style={{marginBottom:20,display:"flex",gap:10}}>
                    <button className="btn btn-primary btn-sm" onClick={() => speak(readingStory.text, 0.82, 1.05)}>🔊 Read Aloud</button>
                    <button className="btn btn-ghost btn-sm" onClick={stopSpeech}>⏹ Stop</button>
                  </div>
                )}
                <div style={{fontSize:15,lineHeight:1.9,color:"var(--text2)",whiteSpace:"pre-line"}}>{readingStory.text}</div>
                <div style={{marginTop:28,paddingTop:20,borderTop:"1px solid var(--border)",display:"flex",gap:12,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
                  <button className="btn btn-ghost" onClick={() => { setStoryRead(r=>({...r,[readingStory.id]:true})); setReadingStory(null); }}>← All Stories</button>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:12,color:"var(--text3)"}}>How did this make you feel?</span>
                    {["😌","😊","🤗","😴"].map(emoji => (
                      <button key={emoji} onClick={() => { setStoryRead(r=>({...r,[readingStory.id]:true})); if(settings?.audioEnabled) speak("Thanks for sharing how you feel."); }} style={{fontSize:22,background:"none",border:"none",cursor:"pointer",padding:2}}>{emoji}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── FOCUS ROUTINES ── */}
        {activeTab === "focus" && (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <p style={{fontSize:13,color:"var(--text3)",marginBottom:4,lineHeight:1.6}}>
              Structured routines to help with transitions, focus, sensory regulation, and recovery from overwhelm. Each one is designed with neurodiverse learners in mind.
            </p>
            {FOCUS_ROUTINES.map(r => (
              <div key={r.id} className="card" style={{padding:0,overflow:"hidden"}}>
                <div style={{padding:"18px 22px",display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}
                  onClick={() => setExpandedRoutine(expandedRoutine===r.id ? null : r.id)}>
                  <div style={{fontSize:32,flexShrink:0}}>{r.icon}</div>
                  <div style={{flex:1}}>
                    <h3 style={{fontFamily:"var(--font-display)",fontSize:15,fontWeight:700,color:"var(--text)",marginBottom:4}}>{r.name}</h3>
                    <p style={{fontSize:12,color:"var(--text3)",lineHeight:1.5}}>{r.desc}</p>
                  </div>
                  <span style={{color:"var(--text3)",fontSize:18,flexShrink:0,transition:"transform 0.2s",display:"inline-block",transform:expandedRoutine===r.id?"rotate(90deg)":"none"}}>›</span>
                </div>
                {expandedRoutine === r.id && (
                  <div style={{borderTop:"1px solid var(--border)",padding:"20px 22px"}}>
                    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                      {r.steps.map((step, i) => (
                        <div key={i} style={{display:"flex",gap:12,padding:"12px 14px",background:"var(--bg3)",borderRadius:"var(--radius-sm)",alignItems:"flex-start"}}>
                          <div style={{width:24,height:24,borderRadius:"50%",background:"var(--accent)",color:"#fff",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                          <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.6,flex:1}}>{step}</div>
                          {settings?.audioEnabled && (
                            <button className="voice-btn" style={{flexShrink:0}} onClick={() => speak(step, 0.85, 1.0)}>🔊</button>
                          )}
                        </div>
                      ))}
                    </div>
                    {settings?.audioEnabled && (
                      <button className="btn btn-ghost btn-sm" onClick={() => speak(r.steps.join(". Next step: "), 0.85, 1.0)}>🔊 Read Full Routine Aloud</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}