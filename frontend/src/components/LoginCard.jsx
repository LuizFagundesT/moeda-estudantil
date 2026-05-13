import { useState } from "react";

const styles = `
  .login-wrapper {
    width: 460px;
    flex-shrink: 0;
    margin-left: auto;
  }

  .login-card {
    position: relative;
    overflow: hidden;
    border-radius: 26px;
    background: rgba(220,232,248,0.38);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.48);
    box-shadow:
      0 8px 40px rgba(83,74,183,.14),
      0 1px 0 rgba(255,255,255,.65) inset,
      0 -1px 0 rgba(83,74,183,.08) inset;
  }

  .login-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top left, rgba(255,255,255,.45), transparent 42%);
    pointer-events: none;
  }

  .login-card::after {
    content: "";
    position: absolute;
    width: 180px;
    height: 180px;
    top: -60px;
    right: -40px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(127,119,221,.22), transparent 70%);
    filter: blur(14px);
    pointer-events: none;
  }

  .login-body {
    padding: 36px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    position: relative;
    z-index: 1;
  }

  .login-header {
    margin-bottom: 4px;
  }

  .login-title {
    font-family: 'Play', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: #26215C;
    margin: 0 0 6px;
  }

  .login-sub {
    font-family: 'Play', sans-serif;
    font-size: 13px;
    color: rgba(83,74,183,.6);
    margin: 0;
  }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .login-label {
    font-family: 'Play', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(60,52,137,.72);
  }

  .login-input {
    width: 100%;
    box-sizing: border-box;
    outline: none;
    padding: 14px 16px;
    border-radius: 13px;
    border: 1px solid rgba(255,255,255,.38);
    background: rgba(255,255,255,.32);
    font-family: 'Play', sans-serif;
    font-size: 14px;
    color: #26215C;
    transition: all .22s ease;
  }

  .login-input::placeholder { color: rgba(83,74,183,.38); }

  .login-input:focus {
    background: rgba(255,255,255,.52);
    border-color: rgba(83,74,183,.35);
    box-shadow: 0 0 0 4px rgba(83,74,183,.08);
  }

  .login-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .login-check {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Play', sans-serif;
    font-size: 12px;
    color: rgba(83,74,183,.65);
    cursor: pointer;
  }

  .login-check input[type="checkbox"] {
    accent-color: #534AB7;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }

  .login-link {
    font-family: 'Play', sans-serif;
    font-size: 12px;
    color: #534AB7;
    text-decoration: none;
    font-weight: 700;
    transition: color .15s;
  }

  .login-link:hover { color: #26215C; }

  .login-btn {
    border: none;
    cursor: pointer;
    width: 100%;
    padding: 15px;
    border-radius: 13px;
    font-family: 'Play', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #fff;
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    box-shadow: 0 10px 24px rgba(83,74,183,.28);
    transition: all .22s ease;
    margin-top: 4px;
  }

  .login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 30px rgba(83,74,183,.38);
  }

  .login-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(175,169,236,.4), transparent);
    margin: 2px 0;
  }

  .login-footer {
    text-align: center;
    font-family: 'Play', sans-serif;
    font-size: 12px;
    color: rgba(83,74,183,.55);
  }

  .login-footer a {
    color: #534AB7;
    text-decoration: none;
    font-weight: 700;
    transition: color .15s;
  }

  .login-footer a:hover { color: #26215C; }

  @keyframes kn-slide-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-enter { animation: kn-slide-in .28s ease; }

  @media (max-width: 768px) {
    .login-wrapper {
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
    }

    .login-body { padding: 28px; }
  }
`;

export default function LoginCard({ onSubmit }) {
  const [form, setForm] = useState({ email: "", senha: "", lembrar: false });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(form);
  }

  return (
    <>
      <style>{styles}</style>

      <div className="login-wrapper">
        <div className="login-card">
          <form className="login-body login-enter" onSubmit={handleSubmit}>

            <div className="login-header">
              <h2 className="login-title">Acessar conta</h2>
              <p className="login-sub">Insira suas credenciais para continuar.</p>
            </div>

            <div className="login-field">
              <label className="login-label">E-mail</label>
              <input
                className="login-input"
                type="email"
                name="email"
                placeholder="seuemail@exemplo.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label">Senha</label>
              <input
                className="login-input"
                type="password"
                name="senha"
                placeholder="••••••••"
                value={form.senha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-row">
              <label className="login-check">
                <input
                  type="checkbox"
                  name="lembrar"
                  checked={form.lembrar}
                  onChange={handleChange}
                />
                Lembrar-me
              </label>
              <a href="/recuperar-senha" className="login-link">Esqueci a senha</a>
            </div>

            <div className="login-divider" />

            <button className="login-btn" type="submit">Entrar</button>

            <p className="login-footer">
              Não possui conta? <a href="/cadastro">Criar conta</a>
            </p>

          </form>
        </div>
      </div>
    </>
  );
}