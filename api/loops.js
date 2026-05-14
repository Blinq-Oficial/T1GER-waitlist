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
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  try {
    const supabaseUrl = 'https://pzxjwqnxnkxtmwovzsuv.supabase.co';
    // Forcing the verified key to avoid Invalid API Key errors from Vercel env vars
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eGp3cW54bmt4dG13b3Z6c3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjQyNDAsImV4cCI6MjA5MzQwMDI0MH0.3aS948dQbncMdO5ihsJPWuxs9Mxq2HZPCZEZIHGlwVc';
    const resendKey = process.env.RESEND_API_KEY || 're_aKrQxPGy_76uyotpK65rMnfPtec3mgXhx';

    // 1. Check if user already exists
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/waitlist?email=eq.${encodeURIComponent(email)}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      }
    });

    const existingUsers = await checkResponse.json();
    let user = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null;
    let isNewUser = false;

    if (!user) {
      // 2. Insert new user
      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ email })
      });

      const insertData = await insertResponse.json();

      if (insertResponse.ok) {
        user = Array.isArray(insertData) ? insertData[0] : insertData;
        isNewUser = true;
      } else if (insertData.code === '23505') {
        // Race condition: someone else added this email just now. Fetch again.
        const retryResponse = await fetch(`${supabaseUrl}/rest/v1/waitlist?email=eq.${encodeURIComponent(email)}&select=*`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          }
        });
        const retryData = await retryResponse.json();
        user = retryData && retryData.length > 0 ? retryData[0] : null;
      } else {
        console.error('Supabase Error:', insertData);
        return res.status(insertResponse.status).json({ 
          error: `Waitlist error: ${insertData.message || 'Unable to join at this time.'}` 
        });
      }
    }

    if (!user) {
      return res.status(500).json({ error: 'Failed to retrieve user record.' });
    }

    // 3. Get Waitlist Position (Total count of users)
    // We use count=exact to get the total number of rows
    const countResponse = await fetch(`${supabaseUrl}/rest/v1/waitlist?select=id`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'count=exact',
        'Range': '0-0'
      }
    });
    
    const contentRange = countResponse.headers.get('content-range');
    let totalCount = 0; // Default if count fails
    
    if (contentRange && contentRange.includes('/')) {
      totalCount = parseInt(contentRange.split('/')[1], 10);
    }

    // Use user.id as the definitive position if it exists, otherwise use totalCount
    const position = (user.id && typeof user.id === 'number') ? user.id : (totalCount || 800);
    const refCode = user.ref_code || 'T1G-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    // 4. Send email via Resend
    try {
      const resend = new Resend(resendKey);
      const htmlTemplate = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 40px; border-radius: 8px; border: 1px solid #333;">
          <h1 style="color: #FF6B00; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">Welcome to the Jungle.</h1>
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

      await resend.emails.send({
        from: 'T1GER <equipo@t1ger.app>',
        to: [email],
        subject: 'Your T1GER position is secured! 🐅',
        html: htmlTemplate,
      });
    } catch (resendErr) {
      console.error('Resend Error:', resendErr);
    }

    return res.status(200).json({ 
      success: true, 
      position: position,
      refCode: refCode
    });

  } catch (error) {
    console.error('Unexpected Error:', error);
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
}


