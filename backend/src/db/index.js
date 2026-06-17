const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL ou Key não encontrados no .env');
}

/** Cliente público (registo/login sem sessão de utilizador). */
const supabase = createClient(supabaseUrl, supabaseKey);

/** Cliente com JWT do utilizador — respeita RLS nas tabelas public.* */
function createSupabaseWithAccessToken(accessToken) {
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/** Admin API (opcional: SUPABASE_SERVICE_ROLE_KEY). */
function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

module.exports = {
  supabase,
  createSupabaseWithAccessToken,
  getSupabaseAdmin,
};
