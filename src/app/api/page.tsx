'use client';
import React, { useState } from 'react';

type Task = {
  description: string;
  status: string;
};

type Workflow = {
  id: string;
  tasks: Task[];
  current_step: number;
};

export default function Home() {
  const [goal, setGoal] = useState('');
  const [workflow, setWorkflow] = useState<Workflow | null>(null);

  const createWorkflow = async () => {
    const res = await fetch('/api/create-workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal }),
    });
    const { workflowId } = await res.json();

    // Poll for workflow status
    const poll = setInterval(async () => {
      const res = await fetch(`/api/execute-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      });
      const { tasks } = await res.json();

      if (tasks.every((t: Task) => t.status === 'success')) {
        clearInterval(poll);
      }
      setWorkflow((prev) => (prev ? { ...prev, tasks } : { id: workflowId, tasks, current_step: 0 }));
    }, 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Agentic AI Workflow</h1>
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Enter goal (e.g., 'Build a SaaS app')"
          className="border p-3 flex-1 rounded-lg"
        />
        <button
          onClick={createWorkflow}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Start Workflow
        </button>
      </div>

      {workflow && (
        <div className="space-y-4">
          {workflow.tasks.map((task, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    task.status === 'success' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <span className={task.status === 'success' ? 'text-green-600' : ''}>
                  {task.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
