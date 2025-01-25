import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
      return NextResponse.json({ success: false, message: 'Goal is required' }, { status: 400 });
    }

    // Save goal to Supabase 'workflows' table
    const { data, error } = await supabase
      .from('workflows')
      .insert([{ goal }]);

    if (error) {
      console.error('Supabase insert error:', error.message);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('Goal saved to database:', data);

    // Send goal to OpenAI API for workflow generation
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that creates workflows." },
          { role: "user", content: `Please generate a workflow for: ${goal}` }
        ],
        function_call: "auto"
      })
    });

    const aiData = await openAiResponse.json();

    if (aiData.error) {
      console.error('OpenAI API error:', aiData.error.message);
      throw new Error(`OpenAI error: ${aiData.error.message}`);
    }

    console.log('OpenAI response received:', aiData);

    if (aiData.choices && aiData.choices[0]?.message?.function_call) {
      const workflow = JSON.parse(aiData.choices[0].message.function_call.arguments);
      console.log('Generated workflow:', workflow);
      return NextResponse.json({ success: true, workflow });
    }

    return NextResponse.json({ success: false, message: 'Could not generate workflow' }, { status: 500 });

  } catch (err: any) {
    console.error('Error in create-workflow route:', err.message);

    return NextResponse.json({ error: err.message || 'Internal Server Error' }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
