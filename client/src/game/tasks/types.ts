// types.ts
// Shared task types used across all interaction components and the simulation engine.

export type TaskOption = {
  id: string
  label: string
  correct: boolean
}

export type TaskStep = {
  id: string
  label: string
  order: number
}

export type DragItem = {
  id: string
  label: string
  targetZone: string
}

export type DropZone = {
  id: string
  label: string
}

export type Task = {
  id: string
  skill: string
  tier: 1 | 2 | 3
  difficulty: 'easy' | 'intermediate' | 'advanced'
  type: 'tap_select' | 'scenario_choice' | 'true_false' | 'fill_blank' | 'sequential_steps' | 'drag_drop'
  topic: string
  question: string
  context?: string
  options?: TaskOption[]
  steps?: TaskStep[]
  dragItems?: DragItem[]
  dropZones?: DropZone[]
  hint: string
  explanation: string
}