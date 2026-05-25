// sessionStore.ts
// Offline-first storage using IndexedDB.
// Queues task attempts when device is offline.
// Syncs to adaptive engine when connection is restored.

const DB_NAME = 'lifebuddy'
const DB_VERSION = 1
const STORE_ATTEMPTS = 'pending_attempts'
const STORE_SESSION = 'session_state'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface PendingAttempt {
  id?: number
  learner_id: string
  skill: string
  task_id: string
  success: boolean
  response_time: number
  hints_used: number
  timestamp: number
  synced: boolean
}

export interface SessionState {
  learner_id: string
  skill: string
  tier: number
  difficulty: 'easy' | 'intermediate' | 'advanced'
  difficulty_attempts: number
  tasks_completed: string[]
  weak_topics: string[]
  high_performer_gaps: string[]
  guided_mode_triggered: boolean
  current_task_index: number
  mastery: number
  last_updated: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Open database
// ─────────────────────────────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains(STORE_ATTEMPTS)) {
        const store = db.createObjectStore(STORE_ATTEMPTS, {
          keyPath: 'id',
          autoIncrement: true,
        })
        store.createIndex('synced', 'synced', { unique: false })
        store.createIndex('learner_id', 'learner_id', { unique: false })
      }

      if (!db.objectStoreNames.contains(STORE_SESSION)) {
        db.createObjectStore(STORE_SESSION, { keyPath: 'learner_id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Save a pending attempt (when offline)
// ─────────────────────────────────────────────────────────────────────────────

export async function savePendingAttempt(attempt: PendingAttempt): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_ATTEMPTS, 'readwrite')
    tx.objectStore(STORE_ATTEMPTS).add({ ...attempt, synced: false })
    await new Promise((res, rej) => {
      tx.oncomplete = res
      tx.onerror = rej
    })
  } catch (err) {
    console.error('sessionStore: failed to save attempt', err)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Get all unsynced attempts
// ─────────────────────────────────────────────────────────────────────────────

export async function getPendingAttempts(): Promise<PendingAttempt[]> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ATTEMPTS, 'readonly')
      const index = tx.objectStore(STORE_ATTEMPTS).index('synced')
      const request = index.getAll(IDBKeyRange.only(false))
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch {
    return []
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mark attempt as synced
// ─────────────────────────────────────────────────────────────────────────────

export async function markAttemptSynced(id: number): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_ATTEMPTS, 'readwrite')
    const store = tx.objectStore(STORE_ATTEMPTS)
    const request = store.get(id)
    request.onsuccess = () => {
      const record = request.result
      if (record) {
        record.synced = true
        store.put(record)
      }
    }
  } catch (err) {
    console.error('sessionStore: failed to mark synced', err)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Save session state (progress within a skill)
// Called after every task so learner can resume if they close the app
// ─────────────────────────────────────────────────────────────────────────────

export async function saveSessionState(state: SessionState): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_SESSION, 'readwrite')
    tx.objectStore(STORE_SESSION).put({
      ...state,
      last_updated: Date.now(),
    })
  } catch (err) {
    console.error('sessionStore: failed to save session state', err)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Load session state
// Called on app start to restore progress
// ─────────────────────────────────────────────────────────────────────────────

export async function loadSessionState(
  learnerId: string
): Promise<SessionState | null> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SESSION, 'readonly')
      const request = tx.objectStore(STORE_SESSION).get(learnerId)
      request.onsuccess = () => resolve(request.result ?? null)
      request.onerror = () => reject(request.error)
    })
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Clear session state after skill completion
// ─────────────────────────────────────────────────────────────────────────────

export async function clearSessionState(learnerId: string): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_SESSION, 'readwrite')
    tx.objectStore(STORE_SESSION).delete(learnerId)
  } catch (err) {
    console.error('sessionStore: failed to clear session', err)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sync pending attempts to server
// Called when online connection is restored
// ─────────────────────────────────────────────────────────────────────────────

export async function syncPendingAttempts(
  onSync: (attempt: PendingAttempt) => Promise<boolean>
): Promise<{ synced: number; failed: number }> {
  const pending = await getPendingAttempts()
  let synced = 0
  let failed = 0

  for (const attempt of pending) {
    const success = await onSync(attempt)
    if (success && attempt.id !== undefined) {
      await markAttemptSynced(attempt.id)
      synced++
    } else {
      failed++
    }
  }

  return { synced, failed }
}

// ─────────────────────────────────────────────────────────────────────────────
// Check if device is online
// ─────────────────────────────────────────────────────────────────────────────

export function isOnline(): boolean {
  return navigator.onLine
}

// ─────────────────────────────────────────────────────────────────────────────
// Listen for connection restore and auto-sync
// ─────────────────────────────────────────────────────────────────────────────

export function watchConnectivity(
  onSync: (attempt: PendingAttempt) => Promise<boolean>
): () => void {
  const handler = async () => {
    if (navigator.onLine) {
      const result = await syncPendingAttempts(onSync)
      if (result.synced > 0) {
        console.log(`sessionStore: synced ${result.synced} pending attempts`)
      }
    }
  }

  window.addEventListener('online', handler)
  return () => window.removeEventListener('online', handler)
}