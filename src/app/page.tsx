'use client';
import { useState } from 'react';
import { Task } from '@/types';

export default function Home() {
  const [goal, setGoal] = useState('');
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const createWorkflow = async () => {
    const res = await fetch('/api/create-workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal }),
    });
    const { workflowId } = await res.json();
    setWorkflowId(workflowId);
  };

  const checkProgress = async () => {
    if (!workflowId) return;
    
    const res = await fetch('/api/execute-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowId }),
    });
    const { tasks } = await res.json();
    setTasks(tasks);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter your goal"
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={createWorkflow}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Start Workflow
      </button>

      {tasks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Progress</h2>
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  task.status === 'success' ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                {task.description} - {task.status}
              </div>
            ))}
          </div>
          <button
            onClick={checkProgress}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Check Progress
          </button>
        </div>
      )}
    </div>
  );
}
