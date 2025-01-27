export default function WorkflowForm() {
  // ... existing state ...

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
          AI Workflow Architect
        </h1>
        <p className="text-slate-400 text-lg">
          Transform your goals into executable workflows with AI precision
        </p>
      </div>

      <div className="space-y-6">
        <div className="input-group">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Enter your objective..."
            className="input-field"
            disabled={loading}
          />
        </div>

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
      </div>
    </div>
  );
}
