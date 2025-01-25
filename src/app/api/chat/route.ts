import { NextResponse } from 'next/server';
import { generateChatResponse } from '@/app/utils/openai';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const aiResponse = await generateChatResponse(message);
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
