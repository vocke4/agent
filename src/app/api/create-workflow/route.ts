import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Server-side environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// New config format for Next.js 13+
export const maxDuration = 30; // <-- Fix here

export async function POST(request: NextRequest) {
  try {
    // [Keep existing validation logic]
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 415 }
      );
    }

    const { goal } = await request.json();
    if (!goal || typeof goal !== 'string') {
      return NextResponse.json(
        { error: 'Valid goal string required' },
        { status: 400 }
      );
    }

    // [Keep database operation]
    const { data: dbData, error: dbError } = await supabase
      .from('workflows')
      .insert([{ goal }])
      .select('*')
      .timeout(10000);

    if (dbError) {
      console.error('Database Error:', dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }

    // [Keep AI processing]
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate detailed workflow steps with clear objectives.',
        },
        { role: 'user', content: goal },
      ],
      max_tokens: 1000,
    });

    return NextResponse.json({
      success: true,
      databaseRecord: dbData?.[0],
      generatedWorkflow: aiResponse.choices[0]?.message?.content || '',
    });

  } catch (error: any) {
    console.error('Global Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
