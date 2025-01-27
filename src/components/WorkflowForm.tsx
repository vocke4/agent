'use client';
import { useState } from 'react';
import { Clipboard, AlertCircle, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface WorkflowStep {
  id: number;
  title: string;
  content: string;
}

export default function WorkflowForm() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);

  const toggleStep = (stepId: number) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

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
      setWorkflowSteps(result.steps);
      setGoal('');
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
          AI Workflow Architect
        </h1>
        <p className="text-slate-400 text-lg">
          Transform your goals into executable workflows with AI precision
        </p>
      </div>

      <div className="space-y-6">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Enter your objective..."
          className="input-field"
          disabled={loading}
        />

        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="submit-button"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Workflow...
            </div>
          ) : (
            <>
              <Clipboard className="w-5 h-5" />
              Generate Workflow
            </>
          )}
        </button>

        {message && (
          <div className="error-message">
            <AlertCircle className="w-5 h-5" />
            {message}
          </div>
        )}

        <div className="workflow-container">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => (
                <h1 className="workflow-header" {...props} />
              ),
              h2: ({node, ...props}) => (
                <h2 className="workflow-header text-2xl" {...props} />
              ),
              ul: ({node, ...props}) => (
                <ul className="substep-list" {...props} />
              ),
              li: ({node, ...props}) => (
                <li className="substep-item" {...props} />
              )
            }}
          >
            {workflowSteps.map(step => `
              ## ${step.title}
              ${step.content}
            `).join('\n')}
          </ReactMarkdown>

          {workflowSteps.map(step => (
            <div 
              key={step.id}
              className="step-card"
              role="button"
              tabIndex={0}
              onClick={() => toggleStep(step.id)}
              aria-expanded={expandedSteps.includes(step.id)}
            >
              <div className="step-header">
                <ChevronRight 
                  className={`transition-transform ${
                    expandedSteps.includes(step.id) ? 'rotate-90' : ''
                  }`}
                />
                {step.title}
              </div>
              {expandedSteps.includes(step.id) && (
                <div className="step-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      ul: ({node, ...props}) => (
                        <ul className="substep-list" {...props} />
                      ),
                      li: ({node, ...props}) => (
                        <li className="substep-item" {...props} />
                      )
                    }}
                  >
                    {step.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
