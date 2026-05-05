import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid rgba(83, 74, 183, 0.12);
    box-shadow: 0 2px 24px rgba(83, 74, 183, 0.08);
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  .kn-header.scrolled {
    background: rgba(38, 33, 92, 0.97);
    border-bottom-color: rgba(175, 169, 236, 0.2);
    box-shadow: 0 4px 32px rgba(38, 33, 92, 0.25);
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
    transition: color 0.3s;
  }

  .kn-header.scrolled .kn-logo-text { color: #fff; }

  .kn-nav {
    display: flex;
    align-items: center;
    gap: 2px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .kn-nav a {
    font-family: 'Play', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #3C3489;
    text-decoration: none;
    padding: 8px 14px;
    border-radius: 8px;
    transition: all 0.2s ease;
    cursor: pointer;
    display: block;
    position: relative;
  }

  .kn-header.scrolled .kn-nav a { color: #AFA9EC; }

  .kn-nav a::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 14px;
    right: 14px;
    height: 2px;
    border-radius: 2px;
    background: #534AB7;
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }

  .kn-nav a:hover::after,
  .kn-nav a.active::after { transform: scaleX(1); }

  .kn-header.scrolled .kn-nav a::after { background: #AFA9EC; }

  .kn-nav a:hover { color: #534AB7; }
  .kn-header.scrolled .kn-nav a:hover { color: #fff; }

  .kn-nav a.active { color: #534AB7; font-weight: 700; }
  .kn-header.scrolled .kn-nav a.active { color: #fff; }

  .kn-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .kn-user-greeting {
    font-family: 'Play', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #3C3489;
    letter-spacing: 0.5px;
    transition: color 0.3s;
  }

  .kn-header.scrolled .kn-user-greeting { color: #AFA9EC; }

  .kn-btn-ghost {
    font-family: 'Play', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    background: transparent;
    color: #3C3489;
    border: 1px solid rgba(83, 74, 183, 0.3);
    border-radius: 8px;
    padding: 8px 18px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .kn-header.scrolled .kn-btn-ghost {
    color: #AFA9EC;
    border-color: rgba(175, 169, 236, 0.4);
  }

  .kn-btn-ghost:hover {
    background: rgba(83, 74, 183, 0.08);
    border-color: rgba(83, 74, 183, 0.5);
  }

  .kn-header.scrolled .kn-btn-ghost:hover {
    background: rgba(175, 169, 236, 0.12);
  }

  .kn-btn-primary {
    font-family: 'Play', sans-serif;
    font-size: 12px;
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
    box-shadow: 0 2px 12px rgba(83, 74, 183, 0.3);
  }

  .kn-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(83, 74, 183, 0.4);
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
    .kn-header { padding: 0 20px; }
  }
`;

const NAV_LINKS = [
  { label: "Home", route: "/" },
  { label: "Como funciona", route: "/como-funciona" },
  { label: "Vantagens", route: "/vantagens" },
  { label: "Parceiros", route: "/parceiros" },
  { label: "Ranking", route: "/ranking" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("Home");
  const [usuario, setUsuario]   = useState(null);
  const navigate                = useNavigate();

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

    lerUsuario(); // lê ao montar

    // 👇 Escuta o evento disparado pelo Login
    window.addEventListener("usuarioLogado", lerUsuario);
    return () => window.removeEventListener("usuarioLogado", lerUsuario);
  }, []);

  useEffect(() => {
    const dados = localStorage.getItem("usuarioLogado");
    setUsuario(dados ? JSON.parse(dados) : null);
  }, []);

  function handleLogout() {
  localStorage.removeItem("usuarioLogado");
  setUsuario(null);
  window.dispatchEvent(new Event("usuarioLogado"));
  navigate("/");
}

  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "";

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
                <Link
                  to={item.route}
                  className={active === item.label ? "active" : ""}
                  onClick={() => setActive(item.label)}
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
              <span className="kn-user-greeting">Olá, {primeiroNome}!</span>
              <button className="kn-btn-ghost" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <button className="kn-btn-ghost" onClick={() => navigate("/login")}>
                Entrar
              </button>
              <button className="kn-btn-primary" onClick={() => navigate("/cadastro")}>
                Criar conta
              </button>
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