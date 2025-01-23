import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { Task } from "@/types";

export async function POST(req: Request) {
  const { goal } = await req.json();
  const { rows } = await sql`
    INSERT INTO workflows (goal)
    VALUES (${goal})
    RETURNING id
  `;
  return NextResponse.json({ workflowId: rows[0].id });
}
