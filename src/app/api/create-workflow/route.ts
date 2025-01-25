// src/app/api/create-workflow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Validate environment variables at startup
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const { goal } = await request.json();
    if (!goal || typeof goal !== 'string') {
      return NextResponse.json(
        { error: 'Valid goal string is required' },
        { status: 400 }
      );
    }

    // Database operation with RLS bypass
    const { data: dbData, error: dbError } = await supabase
      .from('workflows')
      .insert([{ goal }])
      .select('*');

    if (dbError) {
      console.error('Supabase Error:', dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Generate workflow with OpenAI
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
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
