import { NextResponse } from 'next/server';
// Use Vercel's environment-based connection here

export async function POST(request: Request) {
  try {
    const { goal } = await request.json();


    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ workflowId: data[0].id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
