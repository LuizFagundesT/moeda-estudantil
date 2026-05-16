import { useEffect, useState } from "react";
import { alunoService } from "../../services/alunoService";

const styles = `
  .ranking-lista {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ranking-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 16px;
    border-radius: 14px;
    transition: background .15s;
    position: relative;
  }

  .ranking-item:hover { background: rgba(255,255,255,.35); }

  /* top 3 highlight */
  .ranking-item.pos-1 { background: rgba(255,215,0,.12); }
  .ranking-item.pos-2 { background: rgba(192,192,192,.1); }
  .ranking-item.pos-3 { background: rgba(205,127,50,.08); }

  .ranking-pos {
    width: 28px;
    font-size: 13px;
    font-weight: 700;
    color: rgba(83,74,183,.4);
    text-align: center;
    flex-shrink: 0;
  }

  .ranking-pos.pos-1 { color: #f59e0b; font-size: 16px; }
  .ranking-pos.pos-2 { color: #94a3b8; font-size: 16px; }
  .ranking-pos.pos-3 { color: #b45309; font-size: 16px; }

  .ranking-avatar {
    width: 36px; height: 36px;
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

  .ranking-info {
    flex: 1;
    min-width: 0;
  }

  .ranking-nome {
    font-size: 14px;
    font-weight: 600;
    color: #26215C;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ranking-curso {
    font-size: 11px;
    color: rgba(83,74,183,.5);
  }

  .ranking-saldo {
    font-size: 15px;
    font-weight: 700;
    color: #534AB7;
    flex-shrink: 0;
  }

  .ranking-bar-wrap {
    position: absolute;
    bottom: 0; left: 56px; right: 16px;
    height: 2px;
    background: rgba(83,74,183,.07);
    border-radius: 2px;
    overflow: hidden;
  }

  .ranking-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #534AB7, #7F77DD);
    border-radius: 2px;
    transition: width .6s ease;
  }

  .ranking-vazio {
    text-align: center;
    padding: 40px;
    color: rgba(83,74,183,.45);
    font-size: 13px;
  }

  .ranking-loading {
    text-align: center;
    padding: 40px;
    color: rgba(83,74,183,.45);
    font-size: 13px;
  }
`;

const MEDALHAS = ["🥇", "🥈", "🥉"];

function iniciais(nome) {
  return nome?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export default function RankingAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    alunoService
      .listar()
      .then(({ data }) => {
        const ordenados = [...data].sort(
          (a, b) => (b.saldoMoedas ?? 0) - (a.saldoMoedas ?? 0)
        );
        setAlunos(ordenados);
      })
      .catch(() => setAlunos([]))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return (
      <>
        <style>{styles}</style>
        <div className="ranking-loading">Carregando ranking...</div>
      </>
    );
  }

  if (alunos.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="ranking-vazio">Nenhum aluno cadastrado.</div>
      </>
    );
  }

  const maxSaldo = alunos[0]?.saldoMoedas ?? 1;

  return (
    <>
      <style>{styles}</style>
      <div className="ranking-lista">
        {alunos.map((aluno, i) => {
          const posClasse = i < 3 ? `pos-${i + 1}` : "";
          const pct = maxSaldo > 0 ? ((aluno.saldoMoedas ?? 0) / maxSaldo) * 100 : 0;

          return (
            <div key={aluno.id} className={`ranking-item ${posClasse}`}>
              <div className={`ranking-pos ${posClasse}`}>
                {i < 3 ? MEDALHAS[i] : `${i + 1}º`}
              </div>
              <div className="ranking-avatar">{iniciais(aluno.nome)}</div>
              <div className="ranking-info">
                <div className="ranking-nome">{aluno.nome}</div>
                <div className="ranking-curso">{aluno.curso} · {aluno.instituicao}</div>
              </div>
              <div className="ranking-saldo">{aluno.saldoMoedas ?? 0} KRN</div>
              <div className="ranking-bar-wrap">
                <div className="ranking-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}