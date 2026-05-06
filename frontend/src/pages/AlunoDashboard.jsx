import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alunoService } from "../services/alunoService";

export default function AlunoDashboard() {
  const navigate = useNavigate();

  const [aluno, setAluno] = useState(null);
  const [extrato, setExtrato] = useState([]);
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({});

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const styles = `
    .aluno-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
      padding: 40px;
      font-family: 'Play', sans-serif;
      color: #26215C;
    }

    .aluno-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }

    .aluno-title {
      font-size: 28px;
      font-weight: 700;
    }

    .saldo-card {
      background: linear-gradient(135deg, #534AB7, #7F77DD);
      color: white;
      padding: 25px;
      border-radius: 20px;
      box-shadow: 0 10px 24px rgba(83,74,183,.18);
      margin-bottom: 25px;
    }

    .saldo-card h1 {
      font-size: 36px;
      margin-top: 10px;
    }

    .aluno-card {
      background: rgba(255,255,255,.6);
      backdrop-filter: blur(15px);
      border-radius: 20px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(83,74,183,.10);
    }

    .aluno-card h3 {
      color: #534AB7;
      margin-bottom: 10px;
    }

    .aluno-btn {
      background: linear-gradient(135deg, #534AB7, #7F77DD);
      color: #fff;
      border: none;
      padding: 10px 16px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 700;
      margin-top: 10px;
    }

    .extrato-item {
      padding: 12px;
      border-bottom: 1px solid rgba(83,74,183,.1);
    }

    .tag {
      font-weight: bold;
    }

    .tag.entrada {
      color: #22c55e;
    }

    .tag.saida {
      color: #ef4444;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-content {
      background: white;
      padding: 25px;
      border-radius: 16px;
      width: 300px;
    }

    .modal-content input {
      width: 100%;
      margin-bottom: 10px;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid #ccc;
    }
  `;

  useEffect(() => {
    carregarAluno();
  }, []);

  async function carregarAluno() {
    try {
      const { data } = await alunoService.listar();

      const meuAluno = data.find(
        (a) => a.email === usuarioLogado?.email
      );

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
    setFormEdit({
      nome: aluno.nome,
      curso: aluno.curso,
    });
    setEditando(true);
  }

  async function salvarEdicao() {
    try {
      const { data } = await alunoService.atualizar(aluno.id, formEdit);
      setAluno(data);
      setEditando(false);
      alert("Atualizado!");
    } catch {
      alert("Erro ao atualizar");
    }
  }

  function handleSair() {
    localStorage.removeItem("usuarioLogado");
    navigate("/login");
  }

  if (!aluno) return <div>Carregando...</div>;

  return (
    <>
      <style>{styles}</style>

      <div className="aluno-page">

        <div className="aluno-header">
          <h1 className="aluno-title">Olá, {aluno.nome} 👋</h1>
          <button className="aluno-btn" onClick={handleSair}>Sair</button>
        </div>

        <div className="saldo-card">
          <h2>Seu saldo</h2>
          <h1>{aluno.saldoMoedas} 🪙</h1>
        </div>

        <div className="aluno-card">
          <h3>Seus dados</h3>
          <p><b>Email:</b> {aluno.email}</p>
          <p><b>Curso:</b> {aluno.curso}</p>
          <p><b>Instituição:</b> {aluno.instituicao}</p>

          <button className="aluno-btn" onClick={abrirEdicao}>
            Editar dados
          </button>
        </div>

        <div className="aluno-card">
          <h3>Extrato</h3>

          {extrato.length === 0 ? (
            <p>Nenhuma movimentação ainda</p>
          ) : (
            extrato.map((t, i) => (
              <div key={i} className="extrato-item">
                <span className={`tag ${t.tipo === "ENTRADA" ? "entrada" : "saida"}`}>
                  {t.tipo}
                </span>{" "}
                - {t.valor} moedas <br />
                <small>{t.descricao}</small>
              </div>
            ))
          )}
        </div>

        {/* MODAL */}
        {editando && (
          <div className="modal">
            <div className="modal-content">
              <h3>Editar</h3>

              <input
                placeholder="Nome"
                value={formEdit.nome || ""}
                onChange={(e) =>
                  setFormEdit({ ...formEdit, nome: e.target.value })
                }
              />

              <input
                placeholder="Curso"
                value={formEdit.curso || ""}
                onChange={(e) =>
                  setFormEdit({ ...formEdit, curso: e.target.value })
                }
              />

              <button className="aluno-btn" onClick={salvarEdicao}>
                Salvar
              </button>

              <button
                className="aluno-btn"
                onClick={() => setEditando(false)}
                style={{ marginLeft: 10 }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}