import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { openai } from "@/app/utils/openai";
import { Task } from "@/types";

export async function POST(req: Request) {
  const { workflowId } = await req.json();
  const { rows: [workflow] } = await sql`
    SELECT * FROM workflows WHERE id = ${workflowId}
  `;

  // Generate tasks if first run
  if (!workflow.tasks) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `Break "${workflow.goal}" into 3-5 sequential tasks as a JSON array. Example: ["Research topic", "Draft outline"]`
      }],
    });

    const tasks: Task[] = JSON.parse(completion.choices[0].message.content || "[]")
      .map((desc: string) => ({ description: desc, status: "pending" }));

    await sql`
      UPDATE workflows
      SET tasks = ${JSON.stringify(tasks)}
      WHERE id = ${workflowId}
    `;
  }

  // Execute next task
  const currentStep = workflow.current_step || 0;
  const tasks: Task[] = workflow.tasks || [];
  tasks[currentStep].status = "success"; // Simulate task success

  await sql`
    UPDATE workflows
    SET current_step = ${currentStep + 1}, tasks = ${JSON.stringify(tasks)}
    WHERE id = ${workflowId}
  `;

  return NextResponse.json({ tasks });
}
