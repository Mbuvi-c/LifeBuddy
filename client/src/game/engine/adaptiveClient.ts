// adaptiveClient.ts
// Calls the LifeBuddy FastAPI adaptive engine.
// All simulation task attempts are logged here.
// Returns updated mastery, difficulty tier, and HCI config.

const API_BASE = 'http://127.0.0.1:8000'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TaskAttempt {
  learner_id: string
  simulation_type: string
  task_type: string
  success: boolean
  skill: string
  response_type: 'correct' | 'incorrect' | 'hint'
  hints_used: number
  quit_signal: boolean
  response_time: number   // milliseconds
  attempt_number: number
}

export interface AdaptationResponse {
  learner_id: string
  learner_name: string
  difficulty_tier: number
  mastery: number
  hci_config: {
    hint_frequency: string
    pacing: string
    feedback_type: string
    prompt_modality: string
    scaffolding_level: string
  }
  frustration_index: number
  frustration_status: {
    level: string
    action: string
    notify_caregiver: boolean
    checkin_message: string | null
    message: string
  }
  next_skill: string
  source: string
  explanation: string
}

export interface SessionSummaryResponse {
  session_id: string
  learner_id: string
  duration_seconds: number
  mastery_snapshot: Record<string, number>
  frustration_journey: number[]
  tier_changes: string[]
  tasks_attempted: number
  tasks_correct: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────────────────────

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/adapt/health`)
    return res.ok
  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Start session
// Called when learner begins a skill session
// Resets frustration index and applies mastery decay
// ─────────────────────────────────────────────────────────────────────────────

export async function startSession(learnerId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/adapt/session/start/${learnerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    return res.ok
  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Log task attempt
// Called after every single task interaction
// Returns adaptation config for next task
// ─────────────────────────────────────────────────────────────────────────────

export async function logAttempt(
  attempt: TaskAttempt
): Promise<AdaptationResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/adapt/session/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attempt),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// End session
// Called when learner completes or exits a skill session
// Returns full session summary
// ─────────────────────────────────────────────────────────────────────────────

export async function endSession(
  learnerId: string
): Promise<SessionSummaryResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/adapt/session/end/${learnerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Get current adaptation config
// Called on session resume to restore state
// ─────────────────────────────────────────────────────────────────────────────

export async function getAdaptation(
  learnerId: string
): Promise<AdaptationResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/adapt/adapt/${learnerId}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Get next recommended skill
// ─────────────────────────────────────────────────────────────────────────────

export async function getNextSkill(learnerId: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/adapt/skill/next/${learnerId}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.next_skill ?? null
  } catch {
    return null
  }
}