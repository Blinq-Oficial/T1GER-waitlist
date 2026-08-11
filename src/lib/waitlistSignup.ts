export interface WaitlistSignupResult {
  success: boolean;
  alreadyJoined?: boolean;
  emailSent?: boolean;
  position: number;
  refCode?: string;
  shareUrl?: string;
}

function getReferralCode() {
  const params = new URLSearchParams(window.location.search);
  const referral = params.get('ref')?.trim() || '';
  return /^[A-Za-z0-9_-]{1,80}$/.test(referral) ? referral : '';
}

export async function joinWaitlist(email: string): Promise<WaitlistSignupResult> {
  const response = await fetch('/api/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      referredBy: getReferralCode(),
      website: '',
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Unable to join the waitlist right now.');
  }

  if (!data.success || typeof data.position !== 'number') {
    throw new Error('Signup API is unavailable in this environment. Please try again from the live site.');
  }

  return data as WaitlistSignupResult;
}
