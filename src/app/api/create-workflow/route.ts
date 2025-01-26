import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { openai } from '@/app/utils/openai';

// Ensure environment variables are available
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY!
);

// Ensure optimal Next.js runtime
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type. Expecting JSON' },
        { status: 415 }
      );
    }

    const { goal } = await request.json();
    if (!goal || typeof goal !== 'string') {
      return NextResponse.json(
        { error: 'Valid goal string is required' },
        { status: 400 }
      );
    }

    console.log('Received goal:', goal);

    // Insert goal into Supabase with timeout protection
    const dbPromise = supabase.from('workflows').insert([{ goal }]).select('*');

    const dbResponse = await Promise.race([
      dbPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout')), 10000)
      )
    ]) as any;

    if (dbResponse.error) {
      console.error('Supabase Insert Error:', dbResponse.error);
      return NextResponse.json(
        { error: `Database error: ${dbResponse.error.message}` },
        { status: 500 }
      );
    }

    console.log('Saved to database:', dbResponse.data);

    // Call OpenAI API to generate workflow
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Generate a detailed workflow for the user goal with clear steps.',
        },
        { role: 'user', content: goal },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    if (!aiResponse.choices || !aiResponse.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    const generatedWorkflow = aiResponse.choices[0].message.content;

    console.log('Generated AI workflow:', generatedWorkflow);

    return NextResponse.json({
      success: true,
      databaseRecord: dbResponse.data[0],
      generatedWorkflow,
    });

  } catch (error: any) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
