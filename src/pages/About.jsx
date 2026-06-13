import './About.css'

export default function About() {
  return (
    <div className="about animate-in">
      <div className="about-inner">
        <header className="about-header">
          <div className="about-initials" aria-hidden="true">GA</div>
          <div>
            <h1>Dzifa Adzoa Matrevi</h1>
            <p className="about-role">Software Engineering Technology &middot; Centennial College</p>
          </div>
        </header>

        <div className="about-body">
          <section className="about-section">
            <h2>About this project</h2>
            <p>
              Contribution Tracker records and reports charitable donations.
              Transactions are stored in a PostgreSQL database, summary charts
              cover monthly and annual views, and the ledger exports to PDF for
              tax or reporting purposes.
            </p>
          </section>

          <section className="about-section">
            <h2>Technical stack</h2>
            <div className="stack-grid">
              {[
                ['Frontend',  'React 18, Vite, React Router, Recharts'],
                ['Backend',   'Vercel Serverless Functions (Node.js)'],
                ['Database',  'PostgreSQL via Neon'],
                ['PDF',       'jsPDF + jspdf-autotable'],
                ['Deploy',    'Vercel'],
              ].map(([k, v]) => (
                <div key={k} className="stack-row">
                  <span className="stack-key">{k}</span>
                  <span className="stack-val">{v}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="about-section">
            <h2>Links</h2>
            <div className="about-links">
              <a href="https://github.com/Dzi-zi" target="_blank" rel="noopener noreferrer" className="about-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub &middot; Dzi-zi
              </a>
              <a href="https://gemini-dzi.vercel.app" target="_blank" rel="noopener noreferrer" className="about-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                </svg>
                Portfolio &middot; GeminiDzi
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}