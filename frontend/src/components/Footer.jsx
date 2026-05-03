const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@600;700&family=Exo+2:wght@300;400&display=swap');

  .kn-footer-glass {
    display: flex;
    justify-content: center;
    padding: 0 24px 20px;
  }

  .kn-footer-glass-inner {
    width: 100%;
    max-width: 1200px;
    border-radius: 20px;
    padding: 0 28px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;

    background: rgba(220, 232, 248, 0.32);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.42);
    box-shadow:
      0 4px 32px rgba(83, 74, 183, 0.1),
      0 1px 0 rgba(255, 255, 255, 0.6) inset,
      0 -1px 0 rgba(83, 74, 183, 0.06) inset;
  }

  .kn-fg-logo {
    display: flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .kn-fg-coin {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: linear-gradient(145deg, #FAC775, #EF9F27);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Orbitron', monospace;
    font-size: 10px; font-weight: 900;
    color: #26215C;
    box-shadow: 0 0 0 2px rgba(250,199,117,0.3), 0 2px 8px rgba(239,159,39,0.35);
    flex-shrink: 0;
  }

  .kn-fg-name {
    font-family: 'Orbitron', monospace;
    font-size: 14px; font-weight: 900;
    color: #3C3489; letter-spacing: 1px;
  }

  .kn-fg-links {
    display: flex;
    gap: 4px;
    list-style: none;
  }

  .kn-fg-links a {
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px; font-weight: 600;
    letter-spacing: 1.3px;
    text-transform: uppercase;
    color: #534AB7;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 9px;
    transition: all 0.2s;
  }

  .kn-fg-links a:hover {
    background: rgba(83, 74, 183, 0.1);
    color: #3C3489;
  }

  .kn-fg-copy {
    font-family: 'Exo 2', sans-serif;
    font-size: 12px; font-weight: 300;
    color: rgba(83, 74, 183, 0.5);
    white-space: nowrap;
    flex-shrink: 0;
  }

  @media (max-width: 680px) {
    .kn-fg-links { display: none; }
    .kn-footer-glass-inner { justify-content: space-between; padding: 0 20px; }
  }
`;

export default function Footer() {
  return (
    <>
      <style>{footerStyles}</style>
      <footer className="kn-footer-glass">
        <div className="kn-footer-glass-inner">

          <a href="/" className="kn-fg-logo">
            <div className="kn-fg-coin">₭</div>
            <span className="kn-fg-name">KRONOS</span>
          </a>

          <ul className="kn-fg-links">
            {["Como funciona", "Vantagens", "Parceiros", "Suporte"].map((l) => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>

          <p className="kn-fg-copy">© 2025 Kronos · KRN</p>

        </div>
      </footer>
    </>
  );
}