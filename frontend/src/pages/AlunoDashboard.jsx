import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alunoService } from "../services/alunoService";
import { toast } from "./Toast";

const styles = `
  .aluno-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
    padding: 100px 40px 60px;
    font-family: 'Play', sans-serif;
    color: #26215C;
    box-sizing: border-box;
  }

  /* ── PAGE HEADER ── */
  .aluno-page-header {
    margin-bottom: 32px;
  }

  .aluno-page-title {
    font-size: 26px;
    font-weight: 700;
    margin: 0 0 4px;
    color: #26215C;
  }

  .aluno-page-sub {
    font-size: 13px;
    color: rgba(83,74,183,.6);
    margin: 0;
  }

  /* ── GRID LAYOUT ── */
  .aluno-grid {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 20px;
    align-items: start;
  }

  /* ── SALDO CARD ── */
  .saldo-card {
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    padding: 28px;
    border-radius: 22px;
    box-shadow: 0 12px 32px rgba(83,74,183,.28);
    position: relative;
    overflow: hidden;
  }

  .saldo-card::before {
    content: "";
    position: absolute;
    top: -40px;
    right: -40px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,.08);
  }

  .saldo-card::after {
    content: "";
    position: absolute;
    bottom: -30px;
    left: -20px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255,255,255,.05);
  }

  .saldo-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,.65);
    margin: 0 0 12px;
  }

  .saldo-valor {
    font-size: 42px;
    font-weight: 700;
    margin: 0;
    line-height: 1;
    letter-spacing: -1px;
  }

  .saldo-moeda {
    font-size: 16px;
    font-weight: 400;
    color: rgba(255,255,255,.7);
    margin: 8px 0 0;
  }

  /* ── GLASS CARD ── */
  .aluno-card {
    background: rgba(220,232,248,0.55);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.48);
    border-radius: 22px;
    padding: 26px;
    box-shadow: 0 4px 20px rgba(83,74,183,.10);
  }

  .aluno-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }

  .aluno-card-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(83,74,183,.7);
    margin: 0;
  }

  /* ── INFO GRID ── */
  .aluno-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .aluno-info-item label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,.55);
    margin-bottom: 4px;
  }

  .aluno-info-item span {
    font-size: 14px;
    color: #26215C;
    font-weight: 600;
  }

  /* ── EXTRATO ── */
  .extrato-lista {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .extrato-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border-radius: 12px;
    transition: background .15s;
  }

  .extrato-item:hover {
    background: rgba(255,255,255,.35);
  }

  .extrato-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .extrato-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .extrato-dot.entrada { background: #22c55e; }
  .extrato-dot.saida   { background: #ef4444; }

  .extrato-desc {
    font-size: 13px;
    color: #26215C;
  }

  .extrato-tipo {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .8px;
    text-transform: uppercase;
    color: rgba(83,74,183,.55);
  }

  .extrato-valor {
    font-size: 14px;
    font-weight: 700;
  }

  .extrato-valor.entrada { color: #22c55e; }
  .extrato-valor.saida   { color: #ef4444; }

  .extrato-vazio {
    text-align: center;
    padding: 24px;
    color: rgba(83,74,183,.45);
    font-size: 13px;
  }

  /* ── BUTTONS ── */
  .aluno-btn {
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    border: none;
    padding: 10px 18px;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Play', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .8px;
    transition: all .2s;
    white-space: nowrap;
  }

  .aluno-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(83,74,183,.3);
  }

  .aluno-btn-outline {
    background: transparent;
    color: #534AB7;
    border: 1px solid rgba(83,74,183,.3);
    padding: 10px 18px;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Play', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .8px;
    transition: all .2s;
  }

  .aluno-btn-outline:hover {
    background: rgba(83,74,183,.06);
  }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(38,33,92,0.35);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }

  .modal-box {
    background: rgba(235,240,255,0.96);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,.6);
    border-radius: 22px;
    padding: 32px;
    width: 380px;
    box-shadow: 0 24px 60px rgba(38,33,92,.2);
  }

  .modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #26215C;
    margin: 0 0 20px;
  }

  .modal-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }

  .modal-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,.65);
  }

  .modal-input {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(83,74,183,.2);
    background: rgba(255,255,255,.6);
    font-family: 'Play', sans-serif;
    font-size: 14px;
    color: #26215C;
    outline: none;
    transition: border .2s, box-shadow .2s;
  }

  .modal-input:focus {
    border-color: #534AB7;
    box-shadow: 0 0 0 4px rgba(83,74,183,.08);
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  /* ── LOADING ── */
  .aluno-loading {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Play', sans-serif;
    font-size: 14px;
    color: rgba(83,74,183,.6);
    background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
  }

  @media (max-width: 900px) {
    .aluno-grid { grid-template-columns: 1fr; }
    .aluno-page { padding: 90px 20px 40px; }
  }

  @media (max-width: 500px) {
    .aluno-info-grid { grid-template-columns: 1fr; }
  }
`;

