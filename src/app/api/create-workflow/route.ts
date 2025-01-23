import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  const { goal } = await request.json();
  try {
    const { rows } = await sql`
      INSERT INTO workflows (goal)
      VALUES (${goal})
      RETURNING id
    `;
    return NextResponse.json({ workflowId: rows[0].id });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
