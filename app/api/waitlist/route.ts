import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://app.loops.so/api/v1/events/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        eventName: 'waitlist_signup',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Loops API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to process waitlist signup' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email successfully added to the waitlist.',
    });

  } catch (error) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
