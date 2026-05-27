import { useEffect, useState } from "react";
import QRCode from "qrcode";
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
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [modalCupomAberto, setModalCupomAberto] = useState(false);
    const [vantagemParaConfirmar, setVantagemParaConfirmar] = useState(null);

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        let ativo = true;

        async function gerarQrCode() {
            if (!cupom?.codigoCupom) {
                setQrCodeUrl("");
                return;
            }

            const urlValidacao = `${window.location.origin}/empresa/resgates/validar/${encodeURIComponent(cupom.codigoCupom)}`;
            const dataUrl = await QRCode.toDataURL(urlValidacao, {
                width: 220,
                margin: 2,
                errorCorrectionLevel: "M",
            });

            if (ativo) setQrCodeUrl(dataUrl);
        }

        gerarQrCode().catch(() => {
            if (ativo) setQrCodeUrl("");
            toast.error("Nao foi possivel gerar o QR Code do resgate.");
        });

        return () => { ativo = false; };
    }, [cupom]);

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

    function solicitarResgate(vantagem) {
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

        setVantagemParaConfirmar(vantagem);
    }

    async function confirmarResgate() {
        if (!vantagemParaConfirmar || !aluno?.id) return;

        try {
            const vantagem = vantagemParaConfirmar;
            setResgatandoId(vantagem.id);
            const { data } = await resgateService.resgatar(aluno.id, vantagem.id);
            setVantagemParaConfirmar(null);
            setCupom(data);
            setModalCupomAberto(true);
            await carregarDados();
        } catch (error) {
            toast.error(error.response?.data?.message || error.response?.data || "Erro ao resgatar vantagem.");
        } finally {
            setResgatandoId(null);
        }
    }

    async function copiarCodigoCupom() {
        if (!cupom?.codigoCupom) return;

        try {
            await navigator.clipboard.writeText(cupom.codigoCupom);
            toast.success("Codigo copiado.");
        } catch {
            toast.error("Nao foi possivel copiar o codigo automaticamente.");
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

    .cupom-code-wrap {
      display: flex;
      gap: 18px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .cupom-qr {
      width: 116px;
      height: 116px;
      padding: 8px;
      border-radius: 16px;
      background: #fff;
      border: 1px solid rgba(34,197,94,.22);
      box-shadow: 0 6px 18px rgba(34,197,94,.12);
      box-sizing: border-box;
    }

    .resgate-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 24px;
      background: rgba(20, 18, 56, .48);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-sizing: border-box;
    }

    .resgate-modal {
      width: min(720px, 100%);
      max-height: calc(100vh - 48px);
      overflow: auto;
      background: rgba(255,255,255,.94);
      border: 1px solid rgba(255,255,255,.78);
      border-radius: 24px;
      box-shadow: 0 24px 70px rgba(38,33,92,.26);
      color: #26215C;
    }

    .resgate-modal-head {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      padding: 24px 24px 0;
    }

    .resgate-modal-kicker {
      margin: 0 0 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #16a34a;
    }

    .resgate-modal-title {
      margin: 0;
      font-size: 28px;
      line-height: 1.1;
      color: #26215C;
    }

    .resgate-modal-close {
      width: 38px;
      height: 38px;
      border: 1px solid rgba(83,74,183,.18);
      border-radius: 50%;
      background: rgba(238,243,255,.84);
      color: #534AB7;
      cursor: pointer;
      font-size: 22px;
      line-height: 1;
    }

    .resgate-modal-body {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 24px;
      padding: 24px;
      align-items: start;
    }

    .resgate-modal-qr {
      display: grid;
      place-items: center;
      min-height: 220px;
      border-radius: 20px;
      background: #fff;
      border: 1px solid rgba(83,74,183,.12);
      box-shadow: inset 0 0 0 8px rgba(238,243,255,.72);
    }

    .resgate-modal-qr img {
      width: 184px;
      height: 184px;
    }

    .resgate-modal-code {
      display: inline-flex;
      margin: 4px 0 16px;
      padding: 12px 16px;
      border-radius: 14px;
      background: rgba(83,74,183,.1);
      color: #534AB7;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: .8px;
    }

    .resgate-modal-detail {
      display: grid;
      gap: 10px;
      margin: 0 0 18px;
      color: rgba(38,33,92,.78);
      font-size: 14px;
      line-height: 1.45;
    }

    .resgate-modal-detail strong {
      color: #26215C;
    }

    .resgate-modal-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .resgate-confirm-body {
      padding: 24px;
      display: grid;
      gap: 18px;
    }

    .resgate-confirm-card {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 16px;
      padding: 14px;
      border-radius: 18px;
      background: rgba(238,243,255,.72);
      border: 1px solid rgba(83,74,183,.12);
    }

    .resgate-confirm-img {
      width: 120px;
      height: 92px;
      border-radius: 14px;
      object-fit: cover;
      background: rgba(83,74,183,.08);
    }

    .resgate-confirm-name {
      margin: 0 0 8px;
      color: #26215C;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.2;
    }

    .resgate-confirm-meta {
      display: grid;
      gap: 6px;
      color: rgba(38,33,92,.7);
      font-size: 14px;
    }

    .resgate-confirm-cost {
      display: inline-flex;
      align-items: center;
      width: fit-content;
      min-height: 34px;
      padding: 0 12px;
      border-radius: 999px;
      background: rgba(83,74,183,.12);
      color: #534AB7;
      font-weight: 700;
    }

    .resgate-modal-btn,
    .resgate-modal-btn-outline {
      min-height: 44px;
      border-radius: 13px;
      padding: 0 16px;
      font-family: 'Play', sans-serif;
      font-weight: 700;
      cursor: pointer;
      transition: .2s ease;
    }

    .resgate-modal-btn {
      border: 0;
      background: linear-gradient(135deg, #534AB7, #7F77DD);
      color: #fff;
    }

    .resgate-modal-btn-outline {
      border: 1px solid rgba(83,74,183,.22);
      background: rgba(238,243,255,.82);
      color: #534AB7;
    }

    .resgate-modal-btn:hover,
    .resgate-modal-btn-outline:hover,
    .resgate-modal-close:hover {
      transform: translateY(-1px);
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
      .resgate-modal-body { grid-template-columns: 1fr; }
      .resgate-modal-title { font-size: 24px; }
      .resgate-modal-actions { flex-direction: column; }
      .resgate-modal-btn, .resgate-modal-btn-outline { width: 100%; }
      .resgate-confirm-card { grid-template-columns: 1fr; }
      .resgate-confirm-img { width: 100%; height: 160px; }
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

                {vantagemParaConfirmar && (
                    <div className="resgate-modal-overlay" onClick={() => setVantagemParaConfirmar(null)}>
                        <div className="resgate-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="resgate-modal-head">
                                <div>
                                    <p className="resgate-modal-kicker">Confirmar resgate</p>
                                    <h2 className="resgate-modal-title">Trocar KRNs por esta vantagem?</h2>
                                </div>
                                <button
                                    className="resgate-modal-close"
                                    type="button"
                                    onClick={() => setVantagemParaConfirmar(null)}
                                    aria-label="Fechar modal"
                                >
                                    x
                                </button>
                            </div>

                            <div className="resgate-confirm-body">
                                <div className="resgate-confirm-card">
                                    <img
                                        className="resgate-confirm-img"
                                        src={vantagemParaConfirmar.fotoUrl || "https://placehold.co/600x400?text=KRN"}
                                        alt={vantagemParaConfirmar.titulo}
                                    />
                                    <div>
                                        <h3 className="resgate-confirm-name">{vantagemParaConfirmar.titulo}</h3>
                                        <div className="resgate-confirm-meta">
                                            <span>{vantagemParaConfirmar.descricao}</span>
                                            <span>Parceiro: {vantagemParaConfirmar.empresaNomeFantasia}</span>
                                            <span className="resgate-confirm-cost">{vantagemParaConfirmar.custoMoedas} KRNs</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="resgate-modal-actions">
                                    <button
                                        className="resgate-modal-btn"
                                        type="button"
                                        disabled={resgatandoId === vantagemParaConfirmar.id}
                                        onClick={confirmarResgate}
                                    >
                                        {resgatandoId === vantagemParaConfirmar.id ? "Resgatando..." : "Confirmar resgate"}
                                    </button>
                                    <button
                                        className="resgate-modal-btn-outline"
                                        type="button"
                                        onClick={() => setVantagemParaConfirmar(null)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {cupom && modalCupomAberto && (
                    <div className="resgate-modal-overlay" onClick={() => setModalCupomAberto(false)}>
                        <div className="resgate-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="resgate-modal-head">
                                <div>
                                    <p className="resgate-modal-kicker">Resgate confirmado</p>
                                    <h2 className="resgate-modal-title">Seu cupom esta pronto</h2>
                                </div>
                                <button
                                    className="resgate-modal-close"
                                    type="button"
                                    onClick={() => setModalCupomAberto(false)}
                                    aria-label="Fechar modal"
                                >
                                    x
                                </button>
                            </div>

                            <div className="resgate-modal-body">
                                <div className="resgate-modal-qr">
                                    {qrCodeUrl ? (
                                        <img src={qrCodeUrl} alt={`QR Code do resgate ${cupom.codigoCupom}`} />
                                    ) : (
                                        <span>Gerando QR Code...</span>
                                    )}
                                </div>

                                <div>
                                    <div className="resgate-modal-code">{cupom.codigoCupom}</div>
                                    <div className="resgate-modal-detail">
                                        <span><strong>Vantagem:</strong> {cupom.vantagemTitulo}</span>
                                        <span><strong>Parceiro:</strong> {cupom.empresaNomeFantasia}</span>
                                        <span><strong>Custo:</strong> {cupom.custoMoedas} KRNs</span>
                                        <span>Apresente o QR Code ou o codigo acima na empresa parceira.</span>
                                    </div>

                                    <div className="resgate-modal-actions">
                                        <button className="resgate-modal-btn" type="button" onClick={copiarCodigoCupom}>
                                            Copiar codigo
                                        </button>
                                        <button className="resgate-modal-btn-outline" type="button" onClick={() => setModalCupomAberto(false)}>
                                            Continuar vendo vantagens
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {cupom && (
                    <div className="cupom-box">
                        <div className="cupom-info">
                            <strong>Resgate realizado!</strong><br />
                            Apresente este código na empresa parceira para conferir a troca.
                        </div>
                        <div className="cupom-code-wrap">
                            {qrCodeUrl && (
                                <img className="cupom-qr" src={qrCodeUrl} alt={`QR Code do resgate ${cupom.codigoCupom}`} />
                            )}
                            <div className="cupom-code">{cupom.codigoCupom}</div>
                        </div>
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
                                                onClick={() => solicitarResgate(vantagem)}
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
