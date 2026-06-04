// DragDrop.tsx
// Desktop: drag items into drop zones
// Mobile: tap item to select, tap zone to place
// Hover/long press → plays option audio
// All placed correctly → plays verdict audio

import { useState, useRef } from 'react'
import type { Task } from '../../tasks/taskData_money'
import { playOptionAudio, playVerdictAudio, stop } from '../audioManager'

interface DragDropProps {
  task: Task
  learnerId: string
  onAnswer: (correct: boolean, responseTime: number, hintsUsed: number) => void
  hintsAllowed: boolean
  showHint?: boolean
}

interface Placement {
  itemId: string
  zoneId: string
}

export default function DragDrop({ task, learnerId, onAnswer, hintsAllowed, showHint: followUpHint = false }: DragDropProps) {
  const items     = task.dragItems ?? []
  const zones     = task.dropZones ?? []

  const [placements, setPlacements]   = useState<Placement[]>([])
  const [selected, setSelected]       = useState<string | null>(null)
  const [revealed, setRevealed]       = useState(false)
  const [showHint, setShowHint]       = useState(followUpHint)
  const [hintsUsed, setHintsUsed]     = useState(followUpHint ? 1 : 0)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const startTime                     = useRef(Date.now())
  const longPressTimer                = useRef<ReturnType<typeof setTimeout> | null>(null)

  const getItemZone = (itemId: string) =>
    placements.find(p => p.itemId === itemId)?.zoneId ?? null

  const getZoneItems = (zoneId: string) =>
    placements.filter(p => p.zoneId === zoneId).map(p => p.itemId)

  const unplacedItems = items.filter(item => !getItemZone(item.id))
  const allPlaced = placements.length === items.length

  // Follow-up hint: find next item to place and its target zone
  const nextHintItem = followUpHint && !revealed
    ? unplacedItems.find(item => item.targetZone)
    : null
  const nextHintZone = nextHintItem?.targetZone ?? null
  const isItemSelected = selected !== null

  const checkAllCorrect = (currentPlacements: Placement[]) => {
    return currentPlacements.every(p => {
      const item = items.find(i => i.id === p.itemId)
      return item?.targetZone === p.zoneId
    })
  }

  const placeItem = (itemId: string, zoneId: string) => {
    const newPlacements = [
      ...placements.filter(p => p.itemId !== itemId),
      { itemId, zoneId },
    ]
    setPlacements(newPlacements)
    setSelected(null)

    if (newPlacements.length === items.length) {
      setRevealed(true)
      const correct = checkAllCorrect(newPlacements)
      const responseTime = Date.now() - startTime.current
      playVerdictAudio(correct, () => {
        onAnswer(correct, responseTime, hintsUsed)
      })
    }
  }

  const removeItem = (itemId: string) => {
    if (revealed) return
    setPlacements(placements.filter(p => p.itemId !== itemId))
  }

  // ── Desktop drag handlers ──────────────────────────────────────────────────

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault()
    if (draggedItem) {
      placeItem(draggedItem, zoneId)
      setDraggedItem(null)
    }
  }

  // ── Mobile tap handlers ────────────────────────────────────────────────────

  const handleItemTap = (itemId: string) => {
    if (revealed) return
    if (selected === itemId) {
      setSelected(null)
    } else {
      setSelected(itemId)
      playOptionAudio(task.id, task.skill, itemId)
    }
  }

  const handleZoneTap = (zoneId: string) => {
    if (revealed) return
    if (selected) {
      placeItem(selected, zoneId)
    }
  }

  const handleLongPress = (itemId: string) => {
    longPressTimer.current = setTimeout(() => {
      playOptionAudio(task.id, task.skill, itemId)
    }, 400)
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }

  const getItemStyle = (itemId: string, inZone = false) => {
    const zone = getItemZone(itemId)
    const item = items.find(i => i.id === itemId)
    const isCorrect = revealed && zone === item?.targetZone
    const isWrong   = revealed && zone !== item?.targetZone
    const isSelected = selected === itemId

    return {
      ...s.item,
      ...(isSelected ? s.itemSelected : {}),
      ...(inZone && isCorrect ? s.itemCorrect : {}),
      ...(inZone && isWrong   ? s.itemWrong   : {}),
    }
  }

  return (
    <div style={s.wrap}>
      <style>{`@keyframes pulseHint{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.85)}} .pulse-hint{animation:pulseHint 0.8s ease-in-out infinite}`}</style>

      {/* Question */}
      <div style={s.question}>{task.question}</div>
      {task.context && <div style={s.context}>{task.context}</div>}

      {/* Unplaced items */}
      {unplacedItems.length > 0 && (
        <div style={s.section}>
          <div style={s.sectionLabel}>Items to sort</div>
          <div style={s.itemPool}>
            {unplacedItems.map(item => (
              <div
                key={item.id}
                style={{
                  ...getItemStyle(item.id),
                  ...(followUpHint && nextHintItem?.id === item.id && !selected ? {
                    border: '2px solid #fbbf24',
                    boxShadow: '0 0 12px rgba(251,191,36,0.4)',
                  } : {}),
                }}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                onClick={() => handleItemTap(item.id)}
                onTouchStart={() => handleLongPress(item.id)}
                onTouchEnd={handleLongPressEnd}
                onMouseEnter={() => !revealed && playOptionAudio(task.id, task.skill, item.id)}
                onMouseLeave={() => !revealed && stop()}
              >
                {item.label}
                {followUpHint && nextHintItem?.id === item.id && !selected && (
                  <span className="pulse-hint" style={{ fontSize: 14, marginLeft: 4 }}>👆</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hint */}
      {hintsAllowed && !revealed && !showHint && (
        <button style={s.hintBtn} onClick={() => { setShowHint(true); setHintsUsed(h => h + 1) }}>
          💡 Show hint
        </button>
      )}
      {showHint && <div style={s.hintBox}>{task.hint}</div>}

      {/* Drop zones */}
      <div style={s.zones}>
        {zones.map(zone => {
          const zoneItems = getZoneItems(zone.id)
          const isActive = selected !== null

          return (
            <div
              key={zone.id}
              style={{
                ...s.zone,
                ...(isActive && !revealed ? s.zoneActive : {}),
                ...(followUpHint && isItemSelected && nextHintZone === zone.id && !revealed ? {
                  border: '2px dashed #fbbf24',
                  background: 'rgba(251,191,36,0.08)',
                  boxShadow: '0 0 16px rgba(251,191,36,0.2)',
                } : {}),
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, zone.id)}
              onClick={() => handleZoneTap(zone.id)}
            >
              <div style={s.zoneLabel}>
                {zone.label}
                {followUpHint && isItemSelected && nextHintZone === zone.id && !revealed && (
                  <span className="pulse-hint" style={{ fontSize: 14, marginLeft: 6 }}>👆 Drop here</span>
                )}
              </div>
              <div style={s.zoneItems}>
                {zoneItems.length === 0 && (
                  <div style={s.zonePlaceholder}>
                    {isActive ? 'Tap to place here' : 'Drop items here'}
                  </div>
                )}
                {zoneItems.map(itemId => {
                  const item = items.find(i => i.id === itemId)
                  if (!item) return null
                  return (
                    <div
                      key={itemId}
                      style={getItemStyle(itemId, true)}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!revealed) removeItem(itemId)
                      }}
                    >
                      {item.label}
                      {!revealed && (
                        <span style={s.removeBtn}>×</span>
                      )}
                      {revealed && (
                        <span style={
                          item.targetZone === zone.id ? s.tick : s.cross
                        }>
                          {item.targetZone === zone.id ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile tap instruction */}
      {!revealed && (
        <div style={s.tapInstruction}>
          📱 Tap an item to select it, then tap a zone to place it.
          Tap a placed item to move it back.
        </div>
      )}

      {/* Explanation */}
      {revealed && (
        <div style={s.explanation}>{task.explanation}</div>
      )}
    </div>
  )
}

const s: Record<string, any> = {
  wrap: {
    display: 'flex', flexDirection: 'column', gap: 14,
    padding: '0 4px',
  },
  question: {
    fontSize: 16, fontWeight: 600, color: '#f0eaff',
    lineHeight: 1.5, fontFamily: "'Syne', sans-serif",
  },
  context: {
    fontSize: 13, color: 'rgba(240,234,255,0.55)',
    lineHeight: 1.6, fontStyle: 'italic',
  },
  section: {
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  sectionLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'rgba(168,85,247,0.7)',
  },
  itemPool: {
    display: 'flex', flexWrap: 'wrap', gap: 8,
  },
  item: {
    padding: '8px 14px', borderRadius: 10,
    background: 'rgba(168,85,247,0.1)',
    border: '1px solid rgba(168,85,247,0.25)',
    color: '#f0eaff', fontSize: 13, fontWeight: 500,
    cursor: 'grab', userSelect: 'none',
    transition: 'all 0.2s', display: 'flex',
    alignItems: 'center', gap: 8,
  },
  itemSelected: {
    background: 'rgba(168,85,247,0.25)',
    border: '1px solid #a855f7',
    boxShadow: '0 0 12px rgba(168,85,247,0.3)',
    transform: 'scale(1.03)',
  },
  itemCorrect: {
    background: 'rgba(74,222,128,0.15)',
    border: '1px solid #4ade80',
    color: '#4ade80',
  },
  itemWrong: {
    background: 'rgba(248,113,113,0.15)',
    border: '1px solid #f87171',
    color: '#f87171',
  },
  zones: {
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  zone: {
    borderRadius: 16, padding: 14,
    background: 'rgba(255,255,255,0.03)',
    border: '1px dashed rgba(168,85,247,0.2)',
    transition: 'all 0.2s', cursor: 'pointer',
    minHeight: 80,
  },
  zoneActive: {
    border: '1px dashed rgba(168,85,247,0.6)',
    background: 'rgba(168,85,247,0.05)',
    boxShadow: '0 0 16px rgba(168,85,247,0.08)',
  },
  zoneLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'rgba(168,85,247,0.7)',
    marginBottom: 10,
  },
  zoneItems: {
    display: 'flex', flexWrap: 'wrap', gap: 8,
  },
  zonePlaceholder: {
    fontSize: 12, color: 'rgba(255,255,255,0.2)',
    fontStyle: 'italic',
  },
  removeBtn: {
    fontSize: 14, color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer', fontWeight: 700,
  },
  tick:  { color: '#4ade80', fontWeight: 800, fontSize: 14 },
  cross: { color: '#f87171', fontWeight: 800, fontSize: 14 },
  tapInstruction: {
    fontSize: 11, color: 'rgba(255,255,255,0.25)',
    lineHeight: 1.5, textAlign: 'center',
  },
  hintBtn: {
    alignSelf: 'flex-start', padding: '8px 16px',
    background: 'transparent', border: '1px solid rgba(168,85,247,0.3)',
    borderRadius: 20, color: 'rgba(168,85,247,0.8)',
    fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
  },
  hintBox: {
    padding: '12px 16px', borderRadius: 12,
    background: 'rgba(168,85,247,0.08)',
    border: '1px solid rgba(168,85,247,0.2)',
    fontSize: 13, color: 'rgba(240,234,255,0.7)', lineHeight: 1.6,
  },
  explanation: {
    padding: '12px 16px', borderRadius: 12,
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.06)',
    fontSize: 13, color: 'rgba(240,234,255,0.65)', lineHeight: 1.6,
  },
}