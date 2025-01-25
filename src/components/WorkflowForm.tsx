'use client';
import { useState } from 'react';

interface WorkflowFormProps {
  onWorkflowCreated: (workflow: any) => void;
}

export default function WorkflowForm({ onWorkflowCreated }: WorkflowFormProps) {
  const [goal, setGoal] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [workflowResponse, setWorkflowResponse] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!goal.trim()) {
      setMessage('Please enter a valid goal.');
      return;
    }

    setLoading(true);
    setMessage('');
    setWorkflowResponse(null);

    try {
      const response = await fetch('/api/create-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage('Workflow created successfully!');
        onWorkflowCreated(result.workflow);
        setWorkflowResponse(result.generatedWorkflow);
        setGoal(''); // Clear input after successful submission
      } else {
        setMessage(`Error: ${result.error || 'Something went wrong'}`);
      }
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workflow-form">
      <h2>Create a New Workflow</h2>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter your goal"
        className="input-field"
      />
      <button onClick={handleSubmit} disabled={loading} className="submit-button">
        {loading ? 'Processing...' : 'Submit'}
      </button>

      {message && <p className="message">{message}</p>}

      {workflowResponse && (
        <div className="workflow-response">
          <h3>Generated Workflow:</h3>
          <pre>{workflowResponse}</pre>
        </div>
      )}

      <style jsx>{`
        .workflow-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 500px;
          margin: 0 auto;
        }
        .input-field {
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .submit-button {
          padding: 10px;
          font-size: 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .submit-button:disabled {
          background-color: #ccc;
        }
        .message {
          color: red;
        }
        .workflow-response {
          margin-top: 1rem;
          padding: 10px;
          background-color: #f0f0f0;
          border-left: 5px solid #0070f3;
        }
      `}</style>
    </div>
  );
}
