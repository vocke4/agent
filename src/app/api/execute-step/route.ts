import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateChatResponse } from '@/app/utils/openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { workflowId } = await request.json();
    
    if (!workflowId) {
      return NextResponse.json({ error: 'workflowId is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('workflows')
      .select('goal')
      .eq('id', workflowId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    const aiResponse = await generateChatResponse(data.goal);

    return NextResponse.json({ success: true, aiResponse });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
