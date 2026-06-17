const serviceController = {
  async list(req, res) {
    try {
      const { data: services, error } = await req.supabaseUser
        .from('services')
        .select('id, name, duration_minutes, price, service_categories(id, name)')
        .eq('is_active', true)
        .order('name')

      if (error) return res.status(400).json({ error: error.message })

      const { data: categories } = await req.supabaseUser
        .from('service_categories')
        .select('id, name')
        .order('sort_order')

      return res.json({
        services: (services || []).map((s) => ({
          id:               s.id,
          name:             s.name,
          duration_minutes: s.duration_minutes,
          price:            s.price,
          category_id:      s.service_categories?.id   ?? null,
          category:         s.service_categories?.name ?? null,
        })),
        categories: categories || [],
      })
    } catch (e) {
      console.error('[services.list]', e.message)
      return res.status(500).json({ error: 'Erro interno no servidor' })
    }
  },
}

module.exports = serviceController
