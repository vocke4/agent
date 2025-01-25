import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using Vercel environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize OpenAI client with Vercel environment variable
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(request: Request) {
  try {
    const { workflowId } = await request.json();

    // Fetch the workflow data from Supabase
    const { data, error } = await supabase
      .from('workflows')
      .select('goal')
      .eq('id', workflowId)
      .single();

    if (error || !data) {
      throw new Error('Workflow not found');
    }

    // Generate AI response based on the retrieved goal
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: `Execute the following goal: ${data.goal}` },
      ],
    });

    if (!aiResponse || !aiResponse.choices || aiResponse.choices.length === 0) {
      throw new Error('Failed to get a response from OpenAI');
    }

    // Return the AI-generated response
    return NextResponse.json({
      success: true,
      response: aiResponse.choices[0].message.content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred' },
      { status: 500 }
    );
  }
}
