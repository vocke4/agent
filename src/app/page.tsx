'use client';
import { useState, useEffect } from 'react';
import { Task } from '@/types';

export default function Home() {
  const [goal, setGoal] = useState('');
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const createWorkflow = async () => {
    try {
      const res = await fetch('/api/create-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });

      if (!res.ok) {
        throw new Error('Failed to create workflow');
      }

      const data = await res.json();
      setWorkflowId(data.workflowId);
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  useEffect(() => {
    if (goal.trim() !== '') {
      createWorkflow();
    }
  }, [goal]);

  return (
    <div>
      <h1>Agent Workflow</h1>
      <input
        type="text"
        placeholder="Enter your goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      {workflowId && <p>Workflow ID: {workflowId}</p>}
    </div>
  );
}
