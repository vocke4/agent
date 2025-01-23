import { NextResponse } from 'next/server';
import OpenAI from 'openai';

type Workflow = {
  goal: string;
  tasks: string[] | null;
  current_step: number;
};

// Mock database
const mockWorkflows: Record<string, Workflow> = {};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(request: Request) {
  try {
    const { workflowId } = await request.json();
    const workflow = mockWorkflows[workflowId] || { 
      goal: 'Default Goal',
      tasks: null,
      current_step: 0 
    };

    if (!workflow.tasks) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: `Break "${workflow.goal}" into 3 sequential tasks as a JSON array.`
        }],
      });
      workflow.tasks = JSON.parse(completion.choices[0].message.content || '[]');
    }

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
