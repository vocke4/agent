import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using server-side secure environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the secure service key instead
);

export async function POST(request: Request) {
  try {
    // Parse the JSON body
    const { goal } = await request.json();

    if (!goal) {
      return NextResponse.json({ error: 'Goal is required' }, { status: 400 });
    }

    console.log('Received goal:', goal);

    // Insert data into the Supabase table
    const { data, error } = await supabase
      .from('workflows')
      .insert([{ goal }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    console.log('Inserted workflow:', data);

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
