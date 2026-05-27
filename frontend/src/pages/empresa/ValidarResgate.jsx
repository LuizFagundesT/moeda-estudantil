import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resgateService } from "../../services/resgateService";
import { toast } from "../shared/Toast";

const styles = `
  .validar-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
    padding: 100px 24px 60px;
    font-family: 'Play', sans-serif;
    color: #26215C;
    box-sizing: border-box;
  }

  .validar-shell {
    width: min(880px, 100%);
    margin: 0 auto;
  }

  .validar-top {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .validar-title {
    margin: 0 0 6px;
    color: #26215C;
    font-size: 30px;
    line-height: 1.1;
  }

  .validar-sub {
    margin: 0;
    color: rgba(83,74,183,.65);
    font-size: 14px;
  }

  .validar-card {
    background: rgba(255,255,255,.58);
    border: 1px solid rgba(255,255,255,.72);
    border-radius: 20px;
    box-shadow: 0 10px 28px rgba(83,74,183,.1);
    padding: 24px;
  }

  .validar-form {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    margin-bottom: 20px;
  }

  .validar-input {
    min-height: 48px;
    border-radius: 14px;
    border: 1px solid rgba(83,74,183,.2);
    padding: 0 16px;
    font-family: 'Play', sans-serif;
    font-size: 16px;
    color: #26215C;
    background: rgba(255,255,255,.74);
    box-sizing: border-box;
  }

  .validar-input:focus {
    outline: none;
    border-color: #534AB7;
    box-shadow: 0 0 0 3px rgba(83,74,183,.13);
  }

  .validar-btn,
  .validar-btn-outline {
    min-height: 48px;
    border-radius: 14px;
    border: 0;
    padding: 0 18px;
    font-family: 'Play', sans-serif;
    font-weight: 700;
    cursor: pointer;
    transition: .2s ease;
    white-space: nowrap;
  }

  .validar-btn {
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
  }

  .validar-btn-outline {
    border: 1px solid rgba(83,74,183,.22);
    background: rgba(255,255,255,.46);
    color: #534AB7;
  }

  .validar-btn:hover:not(:disabled),
  .validar-btn-outline:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .validar-btn:disabled,
  .validar-btn-outline:disabled {
    opacity: .58;
    cursor: not-allowed;
    transform: none;
  }

  .resgate-detail {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-top: 18px;
  }

  .detail-item {
    background: rgba(238,243,255,.76);
    border: 1px solid rgba(83,74,183,.1);
    border-radius: 14px;
    padding: 14px;
  }

  .detail-label {
    display: block;
    margin-bottom: 6px;
    color: rgba(60,52,137,.58);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .7px;
    text-transform: uppercase;
  }

  .detail-value {
    color: #26215C;
    font-size: 15px;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .resgate-code {
    display: inline-flex;
    align-items: center;
    min-height: 40px;
    padding: 0 14px;
    border-radius: 12px;
    background: rgba(83,74,183,.12);
    color: #534AB7;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: .7px;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    background: rgba(59,130,246,.12);
    color: #2563eb;
  }

  .status-pill.utilizado {
    background: rgba(34,197,94,.14);
    color: #15803d;
  }

  .status-pill.cancelado {
    background: rgba(239,68,68,.12);
    color: #b91c1c;
  }

  .validar-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 22px;
    flex-wrap: wrap;
  }

  .validar-empty {
    text-align: center;
    padding: 30px 16px;
    color: rgba(83,74,183,.72);
  }

  @media (max-width: 720px) {
    .validar-page { padding: 90px 16px 40px; }
    .validar-top { flex-direction: column; }
    .validar-form { grid-template-columns: 1fr; }
    .resgate-detail { grid-template-columns: 1fr; }
    .validar-actions { justify-content: stretch; }
    .validar-btn, .validar-btn-outline { width: 100%; }
  }
`;

function normalizarCodigo(codigo) {
  return (codigo || "").trim().toUpperCase();
}

export default function ValidarResgate() {
  const { codigoCupom } = useParams();
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState(normalizarCodigo(codigoCupom));
  const [resgate, setResgate] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const buscarResgate = useCallback(async (codigoParaBuscar) => {
    const codigoNormalizado = normalizarCodigo(codigoParaBuscar);
    if (!codigoNormalizado) {
      toast.info("Informe o codigo do cupom.");
      return;
    }

    try {
      setBuscando(true);
      const { data } = await resgateService.buscarPorCodigoParaEmpresa(codigoNormalizado);
      setCodigo(data.codigoCupom);
      setResgate(data);
    } catch (err) {
      setResgate(null);
      toast.error(err.response?.data?.message || err.response?.data || "Resgate nao encontrado.");
    } finally {
      setBuscando(false);
    }
  }, []);

  useEffect(() => {
    const codigoDaUrl = normalizarCodigo(codigoCupom);
    if (!codigoDaUrl) return undefined;

    const timer = window.setTimeout(() => {
      buscarResgate(codigoDaUrl);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [codigoCupom, buscarResgate]);

  async function confirmarUso() {
    if (!resgate?.codigoCupom) return;

    const confirmou = window.confirm("Confirmar a utilizacao deste resgate?");
    if (!confirmou) return;

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

  return (
    <>
      <style>{styles}</style>
      <main className="validar-page">
        <div className="validar-shell">
          <div className="validar-top">
            <div>
              <h1 className="validar-title">Validar resgate</h1>
              <p className="validar-sub">Confira os dados do cupom antes de confirmar a utilizacao.</p>
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
                aria-label="Codigo do cupom"
              />
              <button className="validar-btn" type="submit" disabled={buscando}>
                {buscando ? "Buscando..." : "Buscar resgate"}
              </button>
            </form>

            {resgate ? (
              <>
                <span className="resgate-code">{resgate.codigoCupom}</span>

                <div className="resgate-detail">
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`status-pill ${String(resgate.status || "").toLowerCase()}`}>{resgate.status}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Data do resgate</span>
                    <span className="detail-value">
                      {resgate.dataResgate ? new Date(resgate.dataResgate).toLocaleString("pt-BR") : "-"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Aluno</span>
                    <span className="detail-value">{resgate.alunoNome}<br />{resgate.alunoEmail}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Vantagem</span>
                    <span className="detail-value">{resgate.vantagemTitulo}<br />{resgate.custoMoedas} KRN</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Empresa</span>
                    <span className="detail-value">{resgate.empresaNomeFantasia}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Identificacao</span>
                    <span className="detail-value">Resgate #{resgate.id}</span>
                  </div>
                </div>

                <div className="validar-actions">
                  <button className="validar-btn-outline" type="button" onClick={() => buscarResgate(resgate.codigoCupom)}>
                    Atualizar dados
                  </button>
                  <button className="validar-btn" type="button" disabled={!podeConfirmar || confirmando} onClick={confirmarUso}>
                    {resgate.status === "UTILIZADO" ? "Ja utilizado" : confirmando ? "Confirmando..." : "Confirmar utilizacao"}
                  </button>
                </div>
              </>
            ) : (
              <div className="validar-empty">Escaneie um QR Code ou informe um codigo para consultar o resgate.</div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
