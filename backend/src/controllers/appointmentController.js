const APT_FIELDS = `
  id, scheduled_at, duration_minutes, status, notes,
  services ( id, name, price, duration_minutes ),
  professionals ( id, name, role, avatar_url )
`

const appointmentController = {
  async getNext(req, res) {
    try {
      const { data, error } = await req.supabaseUser
        .from('appointments')
        .select(APT_FIELDS)
        .eq('client_id', req.user.id)
        .in('status', ['pending', 'confirmed'])
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (error) return res.status(400).json({ error: error.message })
      return res.json({ appointment: data })
    } catch (e) {
      console.error('[appointments.getNext]', e.message)
      return res.status(500).json({ error: 'Erro interno no servidor' })
    }
  },

  async getMy(req, res) {
    try {
      const { data, error } = await req.supabaseUser
        .from('appointments')
        .select(APT_FIELDS)
        .eq('client_id', req.user.id)
        .order('scheduled_at', { ascending: false })
        .limit(20)

      if (error) return res.status(400).json({ error: error.message })
      return res.json({ appointments: data || [] })
    } catch (e) {
      console.error('[appointments.getMy]', e.message)
      return res.status(500).json({ error: 'Erro interno no servidor' })
    }
  },

  async create(req, res) {
    try {
      const { professional_id, service_id, scheduled_at, notes } = req.body

      if (!professional_id || !service_id || !scheduled_at) {
        return res.status(400).json({ error: 'professional_id, service_id e scheduled_at são obrigatórios' })
      }

      const { data: service, error: svcErr } = await req.supabaseUser
        .from('services')
        .select('price, duration_minutes')
        .eq('id', service_id)
        .single()

      if (svcErr) return res.status(400).json({ error: 'Serviço não encontrado' })

      const { data: salons } = await req.supabaseUser
        .from('salons')
        .select('id')
        .limit(1)
        .single()

      const { data, error } = await req.supabaseUser
        .from('appointments')
        .insert({
          client_id:        req.user.id,
          professional_id,
          service_id,
          salon_id:         salons?.id,
          scheduled_at,
          duration_minutes: service.duration_minutes,
          price:            service.price,
          notes:            notes || null,
          status:           'pending',
        })
        .select(APT_FIELDS)
        .single()

      if (error) return res.status(400).json({ error: error.message })
      return res.status(201).json({ appointment: data })
    } catch (e) {
      console.error('[appointments.create]', e.message)
      return res.status(500).json({ error: 'Erro interno no servidor' })
    }
  },

  async cancel(req, res) {
    try {
      const { id } = req.params
      const { cancel_reason } = req.body

      const { data, error } = await req.supabaseUser
        .from('appointments')
        .update({ status: 'cancelled', cancelled_at: new Date().toISOString(), cancel_reason: cancel_reason || null })
        .eq('id', id)
        .eq('client_id', req.user.id)
        .select(APT_FIELDS)
        .single()

      if (error) return res.status(400).json({ error: error.message })
      if (!data)  return res.status(404).json({ error: 'Agendamento não encontrado' })
      return res.json({ appointment: data })
    } catch (e) {
      console.error('[appointments.cancel]', e.message)
      return res.status(500).json({ error: 'Erro interno no servidor' })
    }
  },
}

module.exports = appointmentController
