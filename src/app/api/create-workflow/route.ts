import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Extend function timeout directly within the Next.js API runtime config
export const config = {
  runtime: 'edge',   // 'nodejs' or 'edge' runtime
  maxDuration: 30,   // Increase function timeout to 30 seconds
};

// Supabase credentials (ensure they are correctly set in your .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 415 });
    }

    const { goal } = await request.json();
    if (!goal || typeof goal !== 'string') {
      return NextResponse.json({ error: 'Valid goal string required' }, { status: 400 });
    }

    console.log('Processing goal:', goal);

    // Insert goal into Supabase database
    const { data, error } = await supabase.from('workflows').insert([{ goal }]).select('*');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
    }

    console.log('Inserted workflow:', data);

    // Generate workflow using OpenAI API
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'Generate detailed workflow steps with clear objectives.' },
        { role: 'user', content: goal },
      ],
      max_tokens: 1000,
    });

    if (!aiResponse.choices || !aiResponse.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    console.log('AI response received:', aiResponse.choices[0]?.message?.content);

    return NextResponse.json({
      success: true,
      workflow: data[0],
      generatedWorkflow: aiResponse.choices[0]?.message?.content || '',
    });

  } catch (error: any) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
