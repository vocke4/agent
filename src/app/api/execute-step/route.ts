import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateChatResponse } from '@/app/utils/openai';

// Environment variable fallback handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables missing');
  throw new Error('Supabase environment variables are not set correctly.');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Loaded' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { workflowId } = await request.json();
    if (!workflowId) {
      return NextResponse.json({ error: 'workflowId is required' }, { status: 400 });
    }

    console.log('Fetching workflow with ID:', workflowId);

    const { data, error } = await supabase
      .from('workflows')
      .select('goal')
      .eq('id', workflowId)
      .single();

    if (error) {
      console.error('Supabase query error:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `Database error: ${error.message || JSON.stringify(error) || 'Unknown error'}` },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'No workflow found' }, { status: 404 });
    }

    console.log('Supabase query result:', data);

    const aiResponse = await generateChatResponse(data.goal);
    return NextResponse.json({ success: true, aiResponse });

  } catch (error: any) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
