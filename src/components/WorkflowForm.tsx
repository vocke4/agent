'use client';
import { useState } from 'react';

export default function WorkflowForm() {
  const [goal, setGoal] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!goal.trim()) {
      setError('Please enter a valid goal.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/create-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setMessages((prev) => [
          ...prev,
          { question: goal, response: result.generatedWorkflow },
        ]);
        setGoal('');
      } else {
        setError(result.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to connect. Please try again.');
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

      {error && <p className="error-message">{error}</p>}

      <div className="response-container">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="chat-entry">
              <strong>You:</strong> {msg.question}
              <br />
              <strong>Agent:</strong> <pre>{msg.response}</pre>
            </div>
          ))
        ) : (
          <p>No responses yet.</p>
        )}
      </div>

      <style jsx>{`
        .workflow-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
        }
        .input-field {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          color: #000;
          background: #fff;
        }
        .submit-button {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          background: linear-gradient(90deg, #ff0080, #0070f3);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: opacity 0.3s;
        }
        .submit-button:disabled {
          opacity: 0.5;
        }
        .error-message {
          color: red;
          font-weight: bold;
        }
        .response-container {
          width: 100%;
          margin-top: 15px;
          padding: 15px;
          background: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          max-height: 400px;
        }
        .chat-entry {
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
