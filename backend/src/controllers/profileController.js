const { supabase, getSupabaseAdmin } = require('../db');

function rowToApi(row, authUser) {
  if (!authUser) return null;
  const email = authUser.email || '';
  const r = row || {};
  return {
    email,
    firstName: r.first_name || '',
    lastName: r.last_name || '',
    fullName: r.full_name || '',
    phone: r.phone || '',
    address: r.address || '',
    avatarUrl: r.avatar_url || authUser.user_metadata?.avatar_url || '',
    preferredStylist: r.preferred_stylist || 'Sem preferência',
    preferredDrink: r.preferred_drink || 'Água',
    quietAppointment: !!r.quiet_appointment,
    notifySms: r.notify_sms !== false,
    notifyEmailNewsletter: !!r.notify_email_newsletter,
    notifyPush: r.notify_push !== false,
    notifyBookingConfirm: r.notify_booking_confirm !== false,
    twoFactorEnabled: !!r.two_factor_enabled,
    createdAt: r.created_at || null,
    updatedAt: r.updated_at || null,
  };
}

async function getProfile(req, res) {
  try {
    const { data: row, error } = await req.supabaseUser
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      profile: rowToApi(row, req.user),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

async function patchProfile(req, res) {
  try {
    const b = req.body || {};
    const update = {};

    if (b.firstName !== undefined) update.first_name = b.firstName;
    if (b.lastName !== undefined) update.last_name = b.lastName;
    if (b.phone !== undefined) update.phone = b.phone;
    if (b.address !== undefined) update.address = b.address;
    if (b.avatarUrl !== undefined) update.avatar_url = b.avatarUrl;
    if (b.preferredStylist !== undefined) update.preferred_stylist = b.preferredStylist;
    if (b.preferredDrink !== undefined) update.preferred_drink = b.preferredDrink;
    if (b.quietAppointment !== undefined) update.quiet_appointment = !!b.quietAppointment;
    if (b.notifySms !== undefined) update.notify_sms = !!b.notifySms;
    if (b.notifyEmailNewsletter !== undefined) update.notify_email_newsletter = !!b.notifyEmailNewsletter;
    if (b.notifyPush !== undefined) update.notify_push = !!b.notifyPush;
    if (b.notifyBookingConfirm !== undefined) update.notify_booking_confirm = !!b.notifyBookingConfirm;
    if (b.twoFactorEnabled !== undefined) update.two_factor_enabled = !!b.twoFactorEnabled;

    if (b.fullName !== undefined) {
      update.full_name = b.fullName;
    } else if (b.firstName !== undefined || b.lastName !== undefined) {
      const fn = b.firstName !== undefined ? b.firstName : undefined;
      const ln = b.lastName !== undefined ? b.lastName : undefined;
      const { data: cur } = await req.supabaseUser
        .from('profiles')
        .select('first_name,last_name')
        .eq('id', req.user.id)
        .maybeSingle();
      const mergedFn = fn !== undefined ? fn : (cur?.first_name || '');
      const mergedLn = ln !== undefined ? ln : (cur?.last_name || '');
      update.full_name = `${mergedFn} ${mergedLn}`.trim();
    }

    const { data: existing, error: exErr } = await req.supabaseUser
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (exErr) {
      return res.status(400).json({ error: exErr.message });
    }

    let row;
    if (existing) {
      if (Object.keys(update).length === 0) {
        return res.json({ profile: rowToApi(existing, req.user) });
      }
      const { data, error } = await req.supabaseUser
        .from('profiles')
        .update(update)
        .eq('id', req.user.id)
        .select('*')
        .single();
      if (error) return res.status(400).json({ error: error.message });
      row = data;
    } else {
      const fullName =
        update.full_name ||
        req.user.user_metadata?.full_name ||
        (req.user.email ? req.user.email.split('@')[0] : 'Utilizador');
      const insertRow = {
        id: req.user.id,
        full_name: fullName,
        first_name: update.first_name ?? req.user.user_metadata?.first_name ?? '',
        last_name: update.last_name ?? req.user.user_metadata?.last_name ?? '',
        phone: update.phone ?? null,
        address: update.address ?? null,
        avatar_url: update.avatar_url ?? null,
        preferred_stylist: update.preferred_stylist ?? 'Sem preferência',
        preferred_drink: update.preferred_drink ?? 'Água',
        quiet_appointment: update.quiet_appointment ?? false,
        notify_sms: update.notify_sms ?? true,
        notify_email_newsletter: update.notify_email_newsletter ?? false,
        notify_push: update.notify_push ?? true,
        notify_booking_confirm: update.notify_booking_confirm ?? true,
        two_factor_enabled: update.two_factor_enabled ?? false,
        ...update,
      };
      const { data, error } = await req.supabaseUser.from('profiles').insert(insertRow).select('*').single();
      if (error) return res.status(400).json({ error: error.message });
      row = data;
    }

    return res.json({ profile: rowToApi(row, req.user) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

async function changePassword(req, res) {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return res.status(503).json({
        error: 'Alteração de palavra-passe no servidor requer SUPABASE_SERVICE_ROLE_KEY no .env.',
      });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Palavra-passe atual e nova são obrigatórias.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'A nova palavra-passe deve ter pelo menos 6 caracteres.' });
    }

    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: req.user.email,
      password: currentPassword,
    });
    if (signErr) {
      return res.status(400).json({ error: 'Palavra-passe atual incorreta.' });
    }

    const { error: updErr } = await admin.auth.admin.updateUserById(req.user.id, {
      password: newPassword,
    });
    if (updErr) {
      return res.status(400).json({ error: updErr.message });
    }

    return res.json({ message: 'Palavra-passe atualizada.' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

async function deleteAccount(req, res) {
  try {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return res.status(503).json({
        error: 'Eliminar conta requer SUPABASE_SERVICE_ROLE_KEY no .env.',
      });
    }

    const { error } = await admin.auth.admin.deleteUser(req.user.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ message: 'Conta eliminada.' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

async function exportData(req, res) {
  try {
    const { data: row, error } = await req.supabaseUser
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      exportedAt: new Date().toISOString(),
      auth: {
        id: req.user.id,
        email: req.user.email,
        created_at: req.user.created_at,
      },
      profile: row || null,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

module.exports = {
  getProfile,
  patchProfile,
  changePassword,
  deleteAccount,
  exportData,
  rowToApi,
};
