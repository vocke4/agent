import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { openai } from '@/app/utils/openai';

// Validate environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY'
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// Initialize Supabase client with corrected env vars
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = 'edge';
const OPENAI_TIMEOUT = 15000; // 15 seconds

export async function POST(request: NextRequest) {
  try {
    // Validate request
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type. Please use JSON' },
        { status: 415 }
      );
    }

    // Validate request body
    const { goal } = await request.json();
    if (!goal || typeof goal !== 'string' || goal.trim().length < 10) {
      return NextResponse.json(
        { error: 'Valid goal string of at least 10 characters is required' },
        { status: 400 }
      );
    }

    // Database insert with timeout protection
    const insertPromise = supabase
      .from('workflows')
      .insert([{ goal }])
      .select('*');

    const insertResponse = await Promise.race([
      insertPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database operation timed out')), 10000)
      )
    ]) as any;

    if (insertResponse.error) {
      console.error('Supabase Error:', insertResponse.error);
      return NextResponse.json(
        { error: 'Failed to save workflow' },
        { status: 500 }
      );
    }

    const workflowId = insertResponse.data[0]?.id;
    if (!workflowId) {
      throw new Error('Failed to retrieve created workflow ID');
    }

    // Generate AI workflow with timeout protection
    const openaiPromise = openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Generate a detailed, step-by-step workflow for the following goal. Include clear actions and milestones.',
        },
        { role: 'user', content: goal },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = await Promise.race([
      openaiPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI processing timed out')), OPENAI_TIMEOUT)
      )
    ]) as any;

    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error('Failed to generate workflow');
    }
    const generatedWorkflow = aiResponse.choices[0].message.content;

    // Update workflow with AI response
    const updateResponse = await supabase
      .from('workflows')
      .update({ generated_workflow: generatedWorkflow })
      .eq('id', workflowId)
      .select();

    if (updateResponse.error) {
      console.error('Update Error:', updateResponse.error);
      return NextResponse.json(
        { 
          success: true,
          warning: 'Workflow generated but failed to save',
          generatedWorkflow,
          databaseRecord: insertResponse.data[0]
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      generatedWorkflow,
      databaseRecord: updateResponse.data[0]
    });

  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
