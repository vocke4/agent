'use client';
import { useState } from 'react';

interface Workflow {
  id: number;
  goal: string;
}

interface WorkflowFormProps {
  onWorkflowCreated: (workflow: Workflow) => void;
}

export default function WorkflowForm({ onWorkflowCreated }: WorkflowFormProps) {
  const [goal, setGoal] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [workflowResponse, setWorkflowResponse] = useState<Workflow | null>(null);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!goal.trim()) {
      setMessage('Please enter a valid goal.');
      return;
    }

    setLoading(true);
    setMessage(null);
    setWorkflowResponse(null);
    setGeneratedWorkflow(null);

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
        setWorkflowResponse({
          id: result.workflow.id,
          goal: result.workflow.goal,
        });
        setGeneratedWorkflow(result.generatedWorkflow);
        setGoal('');
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
          <>
            <p><strong>Workflow ID:</strong> {workflowResponse.id}</p>
            <p><strong>Goal:</strong> {workflowResponse.goal}</p>
            <h4>Generated Workflow:</h4>
            <pre className="workflow-text">{generatedWorkflow || 'No workflow generated yet.'}</pre>
          </>
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
          box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
        }
        .input-field {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          outline: none;
          transition: all 0.3s ease;
        }
        .input-field:focus {
          border-color: #0070f3;
          box-shadow: 0 0 5px rgba(0, 112, 243, 0.5);
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
          transition: background-color 0.3s;
        }
        .submit-button:hover {
          background-color: #005bb5;
        }
        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
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
          overflow-wrap: break-word;
          font-family: monospace;
        }
        .workflow-text {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 1rem;
          color: #333;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
