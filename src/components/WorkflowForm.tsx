'use client';
import { useState } from 'react';

interface WorkflowFormProps {
  onWorkflowCreated: (workflow: any) => void;
}

export default function WorkflowForm({ onWorkflowCreated }: WorkflowFormProps) {
  const [goal, setGoal] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ goal }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`Workflow created successfully!`);
        onWorkflowCreated(result.workflow);
        setGoal(''); // Clear input after successful submission
      } else {
        setMessage('There was an error submitting your goal.');
      }
    } catch (error) {
      setMessage('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Your Goal</h2>
      <input
        id="goal-input"
        type="text"
        placeholder="Enter your goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <button id="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Start'}
      </button>
      {message && <p className="feedback-message">{message}</p>}
    </div>
  );
}
