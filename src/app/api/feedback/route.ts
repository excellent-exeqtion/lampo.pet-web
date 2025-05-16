
// src/app/api/feedback/route.ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/services/emailService';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { feedback, anonymous, userEmail } = await req.json();
    if (!feedback || typeof feedback !== 'string') {
      return NextResponse.json({ error: 'Falta el texto del feedback' }, { status: 400 });
    }

    const subjectBase = process.env.MAILTRAP_SUBJECT || 'Feedback de Lampo';
    const subject = anonymous
      ? `${subjectBase} (Anonymous)`
      : `${subjectBase} (From ${userEmail})`;

    // Llamada al servicio de email
    await sendEmail({ subject, text: feedback });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('Error interno en /api/feedback:', err);
    const message = err instanceof Error ? err.message : 'Error interno del servidor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
