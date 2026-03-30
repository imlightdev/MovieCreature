export default function Manual() {
  return (
    <div className="manual-page">

      {/* Richiedere un film */}
      <section className="manual-section">
        <h2 className="manual-heading">
          <span className="manual-heading-num">01</span>
          How to request a movie
        </h2>
        <p className="manual-desc">
          To request a movie, use the IMDB page link of the movie you want to request.
        </p>
        <div className="command-block">
          <div className="command-row">
            <span className="command-label">Command</span>
            <code className="command-code">!mr &lt;link imdb&gt;</code>
          </div>
        </div>
        <p className="manual-note">
          The link must be a valid IMDB URL. The movie title will be retrieved automatically.
        </p>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">
          <span className="manual-heading-num">02</span>
          How to set conductor
        </h2>
        <p className="manual-desc">
          Only a user with the conductor role can use this command
        </p>
        <p className="manual-desc">
          Set conductor by id
        </p>
        <div className="command-block">
          <div className="command-row">
            <span className="command-label">Command</span>
            <code className="command-code">!sc -id &lt;id1,id2,id3&gt; </code>
          </div>
        </div>
        <p className="manual-note">
          You can enter multiple IDs separated by commas.
        </p>
        <p className="manual-desc">
          Set conductor by imdb id
        </p>
        <div className="command-block">
          <div className="command-row">
            <span className="command-label">Command</span>
            <code className="command-code">!sc -imdb &lt;imdbId1,imdbId2,imdbId3&gt;</code>
          </div>
        </div>
        <p className="manual-note">
          You can enter multiple IDs separated by commas.
        </p>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">
          <span className="manual-heading-num">03</span>
          Cancel a request
        </h2>
        <p className="manual-desc">
          To cancel a request in pending
        </p>
        <div className="command-block">
          <div className="command-row">
            <span className="command-label">Command</span>
            <code className="command-code">!mc</code>
          </div>
        </div>
      </section>

      {/* Note generali 
      <section className="manual-section manual-section--last">
        <h2 className="manual-heading">
          <span className="manual-heading-num">—</span>
          Note
        </h2>
        <ul className="manual-list">
          <li>I comandi funzionano solo durante la live.</li>
          <li>È possibile avere una sola richiesta attiva per volta.</li>
          <li>Il conduttore si riserva il diritto di rifiutare una richiesta.</li>
        </ul>
      </section>
      */}
      <style jsx>{`
        .manual-page {
          max-width: 780px;
          margin: 0 auto;
          padding: 3rem 2rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .manual-intro {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.7;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid var(--border);
        }

        .manual-section {
          padding: 2.5rem 0;
          border-bottom: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .manual-section--last {
          border-bottom: none;
        }

        .manual-heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 400;
          color: var(--text);
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
        }

        .manual-heading-num {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          color: var(--gold);
          letter-spacing: 0.05em;
        }

        .manual-desc {
          color: var(--text-muted);
          font-size: 0.85rem;
          line-height: 1.65;
        }

        .command-block {
          background: var(--surface);
          border: 1px solid var(--border);
          border-left: 2px solid var(--gold);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .command-row {
          display: flex;
          align-items: baseline;
          gap: 1.25rem;
        }

        .command-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-dim);
          width: 56px;
          flex-shrink: 0;
        }

        .command-code {
          font-family: 'DM Mono', monospace;
          font-size: 0.85rem;
          color: var(--gold-light);
          background: var(--surface-2);
          padding: 0.25rem 0.6rem;
          border: 1px solid var(--border);
          border-radius: 1px;
          letter-spacing: 0.02em;
        }

        .command-example {
          color: var(--text-muted);
          font-size: 0.78rem;
        }

        .manual-note {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-family: 'DM Mono', monospace;
          padding-left: 0.5rem;
          border-left: 1px solid var(--border);
        }

        .manual-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0;
        }

        .manual-list li {
          font-size: 0.83rem;
          color: var(--text-muted);
          padding-left: 1.25rem;
          position: relative;
        }

        .manual-list li::before {
          content: '·';
          position: absolute;
          left: 0;
          color: var(--gold);
          font-size: 1rem;
          line-height: 1.4;
        }

        @media (max-width: 640px) {
          .manual-page { padding: 2rem 1rem 4rem; }
          .command-row { flex-direction: column; gap: 0.4rem; }
          .command-label { width: auto; }
        }
      `}</style>
    </div>
  );
}