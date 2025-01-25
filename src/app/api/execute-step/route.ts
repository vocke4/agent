// src/app/api/execute-step/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateChatResponse } from '@/app/utils/openai';

// Supabase connection
const supabaseUrl = 'https://fvzcxtwxyfhrcqffpfyp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2emN4dHd4eWZocmNxZmZwZnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NTk5NzgsImV4cCI6MjA1MzIzNTk3OH0.Mnri-YULldfRxGHuz12qVZ_3uCMNs7ycc_24qfUpHrM';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { workflowId } = await request.json();
    if (!workflowId) {
      return NextResponse.json({ error: 'workflowId is required' }, { status: 400 });
    }

    console.log('Fetching workflow with ID:', workflowId);

    const { data, error } = await supabase.from('workflows').select('goal').eq('id', workflowId).single();

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