export default function AlunoDashboard() {
  const navigate = useNavigate();

  const [aluno, setAluno]       = useState(null);
  const [extrato, setExtrato]   = useState([]);
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({});

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  useEffect(() => { carregarAluno(); }, []);

  async function carregarAluno() {
    try {
      const { data } = await alunoService.listar();
      const meuAluno = data.find((a) => a.email === usuarioLogado?.email);
      if (meuAluno) {
        setAluno(meuAluno);
        carregarExtrato(meuAluno.id);
      }
    } catch {
      navigate("/login");
    }
  }

  async function carregarExtrato(id) {
    try {
      const res = await alunoService.extrato(id);
      setExtrato(res.data);
    } catch (err) {
      console.error("Erro extrato", err);
    }
  }

  function abrirEdicao() {
    setFormEdit({ nome: aluno.nome, curso: aluno.curso });
    setEditando(true);
  }

  async function salvarEdicao() {
    try {
      const { data } = await alunoService.atualizar(aluno.id, formEdit);
      setAluno(data);
      setEditando(false);
      toast.success("Dados atualizados com sucesso.");
    } catch {
      toast.error("Não foi possível atualizar os dados.");
    }
  }

  if (!aluno) {
    return (
      <>
        <style>{styles}</style>
        <div className="aluno-loading">Carregando...</div>
      </>
    );
  }

  const primeiroNome = aluno.nome?.split(" ")[0] ?? "";

  return (
    <>
      <style>{styles}</style>

      <div className="aluno-page">

        <div className="aluno-page-header">
          <h1 className="aluno-page-title">Bem-vindo, {primeiroNome}</h1>
          <p className="aluno-page-sub">Acompanhe seu saldo e movimentações de KRN.</p>
        </div>

        <div className="aluno-grid">

          {/* Coluna esquerda */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div className="saldo-card">
              <p className="saldo-label">Saldo disponível</p>
              <p className="saldo-valor">{aluno.saldoMoedas}</p>
              <p className="saldo-moeda">KRN · Kronos</p>
            </div>

            <div className="aluno-card">
              <div className="aluno-card-head">
                <p className="aluno-card-title">Dados da conta</p>
                <button className="aluno-btn-outline" onClick={abrirEdicao}>Editar</button>
              </div>
              <div className="aluno-info-grid">
                <div className="aluno-info-item">
                  <label>Email</label>
                  <span>{aluno.email}</span>
                </div>
                <div className="aluno-info-item">
                  <label>Matrícula</label>
                  <span>{aluno.matricula || "—"}</span>
                </div>
                <div className="aluno-info-item">
                  <label>Curso</label>
                  <span>{aluno.curso}</span>
                </div>
                <div className="aluno-info-item">
                  <label>Instituição</label>
                  <span>{aluno.instituicao}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Coluna direita — Extrato */}
          <div className="aluno-card" style={{ minHeight: 300 }}>
            <div className="aluno-card-head">
              <p className="aluno-card-title">Extrato</p>
            </div>

            {extrato.length === 0 ? (
              <div className="extrato-vazio">Nenhuma movimentação registrada.</div>
            ) : (
              <div className="extrato-lista">
                {extrato.map((t, i) => {
                  const tipo = t.tipo === "ENTRADA" ? "entrada" : "saida";
                  return (
                    <div key={i} className="extrato-item">
                      <div className="extrato-left">
                        <div className={`extrato-dot ${tipo}`} />
                        <div>
                          <div className="extrato-desc">{t.descricao || "—"}</div>
                          <div className="extrato-tipo">{t.tipo}</div>
                        </div>
                      </div>
                      <span className={`extrato-valor ${tipo}`}>
                        {tipo === "entrada" ? "+" : "-"}{t.valor} KRN
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modal de edição */}
      {editando && (
        <div className="modal-overlay" onClick={() => setEditando(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Editar dados</h3>

            <div className="modal-field">
              <label className="modal-label">Nome</label>
              <input
                className="modal-input"
                placeholder="Nome completo"
                value={formEdit.nome || ""}
                onChange={(e) => setFormEdit({ ...formEdit, nome: e.target.value })}
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">Curso</label>
              <input
                className="modal-input"
                placeholder="Curso"
                value={formEdit.curso || ""}
                onChange={(e) => setFormEdit({ ...formEdit, curso: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button className="aluno-btn" onClick={salvarEdicao}>Salvar</button>
              <button className="aluno-btn-outline" onClick={() => setEditando(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}