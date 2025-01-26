'use client';
import { useState } from 'react';

export default function Page() {
  const [goal, setGoal] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!goal.trim()) {
      setMessage('Please enter a valid goal.');
      return;
    }

    setLoading(true);
    setMessage('');
    setResponse(null);

    try {
      const res = await fetch('/api/create-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setMessage('Workflow created successfully!');
        setResponse(result.generatedWorkflow);
        setGoal(''); // Clear input after success
      } else {
        if (typeof result.error === 'string') {
          setMessage(result.error);
        } else if (
          result.error &&
          typeof result.error === 'object' &&
          'message' in result.error
        ) {
          setMessage((result.error as { message: string }).message);
        } else {
          setMessage('Something went wrong');
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setResponse(err.message);
      } else {
        setResponse('An unknown error occurred.');
      }
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
        ) : response ? (
          <pre className="workflow-text">{response}</pre>
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
