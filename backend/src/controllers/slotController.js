const SLOT_INTERVAL = 30 // minutes between slots

function toMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function fromMinutes(min) {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
}

function generateSlots(startTime, endTime, duration) {
  const slots = []
  let cur = toMinutes(startTime)
  const end = toMinutes(endTime) - duration
  while (cur <= end) {
    slots.push(fromMinutes(cur))
    cur += SLOT_INTERVAL
  }
  return slots
}

function slotsOverlap(slotTime, slotDuration, aptTime, aptDuration) {
  const slotStart = toMinutes(slotTime)
  const slotEnd   = slotStart + slotDuration
  const aptStart  = toMinutes(aptTime)
  const aptEnd    = aptStart + aptDuration
  return slotStart < aptEnd && slotEnd > aptStart
}

const slotController = {
  async get(req, res) {
    try {
      const { professional_id, service_id, date } = req.query
      if (!service_id || !date) {
        return res.status(400).json({ error: 'service_id e date são obrigatórios' })
      }

      const { data: service } = await req.supabaseUser
        .from('services')
        .select('duration_minutes')
        .eq('id', service_id)
        .single()

      if (!service) return res.status(404).json({ error: 'Serviço não encontrado' })

      const duration = service.duration_minutes
      const weekday  = new Date(`${date}T12:00:00`).getDay()

      // get working hours (professional-specific or defaults)
      let startTime = '09:00'
      let endTime   = '18:00'

      if (professional_id) {
        const { data: wh } = await req.supabaseUser
          .from('working_hours')
          .select('start_time, end_time')
          .eq('professional_id', professional_id)
          .eq('weekday', weekday)
          .eq('is_active', true)
          .maybeSingle()

        if (wh) {
          startTime = wh.start_time.slice(0, 5)
          endTime   = wh.end_time.slice(0, 5)
        }
      }

      const allSlots = generateSlots(startTime, endTime, duration)

      // fetch booked appointments for that day
      const query = req.supabaseUser
        .from('appointments')
        .select('scheduled_at, duration_minutes')
        .gte('scheduled_at', `${date}T00:00:00`)
        .lte('scheduled_at', `${date}T23:59:59`)
        .in('status', ['pending', 'confirmed'])

      if (professional_id) query.eq('professional_id', professional_id)

      const { data: booked } = await query

      const bookedTimes = (booked || []).map((a) => ({
        time:     new Date(a.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        duration: a.duration_minutes,
      }))

      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]

      const slots = allSlots.map((time) => {
        const isPast = date === todayStr && toMinutes(time) <= now.getHours() * 60 + now.getMinutes()
        const isTaken = bookedTimes.some((b) => slotsOverlap(time, duration, b.time, b.duration))
        return { time, available: !isPast && !isTaken }
      })

      return res.json({ slots, date })
    } catch (e) {
      console.error('[slots.get]', e.message)
      return res.status(500).json({ error: 'Erro interno no servidor' })
    }
  },
}

module.exports = slotController
