const PT = 'pt-BR'

export function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatMonthYear(date) {
  return new Intl.DateTimeFormat(PT, { month: 'long', year: 'numeric' }).format(date)
    .replace(' de ', ', ')
    .replace(/^\w/, (c) => c.toUpperCase())
}

export function formatWeekdayShort(date) {
  return new Intl.DateTimeFormat(PT, { weekday: 'short' }).format(date)
    .replace('.', '').replace(/^\w/, (c) => c.toUpperCase())
}

export function formatShortDate(date) {
  return new Intl.DateTimeFormat(PT, { weekday: 'short', day: 'numeric', month: 'short' })
    .format(date).replace(/\./g, '')
}

export function formatLongDate(date) {
  return new Intl.DateTimeFormat(PT, { weekday: 'long', day: 'numeric', month: 'long' })
    .format(date)
}

export function formatTime(isoOrDate) {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate
  return new Intl.DateTimeFormat(PT, { hour: '2-digit', minute: '2-digit' }).format(d)
}

export function getDaysFrom(startDate, count) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    return d
  })
}

export function isToday(date) {
  const t = new Date()
  return date.getDate() === t.getDate()
    && date.getMonth() === t.getMonth()
    && date.getFullYear() === t.getFullYear()
}

export function isSameDay(a, b) {
  return a?.toDateString() === b?.toDateString()
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}min` : `${h}h`
}
