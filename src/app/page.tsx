'use client';

import { useState } from 'react';

export default function Home() {
  const [goal, setGoal] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/create-workflow', {
        method: 'POST',
        body: JSON.stringify({ goal }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      setResponse(data.workflow || data.error);
    } catch (err) {
      setResponse('Error processing request.');
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Workflow Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter your goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      {response && <p className="mt-4 p-2 bg-gray-100">{response}</p>}
    </div>
  );
}
