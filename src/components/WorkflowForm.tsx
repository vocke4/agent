'use client';

import { useState } from 'react';

export default function WorkflowForm() {
  const [goal, setGoal] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [workflowResponse, setWorkflowResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      <form onSubmit={handleSubmit} className="workflow-form-container">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Enter your goal"
          className="input-field"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !goal.trim()} className="submit-button">
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

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
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }

        .workflow-form-container {
          display: flex;
          width: 100%;
          gap: 10px;
        }

        .input-field {
          flex-grow: 1;
          padding: 12px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          outline: none;
        }

        .submit-button {
          padding: 12px 20px;
          font-size: 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .message {
          color: ${message.includes('Error') ? 'red' : 'green'};
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
