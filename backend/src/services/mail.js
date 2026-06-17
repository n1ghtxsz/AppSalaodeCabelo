const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM    = process.env.EMAIL_FROM    || 'Atelier Rose <noreply@atelierrose.com.br>';
const APP_URL = process.env.FRONTEND_URL  || 'http://localhost:5173';

/* ── templates ────────────────────────────────────────────── */

function welcomeHtml(firstName) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bem-vinda ao Atelier Rose</title>
</head>
<body style="margin:0;padding:0;background:#f9f0f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f0f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(90,6,48,0.08);">

          <!-- header gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#e0399c 0%,#c41d68 50%,#8b0847 100%);padding:40px 48px;text-align:center;">
              <div style="width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                <span style="font-size:22px;">✦</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Atelier Rose</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;letter-spacing:1px;text-transform:uppercase;">Sua beleza, com hora marcada.</p>
            </td>
          </tr>

          <!-- body -->
          <tr>
            <td style="padding:48px;">
              <p style="margin:0 0 8px;font-size:13px;color:#c41d68;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Bem-vinda ✨</p>
              <h2 style="margin:0 0 20px;font-size:28px;font-weight:700;color:#1a1a2e;line-height:1.2;">
                Olá, ${firstName}!
              </h2>
              <p style="margin:0 0 16px;font-size:15px;color:#555;line-height:1.7;">
                Sua conta foi criada com sucesso. Agora você pode agendar serviços com nossas profissionais, acompanhar seus horários e muito mais — tudo em poucos toques.
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#555;line-height:1.7;">
                Estamos felizes em ter você com a gente. 💕
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${APP_URL}/dashboard"
                       style="display:inline-block;background:linear-gradient(135deg,#f472b6 0%,#e0399c 50%,#c41d68 100%);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:100px;letter-spacing:0.3px;">
                      Acessar minha conta
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- divider -->
          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:#f0e6ee;"></div>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding:32px 48px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#aaa;line-height:1.6;">
                Você está recebendo este e-mail porque criou uma conta no Atelier Rose.<br />
                Se não foi você, ignore esta mensagem.
              </p>
              <p style="margin:0;font-size:12px;color:#c41d68;font-weight:600;">
                © ${new Date().getFullYear()} Atelier Rose — Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ── senders ──────────────────────────────────────────────── */

async function sendWelcome({ name, email }) {
  const firstName = String(name).trim().split(' ')[0];
  const { data, error } = await resend.emails.send({
    from:    FROM,
    to:      email,
    subject: `Bem-vinda ao Atelier Rose, ${firstName}! ✨`,
    html:    welcomeHtml(firstName),
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
  return data;
}

module.exports = { sendWelcome };
