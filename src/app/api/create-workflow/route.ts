'use client';
import { useState } from 'react';

interface Message {
  question: string;
  response: string;
}

export default function WorkflowForm() {
  const [goal, setGoal] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
        setMessages((prev) => [
          ...prev,
          { question: goal, response: result.generatedWorkflow },
        ]);
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
      <h2 className="form-title">AI Workflow Generator</h2>
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
        <h3>Responses:</h3>
        {messages.length === 0 ? (
          <p>No responses yet. Enter a goal to get started.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="response-item">
              <p><strong>Q:</strong> {msg.question}</p>
              <pre className="workflow-text"><strong>A:</strong> {msg.response}</pre>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .workflow-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .form-title {
          font-size: 2rem;
          font-weight: bold;
          color: #ffffff;
        }
        .input-field {
          width: 100%;
          padding: 15px;
          font-size: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          outline: none;
        }
        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        .submit-button {
          width: 100%;
          padding: 15px;
          font-size: 1rem;
          background: linear-gradient(90deg, #ff00ff, #00d4ff);
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }
        .submit-button:disabled {
          background: #ccc;
        }
        .message {
          color: red;
          font-weight: bold;
        }
        .response-frame {
          width: 100%;
          padding: 20px;
          margin-top: 15px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          max-height: 300px;
          overflow-y: auto;
          color: #fff;
        }
        .response-item {
          margin-bottom: 10px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 5px;
        }
        .workflow-text {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}
