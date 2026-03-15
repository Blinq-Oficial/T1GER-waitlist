export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, referredBy } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

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
      // Check for duplicate email error code
      if (data.code === '23505') {
        return res.status(409).json({ error: 'already_registered' });
      }
      console.error('Supabase insert error:', data);
      return res.status(500).json({ error: 'Failed to join waitlist' });
    }

    // `return=representation` returns an array of inserted rows
    const user = data[0]; 
    return res.status(200).json({
      position: user.position || 0, // Fallback if DB doesn't return position immediately
      refCode: user.ref_code || ''
    });

  } catch (error) {
    console.error('Waitlist API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
