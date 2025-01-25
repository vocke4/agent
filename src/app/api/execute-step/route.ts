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

    if (error) {
      console.error('Supabase fetch error:', error.message);
      return NextResponse.json({ error: `Database error: ${error.message || 'Unknown error'}` }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'No workflow found' }, { status: 404 });
    }

    const aiResponse = await generateChatResponse(data.goal);

    return NextResponse.json({ success: true, aiResponse });

  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: `Internal server error: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
