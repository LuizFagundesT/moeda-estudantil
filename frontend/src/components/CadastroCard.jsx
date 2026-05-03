import { useState } from "react";

const styles = `
  .cad-wrapper {
    width: 520px;
    flex-shrink: 0;
    margin-left: auto;
  }

  /* ───────── CARD GLASS ───────── */
  .cad-card {
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

  .cad-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at top left,
      rgba(255,255,255,0.45),
      transparent 42%);
    pointer-events: none;
  }

  .cad-card::after {
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

  /* ───────── TABS ───────── */
  .cad-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 10px;
    gap: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.18);
  }

  .cad-tab {
    border: none;
    cursor: pointer;
    padding: 14px 0;
    border-radius: 16px;

    font-family: 'Play', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.3px;
    text-transform: uppercase;

    color: rgba(60,52,137,.65);
    background: transparent;
    transition: all .25s ease;
  }

  .cad-tab:hover {
    background: rgba(255,255,255,0.22);
    color: #534AB7;
  }

  .cad-tab.active {
    background: linear-gradient(
      135deg,
      rgba(83,74,183,.95),
      rgba(127,119,221,.92)
    );
    color: #fff;

    box-shadow:
      0 8px 18px rgba(83,74,183,.28),
      0 1px 0 rgba(255,255,255,.25) inset;
  }

  /* ───────── BODY ───────── */
  .cad-body {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .cad-title {
    font-family: 'Play', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #26215C;
    margin-bottom: 2px;
  }

  .cad-sub {
    font-family: 'Play', sans-serif;
    font-size: 12px;
    color: rgba(83,74,183,.65);
    margin-bottom: 8px;
  }

  /* ───────── INPUTS ───────── */
  .cad-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .cad-label {
    font-family: 'Play', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,.72);
  }

  .cad-input,
  .cad-select {
    width: 100%;
    outline: none;
    padding: 12px 14px;
    border-radius: 14px;

    border: 1px solid rgba(255,255,255,.35);
    background: rgba(255,255,255,.30);

    font-family: 'Play', sans-serif;
    font-size: 13px;
    color: #26215C;

    transition: all .25s ease;
    -webkit-appearance: none;
  }

  .cad-input::placeholder {
    color: rgba(83,74,183,.38);
  }

  .cad-input:focus,
  .cad-select:focus {
    background: rgba(255,255,255,.48);
    border-color: rgba(83,74,183,.35);

    box-shadow:
      0 0 0 4px rgba(83,74,183,.08),
      0 6px 18px rgba(83,74,183,.08);
  }

  .cad-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .cad-divider {
    height: 1px;
    margin: 4px 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(175,169,236,.45),
      transparent
    );
  }

  .cad-select-wrap {
    position: relative;
  }

  .cad-select-wrap::after {
    content: "▾";
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(83,74,183,.55);
    font-size: 12px;
    pointer-events: none;
  }

  .cad-select {
    padding-right: 34px;
    cursor: pointer;
  }

  /* ───────── BUTTON ───────── */
  .cad-btn {
    border: none;
    cursor: pointer;
    width: 100%;
    margin-top: 6px;

    padding: 14px;
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

  .cad-btn:hover {
    transform: translateY(-2px);
    box-shadow:
      0 14px 30px rgba(83,74,183,.42);
  }

  .cad-footer-text {
    text-align: center;
    font-family: 'Play', sans-serif;
    font-size: 12px;
    color: rgba(83,74,183,.55);
    margin-top: 4px;
  }

  .cad-footer-text a {
    color: #534AB7;
    text-decoration: none;
    font-weight: 700;
  }

  .cad-footer-text a:hover {
    color: #26215C;
  }

  .cad-form-enter {
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
    .cad-wrapper {
      width: 100%;
      max-width: 420;
      margin: 0 auto;
    }

    .cad-row {
      grid-template-columns: 1fr;
    }
  }
`;

function FormAluno({ onSubmit }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    curso: "",
    senha: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.("aluno", form);
  }

  return (
    <form className="cad-form-enter" onSubmit={handleSubmit}>
      <p className="cad-title">Cadastro do Aluno</p>
      <p className="cad-sub">Crie sua conta e aproveite benefícios</p>

      <div className="cad-field">
        <label className="cad-label">Nome completo</label>
        <input
          className="cad-input"
          name="nome"
          placeholder="Seu nome"
          onChange={handleChange}
          required
        />
      </div>

      <div className="cad-row">
        <div className="cad-field">
          <label className="cad-label">Email</label>
          <input
            className="cad-input"
            type="email"
            name="email"
            placeholder="email@email.com"
            onChange={handleChange}
            required
          />
        </div>

        <div className="cad-field">
          <label className="cad-label">CPF</label>
          <input
            className="cad-input"
            name="cpf"
            placeholder="000.000.000-00"
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="cad-field">
        <label className="cad-label">Curso</label>
        <input
          className="cad-input"
          name="curso"
          placeholder="Seu curso"
          onChange={handleChange}
          required
        />
      </div>

      <div className="cad-field">
        <label className="cad-label">Senha</label>
        <input
          className="cad-input"
          type="password"
          name="senha"
          placeholder="********"
          onChange={handleChange}
          required
        />
      </div>

      <button className="cad-btn">Criar conta</button>
    </form>
  );
}

function FormEmpresa({ onSubmit }) {
  const [form, setForm] = useState({
    empresa: "",
    cnpj: "",
    email: "",
    senha: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.("empresa", form);
  }

  return (
    <form className="cad-form-enter" onSubmit={handleSubmit}>
      <p className="cad-title">Cadastro Empresa</p>
      <p className="cad-sub">Cadastre sua empresa parceira</p>

      <div className="cad-field">
        <label className="cad-label">Empresa</label>
        <input
          className="cad-input"
          name="empresa"
          placeholder="Nome da empresa"
          onChange={handleChange}
          required
        />
      </div>

      <div className="cad-field">
        <label className="cad-label">CNPJ</label>
        <input
          className="cad-input"
          name="cnpj"
          placeholder="00.000.000/0001-00"
          onChange={handleChange}
          required
        />
      </div>

      <div className="cad-field">
        <label className="cad-label">Email</label>
        <input
          className="cad-input"
          type="email"
          name="email"
          placeholder="empresa@email.com"
          onChange={handleChange}
          required
        />
      </div>

      <div className="cad-field">
        <label className="cad-label">Senha</label>
        <input
          className="cad-input"
          type="password"
          name="senha"
          placeholder="********"
          onChange={handleChange}
          required
        />
      </div>

      <button className="cad-btn">Solicitar parceria</button>
    </form>
  );
}

export default function CadastroCard({ onSubmit }) {
  const [aba, setAba] = useState("aluno");

  return (
    <>
      <style>{styles}</style>

      <div className="cad-wrapper">
        <div className="cad-card">

          <div className="cad-tabs">
            <button
              type="button"
              className={`cad-tab ${aba === "aluno" ? "active" : ""}`}
              onClick={() => setAba("aluno")}
            >
              Aluno
            </button>

            <button
              type="button"
              className={`cad-tab ${aba === "empresa" ? "active" : ""}`}
              onClick={() => setAba("empresa")}
            >
              Empresa
            </button>
          </div>

          <div className="cad-body">
            {aba === "aluno" ? (
              <FormAluno onSubmit={onSubmit} />
            ) : (
              <FormEmpresa onSubmit={onSubmit} />
            )}
          </div>

        </div>
      </div>
    </>
  );
}