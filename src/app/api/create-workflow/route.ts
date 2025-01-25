import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using Vercel environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { goal } = await request.json();

    // Insert the received goal into the Supabase 'workflows' table
    const { data, error } = await supabase
      .from('workflows')
      .insert([{ goal }]);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
