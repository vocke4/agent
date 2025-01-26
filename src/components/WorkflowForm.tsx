'use client';
import { useState } from 'react';
import { Clipboard } from 'lucide-react';

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
    <div className="workflow-container">
      <h2 className="workflow-title">AI Workflow Architect</h2>
      <p className="workflow-subtitle">
        Transform your goals into executable workflows with AI precision
      </p>
      <div className="form-group">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Example: Create a marketing campaign for a new SaaS product..."
          className="input-field transition-all focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
          aria-label="Enter your objective"
        />
        <button onClick={handleSubmit} disabled={loading} className="submit-button">
          {loading ? 'Generating...' : <><Clipboard className="icon" /> Generate Workflow</>}
        </button>
      </div>

      {message && <p className="error-message">{message}</p>}

      <div className="response-frame max-h-80 overflow-y-auto p-4 border border-gray-700 rounded-lg">
        <h3 className="response-title">Generated Workflow</h3>
        {messages.length === 0 ? (
          <p className="no-response">Enter your objective to generate a workflow.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="response-item">
              <p className="question-text font-semibold text-indigo-300"><strong>Objective:</strong> {msg.question}</p>
              <pre className="workflow-text text-gray-200">{msg.response}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
