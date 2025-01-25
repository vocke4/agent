'use client';
import { useState, useEffect } from 'react';
import WorkflowForm from '@/components/WorkflowForm';
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
    <div className="container">
      <header>
        <h1>Agent Workflow</h1>
        <p>Automate your tasks efficiently</p>
      </header>
      <WorkflowForm />
      <div className="card">
        <h2>Your Goal</h2>
        <input
          type="text"
          placeholder="Enter your goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        {workflowId && <p>Workflow ID: {workflowId}</p>}
      </div>
    </div>
  );
}
