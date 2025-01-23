import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { goal } = await request.json();
  // Temporary mock response
  return NextResponse.json({ workflowId: "temp-id-123" });
}
