'use client';
import { useState } from 'react';

interface WorkflowFormProps {
  onWorkflowCreated: (workflow: any) => void;
}

export default function WorkflowForm({ onWorkflowCreated }: WorkflowFormProps) {
  const [goal, setGoal] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [workflowHistory, setWorkflowHistory] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!goal.trim()) {
      setMessage('Please enter a valid goal.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/create-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage('✅ Workflow created successfully!');
        onWorkflowCreated(result.workflow);
        setWorkflowHistory([...workflowHistory, result.generatedWorkflow]);
        setGoal(''); // Clear input after successful submission
      } else {
        setMessage(`❌ Error: ${result.error || 'Something went wrong'}`);
      }
    } catch (error) {
      setMessage('⚠️ An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workflow-form">
      <h2 className="title">🤖 AI Workflow Generator</h2>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter your goal..."
        className="input-field"
      />
      <button onClick={handleSubmit} disabled={loading} className="submit-button">
        {loading ? 'Processing...' : 'Submit'}
      </button>

      {message && <p className="message">{message}</p>}

      <div className="response-frame">
        <h3>Chat History</h3>
        {workflowHistory.length > 0 ? (
          <ul className="history-list">
            {workflowHistory.map((response, index) => (
              <li key={index} className="workflow-text">
                {response}
              </li>
            ))}
          </ul>
        ) : (
          <p>No history yet. Submit a goal to start.</p>
        )}
      </div>

      <style jsx>{`
        .workflow-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          max-width: 700px;
          margin: 50px auto;
          padding: 30px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.6);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          color: #fff;
          text-align: center;
        }
        .title {
          font-size: 2rem;
          font-weight: bold;
          color: #ffffff;
          text-shadow: 2px 2px 10px rgba(0, 255, 255, 0.8);
        }
        .input-field {
          width: 100%;
          padding: 15px;
          font-size: 1.2rem;
          border: none;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          outline: none;
          box-shadow: inset 0 0 5px rgba(0, 255, 255, 0.8);
        }
        .submit-button {
          width: 100%;
          padding: 15px;
          font-size: 1.2rem;
          background: linear-gradient(to right, #ff00ff, #00ffff);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease-in-out;
        }
        .submit-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(255, 0, 255, 0.8);
        }
        .message {
          font-size: 1rem;
          font-weight: bold;
          color: yellow;
          margin-top: 10px;
        }
        .response-frame {
          width: 100%;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 255, 255, 0.2);
        }
        .history-list {
          list-style-type: none;
          padding: 0;
        }
        .workflow-text {
          font-size: 1rem;
          color: #00ffff;
          background: rgba(255, 255, 255, 0.1);
          padding: 10px;
          margin-top: 5px;
          border-radius: 5px;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
}
