import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { openai } from '@/app/utils/openai';

// Debugging: Ensure environment variables are loaded correctly
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Loaded' : 'Missing');

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    console.log('Received a request to /api/create-workflow');

    const { goal } = await req.json();

    if (!goal) {
      console.warn('No goal provided in request');
      return NextResponse.json(
        { success: false, message: 'Goal is required' },
        { status: 400 }
      );
    }

    // Save goal to Supabase 'workflows' table
    const { data, error } = await supabase.from('workflows').insert([{ goal }]);

    if (error) {
      console.error('Supabase insert error:', error.message);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('Goal saved to database:', data);

    // Call OpenAI API to generate workflow
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that creates workflows.' },
        { role: 'user', content: `Please generate a workflow for: ${goal}` },
      ],
    });

    if (!aiResponse.choices || !aiResponse.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    const generatedWorkflow = aiResponse.choices[0].message.content;
    console.log('OpenAI response received:', generatedWorkflow);

    return NextResponse.json({ success: true, workflow: generatedWorkflow });

  } catch (err: any) {
    console.error('Error in create-workflow route:', err.message);

    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
