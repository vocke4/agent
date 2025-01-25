'use client';
import { useState } from 'react';

export default function WorkflowForm() {
  const [goal, setGoal] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/create-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.generatedWorkflow || 'No response received.');
      } else {
        setResponse(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setResponse('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workflow-form">
      <h2>Test Workflow Submission</h2>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter your goal"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
      {response && <p>{response}</p>}
    </div>
  );
}
