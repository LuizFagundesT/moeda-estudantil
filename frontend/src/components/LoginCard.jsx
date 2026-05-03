import { useState } from "react";

const styles = `
  .login-wrapper {
    width: 520px;
    flex-shrink: 0;
    margin-left: auto;
  }

  /* ───────── CARD GLASS ───────── */
  .login-card {
    position: relative;
    overflow: hidden;
    border-radius: 28px;

    background: rgba(220, 232, 248, 0.34);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);

    border: 1px solid rgba(255,255,255,0.45);

    box-shadow:
      0 8px 40px rgba(83, 74, 183, 0.14),
      0 1px 0 rgba(255,255,255,0.65) inset,
      0 -1px 0 rgba(83,74,183,0.08) inset;
  }

  .login-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at top left,
      rgba(255,255,255,0.45),
      transparent 42%);
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
    background: radial-gradient(
      circle,
      rgba(127,119,221,0.25),
      transparent 70%
    );
    filter: blur(12px);
    pointer-events: none;
  }

  /* ───────── BODY ───────── */
  .login-body {
    padding: 34px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .login-title {
    font-family: 'Play', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #26215C;
    margin: 0;
  }

  .login-sub {
    font-family: 'Play', sans-serif;
    font-size: 13px;
    color: rgba(83,74,183,.65);
    margin-bottom: 10px;
  }

  /* ───────── INPUTS ───────── */
  .login-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .login-label {
    font-family: 'Play', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,.72);
  }

  .login-input {
    width: 100%;
    outline: none;
    padding: 14px 16px;
    border-radius: 14px;

    border: 1px solid rgba(255,255,255,.35);
    background: rgba(255,255,255,.30);

    font-family: 'Play', sans-serif;
    font-size: 14px;
    color: #26215C;

    transition: all .25s ease;
  }

  .login-input::placeholder {
    color: rgba(83,74,183,.38);
  }

  .login-input:focus {
    background: rgba(255,255,255,.48);
    border-color: rgba(83,74,183,.35);

    box-shadow:
      0 0 0 4px rgba(83,74,183,.08),
      0 6px 18px rgba(83,74,183,.08);
  }

  /* ───────── OPTIONS ───────── */
  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-top: -2px;
  }

  .login-check {
    display: flex;
    align-items: center;
    gap: 8px;

    font-family: 'Play', sans-serif;
    font-size: 12px;
    color: rgba(83,74,183,.72);
  }

  .login-link {
    font-family: 'Play', sans-serif;
    font-size: 12px;
    color: #534AB7;
    text-decoration: none;
    font-weight: 700;
  }

  .login-link:hover {
    color: #26215C;
  }

  /* ───────── BUTTON ───────── */
  .login-btn {
    border: none;
    cursor: pointer;
    width: 100%;
    margin-top: 8px;

    padding: 15px;
    border-radius: 14px;

    font-family: 'Play', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;

    color: #fff;
    background: linear-gradient(
      135deg,
      #534AB7,
      #7F77DD
    );

    box-shadow:
      0 10px 24px rgba(83,74,183,.30);

    transition: all .25s ease;
  }

  .login-btn:hover {
    transform: translateY(-2px);
    box-shadow:
      0 14px 30px rgba(83,74,183,.42);
  }

  /* ───────── FOOTER ───────── */
  .login-footer {
    text-align: center;
    font-family: 'Play', sans-serif;
    font-size: 12px;
    color: rgba(83,74,183,.55);
    margin-top: 6px;
  }

  .login-footer a {
    color: #534AB7;
    text-decoration: none;
    font-weight: 700;
  }

  .login-footer a:hover {
    color: #26215C;
  }

  /* ───────── ANIMATION ───────── */
  .login-enter {
    animation: fadeSlideIn .28s ease;
  }

  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .login-wrapper {
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
    }
  }
`;

export default function LoginCard({ onSubmit }) {
  const [form, setForm] = useState({
    email: "",
    senha: "",
    lembrar: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
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
            <h2 className="login-title">Entrar</h2>
            <p className="login-sub">
              Acesse sua conta e continue sua jornada.
            </p>

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
                placeholder="********"
                value={form.senha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-options">
              <label className="login-check">
                <input
                  type="checkbox"
                  name="lembrar"
                  checked={form.lembrar}
                  onChange={handleChange}
                />
                Lembrar-me
              </label>

              <a href="/recuperar-senha" className="login-link">
                Esqueci senha
              </a>
            </div>

            <button className="login-btn" type="submit">
              Entrar
            </button>

            <p className="login-footer">
              Não possui conta? <a href="/cadastro">Criar conta</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}