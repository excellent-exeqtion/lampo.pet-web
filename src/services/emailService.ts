// src/services/emailService.ts
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

export interface SendEmailOptions {
  subject: string;
  text?: string; // El texto plano ahora es opcional
  html?: string; // Para enviar HTML directamente
  template?: string; // Nombre del archivo de plantilla (sin .hbs)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>; // Datos para la plantilla
  from?: string;
  to?: string;
}

export async function sendEmail({ subject, text, html, template, context, from, to }: SendEmailOptions) {
  const MAILTRAP_URL = process.env.MAILTRAP_URL;
  const MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN;
  const MAILTRAP_FROM = from || process.env.MAILTRAP_FROM;
  const MAILTRAP_TO = to || process.env.MAILTRAP_TO;

  if (!MAILTRAP_URL || !MAILTRAP_TOKEN || !MAILTRAP_FROM || !MAILTRAP_TO) {
    throw new Error('Configuración de email incompleta');
  }

  let finalHtml = html;

  if (template && context) {
    const templatePath = path.join(process.cwd(), 'src', 'templates', `${template}.hbs`);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateSource);
    finalHtml = compiledTemplate(context);
  }

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
      text: text || "Este correo contiene formato HTML que no pudo ser visualizado.", // Fallback de texto plano
      html: finalHtml,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al enviar correo: ${response.status} - ${errorText}`);
  }
}