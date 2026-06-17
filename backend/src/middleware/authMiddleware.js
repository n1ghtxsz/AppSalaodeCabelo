const { createSupabaseWithAccessToken } = require('../db');

/**
 * Valida Bearer JWT e anexa req.user, req.accessToken e req.supabaseUser.
 */
async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acesso em falta.' });
  }
  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    return res.status(401).json({ error: 'Token de acesso em falta.' });
  }

  const supabaseUser = createSupabaseWithAccessToken(token);
  const { data, error } = await supabaseUser.auth.getUser();

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }

  req.accessToken = token;
  req.user = data.user;
  req.supabaseUser = supabaseUser;
  return next();
}

module.exports = { requireAuth };
