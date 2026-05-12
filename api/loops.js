export const config = {
  api: {
    bodyParser: true,
  },
};

import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://pzxjwqnxnkxtmwovzsuv.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eGp3cW54bmt4dG13b3Z6c3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjQyNDAsImV4cCI6MjA5MzQwMDI0MH0.3aS948dQbncMdO5ihsJPWuxs9Mxq2HZPCZEZIHGlwVc';
    const resendKey = process.env.RESEND_API_KEY || 're_aKrQxPGy_76uyotpK65rMnfPtec3mgXhx';

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ 
        error: 'Configuración incompleta: Faltan las variables de Supabase (SUPABASE_URL o SUPABASE_ANON_KEY) en Vercel.' 
      });
    }

    // 1. Insert into Supabase Waitlist
    let supabaseResponse;
    try {
      supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ email })
      });
    } catch (e) {
      return res.status(500).json({ error: `Falla de red al insertar en Supabase: ${e.message}. Verifica que SUPABASE_URL sea correcta.` });
    }

    const supabaseData = await supabaseResponse.json();
    
    if (!supabaseResponse.ok) {
      if (supabaseData.code !== '23505') {
        return res.status(supabaseResponse.status).json({ 
          error: `Supabase respondió con error: ${supabaseData.message || 'Error desconocido'}` 
        });
      }
    }

    // 2. Get Waitlist Position
    let countResponse;
    try {
      countResponse = await fetch(`${supabaseUrl}/rest/v1/waitlist?select=count`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Range': '0-0'
        }
      });
    } catch (e) {
      return res.status(500).json({ error: `Falla de red al obtener conteo de Supabase: ${e.message}` });
    }
    
    const totalCount = countResponse.headers.get('content-range')?.split('/')[1] || "800";
    const position = parseInt(totalCount, 10);

    const user = Array.isArray(supabaseData) ? supabaseData[0] : null;
    const refCode = user?.ref_code || 'T1G-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    // 3. Send email via Resend
    try {
      const resend = new Resend(resendKey);
      
      const htmlTemplate = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px; border-radius: 8px; border: 1px solid #333;">
          <h1 style="color: #FF6B00; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">Bienvenido a la jungla.</h1>
          <p style="font-size: 16px; color: #ccc; line-height: 1.6;">Has asegurado tu posición en la waitlist de <strong>T1GER</strong>.</p>
          <div style="background-color: #111; border: 1px solid #FF6B00; padding: 25px; text-align: center; margin: 30px 0; border-radius: 12px;">
            <p style="margin: 0; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 4px;">Tu número de posición</p>
            <h2 style="margin: 10px 0 0 0; font-size: 56px; color: #fff; font-weight: 900;">#${position}</h2>
          </div>
          <p style="font-size: 16px; color: #ccc; line-height: 1.6;">Cada invitación te acerca más al lanzamiento. Comparte tu link único:</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="https://t1ger.app/?ref=${position}" style="background-color: #FF6B00; color: #000; padding: 18px 35px; text-decoration: none; font-weight: bold; border-radius: 50px; text-transform: uppercase; letter-spacing: 2px; display: inline-block;">HUNT GREATNESS</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #222; margin: 40px 0;">
          <p style="font-size: 12px; color: #444; text-align: center; text-transform: uppercase; letter-spacing: 3px;">T1GER | BUILD DISCIPLINE</p>
        </div>
      `;

      await resend.emails.send({
        from: 'T1GER <equipo@t1ger.app>',
        to: [email],
        subject: '¡Tu posición en T1GER ha sido asegurada! 🐅',
        html: htmlTemplate,
      });

    } catch (resendErr) {
      console.error('Resend Error:', resendErr);
      // We don't fail the whole request if email fails, but we could return a warning
    }

    return res.status(200).json({ 
      success: true, 
      position: position || 800,
      refCode: refCode
    });

  } catch (error) {
    return res.status(500).json({ error: `Error inesperado: ${error.message}` });
  }
}


