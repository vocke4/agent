export default function WorkflowForm() {
  return (
    <div className="container">
      <header>
        <h1>Agent Workflow</h1>
        <p>Automate your tasks efficiently</p>
      </header>
      <div className="card">
        <h2>Your Goal</h2>
        <input id="goal-input" type="text" placeholder="Enter your goal" />
        <button id="submit-btn">Start</button>
      </div>
      <div id="output"></div>
    </div>
  );
}
