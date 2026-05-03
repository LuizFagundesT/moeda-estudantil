import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alunoService } from "../services/alunoService";

const styles = `
  .dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
    padding: 40px;
    font-family: 'Play', sans-serif;
  }
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }
  .dashboard-title {
    font-size: 28px;
    font-weight: 700;
    color: #26215C;
  }
  .dashboard-saldo {
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    border-radius: 16px;
    padding: 16px 28px;
    font-size: 18px;
    font-weight: 700;
  }
  .dashboard-card {
    background: rgba(220,232,248,0.5);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.45);
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px rgba(83,74,183,0.10);
  }
  .dashboard-card h3 {
    color: #534AB7;
    margin-bottom: 16px;
    font-size: 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }
  .info-item label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,0.6);
    margin-bottom: 4px;
  }
  .info-item span {
    font-size: 14px;
    color: #26215C;
  }
  .btn-editar {
    border: none;
    cursor: pointer;
    padding: 10px 24px;
    border-radius: 12px;
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    font-family: 'Play', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    transition: all .2s;
  }
  .btn-editar:hover { transform: translateY(-1px); }
  .btn-sair {
    border: 1px solid rgba(83,74,183,0.3);
    cursor: pointer;
    padding: 10px 24px;
    border-radius: 12px;
    background: transparent;
    color: #534AB7;
    font-family: 'Play', sans-serif;
    font-size: 13px;
    font-weight: 700;
    transition: all .2s;
    margin-left: 10px;
  }
  .btn-sair:hover { background: rgba(83,74,183,0.08); }

  /* Modal de edição */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(38,33,92,0.35);
    backdrop-filter: blur(6px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-box {
    background: #fff;
    border-radius: 24px;
    padding: 32px;
    width: 520px;
    max-width: 95vw;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(83,74,183,0.25);
  }
  .modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #26215C;
    margin-bottom: 20px;
  }
  .modal-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 14px;
  }
  .modal-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,0.65);
  }
  .modal-input {
    padding: 11px 14px;
    border-radius: 12px;
    border: 1px solid rgba(83,74,183,0.2);
    font-family: 'Play', sans-serif;
    font-size: 13px;
    color: #26215C;
    outline: none;
    transition: border .2s;
  }
  .modal-input:focus { border-color: #534AB7; }
  .modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  .btn-cancelar {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid rgba(83,74,183,0.25);
    background: transparent;
    color: #534AB7;
    font-family: 'Play', sans-serif;
    font-weight: 700;
    cursor: pointer;
  }
  .btn-salvar {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    font-family: 'Play', sans-serif;
    font-weight: 700;
    cursor: pointer;
  }
`;

export default function AlunoDashboard() {
  const navigate = useNavigate();
  const [aluno, setAluno] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({});

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  useEffect(() => {
    // Busca os dados do aluno pelo email via token
    async function carregarAluno() {
      try {
        const { data } = await alunoService.listar();
        const meuAluno = data.find((a) => a.email === usuarioLogado?.email);
        if (meuAluno) setAluno(meuAluno);
      } catch {
        navigate("/login");
      }
    }
    carregarAluno();
  }, []);

  function abrirEdicao() {
    setFormEdit({
      nome: aluno.nome,
      cpf: aluno.cpf,
      rg: aluno.rg,
      matricula: aluno.matricula,
      curso: aluno.curso,
      instituicao: aluno.instituicao,
      endereco: { ...aluno.endereco },
    });
    setEditando(true);
  }

  async function salvarEdicao() {
    try {
      const { data } = await alunoService.atualizar(aluno.id, formEdit);
      setAluno(data);
      setEditando(false);
      alert("Dados atualizados com sucesso!");
    } catch {
      alert("Erro ao atualizar. Tente novamente.");
    }
  }

  function handleSair() {
    localStorage.removeItem("usuarioLogado");
    navigate("/login");
  }

  if (!aluno) return <div className="dashboard">Carregando...</div>;

  return (
    <>
      <style>{styles}</style>

      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Olá, {aluno.nome.split(" ")[0]}! 👋</h1>
            <p style={{ color: "rgba(83,74,183,.65)", fontSize: 13 }}>
              Bem-vindo ao seu painel
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="dashboard-saldo">
              🪙 {aluno.saldoMoedas ?? 0} moedas
            </div>
            <button className="btn-sair" onClick={handleSair}>Sair</button>
          </div>
        </div>

        {/* Dados pessoais */}
        <div className="dashboard-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Dados Pessoais</h3>
            <button className="btn-editar" onClick={abrirEdicao}>Editar</button>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <label>Nome</label><span>{aluno.nome}</span>
            </div>
            <div className="info-item">
              <label>Email</label><span>{aluno.email}</span>
            </div>
            <div className="info-item">
              <label>CPF</label><span>{aluno.cpf}</span>
            </div>
            <div className="info-item">
              <label>RG</label><span>{aluno.rg}</span>
            </div>
            <div className="info-item">
              <label>Matrícula</label><span>{aluno.matricula}</span>
            </div>
            <div className="info-item">
              <label>Curso</label><span>{aluno.curso}</span>
            </div>
            <div className="info-item">
              <label>Instituição</label><span>{aluno.instituicao}</span>
            </div>
          </div>
        </div>

        {/* Endereço */}
        {aluno.endereco && (
          <div className="dashboard-card">
            <h3>Endereço</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Logradouro</label>
                <span>{aluno.endereco.logradouro}, {aluno.endereco.numero}</span>
              </div>
              <div className="info-item">
                <label>Bairro</label><span>{aluno.endereco.bairro}</span>
              </div>
              <div className="info-item">
                <label>Cidade / Estado</label>
                <span>{aluno.endereco.cidade} - {aluno.endereco.estado}</span>
              </div>
              <div className="info-item">
                <label>CEP</label><span>{aluno.endereco.cep}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de edição */}
      {editando && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p className="modal-title">Editar dados</p>

            {[
              ["Nome", "nome"],
              ["CPF", "cpf"],
              ["RG", "rg"],
              ["Matrícula", "matricula"],
              ["Curso", "curso"],
              ["Instituição", "instituicao"],
            ].map(([label, campo]) => (
              <div className="modal-field" key={campo}>
                <label className="modal-label">{label}</label>
                <input
                  className="modal-input"
                  value={formEdit[campo] || ""}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, [campo]: e.target.value })
                  }
                />
              </div>
            ))}

            <p className="modal-label" style={{ marginBottom: 10 }}>Endereço</p>
            {[
              ["Logradouro", "logradouro"],
              ["Número", "numero"],
              ["Bairro", "bairro"],
              ["Cidade", "cidade"],
              ["Estado", "estado"],
              ["CEP", "cep"],
            ].map(([label, campo]) => (
              <div className="modal-field" key={campo}>
                <label className="modal-label">{label}</label>
                <input
                  className="modal-input"
                  value={formEdit.endereco?.[campo] || ""}
                  onChange={(e) =>
                    setFormEdit({
                      ...formEdit,
                      endereco: { ...formEdit.endereco, [campo]: e.target.value },
                    })
                  }
                />
              </div>
            ))}

            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setEditando(false)}>
                Cancelar
              </button>
              <button className="btn-salvar" onClick={salvarEdicao}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}