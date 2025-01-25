import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(request: Request) {
  try {
    const { workflowId } = await request.json();


    if (error || !data) {
      throw new Error('Workflow not found');
    }

    // Generate AI response (example logic)
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Execute the following goal: ${data.goal}` }],
    });

    return NextResponse.json({ response: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
