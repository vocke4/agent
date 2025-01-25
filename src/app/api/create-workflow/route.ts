// src/app/api/create-workflow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// 1. Validate environment variables
const supabaseUrl = 'https://fvzcxtwxyfhrcqffpfyp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2emN4dHd4eWZocmNxZmZwZnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NTk5NzgsImV4cCI6MjA1MzIzNTk3OH0.Mnri-YULldfRxGHuz12qVZ_3uCMNs7ycc_24qfUpHrM';

const openAiKey = process.env.OPENAI_API_KEY;
if (!openAiKey) {
  throw new Error('Missing required environment variable: OPENAI_API_KEY');
}

// 2. Initialize Supabase and OpenAI clients
const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({
  apiKey: openAiKey,
});

export async function POST(request: NextRequest) {
  try {
    // 3. Validate request content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 415 });
    }

    const body = await request.json();
    if (!body?.goal || typeof body.goal !== 'string') {
      return NextResponse.json({ error: 'Valid goal string is required' }, { status: 400 });
    }

    // 4. Insert into database with timeout
    const dbPromise = supabase.from('workflows').insert([{ goal: body.goal }]).select('*');

    const dbResponse = await Promise.race([
      dbPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 5000)),
    ]) as any;

    if (dbResponse.error) {
      console.error('Supabase Error:', dbResponse.error);
      return NextResponse.json({ error: `Database error: ${dbResponse.error.message}` }, { status: 500 });
    }

    // 5. Generate workflow using OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'Generate detailed workflow steps with clear objectives.' },
        { role: 'user', content: body.goal },
      ],
      max_tokens: 1000,
    });

    return NextResponse.json({
      success: true,
      databaseRecord: dbResponse.data[0],
      generatedWorkflow: aiResponse.choices[0]?.message?.content || '',
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
