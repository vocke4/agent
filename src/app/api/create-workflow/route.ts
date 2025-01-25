import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Next.js 13+ config
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    // Validate request
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

    // Database operation with proper timeout handling
    const dbPromise = supabase
      .from('workflows')
      .insert([{ goal }])
      .select('*');

    const dbResponse = await Promise.race([
      dbPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 10000)
      )
    ]) as any;

    if (dbResponse.error) {
      console.error('Database Error:', dbResponse.error);
      return NextResponse.json(
        { error: `Database error: ${dbResponse.error.message}` },
        { status: 500 }
      );
    }

    // AI processing
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
      databaseRecord: dbResponse.data[0],
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
