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
        onWorkflowCreated(result.workflow || {});
        setWorkflowResponse(result.generatedWorkflow || 'No workflow received');
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

      <div className="response-frame">
        <h3>AI Response:</h3>
        {loading ? (
          <p>Generating workflow... Please wait.</p>
        ) : workflowResponse ? (
          <pre className="workflow-text">{workflowResponse}</pre>
        ) : (
          <p>No response yet. Submit a goal to generate workflow.</p>
        )}
      </div>

      <style jsx>{`
        .workflow-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .input-field {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .submit-button {
          width: 100%;
          padding: 12px;
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
          font-weight: bold;
        }
        .response-frame {
          width: 100%;
          padding: 15px;
          margin-top: 15px;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 5px;
          min-height: 150px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .workflow-text {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 1rem;
          color: #333;
        }
      `}</style>
    </div>
  );
}
