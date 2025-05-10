// /app/api/feedback/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { feedback, anonymous } = await req.json()
    if (!feedback || typeof feedback !== 'string') {
      return NextResponse.json({ error: 'Falta el texto del feedback' }, { status: 400 })
    }

    // Variables de entorno
    const MAILTRAP_URL   = process.env.MAILTRAP_URL   // ej: "https://send.api.mailtrap.io"
    const MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN // tu token
    const MAILTRAP_FROM  = process.env.MAILTRAP_FROM  // ej: "feedback@tudominio.com"
    const MAILTRAP_TO    = process.env.MAILTRAP_TO    // ej: "destino@tudominio.com"
    const MAILTRAP_SUBJECT = process.env.MAILTRAP_SUBJECT || 'Feedback de Lampo'

    // Validación de env vars
    if (!MAILTRAP_URL || !MAILTRAP_TOKEN || !MAILTRAP_FROM || !MAILTRAP_TO) {
      console.error('Faltan variables de entorno:', { MAILTRAP_URL, MAILTRAP_TOKEN, MAILTRAP_FROM, MAILTRAP_TO })
      return NextResponse.json({ error: 'Configuración de servidor incompleta' }, { status: 500 })
    }

    // Llamada al API de Mailtrap
    const apiRes = await fetch(`${MAILTRAP_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILTRAP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { email: MAILTRAP_FROM },
        to:   [{ email: MAILTRAP_TO }],
        subject: `${MAILTRAP_SUBJECT}${anonymous? ' Anonymous' : ' From User'}`,
        text: feedback,
        // si quisieras HTML: html: "<p>…</p>"
      }),
    })

    if (!apiRes.ok) {
      const body = await apiRes.text()
      console.error('Mailtrap API retornó error', apiRes.status, body)
      return NextResponse.json({ error: 'Error al enviar correo' }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('Error interno en /api/feedback:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
