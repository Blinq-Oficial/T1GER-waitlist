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
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const resendKey = process.env.RESEND_API_KEY || 're_aKrQxPGy_76uyotpK65rMnfPtec3mgXhx';

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return res.status(500).json({ 
        error: 'Configuración incompleta: Faltan las variables de Supabase en Vercel (SUPABASE_URL o SUPABASE_ANON_KEY).' 
      });
    }

    // 1. Insert into Supabase Waitlist
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ email })
    });

    const supabaseData = await supabaseResponse.json();
    
    // Check for duplicate or other errors
    if (!supabaseResponse.ok) {
      if (supabaseData.code === '23505') {
        // We still want to get the position even if already registered
      } else {
        console.error('Supabase Error:', supabaseData);
        return res.status(supabaseResponse.status).json({ 
          error: `Error de base de datos: ${supabaseData.message || 'No se pudo guardar el email'}` 
        });
      }
    }

    // 2. Get Waitlist Position (Total Count)
    const countResponse = await fetch(`${supabaseUrl}/rest/v1/waitlist?select=count`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Range': '0-0'
      }
    });
    
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

      const { data: resendData, error: resendError } = await resend.emails.send({
        from: 'T1GER <equipo@t1ger.app>',
        to: [email],
        subject: '¡Tu posición en T1GER ha sido asegurada! 🐅',
        html: htmlTemplate,
      });

      if (resendError) {
        console.error('Resend API error:', resendError);
        // Note: We don't block the response here because the user is already in the DB
      }
    } catch (resendErr) {
      console.error('Failed to send email with Resend:', resendErr);
    }

    return res.status(200).json({ 
      success: true, 
      position: position || 800,
      refCode: refCode
    });

  } catch (error) {
    console.error('Waitlist API error:', error);
    return res.status(500).json({ 
      error: `Error interno: ${error.message || 'Desconocido'}` 
    });
  }
}

