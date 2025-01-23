import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello from API!' });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ received: body });
}

// Ensure the module is properly recognized
export const config = {
  runtime: 'edge',
};
