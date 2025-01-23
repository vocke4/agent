import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(request: Request) {
  const { workflowId } = await request.json();

  // Fetch workflow
  const { data: workflowData, error: fetchError } = await supabase
    .from('workflows')
    .select('*')
    .eq('id', workflowId)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  // Generate tasks if first run
  if (!workflowData.tasks) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Break "${workflowData.goal}" into sequential tasks as a JSON array. Example: ["Research", "Draft"]`
      }],
    });

    const tasks = JSON.parse(completion.choices[0].message.content || '[]');

    const { error: updateError } = await supabase
      .from('workflows')
      .update({ tasks })
      .eq('id', workflowId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  // Update current step
  const { error: stepError } = await supabase
    .from('workflows')
    .update({ current_step: (workflowData.current_step || 0) + 1 })
    .eq('id', workflowId);

  if (stepError) {
    return NextResponse.json({ error: stepError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
