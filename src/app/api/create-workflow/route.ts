import { createClient } from '@supabase/supabase-js';

// Debugging: Check if environment variables are loaded correctly
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Initialize Supabase client using Vercel environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    // Debugging: Log when the API is hit
    console.log('Received a request to /api/create-workflow');

    const { goal } = await request.json();

    // Debugging: Log the received goal
    console.log('Received goal:', goal);

    // Insert the received goal into the Supabase 'workflows' table
    const { data, error } = await supabase
      .from('workflows')
      .insert([{ goal }]);

    if (error) {
      console.error('Supabase insert error:', error.message);
      throw error;
    }

    // Debugging: Log success message
    console.log('Workflow successfully inserted:', data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error in create-workflow route:', err.message);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
