'use client';
import { useState } from 'react';
import WorkflowForm from '@/components/WorkflowForm';

export default function Home() {
  const [workflow, setWorkflow] = useState<string | null>(null);

  const handleWorkflowCreated = (workflow: string) => {
    setWorkflow(workflow);
  };

  return (
    <div className="container">
      <header>
        <h1>Agent Workflow</h1>
        <p>Automate your tasks efficiently</p>
      </header>
      <WorkflowForm onWorkflowCreated={handleWorkflowCreated} />
      {workflow && <p className="feedback-message">Generated Workflow: {workflow}</p>}
    </div>
  );
}
