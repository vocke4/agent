'use client';
import { useState } from 'react';
import { Loader2, Rocket } from 'lucide-react';

export default function Home() {
  const [goal, setGoal] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!goal.trim()) {
      setError('Please enter a valid goal');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/create-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });

      if (!res.ok) throw new Error('Request failed');
      
      const data = await res.json();
      setResponse(data.generatedWorkflow);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          AI Workflow Architect
        </h1>
        <p className="text-gray-400">
          Transform your goals into executable workflows with AI precision
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            Your Objective
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Example: Create a marketing campaign for a new SaaS product..."
            rows={3}
            className="w-full resize-none"
          />

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Architecting Workflow...
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5" />
                Generate Workflow
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {response && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Generated Workflow</h2>
              <button 
                onClick={() => navigator.clipboard.writeText(response)}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Copy to Clipboard
              </button>
            </div>
            <pre className="whitespace-pre-wrap break-words font-mono text-sm bg-gray-900/50 p-4 rounded-lg overflow-x-auto">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
