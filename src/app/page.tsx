'use client';
import { useState } from 'react';
import WorkflowForm from '@/components/WorkflowForm';

export default function Home() {
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  const handleWorkflowCreated = (id: string) => {
    setWorkflowId(id);
  };

  return (
    <div className="container">
      <header>
        <h1>Agent Workflow</h1>
        <p>Automate your tasks efficiently</p>
      </header>
      <WorkflowForm onWorkflowCreated={handleWorkflowCreated} />
      {workflowId && <p className="feedback-message">Workflow ID: {workflowId}</p>}
    </div>
  );
}
