import { useState } from "react";

import { toast } from "../../pages/shared/Toast";
import { professorService } from "../../services/professorService";

const styles = `
  .prof-sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ── SALDO CARD ── */
  .prof-saldo-card {
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    padding: 28px;
    border-radius: 22px;
    box-shadow: 0 12px 32px rgba(83,74,183,.28);
    position: relative;
    overflow: hidden;
  }

  .prof-saldo-card::before {
    content: "";
    position: absolute;
    top: -40px; right: -40px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: rgba(255,255,255,.08);
  }

  .prof-saldo-card::after {
    content: "";
    position: absolute;
    bottom: -30px; left: -20px;
    width: 100px; height: 100px;
    border-radius: 50%;
    background: rgba(255,255,255,.05);
  }

  .prof-saldo-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,.65);
    margin: 0 0 12px;
  }

  .prof-saldo-valor {
    font-size: 42px;
    font-weight: 700;
    margin: 0;
    line-height: 1;
    letter-spacing: -1px;
    position: relative;
    z-index: 1;
  }

  .prof-saldo-moeda {
    font-size: 16px;
    font-weight: 400;
    color: rgba(255,255,255,.7);
    margin: 8px 0 0;
    position: relative;
    z-index: 1;
  }

  /* ── DADOS CARD ── */
  .prof-dados-card {
    background: rgba(220,232,248,0.55);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.48);
    border-radius: 22px;
    padding: 26px;
    box-shadow: 0 4px 20px rgba(83,74,183,.10);
  }

  .prof-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
  }

  .prof-card-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(83,74,183,.7);
    margin: 0;
  }

  .prof-info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .prof-info-item label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,.55);
    margin-bottom: 3px;
  }

  .prof-info-item span {
    font-size: 14px;
    color: #26215C;
    font-weight: 600;
  }

  /* ── BUTTONS ── */
  .prof-btn {
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

  .prof-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(83,74,183,.3);
  }

  .prof-btn-outline {
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

  .prof-btn-outline:hover { background: rgba(83,74,183,.06); }

  /* ── MODAL ── */
  .prof-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(38,33,92,0.35);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }

  .prof-modal-box {
    background: rgba(235,240,255,0.96);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,.6);
    border-radius: 22px;
    padding: 32px;
    width: 400px;
    box-shadow: 0 24px 60px rgba(38,33,92,.2);
  }

  .prof-modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #26215C;
    margin: 0 0 20px;
  }

  .prof-modal-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }

  .prof-modal-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,.65);
  }

  .prof-modal-input {
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

  .prof-modal-input:focus {
    border-color: #534AB7;
    box-shadow: 0 0 0 4px rgba(83,74,183,.08);
  }

  .prof-modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
`;

export default function ProfessorSidebar({ professor, onUpdate }) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [salvando, setSalvando] = useState(false);

  function abrirEdicao() {
    setForm({
      nome: professor.nome,
      email: professor.email,
      cpf: professor.cpf,
      departamento: professor.departamento,
      universidade: professor.universidade,
    });
    setEditando(true);
  }

  async function salvar() {
    setSalvando(true);
    try {
      const { data } = await professorService.atualizar(professor.id, form);
      onUpdate(data);
      setEditando(false);
      toast.success("Dados atualizados com sucesso.");
    } catch {
      toast.error("Não foi possível atualizar os dados.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <style>{styles}</style>

      <div className="prof-sidebar">
        {/* Saldo */}
        <div className="prof-saldo-card">
          <p className="prof-saldo-label">Saldo disponível</p>
          <p className="prof-saldo-valor">{professor.saldoMoedas ?? 0}</p>
          <p className="prof-saldo-moeda">KRN · Kronos</p>
        </div>

        {/* Dados */}
        <div className="prof-dados-card">
          <div className="prof-card-head">
            <p className="prof-card-title">Dados da conta</p>
            <button className="prof-btn-outline" onClick={abrirEdicao}>Editar</button>
          </div>
          <div className="prof-info-grid">
            <div className="prof-info-item">
              <label>Nome</label>
              <span>{professor.nome}</span>
            </div>
            <div className="prof-info-item">
              <label>Email</label>
              <span>{professor.email}</span>
            </div>
            <div className="prof-info-item">
              <label>Departamento</label>
              <span>{professor.departamento || "—"}</span>
            </div>
            <div className="prof-info-item">
              <label>Universidade</label>
              <span>{professor.universidade || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edição */}
      {editando && (
        <div className="prof-modal-overlay" onClick={() => setEditando(false)}>
          <div className="prof-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="prof-modal-title">Editar dados</h3>

            {[
              { key: "nome", label: "Nome completo" },
              { key: "email", label: "E-mail" },
              { key: "cpf", label: "CPF" },
              { key: "departamento", label: "Departamento" },
              { key: "universidade", label: "Universidade" },
            ].map(({ key, label }) => (
              <div className="prof-modal-field" key={key}>
                <label className="prof-modal-label">{label}</label>
                <input
                  className="prof-modal-input"
                  placeholder={label}
                  value={form[key] || ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}

            <div className="prof-modal-actions">
              <button className="prof-btn" onClick={salvar} disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button className="prof-btn-outline" onClick={() => setEditando(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}