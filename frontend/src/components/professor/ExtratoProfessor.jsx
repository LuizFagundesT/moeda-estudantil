import { useEffect, useState } from "react";
import { professorService } from "../../services/professorService";

const styles = `
  .extrato-prof-lista {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .extrato-prof-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-radius: 12px;
    transition: background .15s;
  }

  .extrato-prof-item:hover { background: rgba(255,255,255,.35); }

  .extrato-prof-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .extrato-prof-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .extrato-prof-dot.entrada { background: #22c55e; }
  .extrato-prof-dot.saida   { background: #ef4444; }

  .extrato-prof-desc {
    font-size: 13px;
    color: #26215C;
    font-weight: 500;
  }

  .extrato-prof-meta {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 2px;
  }

  .extrato-prof-tipo {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .8px;
    text-transform: uppercase;
    color: rgba(83,74,183,.55);
  }

  .extrato-prof-data {
    font-size: 10px;
    color: rgba(83,74,183,.4);
  }

  .extrato-prof-valor {
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .extrato-prof-valor.entrada { color: #22c55e; }
  .extrato-prof-valor.saida   { color: #ef4444; }

  .extrato-prof-vazio {
    text-align: center;
    padding: 40px 24px;
    color: rgba(83,74,183,.45);
    font-size: 13px;
  }

  .extrato-prof-loading {
    text-align: center;
    padding: 40px;
    color: rgba(83,74,183,.45);
    font-size: 13px;
  }
`;

function formatarData(dataStr) {
  if (!dataStr) return "";
  const d = new Date(dataStr);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ExtratoProfessor({ professorId, refresh }) {
  const [extrato, setExtrato] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!professorId) return;
    setCarregando(true);
    professorService
      .extrato(professorId)
      .then(({ data }) => setExtrato(data))
      .catch(() => setExtrato([]))
      .finally(() => setCarregando(false));
  }, [professorId, refresh]);

  if (carregando) {
    return (
      <>
        <style>{styles}</style>
        <div className="extrato-prof-loading">Carregando extrato...</div>
      </>
    );
  }

  if (extrato.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="extrato-prof-vazio">Nenhuma transação registrada ainda.</div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="extrato-prof-lista">
        {extrato.map((t, i) => {
          const tipo = t.tipo === "ENTRADA" ? "entrada" : "saida";
          return (
            <div key={i} className="extrato-prof-item">
              <div className="extrato-prof-left">
                <div className={`extrato-prof-dot ${tipo}`} />
                <div>
                  <div className="extrato-prof-desc">{t.descricao || "—"}</div>
                  <div className="extrato-prof-meta">
                    <span className="extrato-prof-tipo">{t.tipo}</span>
                    <span className="extrato-prof-data">{formatarData(t.data)}</span>
                  </div>
                </div>
              </div>
              <span className={`extrato-prof-valor ${tipo}`}>
                {tipo === "entrada" ? "+" : "-"}{t.valor} KRN
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}