const footerStyles = `
  .kn-footer {
    padding: 0 48px 24px;
    box-sizing: border-box;
  }

  .kn-footer-inner {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 18px;
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;

    background: rgba(220,232,248,0.38);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.45);
    box-shadow:
      0 4px 28px rgba(83,74,183,0.09),
      0 1px 0 rgba(255,255,255,0.62) inset;
  }

  /* ── LOGO ── */
  .kn-fg-logo {
    display: flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .kn-fg-coin {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(145deg, #FAC775, #EF9F27);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Play', sans-serif;
    font-size: 11px;
    font-weight: 700;
    color: #26215C;
    box-shadow: 0 0 0 2px rgba(250,199,117,0.28), 0 2px 8px rgba(239,159,39,0.32);
    flex-shrink: 0;
  }

  .kn-fg-name {
    font-family: 'Play', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #26215C;
    letter-spacing: 2px;
  }

  .kn-fg-tag {
    font-family: 'Play', sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: rgba(83,74,183,.45);
    align-self: flex-end;
    margin-bottom: 2px;
  }

  /* ── LINKS ── */
  .kn-fg-links {
    display: flex;
    gap: 2px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .kn-fg-links a {
    font-family: 'Play', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(83,74,183,.65);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 8px;
    transition: background 0.18s, color 0.18s;
  }

  .kn-fg-links a:hover {
    background: rgba(83,74,183,.08);
    color: #3C3489;
  }

  /* ── COPYRIGHT ── */
  .kn-fg-copy {
    font-family: 'Play', sans-serif;
    font-size: 11px;
    font-weight: 400;
    color: rgba(83,74,183,.42);
    white-space: nowrap;
    flex-shrink: 0;
    letter-spacing: 0.3px;
  }

  /* ── DIVIDER ── */
  .kn-fg-divider {
    width: 1px;
    height: 16px;
    background: rgba(83,74,183,.14);
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .kn-footer { padding: 0 20px 20px; }
    .kn-footer-inner { padding: 0 20px; }
    .kn-fg-links, .kn-fg-divider { display: none; }
  }
`;

const LINKS = ["Como funciona", "Vantagens", "Parceiros", "Suporte"];

export default function Footer() {
  return (
    <>
      <style>{footerStyles}</style>

      <footer className="kn-footer">
        <div className="kn-footer-inner">

          <a href="/" className="kn-fg-logo">
            <div className="kn-fg-coin">₭</div>
            <span className="kn-fg-name">KRONOS</span>
            <span className="kn-fg-tag">KRN</span>
          </a>

          <ul className="kn-fg-links">
            {LINKS.map((l) => (
              <li key={l}><a href="#">{l}</a></li>
            ))}
          </ul>

          <div className="kn-fg-divider" />

          <p className="kn-fg-copy">© 2025 Kronos Network</p>

        </div>
      </footer>
    </>
  );
}