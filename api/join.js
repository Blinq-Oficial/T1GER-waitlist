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

  const { email, name, referredBy } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const supabaseUrl = 'https://pzxjwqnxnkxtmwovzsuv.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eGp3cW54bmt4dG13b3Z6c3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjQyNDAsImV4cCI6MjA5MzQwMDI0MH0.3aS948dQbncMdO5ihsJPWuxs9Mxq2HZPCZEZIHGlwVc';
    const resendKey = process.env.RESEND_API_KEY || 're_aKrQxPGy_76uyotpK65rMnfPtec3mgXhx';

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const payload = { email };
    if (name) payload.name = name;
    if (referredBy) payload.referred_by = referredBy;

    const response = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.code === '23505') {
        return res.status(409).json({ error: 'already_registered' });
      }
      console.error('Supabase insert error:', data);
      return res.status(500).json({ error: 'Failed to join waitlist' });
    }

    const user = data[0]; 
    const position = user.position || 0;
    const refCode = user.ref_code || '';

    // Send email via Resend
    const resend = new Resend(resendKey);
    
    const htmlTemplate = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px; border-radius: 8px; border: 1px solid #333;">
        <h1 style="color: #FF6B00; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">Welcome to the Jungle${name ? ', ' + name : ''}.</h1>
        <p style="font-size: 16px; color: #ccc; line-height: 1.6;">You have secured your position on the <strong>T1GER</strong> waitlist.</p>
        <div style="background-color: #111; border: 1px solid #FF6B00; padding: 25px; text-align: center; margin: 30px 0; border-radius: 12px;">
          <p style="margin: 0; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 4px;">Your Position</p>
          <h2 style="margin: 10px 0 0 0; font-size: 56px; color: #fff; font-weight: 900;">#${position}</h2>
        </div>
        <p style="font-size: 16px; color: #ccc; line-height: 1.6;">Every referral brings you closer to the hunt. Share your unique link:</p>
        <div style="text-align: center; margin: 35px 0;">
          <a href="https://t1ger.app/?ref=${position}" style="background-color: #FF6B00; color: #000; padding: 18px 35px; text-decoration: none; font-weight: bold; border-radius: 50px; text-transform: uppercase; letter-spacing: 2px; display: inline-block;">HUNT GREATNESS</a>
        </div>
        <hr style="border: 0; border-top: 1px solid #222; margin: 40px 0;">
        <p style="font-size: 12px; color: #444; text-align: center; text-transform: uppercase; letter-spacing: 3px;">T1GER | BUILD DISCIPLINE</p>
      </div>
    `;

    try {
      const { data: resendData, error } = await resend.emails.send({
        from: 'T1GER <equipo@t1ger.app>', 
        to: [email],
        subject: 'Your T1GER position is secured! 🐅',
        html: htmlTemplate,
      });

      if (error) {
        console.error('Resend API error:', error);
      }
    } catch (resendErr) {
      console.error('Failed to send email with Resend:', resendErr);
    }

    return res.status(200).json({
      position: position,
      refCode: refCode
    });

  } catch (error) {
    console.error('Waitlist API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
