import { useEffect, useState } from "react";
import { vantagemService } from "../../services/vantagemService";
import { resgateService } from "../../services/resgateService";
import { alunoService } from "../../services/alunoService";
import { toast } from "../shared/Toast";

export default function Vantagens() {

    const [vantagens, setVantagens] = useState([]);
    const [aluno, setAluno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resgatandoId, setResgatandoId] = useState(null);
    const [cupom, setCupom] = useState(null);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            setLoading(true);
            const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

            const [vantagensRes, alunosRes] = await Promise.all([
                vantagemService.listarAtivas(),
                alunoService.listar(),
            ]);

            setVantagens(vantagensRes.data);

            const meuAluno = usuarioLogado?.id
                ? alunosRes.data.find((a) => a.id === usuarioLogado.id) || alunosRes.data.find((a) => a.email === usuarioLogado?.email)
                : alunosRes.data.find((a) => a.email === usuarioLogado?.email);

            setAluno(meuAluno || null);
        } catch (error) {
            console.error("Erro ao carregar vantagens", error);
            toast.error("Erro ao carregar vantagens.");
        } finally {
            setLoading(false);
        }
    }

    async function resgatarVantagem(vantagem) {
        if (!aluno?.id) {
            toast.error("Aluno logado não encontrado.");
            return;
        }

        if (vantagem.quantidadeDisponivel !== null && vantagem.quantidadeDisponivel !== undefined && vantagem.quantidadeDisponivel <= 0) {
            toast.error("Esta vantagem está esgotada.");
            return;
        }

        const saldoAtual = Number(aluno.saldoMoedas || 0);
        if (saldoAtual < Number(vantagem.custoMoedas || 0)) {
            toast.error("Saldo insuficiente para resgatar esta vantagem.");
            return;
        }

        const confirmou = window.confirm(`Deseja resgatar "${vantagem.titulo}" por ${vantagem.custoMoedas} KRNs?`);
        if (!confirmou) return;

        try {
            setResgatandoId(vantagem.id);
            const { data } = await resgateService.resgatar(aluno.id, vantagem.id);
            setCupom(data);
            toast.success(`Resgate realizado! Código: ${data.codigoCupom}`);
            await carregarDados();
        } catch (error) {
            toast.error(error.response?.data?.message || error.response?.data || "Erro ao resgatar vantagem.");
        } finally {
            setResgatandoId(null);
        }
    }

    const styles = `
    .vantagens-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
      padding: 100px 40px 60px;
      font-family: 'Play', sans-serif;
      color: #26215C;
      box-sizing: border-box;
    }

    .hero {
      text-align: center;
      margin-bottom: 36px;
    }

    .hero h1 {
      font-size: 48px;
      margin-bottom: 12px;
      color: #534AB7;
    }

    .hero p {
      color: #6666a3;
      font-size: 18px;
    }

    .saldo-box, .cupom-box {
      max-width: 860px;
      margin: 0 auto 28px;
      background: rgba(255,255,255,.52);
      border: 1px solid rgba(255,255,255,.65);
      border-radius: 22px;
      padding: 20px 24px;
      box-shadow: 0 8px 24px rgba(83,74,183,.08);
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .saldo-box strong, .cupom-code {
      color: #534AB7;
      font-size: 24px;
    }

    .cupom-box {
      border-color: rgba(34,197,94,.25);
      background: rgba(240,253,244,.72);
    }

    .cupom-info {
      line-height: 1.6;
      color: rgba(38,33,92,.75);
    }

    .vantagens-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 28px;
    }

    .vantagem-card {
      background: rgba(255,255,255,.55);
      backdrop-filter: blur(16px);
      border-radius: 26px;
      overflow: hidden;
      box-shadow: 0 10px 24px rgba(83,74,183,.08);
      transition: .3s ease;
      border: 1px solid rgba(255,255,255,.4);
      display: flex;
      flex-direction: column;
    }

    .vantagem-card:hover {
      transform: translateY(-6px);
    }

    .vantagem-img {
      width: 100%;
      height: 220px;
      object-fit: cover;
    }

    .vantagem-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .vantagem-titulo {
      font-size: 24px;
      font-weight: bold;
      color: #534AB7;
      margin-bottom: 12px;
    }

    .vantagem-descricao {
      color: #6666a3;
      line-height: 1.5;
      margin-bottom: 20px;
      min-height: 60px;
      flex: 1;
    }

    .empresa, .estoque {
      font-size: 14px;
      margin-bottom: 10px;
      color: #8a86c9;
    }

    .footer-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-top: 10px;
    }

    .custo {
      font-size: 22px;
      font-weight: bold;
      color: #26215C;
    }

    .resgatar-btn {
      border: none;
      background: linear-gradient(135deg, #534AB7, #7F77DD);
      color: white;
      padding: 12px 18px;
      border-radius: 14px;
      cursor: pointer;
      font-weight: bold;
      transition: .3s;
    }

    .resgatar-btn:hover:not(:disabled) {
      transform: scale(1.05);
    }

    .resgatar-btn:disabled {
      opacity: .55;
      cursor: not-allowed;
      transform: none;
    }

    .empty, .loading {
      text-align: center;
      padding: 80px;
      color: #534AB7;
      font-size: 22px;
    }

    @media (max-width: 768px) {
      .vantagens-page { padding: 90px 20px 40px; }
      .hero h1 { font-size: 36px; }
      .footer-card { align-items: flex-start; flex-direction: column; }
    }
  `;

    if (loading) {
        return (
            <>
                <style>{styles}</style>
                <div className="loading">Carregando vantagens...</div>
            </>
        );
    }

    return (
        <>
            <style>{styles}</style>

            <div className="vantagens-page">

                <section className="hero">
                    <h1>Vantagens disponíveis</h1>
                    <p>Troque seus KRNs por benefícios exclusivos oferecidos pelas empresas parceiras.</p>
                </section>

                <div className="saldo-box">
                    <span>Saldo disponível para troca</span>
                    <strong>{Number(aluno?.saldoMoedas || 0)} KRNs</strong>
                </div>

                {cupom && (
                    <div className="cupom-box">
                        <div className="cupom-info">
                            <strong>Resgate realizado!</strong><br />
                            Apresente este código na empresa parceira para conferir a troca.
                        </div>
                        <div className="cupom-code">{cupom.codigoCupom}</div>
                    </div>
                )}

                {vantagens.length === 0 ? (
                    <div className="empty">Nenhuma vantagem disponível no momento.</div>
                ) : (
                    <div className="vantagens-grid">
                        {vantagens.map((vantagem) => {
                            const esgotada = vantagem.quantidadeDisponivel !== null && vantagem.quantidadeDisponivel !== undefined && vantagem.quantidadeDisponivel <= 0;
                            const saldoInsuficiente = Number(aluno?.saldoMoedas || 0) < Number(vantagem.custoMoedas || 0);

                            return (
                                <div className="vantagem-card" key={vantagem.id}>
                                    <img
                                        src={vantagem.fotoUrl || "https://placehold.co/600x400?text=KRN"}
                                        alt={vantagem.titulo}
                                        className="vantagem-img"
                                    />

                                    <div className="vantagem-content">
                                        <div className="vantagem-titulo">{vantagem.titulo}</div>
                                        <div className="vantagem-descricao">{vantagem.descricao}</div>
                                        <div className="empresa">Parceiro: {vantagem.empresaNomeFantasia}</div>
                                        <div className="estoque">Disponível: {vantagem.quantidadeDisponivel ?? "Ilimitado"}</div>

                                        <div className="footer-card">
                                            <div className="custo">💰 {vantagem.custoMoedas} KRNs</div>
                                            <button
                                                className="resgatar-btn"
                                                disabled={resgatandoId === vantagem.id || esgotada || saldoInsuficiente}
                                                onClick={() => resgatarVantagem(vantagem)}
                                                title={esgotada ? "Vantagem esgotada" : saldoInsuficiente ? "Saldo insuficiente" : "Resgatar vantagem"}
                                            >
                                                {resgatandoId === vantagem.id ? "Resgatando..." : esgotada ? "Esgotada" : saldoInsuficiente ? "Saldo insuficiente" : "Resgatar"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
