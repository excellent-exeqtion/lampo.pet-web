// src/services/emailService.ts

export interface SendEmailOptions {
  subject: string;
  text: string;
  from?: string;
  to?: string;
}

export async function sendEmail({ subject, text, from, to }: SendEmailOptions) {
  const MAILTRAP_URL = process.env.MAILTRAP_URL;
  const MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN;
  const MAILTRAP_FROM = from || process.env.MAILTRAP_FROM;
  const MAILTRAP_TO = to || process.env.MAILTRAP_TO;

  // Validación de configuración
  if (!MAILTRAP_URL || !MAILTRAP_TOKEN || !MAILTRAP_FROM || !MAILTRAP_TO) {
    throw new Error('Configuración de email incompleta');
  }

  // Envío de correo vía API
  const response = await fetch(MAILTRAP_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MAILTRAP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: { email: MAILTRAP_FROM },
      to: [{ email: MAILTRAP_TO }],
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al enviar correo: ${response.status} - ${errorText}`);
  }
}