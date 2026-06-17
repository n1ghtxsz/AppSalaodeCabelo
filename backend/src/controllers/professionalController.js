const professionalController = {
  async list(req, res) {
    try {
      const { data, error } = await req.supabaseUser
        .from('professionals')
        .select('id, name, role, avatar_url')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) return res.status(400).json({ error: error.message })
      return res.json({ professionals: data || [] })
    } catch (e) {
      console.error('[professionals.list]', e.message)
      return res.status(500).json({ error: 'Erro interno no servidor' })
    }
  },
}

module.exports = professionalController
