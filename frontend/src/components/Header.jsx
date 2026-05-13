import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const headerStyles = `
  .kn-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid rgba(83, 74, 183, 0.10);
    box-shadow: 0 1px 20px rgba(83, 74, 183, 0.07);
    transition: background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
    box-sizing: border-box;
  }

  .kn-header.scrolled {
    background: rgba(28, 24, 72, 0.97);
    border-bottom-color: rgba(175, 169, 236, 0.15);
    box-shadow: 0 4px 40px rgba(20, 16, 60, 0.30);
  }

  /* ── LOGO ── */
  .kn-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
  }

  .kn-logo-coin {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(145deg, #FAC775, #EF9F27);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Play', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #26215C;
    box-shadow: 0 0 0 2px rgba(250,199,117,0.28), 0 2px 10px rgba(239,159,39,0.35);
    flex-shrink: 0;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .kn-logo:hover .kn-logo-coin {
    transform: rotate(-8deg) scale(1.08);
    box-shadow: 0 0 0 3px rgba(250,199,117,0.4), 0 4px 16px rgba(239,159,39,0.45);
  }

  .kn-logo-text {
    font-family: 'Play', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #26215C;
    letter-spacing: 2px;
    transition: color 0.3s;
  }

  .kn-logo-tag {
    font-family: 'Play', sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: rgba(83,74,183,.5);
    text-transform: uppercase;
    margin-left: 2px;
    align-self: flex-end;
    margin-bottom: 2px;
    transition: color 0.3s;
  }

  .kn-header.scrolled .kn-logo-text { color: #fff; }
  .kn-header.scrolled .kn-logo-tag  { color: rgba(175,169,236,.45); }

  /* ── NAV ── */
  .kn-nav {
    display: flex;
    align-items: center;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .kn-nav a {
    font-family: 'Play', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    color: rgba(60,52,137,.75);
    text-decoration: none;
    padding: 8px 14px;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    display: block;
    position: relative;
  }

  .kn-nav a::after {
    content: '';
    position: absolute;
    bottom: 3px;
    left: 14px;
    right: 14px;
    height: 2px;
    border-radius: 2px;
    background: #534AB7;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.22s ease;
  }

  .kn-nav a:hover        { color: #534AB7; }
  .kn-nav a.active       { color: #534AB7; }
  .kn-nav a:hover::after,
  .kn-nav a.active::after { transform: scaleX(1); }

  .kn-header.scrolled .kn-nav a         { color: rgba(175,169,236,.65); }
  .kn-header.scrolled .kn-nav a:hover   { color: #fff; }
  .kn-header.scrolled .kn-nav a.active  { color: #fff; }
  .kn-header.scrolled .kn-nav a::after  { background: rgba(175,169,236,.7); }

  /* ── ACTIONS ── */
  .kn-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .kn-user-badge {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .kn-user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Play', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .kn-user-greeting {
    font-family: 'Play', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #3C3489;
    letter-spacing: 0.4px;
    transition: color 0.3s;
  }

  .kn-header.scrolled .kn-user-greeting { color: #AFA9EC; }

  .kn-btn-ghost {
    font-family: 'Play', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    background: transparent;
    color: #3C3489;
    border: 1px solid rgba(83,74,183,.28);
    border-radius: 8px;
    padding: 8px 18px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .kn-btn-ghost:hover {
    background: rgba(83,74,183,.07);
    border-color: rgba(83,74,183,.45);
    color: #534AB7;
  }

  .kn-header.scrolled .kn-btn-ghost {
    color: #AFA9EC;
    border-color: rgba(175,169,236,.35);
  }

  .kn-header.scrolled .kn-btn-ghost:hover {
    background: rgba(175,169,236,.12);
    color: #fff;
    border-color: rgba(175,169,236,.55);
  }

  .kn-btn-primary {
    font-family: 'Play', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 9px 20px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    box-shadow: 0 2px 14px rgba(83,74,183,.28);
  }

  .kn-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 20px rgba(83,74,183,.40);
  }

  /* ── DIVIDER ── */
  .kn-nav-divider {
    width: 1px;
    height: 18px;
    background: rgba(83,74,183,.15);
    margin: 0 6px;
    flex-shrink: 0;
    transition: background 0.3s;
  }

  .kn-header.scrolled .kn-nav-divider {
    background: rgba(175,169,236,.2);
  }

  /* ── HAMBURGER ── */
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
    .kn-nav, .kn-actions, .kn-nav-divider { display: none; }
    .kn-hamburger { display: flex; }
    .kn-header { padding: 0 20px; }
  }
`;

const NAV_LINKS = [
  { label: "Home",          route: "/"              },
  { label: "Como funciona", route: "/como-funciona" },
  { label: "Vantagens",     route: "/vantagens"     },
  { label: "Parceiros",     route: "/parceiros"     },
  { label: "Ranking",       route: "/ranking"       },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [usuario,  setUsuario]  = useState(null);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function lerUsuario() {
      const dados = localStorage.getItem("usuarioLogado");
      setUsuario(dados ? JSON.parse(dados) : null);
    }
    lerUsuario();
    window.addEventListener("usuarioLogado", lerUsuario);
    return () => window.removeEventListener("usuarioLogado", lerUsuario);
  }, []);

  function handleLogout() {
    localStorage.removeItem("usuarioLogado");
    setUsuario(null);
    window.dispatchEvent(new Event("usuarioLogado"));
    navigate("/");
  }

  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "";
  const inicial      = primeiroNome.charAt(0).toUpperCase();

  return (
    <>
      <style>{headerStyles}</style>

      <header className={`kn-header${scrolled ? " scrolled" : ""}`}>

        <a href="/" className="kn-logo">
          <div className="kn-logo-coin">₭</div>
          <span className="kn-logo-text">KRONOS</span>
          <span className="kn-logo-tag">KRN</span>
        </a>

        <nav>
          <ul className="kn-nav">
            {NAV_LINKS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.route}
                  className={location.pathname === item.route ? "active" : ""}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="kn-actions">
          {usuario ? (
            <>
              <div className="kn-user-badge">
                <div className="kn-user-avatar">{inicial}</div>
                <span className="kn-user-greeting">{primeiroNome}</span>
              </div>
              <div className="kn-nav-divider" />
              <button className="kn-btn-ghost" onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <>
              <button className="kn-btn-ghost"   onClick={() => navigate("/login")}>Entrar</button>
              <button className="kn-btn-primary"  onClick={() => navigate("/cadastro")}>Criar conta</button>
            </>
          )}
        </div>

        <button className="kn-hamburger" aria-label="Abrir menu">
          <span /><span /><span />
        </button>

      </header>
    </>
  );
}