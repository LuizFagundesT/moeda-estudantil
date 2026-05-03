import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const headerStyles = `
  .kn-header {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 48px);
    max-width: 1200px;
    z-index: 100;
    border-radius: 20px;
    padding: 0 28px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(220, 232, 248, 0.35);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.45);
    box-shadow:
      0 4px 32px rgba(83, 74, 183, 0.12),
      0 1px 0 rgba(255, 255, 255, 0.6) inset,
      0 -1px 0 rgba(83, 74, 183, 0.08) inset;
    transition: all 0.4s ease;
  }

  .kn-header.scrolled {
    background: rgba(38, 33, 92, 0.45);
    backdrop-filter: blur(32px) saturate(200%);
    -webkit-backdrop-filter: blur(32px) saturate(200%);
    border-color: rgba(175, 169, 236, 0.3);
    box-shadow:
      0 8px 40px rgba(38, 33, 92, 0.3),
      0 1px 0 rgba(175, 169, 236, 0.2) inset;
  }

  .kn-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .kn-logo-coin {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(145deg, #FAC775, #EF9F27);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Play', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #26215C;
    box-shadow:
      0 0 0 2px rgba(250, 199, 117, 0.3),
      0 2px 12px rgba(239, 159, 39, 0.4);
    flex-shrink: 0;
  }

  .kn-logo-text {
    font-family: 'Play', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #26215C;
    letter-spacing: 1px;
    transition: color 0.4s;
  }

  .kn-header.scrolled .kn-logo-text { color: #fff; }

  .kn-nav {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
  }

  .kn-nav a {
    font-family: 'Play', sans-serif;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #3C3489;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 10px;
    transition: all 0.25s ease;
    cursor: pointer;
  }

  .kn-header.scrolled .kn-nav a { color: #AFA9EC; }

  .kn-nav a:hover {
    background: rgba(83, 74, 183, 0.12);
    color: #534AB7;
  }

  .kn-header.scrolled .kn-nav a:hover {
    background: rgba(175, 169, 236, 0.15);
    color: #fff;
  }

  .kn-nav a.active {
    background: rgba(83, 74, 183, 0.15);
    color: #534AB7;
  }

  .kn-header.scrolled .kn-nav a.active {
    background: rgba(175, 169, 236, 0.2);
    color: #fff;
  }

  .kn-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .kn-btn-ghost {
    font-family: 'Play', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    background: transparent;
    color: #3C3489;
    border: 1px solid rgba(83, 74, 183, 0.3);
    border-radius: 10px;
    padding: 8px 18px;
    cursor: pointer;
    transition: all 0.25s;
    white-space: nowrap;
  }

  .kn-header.scrolled .kn-btn-ghost {
    color: #AFA9EC;
    border-color: rgba(175, 169, 236, 0.35);
  }

  .kn-btn-ghost:hover { background: rgba(83, 74, 183, 0.1); }

  .kn-btn-primary {
    font-family: 'Play', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    border: 1px solid rgba(175, 169, 236, 0.3);
    border-radius: 10px;
    padding: 9px 20px;
    cursor: pointer;
    transition: all 0.25s;
    white-space: nowrap;
    box-shadow: 0 2px 16px rgba(83, 74, 183, 0.35);
  }

  .kn-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(83, 74, 183, 0.45);
  }

  .kn-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    padding: 8px;
    background: none;
    border: none;
  }

  .kn-hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    border-radius: 2px;
    background: #3C3489;
    transition: all 0.3s;
  }

  .kn-header.scrolled .kn-hamburger span { background: #AFA9EC; }

  @media (max-width: 768px) {
    .kn-nav, .kn-actions { display: none; }
    .kn-hamburger { display: flex; }
    .kn-header { width: calc(100% - 24px); padding: 0 20px; }
  }
`;

// ─── Defina aqui o label e a rota de cada item do menu ───
const NAV_LINKS = [
  { label: "home",route: "/" },
  { label: "Como funciona",route: "/como-funciona" },
  { label: "Vantagens",route: "/vantagens" },
  { label: "Parceiros",route: "/parceiros" },
  { label: "Ranking",route: "/ranking" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("Início");
  const navigate                = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick(item) {
    setActive(item.label);
    navigate(item.route);
  }

  return (
    <>
      <style>{headerStyles}</style>
      <header className={`kn-header${scrolled ? " scrolled" : ""}`}>

        <a href="/" className="kn-logo">
          <div className="kn-logo-coin">₭</div>
          <span className="kn-logo-text">KRONOS</span>
        </a>

        <nav>
          <ul className="kn-nav">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <a
                  className={active === item.label ? "active" : ""}
                  onClick={() => handleNavClick(item)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="kn-actions">
          <button className="kn-btn-ghost" onClick={() => navigate("/login")}>
            Entrar
          </button>
          <button className="kn-btn-primary" onClick={() => navigate("/cadastro")}>
            Criar conta
          </button>
        </div>

        <button className="kn-hamburger" aria-label="Abrir menu">
          <span /><span /><span />
        </button>

      </header>
    </>
  );
}