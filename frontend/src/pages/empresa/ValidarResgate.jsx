import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resgateService } from "../../services/resgateService";
import { toast } from "../shared/Toast";

/* ─── MODAL DE CONFIRMAÇÃO ─────────────────────────────── */
function ConfirmModal({ titulo, mensagem, labelConfirmar = "Confirmar", onConfirmar, onCancelar }) {
  return (
    <div className="confirm-overlay" onClick={onCancelar}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">✅</div>
        <h3 className="confirm-title">{titulo}</h3>
        <p className="confirm-msg">{mensagem}</p>
        <div className="confirm-actions">
          <button className="validar-btn-outline" onClick={onCancelar}>Cancelar</button>
          <button className="validar-btn" onClick={onConfirmar}>{labelConfirmar}</button>
        </div>
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  GERADO:    { cor: "gerado",    dot: "🔵", label: "Pendente de uso" },
  UTILIZADO: { cor: "utilizado", dot: "🟢", label: "Utilizado"       },
  EXPIRADO:  { cor: "expirado",  dot: "🔴", label: "Expirado"        },
  CANCELADO: { cor: "cancelado", dot: "⚫", label: "Cancelado"       },
};

const styles = `
  .validar-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
    padding: 100px 24px 60px;
    font-family: 'Play', sans-serif;
    color: #26215C;
    box-sizing: border-box;
  }

  .validar-shell { width: min(880px, 100%); margin: 0 auto; }

  .validar-top {
    display: flex; justify-content: space-between;
    gap: 16px; align-items: flex-start; margin-bottom: 24px;
  }
  .validar-title { margin: 0 0 6px; color: #26215C; font-size: 30px; line-height: 1.1; }
  .validar-sub   { margin: 0; color: rgba(83,74,183,.65); font-size: 14px; }

  .validar-card {
    background: rgba(255,255,255,.58);
    border: 1px solid rgba(255,255,255,.72);
    border-radius: 20px;
    box-shadow: 0 10px 28px rgba(83,74,183,.1);
    padding: 24px;
  }

  /* BUSCA */
  .validar-form {
    display: grid; grid-template-columns: 1fr auto;
    gap: 12px; margin-bottom: 20px;
  }
  .validar-input {
    min-height: 52px; border-radius: 14px;
    border: 2px solid rgba(83,74,183,.2);
    padding: 0 18px;
    font-family: 'Play', sans-serif; font-size: 17px; font-weight: 700;
    color: #26215C; letter-spacing: 1px;
    background: rgba(255,255,255,.8);
    box-sizing: border-box; transition: border .2s, box-shadow .2s;
  }
  .validar-input::placeholder { font-weight: 400; font-size: 14px; letter-spacing: 0; }
  .validar-input:focus {
    outline: none; border-color: #534AB7;
    box-shadow: 0 0 0 4px rgba(83,74,183,.12);
  }

  /* BOTÕES */
  .validar-btn, .validar-btn-outline {
    min-height: 52px; border-radius: 14px; border: 0;
    padding: 0 22px; font-family: 'Play', sans-serif;
    font-weight: 700; cursor: pointer; transition: .2s ease; white-space: nowrap;
  }
  .validar-btn {
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff; box-shadow: 0 6px 20px rgba(83,74,183,.3);
  }
  .validar-btn:hover:not(:disabled) {
    transform: translateY(-2px); box-shadow: 0 10px 28px rgba(83,74,183,.4);
  }
  .validar-btn:disabled { opacity: .55; cursor: not-allowed; }

  /* CTA de confirmar — dourado */
  .validar-btn-cta {
    background: linear-gradient(135deg, #EF9F27, #FAC775);
    color: #26215C; font-weight: 700;
    min-height: 52px; border-radius: 14px; border: 0;
    padding: 0 26px; font-family: 'Play', sans-serif;
    cursor: pointer; transition: .2s ease; white-space: nowrap;
    box-shadow: 0 6px 22px rgba(239,159,39,.38);
    font-size: 13px; letter-spacing: .8px;
  }
  .validar-btn-cta:hover:not(:disabled) {
    transform: translateY(-2px); box-shadow: 0 12px 32px rgba(239,159,39,.5);
  }
  .validar-btn-cta:disabled { opacity: .55; cursor: not-allowed; }

  .validar-btn-outline {
    border: 1px solid rgba(83,74,183,.22);
    background: rgba(255,255,255,.46); color: #534AB7;
  }
  .validar-btn-outline:hover:not(:disabled) { transform: translateY(-1px); background: rgba(255,255,255,.7); }

  /* CÓDIGO DO CUPOM — destaque */
  .resgate-code-wrap {
    display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
  }
  .resgate-code {
    display: inline-flex; align-items: center;
    padding: 10px 20px; border-radius: 14px;
    background: linear-gradient(135deg, rgba(83,74,183,.12), rgba(127,119,221,.08));
    border: 1px solid rgba(83,74,183,.18);
    color: #534AB7; font-size: 22px; font-weight: 800; letter-spacing: 2px;
  }

  /* STATUS BADGE — destaque */
  .status-pill {
    display: inline-flex; align-items: center; gap: 6px;
    min-height: 36px; padding: 0 14px;
    border-radius: 999px; font-size: 12px; font-weight: 700;
  }
  .status-pill.gerado    { background: rgba(59,130,246,.13); color: #2563eb; }
  .status-pill.utilizado { background: rgba(34,197,94,.15);  color: #15803d; }
  .status-pill.expirado  { background: rgba(239,68,68,.12);  color: #b91c1c; }
  .status-pill.cancelado { background: rgba(100,116,139,.13);color: #475569; }

  /* DETAIL GRID */
  .resgate-detail {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px; margin-top: 4px;
  }
  .detail-item {
    background: rgba(238,243,255,.76);
    border: 1px solid rgba(83,74,183,.1);
    border-radius: 14px; padding: 14px;
  }
  /* Status e Código têm destaque extra */
  .detail-item.highlight {
    border-color: rgba(83,74,183,.22);
    background: rgba(83,74,183,.06);
  }
  .detail-label {
    display: block; margin-bottom: 6px;
    color: rgba(60,52,137,.58); font-size: 11px;
    font-weight: 700; letter-spacing: .7px; text-transform: uppercase;
  }
  .detail-value {
    color: #26215C; font-size: 15px;
    line-height: 1.35; overflow-wrap: anywhere;
  }

  /* AÇÕES */
  .validar-actions {
    display: flex; gap: 12px; justify-content: flex-end;
    margin-top: 22px; flex-wrap: wrap;
  }

  /* EMPTY */
  .validar-empty {
    text-align: center; padding: 40px 16px;
    color: rgba(83,74,183,.65); font-size: 14px;
  }
  .validar-empty span { display: block; font-size: 36px; margin-bottom: 10px; }

  /* CONFIRM MODAL */
  .confirm-overlay {
    position: fixed; inset: 0;
    background: rgba(38,33,92,0.4);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 300;
  }
  .confirm-box {
    background: rgba(235,240,255,0.97);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,.7);
    border-radius: 22px; padding: 36px 32px;
    width: min(400px, 90vw);
    box-shadow: 0 28px 64px rgba(38,33,92,.22);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    text-align: center;
  }
  .confirm-icon  { font-size: 36px; margin-bottom: 4px; }
  .confirm-title { font-size: 17px; font-weight: 700; color: #26215C; margin: 0; }
  .confirm-msg   { font-size: 13px; color: rgba(38,33,92,.65); margin: 4px 0 16px; line-height: 1.5; }
  .confirm-actions { display: flex; gap: 10px; justify-content: center; width: 100%; }

  @media (max-width: 720px) {
    .validar-page { padding: 90px 16px 40px; }
    .validar-top  { flex-direction: column; }
    .validar-form { grid-template-columns: 1fr; }
    .resgate-detail { grid-template-columns: 1fr; }
    .validar-actions { justify-content: stretch; }
    .validar-btn, .validar-btn-outline, .validar-btn-cta { width: 100%; }
  }
`;

function normalizarCodigo(codigo) {
  return (codigo || "").trim().toUpperCase();
}

export default function ValidarResgate() {
  const { codigoCupom } = useParams();
  const navigate = useNavigate();

  const [codigo,      setCodigo]      = useState(normalizarCodigo(codigoCupom));
  const [resgate,     setResgate]     = useState(null);
  const [buscando,    setBuscando]    = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const buscarResgate = useCallback(async (codigoParaBuscar) => {
    const codigoNormalizado = normalizarCodigo(codigoParaBuscar);
    if (!codigoNormalizado) { toast.info("Informe o código do cupom."); return; }
    try {
      setBuscando(true);
      const { data } = await resgateService.buscarPorCodigoParaEmpresa(codigoNormalizado);
      setCodigo(data.codigoCupom);
      setResgate(data);
    } catch (err) {
      setResgate(null);
      toast.error(err.response?.data?.message || err.response?.data || "Resgate não encontrado.");
    } finally {
      setBuscando(false);
    }
  }, []);

  useEffect(() => {
    const codigoDaUrl = normalizarCodigo(codigoCupom);
    if (!codigoDaUrl) return;
    const timer = window.setTimeout(() => buscarResgate(codigoDaUrl), 0);
    return () => window.clearTimeout(timer);
  }, [codigoCupom, buscarResgate]);

  async function confirmarUso() {
    if (!resgate?.codigoCupom) return;
    setShowConfirm(false);
    try {
      setConfirmando(true);
      const { data } = await resgateService.confirmarUsoPorCodigo(resgate.codigoCupom);
      setResgate(data);
      toast.success("Resgate confirmado como utilizado.");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "Erro ao confirmar resgate.");
    } finally {
      setConfirmando(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    buscarResgate(codigo);
  }

  const podeConfirmar = resgate?.status === "GERADO";
  const statusCfg     = STATUS_CONFIG[resgate?.status] ?? {};

  return (
    <>
      <style>{styles}</style>

      {showConfirm && (
        <ConfirmModal
          titulo="Confirmar utilização"
          mensagem={`Marcar o cupom ${resgate.codigoCupom} como utilizado? Essa ação não pode ser desfeita.`}
          labelConfirmar={confirmando ? "Confirmando..." : "Confirmar uso"}
          onConfirmar={confirmarUso}
          onCancelar={() => setShowConfirm(false)}
        />
      )}

      <main className="validar-page">
        <div className="validar-shell">

          <div className="validar-top">
            <div>
              <h1 className="validar-title">Validar resgate</h1>
              <p className="validar-sub">Confira os dados do cupom antes de confirmar a utilização.</p>
            </div>
            <button className="validar-btn-outline" type="button" onClick={() => navigate("/empresa/dashboard")}>
              Voltar ao painel
            </button>
          </div>

          <section className="validar-card">
            <form className="validar-form" onSubmit={handleSubmit}>
              <input
                className="validar-input"
                value={codigo}
                onChange={(e) => setCodigo(normalizarCodigo(e.target.value))}
                placeholder="KRN-ABCD-1234"
                aria-label="Código do cupom"
              />
              <button className="validar-btn" type="submit" disabled={buscando}>
                {buscando ? "Buscando..." : "Buscar"}
              </button>
            </form>

            {resgate ? (
              <>
                {/* Código em destaque */}
                <div className="resgate-code-wrap">
                  <span className="resgate-code"> {resgate.codigoCupom}</span>
                </div>

                <div className="resgate-detail">
                  {/* Status — destaque */}
                  <div className="detail-item highlight">
                    <span className="detail-label">Status</span>
                    <span className={`status-pill ${statusCfg.cor ?? ""}`}>
                      {statusCfg.dot} {statusCfg.label ?? resgate.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Data do resgate</span>
                    <span className="detail-value">
                      {resgate.dataResgate ? new Date(resgate.dataResgate).toLocaleString("pt-BR") : "—"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Aluno</span>
                    <span className="detail-value">{resgate.alunoNome}<br />{resgate.alunoEmail}</span>
                  </div>
                  {/* Vantagem — destaque */}
                  <div className="detail-item highlight">
                    <span className="detail-label">Vantagem</span>
                    <span className="detail-value" style={{ fontWeight: 700 }}>
                      {resgate.vantagemTitulo}
                    </span>
                    <span className="detail-value" style={{ color: "#534AB7", fontWeight: 700, fontSize: 13 }}>
                      ⬡ {resgate.custoMoedas} KRN
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Empresa</span>
                    <span className="detail-value">{resgate.empresaNomeFantasia}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Identificação</span>
                    <span className="detail-value">Resgate #{resgate.id}</span>
                  </div>
                </div>

                <div className="validar-actions">
                  <button className="validar-btn-outline" type="button"
                    onClick={() => buscarResgate(resgate.codigoCupom)}>
                    Atualizar dados
                  </button>
                  {resgate.status === "UTILIZADO" ? (
                    <button className="validar-btn" type="button" disabled> Já utilizado</button>
                  ) : (
                    <button className="validar-btn-cta" type="button"
                      disabled={!podeConfirmar || confirmando}
                      onClick={() => setShowConfirm(true)}>
                      {confirmando ? "Confirmando..." : "Confirmar utilização"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="validar-empty">
                <span>🎟️</span>
                Escaneie um QR Code ou informe um código para consultar o resgate.
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}