import { useState, useEffect, useRef } from "react";
import { toast } from "../../pages/shared/Toast";
import { alunoService } from "../../services/alunoService";
import { professorService } from "../../services/professorService";

const styles = `
  .enviar-wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── SEARCH ── */
  .enviar-search-wrap {
    position: relative;
  }

  .enviar-search-input {
    width: 100%;
    padding: 14px 18px 14px 44px;
    border-radius: 14px;
    border: 1px solid rgba(83,74,183,.2);
    background: rgba(255,255,255,.6);
    backdrop-filter: blur(10px);
    font-family: 'Play', sans-serif;
    font-size: 14px;
    color: #26215C;
    outline: none;
    transition: border .2s, box-shadow .2s;
    box-sizing: border-box;
  }

  .enviar-search-input:focus {
    border-color: #534AB7;
    box-shadow: 0 0 0 4px rgba(83,74,183,.08);
  }

  .enviar-search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(83,74,183,.45);
    font-size: 16px;
    pointer-events: none;
  }

  /* ── DROPDOWN ── */
  .enviar-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0; right: 0;
    background: rgba(235,240,255,0.97);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,.6);
    border-radius: 16px;
    box-shadow: 0 16px 40px rgba(38,33,92,.15);
    z-index: 100;
    max-height: 240px;
    overflow-y: auto;
    padding: 6px;
  }

  .enviar-dropdown::-webkit-scrollbar { width: 4px; }
  .enviar-dropdown::-webkit-scrollbar-track { background: transparent; }
  .enviar-dropdown::-webkit-scrollbar-thumb { background: rgba(83,74,183,.2); border-radius: 4px; }

  .enviar-dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: background .15s;
  }

  .enviar-dropdown-item:hover { background: rgba(83,74,183,.08); }

  .enviar-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .enviar-aluno-nome {
    font-size: 14px;
    font-weight: 600;
    color: #26215C;
  }

  .enviar-aluno-curso {
    font-size: 11px;
    color: rgba(83,74,183,.55);
  }

  .enviar-dropdown-vazio {
    padding: 16px;
    text-align: center;
    font-size: 13px;
    color: rgba(83,74,183,.45);
  }

  /* ── ALUNO SELECIONADO ── */
  .enviar-selecionado {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: rgba(83,74,183,.08);
    border: 1px solid rgba(83,74,183,.2);
    border-radius: 14px;
  }

  .enviar-selecionado-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .enviar-limpar {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: rgba(83,74,183,.45);
    transition: color .15s;
    padding: 4px;
  }

  .enviar-limpar:hover { color: #ef4444; }

  /* ── FORM ── */
  .enviar-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .enviar-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .enviar-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,.65);
  }

  .enviar-input {
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

  .enviar-input:focus {
    border-color: #534AB7;
    box-shadow: 0 0 0 4px rgba(83,74,183,.08);
  }

  .enviar-textarea {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(83,74,183,.2);
    background: rgba(255,255,255,.6);
    font-family: 'Play', sans-serif;
    font-size: 14px;
    color: #26215C;
    outline: none;
    resize: vertical;
    min-height: 90px;
    transition: border .2s, box-shadow .2s;
  }

  .enviar-textarea:focus {
    border-color: #534AB7;
    box-shadow: 0 0 0 4px rgba(83,74,183,.08);
  }

  .enviar-btn {
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    border: none;
    padding: 14px 24px;
    border-radius: 12px;
    cursor: pointer;
    font-family: 'Play', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: .8px;
    transition: all .2s;
    margin-top: 4px;
  }

  .enviar-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(83,74,183,.35);
  }

  .enviar-btn:disabled {
    opacity: .5;
    cursor: not-allowed;
  }
`;

