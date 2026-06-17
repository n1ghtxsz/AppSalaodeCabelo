import { useState } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import { useAvailableSlots } from '../../hooks/useAvailableSlots'
import {
  getDaysFrom, toDateStr, formatMonthYear,
  formatWeekdayShort, isSameDay, formatShortDate,
} from '../../utils/date'

const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)

function DayStrip({ days, selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 px-4 scrollbar-hide">
      {days.map((day) => {
        const isPast    = day < TODAY
        const isSelected = isSameDay(day, selected)
        return (
          <button
            key={day.toISOString()}
            onClick={() => !isPast && onSelect(day)}
            disabled={isPast}
            className={`flex flex-col items-center shrink-0 w-12 py-2 rounded-2xl transition-colors duration-150 ${
              isSelected
                ? 'text-white'
                : isPast
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            style={isSelected ? { background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 100%)' } : {}}
          >
            <span className="text-[10px] font-semibold uppercase">{formatWeekdayShort(day)}</span>
            <span className="text-lg font-bold leading-tight">{day.getDate()}</span>
          </button>
        )
      })}
    </div>
  )
}

function TimeSlotGrid({ slots, loading, selected, onSelect }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2.5 px-4">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="h-11 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  const available = slots.filter((s) => s.available)

  if (!slots.length) return (
    <p className="text-sm text-gray-400 text-center py-8 px-4">
      Selecione uma data para ver os horários disponíveis.
    </p>
  )

  if (!available.length) return (
    <p className="text-sm text-gray-400 text-center py-8 px-4">
      Nenhum horário disponível para essa data.
    </p>
  )

  return (
    <div className="grid grid-cols-3 gap-2.5 px-4">
      {slots.map(({ time, available: avail }) => {
        const isSelected = selected === time
        return (
          <button
            key={time}
            onClick={() => avail && onSelect(time)}
            disabled={!avail}
            className={`h-11 rounded-2xl text-sm font-semibold transition-all duration-150 ${
              !avail
                ? 'bg-gray-100 text-transparent cursor-not-allowed'
                : isSelected
                ? 'text-white shadow-md shadow-pink-200'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
            style={isSelected ? { background: 'linear-gradient(135deg, #f472b6 0%, #e0399c 100%)' } : {}}
          >
            {avail ? time : ''}
          </button>
        )
      })}
    </div>
  )
}

export default function StepDateTime({ serviceId, professionalId, selectedDate, selectedTime, onSelectDate, onSelectTime }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const weekStart = new Date(TODAY)
  weekStart.setDate(TODAY.getDate() + weekOffset * 7)
  const days = getDaysFrom(weekStart, 14)

  const dateStr = selectedDate ? toDateStr(selectedDate) : null
  const { slots, loading } = useAvailableSlots(serviceId, dateStr, professionalId)

  const displayMonth = selectedDate
    ? formatMonthYear(selectedDate)
    : formatMonthYear(weekStart)

  return (
    <div className="flex flex-col gap-5">
      {/* month nav */}
      <div className="flex items-center justify-between px-4">
        <h2 className="text-base font-bold text-gray-900 capitalize">{displayMonth}</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setWeekOffset((p) => Math.max(0, p - 1))}
            disabled={weekOffset === 0}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 disabled:opacity-30 transition-colors"
          >
            <RiArrowLeftSLine size={18} />
          </button>
          <button
            onClick={() => setWeekOffset((p) => p + 1)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <RiArrowRightSLine size={18} />
          </button>
        </div>
      </div>

      <DayStrip days={days} selected={selectedDate} onSelect={onSelectDate} />

      <div className="flex items-center justify-between px-4">
        <h3 className="text-sm font-bold text-gray-900">Horários disponíveis</h3>
        {selectedDate && (
          <span className="text-xs text-gray-400">{formatShortDate(selectedDate)}</span>
        )}
      </div>

      <TimeSlotGrid slots={slots} loading={loading && !!dateStr} selected={selectedTime} onSelect={onSelectTime} />
    </div>
  )
}
