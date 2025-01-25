// src/app/api/create-workflow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// 1. Add explicit environment validation
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// 2. Initialize clients outside handler for better performance
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    // 3. Add request content validation
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 415 }
      );
    }

    const body = await request.json();
    if (!body?.goal || typeof body.goal !== 'string') {
      return NextResponse.json(
        { error: 'Valid goal string is required' },
        { status: 400 }
      );
    }

    // 4. Add database operation timeout
    const dbPromise = supabase
      .from('workflows')
      .insert([{ goal: body.goal }])
      .select('*');

    const dbResponse = await Promise.race([
      dbPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      )
    ]) as any;

    if (dbResponse.error) {
      console.error('Supabase Error:', dbResponse.error);
      return NextResponse.json(
        { error: `Database error: ${dbResponse.error.message}` },
        { status: 500 }
      );
    }

    // 5. Add OpenAI rate limiting
    try {
      const aiResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'Generate detailed workflow steps with clear objectives.',
          },
          { role: 'user', content: body.goal },
        ],
        max_tokens: 1000,
      });

      return NextResponse.json({
        success: true,
        databaseRecord: dbResponse.data[0],
        generatedWorkflow: aiResponse.choices[0]?.message?.content || '',
      });

    } catch (aiError: any) {
      console.error('OpenAI Error:', aiError);
      return NextResponse.json(
        { error: `AI processing error: ${aiError.message}` },
        { status: 503 }
      );
    }

  } catch (error: any) {
    console.error('Global Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
