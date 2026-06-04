// audioManager.ts
// Handles all audio playback for LifeBuddy.
// Scenes: auto-play on load, stop on next.
// Tasks: auto-play question, hover plays option, click plays verdict.
// Silent fallback — if file does not exist, app continues without error.

const BASE = '/audio'

// Currently playing audio instance
let current: HTMLAudioElement | null = null

// ─────────────────────────────────────────────────────────────────────────────
// Core play function
// Stops any currently playing audio before starting new one
// ─────────────────────────────────────────────────────────────────────────────

function play(path: string, onEnd?: () => void): void {
  stop()
  const audio = new Audio(path)
  audio.addEventListener('ended', () => {
    current = null
    onEnd?.()
  })
  audio.addEventListener('error', () => {
    // File not recorded yet — fail silently
    current = null
  })
  current = audio
  audio.play().catch(() => {
    // Browser autoplay blocked — fail silently
    current = null
  })
}

export function stop(): void {
  if (current) {
    current.pause()
    current.currentTime = 0
    current = null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene narration
// ─────────────────────────────────────────────────────────────────────────────

export function playSceneAudio(skillId: string, sceneIndex: number): void {
  const path = `${BASE}/${skillId}/scenes/scene_${sceneIndex + 1}.mp3`
  play(path)
}

export function stopSceneAudio(): void {
  stop()
}

// ─────────────────────────────────────────────────────────────────────────────
// Task question narration — plays automatically when task loads
// ─────────────────────────────────────────────────────────────────────────────

export function playQuestionAudio(taskId: string, skillId: string): void {
  // taskId format: mt_t1_easy_1 → file: t1_easy_1_q.mp3
  const fileId = taskId.replace(`${skillId.slice(0, 2)}_`, '')
  const path = `${BASE}/${skillId}/tasks/${fileId}_q.mp3`
  play(path)
}

// ─────────────────────────────────────────────────────────────────────────────
// Option hover narration — plays when learner hovers or long presses
// ─────────────────────────────────────────────────────────────────────────────

export function playOptionAudio(taskId: string, skillId: string, optionId: string): void {
  const fileId = taskId.replace(`${skillId.slice(0, 2)}_`, '')
  const path = `${BASE}/${skillId}/tasks/${fileId}_${optionId}.mp3`
  play(path)
}

// ─────────────────────────────────────────────────────────────────────────────
// Verdict narration — plays when learner clicks an option
// Randomly picks from 3 correct or 3 wrong clips
// ─────────────────────────────────────────────────────────────────────────────

export function playVerdictAudio(correct: boolean, onEnd?: () => void): void {
  let called = false
  const done = () => { if (!called) { called = true; onEnd?.() } }

  const index = Math.floor(Math.random() * 3) + 1
  const type = correct ? 'correct' : 'wrong'
  const path = `${BASE}/shared/${type}_${index}.mp3`

  stop()
  const audio = new Audio(path)

  audio.addEventListener('ended', () => {
    current = null
    done()
  })

  audio.addEventListener('error', () => {
    // No audio file yet — call onEnd immediately so the app continues
    current = null
    done()
  })

  current = audio
  audio.play().catch(() => {
    current = null
    done()
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Replay current scene — called when learner taps replay button
// ─────────────────────────────────────────────────────────────────────────────

export function replayCurrentAudio(): void {
  if (current) {
    current.currentTime = 0
    current.play().catch(() => {})
  }
}