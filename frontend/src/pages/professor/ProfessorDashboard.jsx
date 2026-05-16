import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { professorService } from "../../services/professorService";
import ProfessorSidebar from "../../components/professor/ProfessorSidebar";
import EnviarMoedas from "../../components/professor/EnviarMoedas";
import ExtratoProfessor from "../../components/professor/ExtratoProfessor";
import RankingAlunos from "../../components/professor/RankingAlunos";

const styles = `
  .prof-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
    padding: 100px 40px 60px;
    font-family: 'Play', sans-serif;
    color: #26215C;
    box-sizing: border-box;
  }

  /* ── HEADER ── */
  .prof-page-header {
    margin-bottom: 32px;
  }

  .prof-page-title {
    font-size: 26px;
    font-weight: 700;
    margin: 0 0 4px;
    color: #26215C;
  }

  .prof-page-sub {
    font-size: 13px;
    color: rgba(83,74,183,.6);
    margin: 0;
  }

  /* ── GRID ── */
  .prof-grid {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 20px;
    align-items: start;
  }

  /* ── MAIN PANEL ── */
  .prof-main-panel {
    background: rgba(220,232,248,0.55);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.48);
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(83,74,183,.10);
  }

  /* ── TABS ── */
  .prof-tabs {
    display: flex;
    border-bottom: 1px solid rgba(83,74,183,.1);
    padding: 0 6px;
    background: rgba(255,255,255,.25);
  }

  .prof-tab {
    padding: 16px 20px;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Play', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .8px;
    text-transform: uppercase;
    color: rgba(83,74,183,.45);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color .2s, border-color .2s;
    white-space: nowrap;
  }

  .prof-tab:hover { color: rgba(83,74,183,.75); }

  .prof-tab.active {
    color: #534AB7;
    border-bottom-color: #534AB7;
  }

  /* ── TAB CONTENT ── */
  .prof-tab-content {
    padding: 26px;
    min-height: 300px;
  }

  /* ── LOADING ── */
  .prof-page-loading {
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
    .prof-grid { grid-template-columns: 1fr; }
    .prof-page { padding: 90px 20px 40px; }
  }

  @media (max-width: 500px) {
    .prof-tab { padding: 14px 12px; font-size: 10px; }
  }
`;

const TABS = [
  { key: "enviar",   label: "Enviar Pontos" },
  { key: "extrato",  label: "Extrato"       },
  { key: "ranking",  label: "Ranking"       },
];

export default function ProfessorDashboard() {
  const navigate = useNavigate();
  const [professor, setProfessor] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("enviar");
  const [extratoRefresh, setExtratoRefresh] = useState(0);

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  useEffect(() => {
    carregarProfessor();
  }, []);

  async function carregarProfessor() {
    try {
      const { data } = await professorService.listar();
      const meu = data.find((p) => p.email === usuarioLogado?.email);
      if (meu) {
        setProfessor(meu);
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }

  // Chamado após envio de moedas: recarrega professor (saldo) e extrato
  async function handleEnvio() {
    try {
      const { data } = await professorService.buscarPorId(professor.id);
      setProfessor(data);
      setExtratoRefresh((r) => r + 1);
    } catch {
      // silencioso — toast já foi exibido no componente filho
    }
  }

  if (!professor) {
    return (
      <>
        <style>{styles}</style>
        <div className="prof-page-loading">Carregando...</div>
      </>
    );
  }

  const primeiroNome = professor.nome?.split(" ")[0] ?? "";

  return (
    <>
      <style>{styles}</style>

      <div className="prof-page">

        <div className="prof-page-header">
          <h1 className="prof-page-title">Olá, Prof. {primeiroNome}</h1>
          <p className="prof-page-sub">Gerencie seus pontos e reconheça seus alunos.</p>
        </div>

        <div className="prof-grid">

          {/* Sidebar: saldo + dados */}
          <ProfessorSidebar
            professor={professor}
            onUpdate={(updated) => setProfessor(updated)}
          />

          {/* Painel principal com abas */}
          <div className="prof-main-panel">

            {/* Tab bar */}
            <div className="prof-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`prof-tab ${abaAtiva === tab.key ? "active" : ""}`}
                  onClick={() => setAbaAtiva(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="prof-tab-content">
              {abaAtiva === "enviar" && (
                <EnviarMoedas professor={professor} onEnvio={handleEnvio} />
              )}
              {abaAtiva === "extrato" && (
                <ExtratoProfessor
                  professorId={professor.id}
                  refresh={extratoRefresh}
                />
              )}
              {abaAtiva === "ranking" && <RankingAlunos />}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}