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
      console.error('Missing environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
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
    const resend = new Resend(resendKey);
    
    const htmlTemplate = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px; border-radius: 8px;">
        <h1 style="color: #FF6B00; text-transform: uppercase; letter-spacing: 2px;">Bienvenido a la jungla.</h1>
        <p style="font-size: 16px; color: #ccc;">Has asegurado tu posición en la waitlist de T1GER.</p>
        <div style="background-color: #111; border: 1px solid #333; padding: 20px; text-align: center; margin: 30px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 4px;">Tu número de posición</p>
          <h2 style="margin: 10px 0 0 0; font-size: 48px; color: #fff;">#${position}</h2>
        </div>
        <p style="font-size: 16px; color: #ccc;">Puedes subir de posición invitando a más personas. Comparte este enlace exclusivo:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://t1ger.app/?ref=${position}" style="background-color: #FF6B00; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 30px; text-transform: uppercase; letter-spacing: 1px;">Comparte tu link</a>
        </p>
        <p style="font-size: 12px; color: #555; text-align: center; margin-top: 40px;">T1GER - The Duolingo for Founders</p>
      </div>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: 'T1GER <equipo@t1ger.app>', // IMPORTANTE: Debes tener este dominio verificado en Resend
        to: [email],
        subject: '¡Tu posición en T1GER ha sido asegurada! 🐅',
        html: htmlTemplate,
      });

      if (error) {
        console.error('Resend API error:', error);
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
    return res.status(500).json({ error: 'Internal server error' });
  }
}
