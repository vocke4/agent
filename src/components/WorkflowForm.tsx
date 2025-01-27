'use client';
import { useState } from 'react';
import { Clipboard } from 'lucide-react';

export default function WorkflowForm() {
  const [goal, setGoal] = useState('');
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
      setGoal('');
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="text-3xl font-bold mb-4 text-center">AI Workflow Architect</h2>
      <p className="text-gray-400 text-center mb-4">
        Transform your goals into executable workflows with AI precision
      </p>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter your objective..."
        className="input-field"
      />
      <button onClick={handleSubmit} disabled={loading} className="submit-button">
        {loading ? 'Generating...' : <><Clipboard className="icon" /> Generate Workflow</>}
      </button>
      {message && <p className="error-message">{message}</p>}
    </div>
  );
}
