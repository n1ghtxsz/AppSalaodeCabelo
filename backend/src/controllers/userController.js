const { supabase, createSupabaseWithAccessToken } = require('../db');
const { rowToApi } = require('./profileController');
const { sendWelcome } = require('../services/mail');

const userController = {
  async register(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const parts      = String(name).trim().split(/\s+/);
      const first_name = parts[0] || '';
      const last_name  = parts.slice(1).join(' ') || '';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, first_name, last_name } },
      });

      if (error) {
        const status = error.status === 429 ? 429 : 400;
        return res.status(status).json({ error: error.message });
      }

      let profile = null;

      if (data.session?.access_token) {
        const sb = createSupabaseWithAccessToken(data.session.access_token);

        if (phone) {
          await sb.from('profiles').update({ phone }).eq('id', data.user.id);
        }

        const { data: row } = await sb
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
        profile = rowToApi(row, data.user);

        // welcome e-mail — falha silenciosa para não bloquear o cadastro
        sendWelcome({ name, email }).catch((err) =>
          console.error('[register] welcome email failed:', err.message)
        );
      }

      return res.status(201).json({
        message: data.session ? 'Conta criada com sucesso!' : 'Verifique seu e-mail para ativar a conta.',
        user:    data.user,
        session: data.session,
        profile,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('[login] Supabase error:', error.message, error.status);
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      let profile = null;

      if (data.session?.access_token) {
        const sb = createSupabaseWithAccessToken(data.session.access_token);

        const { data: row } = await sb
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
        profile = rowToApi(row, data.user);
      }

      return res.status(200).json({
        message: 'Login realizado com sucesso',
        session: data.session,
        user:    data.user,
        profile,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },
};

module.exports = userController;
