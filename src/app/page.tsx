'use client';

import { useState } from 'react';
import { useMutation } from 'react-query';

export default function ChatInterface() {
  const [goal, setGoal] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const { mutate, isLoading, isError, error } = useMutation(async (goal: string) => {
    const res = await fetch('/api/create-workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal }),
    });

    if (!res.ok) {
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }

    return data.workflow;
  });

  const handleSubmit = async () => {
    if (!goal.trim()) return alert('Please enter a goal');
    mutate(goal, {
      onSuccess: (data) => setResponse(data),
      onError: (err) => alert(err.message),
    });
  };

  return (
    <div className="chat-container">
      <h1>AI Workflow Generator</h1>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter your goal"
        className="input-field"
      />
      <button onClick={handleSubmit} disabled={isLoading} className="submit-button">
        {isLoading ? 'Processing...' : 'Submit'}
      </button>

      {isError && <p className="error-message">{error?.message}</p>}

      <div className="response-frame">
        <h3>AI Response:</h3>
        {response ? <pre>{response}</pre> : <p>No response yet.</p>}
      </div>

      <style jsx>{`
        .chat-container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
          text-align: center;
        }
        .input-field {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          margin-bottom: 10px;
        }
        .submit-button {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
        }
        .response-frame {
          margin-top: 20px;
          padding: 10px;
          background: #fff;
          border: 1px solid #ddd;
        }
        .error-message {
          color: red;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