export default function EnviarMoedas({ professor, onEnvio }) {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [alunosFiltrados, setAlunosFiltrados] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [quantidade, setQuantidade] = useState("");
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    alunoService.listar().then(({ data }) => setAlunos(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!busca.trim()) {
      setAlunosFiltrados(alunos);
    } else {
      setAlunosFiltrados(
        alunos.filter((a) =>
          a.nome.toLowerCase().includes(busca.toLowerCase())
        )
      );
    }
  }, [busca, alunos]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAberto(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function selecionarAluno(aluno) {
    setAlunoSelecionado(aluno);
    setBusca("");
    setDropdownAberto(false);
  }

  function limparSelecao() {
    setAlunoSelecionado(null);
    setBusca("");
  }

  async function enviar() {
    if (!alunoSelecionado) return toast.info("Selecione um aluno.");
    if (!quantidade || Number(quantidade) <= 0) return toast.info("Informe uma quantidade válida.");
    if (!motivo.trim()) return toast.info("O motivo é obrigatório.");
    if (Number(quantidade) > (professor.saldoMoedas ?? 0)) {
      return toast.error("Saldo insuficiente para este envio.");
    }

    setEnviando(true);
    try {
      await professorService.enviarMoedas(professor.id, {
        alunoId: alunoSelecionado.id,
        quantidade: Number(quantidade),
        motivo,
      });
      toast.success(`${quantidade} KRN enviados para ${alunoSelecionado.nome}!`);
      setAlunoSelecionado(null);
      setQuantidade("");
      setMotivo("");
      onEnvio?.(); // notifica o pai para atualizar saldo
    } catch {
      toast.error("Erro ao enviar moedas. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  const iniciais = (nome) =>
    nome?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  return (
    <>
      <style>{styles}</style>

      <div className="enviar-wrap">

        {/* Busca de aluno */}
        {!alunoSelecionado ? (
          <div className="enviar-search-wrap" ref={dropdownRef}>
            <span className="enviar-search-icon">🔍</span>
            <input
              className="enviar-search-input"
              placeholder="Buscar aluno pelo nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onFocus={() => setDropdownAberto(true)}
            />

            {dropdownAberto && (
              <div className="enviar-dropdown">
                {alunosFiltrados.length === 0 ? (
                  <div className="enviar-dropdown-vazio">Nenhum aluno encontrado.</div>
                ) : (
                  alunosFiltrados.map((aluno) => (
                    <div
                      key={aluno.id}
                      className="enviar-dropdown-item"
                      onClick={() => selecionarAluno(aluno)}
                    >
                      <div className="enviar-avatar">{iniciais(aluno.nome)}</div>
                      <div>
                        <div className="enviar-aluno-nome">{aluno.nome}</div>
                        <div className="enviar-aluno-curso">{aluno.curso} · {aluno.instituicao}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          /* Aluno selecionado */
          <div className="enviar-selecionado">
            <div className="enviar-selecionado-info">
              <div className="enviar-avatar">{iniciais(alunoSelecionado.nome)}</div>
              <div>
                <div className="enviar-aluno-nome">{alunoSelecionado.nome}</div>
                <div className="enviar-aluno-curso">{alunoSelecionado.curso}</div>
              </div>
            </div>
            <button className="enviar-limpar" onClick={limparSelecao} title="Trocar aluno">✕</button>
          </div>
        )}

        {/* Form de envio — só aparece com aluno selecionado */}
        {alunoSelecionado && (
          <div className="enviar-form">
            <div className="enviar-field">
              <label className="enviar-label">Quantidade de KRN</label>
              <input
                className="enviar-input"
                type="number"
                min="1"
                max={professor.saldoMoedas ?? 0}
                placeholder="Ex: 50"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>

            <div className="enviar-field">
              <label className="enviar-label">Motivo do reconhecimento</label>
              <textarea
                className="enviar-textarea"
                placeholder="Descreva o motivo pelo qual este aluno está sendo reconhecido..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            </div>

            <button className="enviar-btn" onClick={enviar} disabled={enviando}>
              {enviando ? "Enviando..." : `Enviar ${quantidade || "0"} KRN`}
            </button>
          </div>
        )}
      </div>
    </>
  );
}