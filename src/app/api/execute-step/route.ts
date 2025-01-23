import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// TEMPORARY MOCK DATA - REPLACE WITH SUPABASE LATER
const mockWorkflows: Record<string, any> = {};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(request: Request) {
  try {
    const { workflowId } = await request.json();

    // TEMPORARY MOCK DATABASE LOGIC
    let workflow = mockWorkflows[workflowId] || { 
      goal: 'Mock Goal',
      tasks: null,
      current_step: 0 
    };

    // Generate tasks if first run
    if (!workflow.tasks) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: `Break "${workflow.goal}" into 3 sequential tasks as a JSON array. Example: ["Research phase","Development phase","Testing phase"]`
        }],
      });

      workflow.tasks = JSON.parse(completion.choices[0].message.content || '[]');
    }

    // Update current step
    workflow.current_step += 1;
    mockWorkflows[workflowId] = workflow;

    return NextResponse.json({ 
      success: true,
      tasks: workflow.tasks,
      currentStep: workflow.current_step 
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
