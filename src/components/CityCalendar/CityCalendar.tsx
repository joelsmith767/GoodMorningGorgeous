import { useMemo, useState } from 'react'
import { getDayKeyInZone } from '../../lib/dayKey'
import { useCityCalendar } from './useCityCalendar'
import { getMonthCells, MONTH_NAMES, WEEKDAY_LABELS } from './monthGrid'
import type { CalendarOwner } from '../../cities'
import './CityCalendar.css'

export interface CityCalendarProps {
  owner: CalendarOwner
  ownerLabel: string
  canEdit: boolean
  timeZone: string
}

export function CityCalendar({ owner, ownerLabel, canEdit, timeZone }: CityCalendarProps) {
  const { entries, loading, saveEntry } = useCityCalendar(owner)

  const todayKey = useMemo(() => getDayKeyInZone(timeZone), [timeZone])
  const [todayYear, todayMonth] = todayKey.split('-').map(Number)

  const [viewYear, setViewYear] = useState(todayYear)
  const [viewMonth, setViewMonth] = useState(todayMonth - 1)
  // Today's entry is open by default so there's always something to see on arrival.
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(todayKey)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  const cells = useMemo(() => getMonthCells(viewYear, viewMonth), [viewYear, viewMonth])

  const changeMonth = (delta: number) => {
    setSelectedDayKey(null)
    setIsEditing(false)
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  const selectDay = (dayKey: string) => {
    setSelectedDayKey(dayKey)
    setIsEditing(false)
    setJustSaved(false)
  }

  const closeEntry = () => {
    setSelectedDayKey(null)
    setIsEditing(false)
  }

  const startEdit = () => {
    if (!selectedDayKey) return
    setDraft(entries[selectedDayKey] ?? '')
    setIsEditing(true)
    setJustSaved(false)
  }

  const cancelEdit = () => setIsEditing(false)

  const handleSave = async () => {
    if (!selectedDayKey) return
    setSaving(true)
    try {
      await saveEntry(selectedDayKey, draft)
      setIsEditing(false)
      setJustSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="city-calendar">
      <div className="city-calendar__header">
        <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">
          ‹
        </button>
        <span>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">
          ›
        </button>
      </div>

      <p className="city-calendar__owner">
        {ownerLabel}
        {canEdit ? ' (you)' : ''}
      </p>

      <div className="city-calendar__weekdays">
        {WEEKDAY_LABELS.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>

      <div className="city-calendar__grid">
        {cells.map((cell, index) =>
          cell === null ? (
            <span key={`blank-${index}`} className="city-calendar__cell city-calendar__cell--blank" />
          ) : (
            <button
              key={cell.dayKey}
              type="button"
              className={[
                'city-calendar__cell',
                cell.dayKey === todayKey ? 'is-today' : '',
                entries[cell.dayKey] ? 'has-entry' : '',
                cell.dayKey === selectedDayKey ? 'is-selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => selectDay(cell.dayKey)}
            >
              {cell.day}
            </button>
          ),
        )}
      </div>

      {selectedDayKey && (
        <div className="city-calendar__entry">
          {isEditing ? (
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="What's happening this day?"
              rows={5}
              disabled={saving}
              autoFocus
            />
          ) : (
            <p className="city-calendar__entry-text">
              {entries[selectedDayKey] || 'Nothing written for this day yet.'}
            </p>
          )}

          <div className="city-calendar__entry-actions">
            {isEditing ? (
              <>
                <button type="button" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button type="button" onClick={cancelEdit} disabled={saving}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                {canEdit && (
                  <button type="button" onClick={startEdit} disabled={loading}>
                    Edit
                  </button>
                )}
                {justSaved && <span className="city-calendar__saved-note">Saved</span>}
                <button type="button" onClick={closeEntry}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
