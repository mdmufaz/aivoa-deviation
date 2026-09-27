import DeviationForm from "./components/DeviationForm";
import AIAssistant from "./components/AIAssistant";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>AIVOA Deviation Intake</h1>
        <p>AI-assisted pharmaceutical deviation management</p>
      </header>

      <main className="main-container">
        <section className="form-panel">
          <DeviationForm />
        </section>

        <section className="ai-panel">
          <AIAssistant />
        </section>
      </main>
    </div>
  );
}

export default App;