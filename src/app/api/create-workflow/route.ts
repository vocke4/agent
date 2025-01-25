import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(request: Request) {
  try {
    const { goal } = await request.json();

    // Insert workflow data into Supabase
    const { data, error } = await supabase
      .from('workflows')
      .insert([{ goal }]);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ workflowId: data[0].id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
