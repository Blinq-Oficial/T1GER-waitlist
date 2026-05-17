export interface WaitlistSignupResult {
  success: boolean;
  alreadyJoined?: boolean;
  position: number;
  refCode?: string;
  shareUrl?: string;
}

function getReferralCode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref') || '';
}

export async function joinWaitlist(email: string, name?: string): Promise<WaitlistSignupResult> {
  const response = await fetch('/api/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      name,
      referredBy: getReferralCode(),
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
