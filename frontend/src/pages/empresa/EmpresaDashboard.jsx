import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { empresaService } from "../../services/empresaService";
import { vantagemService } from "../../services/vantagemService";
import { toast } from "../shared/Toast";

const emptyVantagem = {
  titulo: "",
  descricao: "",
  custoMoedas: "",
  fotoUrl: "",
  quantidadeDisponivel: "",
  ativa: true,
};

const styles = `
  .empresa-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
    padding: 100px 40px 60px;
    font-family: 'Play', sans-serif;
    color: #26215C;
    box-sizing: border-box;
  }

  /* ── PAGE HEADER ── */
  .empresa-page-header {
    margin-bottom: 28px;
  }

  .empresa-page-title {
    font-size: 26px;
    font-weight: 700;
    margin: 0 0 4px;
    color: #26215C;
  }

  .empresa-page-sub {
    font-size: 13px;
    color: rgba(83,74,183,.6);
    margin: 0;
  }

  /* ── NAV PILLS ── */
  .empresa-nav {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-bottom: 28px;
    scrollbar-width: none;
  }

  .empresa-nav::-webkit-scrollbar { display: none; }

  .empresa-nav button {
    flex: 0 0 auto;
    border: 1px solid rgba(83,74,183,.18);
    background: rgba(255,255,255,.35);
    color: rgba(38,33,92,.72);
    padding: 10px 18px;
    border-radius: 999px;
    cursor: pointer;
    font-family: 'Play', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .6px;
    transition: all .2s;
    white-space: nowrap;
  }

  .empresa-nav button:hover {
    background: rgba(255,255,255,.55);
    color: #534AB7;
  }

  .empresa-nav button.active {
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    border-color: transparent;
    box-shadow: 0 6px 18px rgba(83,74,183,.22);
  }

  /* ── STATS GRID ── */
  .empresa-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .empresa-stat {
    background: rgba(220,232,248,0.55);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.48);
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(83,74,183,.08);
    padding: 22px;
  }

  .empresa-stat-label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(60,52,137,0.55);
    margin-bottom: 10px;
  }

  .empresa-stat-value {
    font-size: 30px;
    font-weight: 700;
    color: #26215C;
    line-height: 1;
  }

  .empresa-stat-unit {
    font-size: 12px;
    color: rgba(83,74,183,.55);
    margin-top: 6px;
  }

  /* ── GLASS CARD ── */
  .empresa-card {
    background: rgba(220,232,248,0.55);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.48);
    border-radius: 22px;
    padding: 28px;
    margin-bottom: 20px;
    box-shadow: 0 4px 20px rgba(83,74,183,.10);
  }

  .empresa-card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 22px;
  }

  .empresa-card-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(83,74,183,.7);
    margin: 0 0 4px;
  }

  .empresa-card-desc {
    font-size: 13px;
    color: rgba(38,33,92,.55);
    margin: 0;
  }

  /* ── FORM ── */
  .empresa-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(200px, 1fr));
    gap: 16px;
  }

  .empresa-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .empresa-field.full {
    grid-column: 1 / -1;
  }

  .empresa-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,0.65);
  }

  .empresa-input,
  .empresa-textarea {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(83,74,183,.2);
    background: rgba(255,255,255,.55);
    font-family: 'Play', sans-serif;
    font-size: 13px;
    color: #26215C;
    outline: none;
    transition: border .2s, box-shadow .2s;
    box-sizing: border-box;
    width: 100%;
  }

  .empresa-input:focus,
  .empresa-textarea:focus {
    border-color: #534AB7;
    box-shadow: 0 0 0 4px rgba(83,74,183,.08);
  }

  .empresa-textarea {
    min-height: 96px;
    resize: vertical;
  }

  .empresa-checkbox-row {
    display: flex;
    align-items: center;
    gap: 10px;
    grid-column: 1 / -1;
    padding: 4px 0;
  }

  .empresa-checkbox-row input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #534AB7;
    cursor: pointer;
  }

  .empresa-form-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  /* ── BUTTONS ── */
  .empresa-btn,
  .empresa-btn-outline,
  .empresa-btn-danger,
  .empresa-btn-muted {
    border: none;
    cursor: pointer;
    padding: 11px 20px;
    border-radius: 12px;
    font-family: 'Play', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .8px;
    transition: all .2s;
    white-space: nowrap;
  }

  .empresa-btn {
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    box-shadow: 0 6px 18px rgba(83,74,183,.22);
  }

  .empresa-btn-outline {
    background: transparent;
    color: #534AB7;
    border: 1px solid rgba(83,74,183,.3);
  }

  .empresa-btn-danger {
    background: rgba(220,53,69,.10);
    color: #b42336;
    border: 1px solid rgba(180,35,54,.20);
  }

  .empresa-btn-muted {
    background: rgba(83,74,183,.08);
    color: #534AB7;
  }

  .empresa-btn:hover,
  .empresa-btn-outline:hover,
  .empresa-btn-danger:hover,
  .empresa-btn-muted:hover {
    transform: translateY(-1px);
  }

  /* ── VANTAGENS CAROUSEL ── */
  .vantagens-grid {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(270px, 320px);
    gap: 16px;
    overflow-x: auto;
    padding: 4px 4px 14px;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .vantagens-grid::-webkit-scrollbar { display: none; }

  .vantagem-card {
    scroll-snap-align: start;
    background: rgba(255,255,255,.5);
    border: 1px solid rgba(255,255,255,.65);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(83,74,183,.09);
    display: flex;
    flex-direction: column;
  }

  .vantagem-img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    background: linear-gradient(135deg, rgba(83,74,183,.15), rgba(127,119,221,.08));
    flex-shrink: 0;
  }

  .vantagem-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .vantagem-title {
    font-size: 15px;
    font-weight: 700;
    margin: 0 0 6px;
    color: #26215C;
  }

  .vantagem-desc {
    font-size: 12px;
    color: rgba(38,33,92,.65);
    line-height: 1.5;
    flex: 1;
  }

  .vantagem-meta {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin: 14px 0 12px;
  }

  .vtag {
    border-radius: 999px;
    padding: 5px 10px;
    background: rgba(83,74,183,.10);
    color: #534AB7;
    font-size: 11px;
    font-weight: 700;
  }

  .vtag.off {
    background: rgba(220,53,69,.10);
    color: #b42336;
  }

  .vtag.on {
    background: rgba(34,197,94,.12);
    color: #166534;
  }

  .vantagem-actions {
    display: flex;
    gap: 8px;
  }

  /* ── INFO GRID ── */
  .empresa-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 14px;
  }

  .empresa-info-item label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,0.55);
    margin-bottom: 4px;
  }

  .empresa-info-item span {
    font-size: 14px;
    color: #26215C;
    font-weight: 600;
  }

  /* ── EMPTY STATE ── */
  .empty-state {
    border: 1px dashed rgba(83,74,183,.25);
    background: rgba(255,255,255,.25);
    border-radius: 16px;
    padding: 28px;
    color: rgba(38,33,92,.55);
    text-align: center;
    font-size: 13px;
    line-height: 1.6;
  }

  /* ── LOADING ── */
  .empresa-loading {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Play', sans-serif;
    font-size: 14px;
    color: rgba(83,74,183,.6);
    background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
  }

  @media (max-width: 980px) {
    .empresa-page { padding: 90px 24px 40px; }
    .empresa-stats { grid-template-columns: repeat(2, 1fr); }
    .empresa-form-grid { grid-template-columns: 1fr; }
    .empresa-field.full { grid-column: 1; }
  }

  @media (max-width: 620px) {
    .empresa-page { padding: 90px 16px 40px; }
    .empresa-stats { grid-template-columns: 1fr 1fr; }
    .vantagens-grid { grid-auto-columns: minmax(240px, 85vw); }
  }
`;

const NAV_ITEMS = [
  { label: "Dashboard", id: "topo" },
  { label: "Criar vantagem", id: "form-vantagem" },
  { label: "Vantagens", id: "lista-vantagens" },
  { label: "Resgates", id: "historico" },
  { label: "Perfil", id: "perfil" },
];

export default function EmpresaDashboard() {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const [empresa, setEmpresa] = useState(null);
  const [vantagens, setVantagens] = useState([]);
  const [formVantagem, setFormVantagem] = useState(emptyVantagem);
  const [editandoVantagemId, setEditandoVantagemId] = useState(null);
  const [formPerfil, setFormPerfil] = useState({});
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navAtivo, setNavAtivo] = useState("topo");

  const totalAtivas = useMemo(() => vantagens.filter((v) => v.ativa).length, [vantagens]);
  const custoMedio = useMemo(() => {
    if (!vantagens.length) return 0;
    const soma = vantagens.reduce((acc, v) => acc + Number(v.custoMoedas || 0), 0);
    return Math.round(soma / vantagens.length);
  }, [vantagens]);

  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      const { data } = await empresaService.listar();
      const minhaEmpresa = data.find((e) => e.email === usuarioLogado?.email);

      if (!minhaEmpresa) {
        toast.error("Empresa não encontrada.");
        return;
      }

      setEmpresa(minhaEmpresa);
      prepararFormPerfil(minhaEmpresa);

      const vantagensRes = await vantagemService.listarPorEmpresa(minhaEmpresa.id);
      setVantagens(vantagensRes.data);
    } catch {
      toast.error("Erro ao carregar dados da empresa.");
    } finally {
      setLoading(false);
    }
  }

  function prepararFormPerfil(e) {
    setFormPerfil({
      nome: e.nome || "",
      email: e.email || "",
      cpf: e.cpf || "",
      cnpj: e.cnpj || "",
      nomeFantasia: e.nomeFantasia || "",
      endereco: {
        logradouro: e.endereco?.logradouro || "",
        numero: e.endereco?.numero || "",
        complemento: e.endereco?.complemento || "",
        bairro: e.endereco?.bairro || "",
        cidade: e.endereco?.cidade || "",
        estado: e.endereco?.estado || "",
        cep: e.endereco?.cep || "",
        pais: e.endereco?.pais || "",
      },
    });
  }

  function scrollTo(id) {
    setNavAtivo(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function handleVantagemChange(e) {
    const { name, value, type, checked } = e.target;
    setFormVantagem((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function montarPayload() {
    return {
      titulo: formVantagem.titulo.trim(),
      descricao: formVantagem.descricao.trim(),
      custoMoedas: Number(formVantagem.custoMoedas),
      fotoUrl: formVantagem.fotoUrl.trim(),
      quantidadeDisponivel: formVantagem.quantidadeDisponivel === "" ? null : Number(formVantagem.quantidadeDisponivel),
      ativa: Boolean(formVantagem.ativa),
    };
  }

  function validarVantagem() {
    if (!formVantagem.titulo.trim()) return "Informe o título da vantagem.";
    if (!formVantagem.descricao.trim()) return "Informe a descrição.";
    if (!formVantagem.custoMoedas || Number(formVantagem.custoMoedas) <= 0) return "Custo em moedas deve ser maior que zero.";
    return null;
  }

  async function salvarVantagem(e) {
    e.preventDefault();
    const erro = validarVantagem();
    if (erro) { toast.error(erro); return; }

    try {
      const payload = montarPayload();
      if (editandoVantagemId) {
        const { data } = await vantagemService.atualizar(editandoVantagemId, payload);
        setVantagens((lista) => lista.map((v) => v.id === data.id ? data : v));
        toast.success("Vantagem atualizada.");
      } else {
        const { data } = await vantagemService.criar(empresa.id, payload);
        setVantagens((lista) => [data, ...lista]);
        toast.success("Vantagem criada.");
      }
      limparForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao salvar vantagem.");
    }
  }

  function editarVantagem(v) {
    setEditandoVantagemId(v.id);
    setFormVantagem({
      titulo: v.titulo || "",
      descricao: v.descricao || "",
      custoMoedas: v.custoMoedas || "",
      fotoUrl: v.fotoUrl || "",
      quantidadeDisponivel: v.quantidadeDisponivel ?? "",
      ativa: v.ativa ?? true,
    });
    scrollTo("form-vantagem");
  }

  async function excluirVantagem(id) {
    if (!window.confirm("Deseja excluir esta vantagem?")) return;
    try {
      await vantagemService.deletar(id);
      setVantagens((lista) => lista.filter((v) => v.id !== id));
      toast.success("Vantagem excluída.");
    } catch {
      toast.error("Erro ao excluir vantagem.");
    }
  }

  function limparForm() {
    setFormVantagem(emptyVantagem);
    setEditandoVantagemId(null);
  }

  function handlePerfilChange(e) {
    const { name, value } = e.target;
    setFormPerfil((f) => ({ ...f, [name]: value }));
  }

  function handleEnderecoChange(e) {
    const { name, value } = e.target;
    setFormPerfil((f) => ({ ...f, endereco: { ...f.endereco, [name]: value } }));
  }

  async function salvarPerfil(e) {
    e.preventDefault();
    try {
      const { data } = await empresaService.atualizar(empresa.id, formPerfil);
      setEmpresa(data);
      prepararFormPerfil(data);
      setEditandoPerfil(false);
      localStorage.setItem("usuarioLogado", JSON.stringify({ ...usuarioLogado, nome: data.nome, email: data.email }));
      window.dispatchEvent(new Event("usuarioLogado"));
      toast.success("Perfil atualizado.");
    } catch {
      toast.error("Erro ao atualizar perfil.");
    }
  }

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="empresa-loading">Carregando painel...</div>
      </>
    );
  }

  const nomeExibido = empresa?.nomeFantasia || empresa?.nome || "";

  return (
    <>
      <style>{styles}</style>

      <main className="empresa-page">

        <div className="empresa-page-header" id="topo">
          <h1 className="empresa-page-title">{nomeExibido}</h1>
          <p className="empresa-page-sub">Gerencie vantagens, resgates e dados da empresa.</p>
        </div>

        <nav className="empresa-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={navAtivo === item.id ? "active" : ""}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Stats */}
        <section className="empresa-stats">
          <div className="empresa-stat">
            <span className="empresa-stat-label">Total de vantagens</span>
            <strong className="empresa-stat-value">{vantagens.length}</strong>
          </div>
          <div className="empresa-stat">
            <span className="empresa-stat-label">Vantagens ativas</span>
            <strong className="empresa-stat-value">{totalAtivas}</strong>
          </div>
          <div className="empresa-stat">
            <span className="empresa-stat-label">Custo médio</span>
            <strong className="empresa-stat-value">{custoMedio}</strong>
            <div className="empresa-stat-unit">KRN</div>
          </div>
          <div className="empresa-stat">
            <span className="empresa-stat-label">Resgates</span>
            <strong className="empresa-stat-value">0</strong>
          </div>
        </section>

        {/* Formulário vantagem */}
        <section className="empresa-card" id="form-vantagem">
          <div className="empresa-card-head">
            <div>
              <h3 className="empresa-card-title">
                {editandoVantagemId ? "Editar vantagem" : "Criar vantagem"}
              </h3>
              <p className="empresa-card-desc">
                Cadastre benefícios que os alunos poderão resgatar com KRN.
              </p>
            </div>
            {editandoVantagemId && (
              <button className="empresa-btn-muted" onClick={limparForm}>Cancelar edição</button>
            )}
          </div>

          <form onSubmit={salvarVantagem}>
            <div className="empresa-form-grid">
              <div className="empresa-field">
                <label className="empresa-label">Título</label>
                <input className="empresa-input" name="titulo"
                  value={formVantagem.titulo} onChange={handleVantagemChange}
                  placeholder="Ex.: 20% de desconto no almoço" />
              </div>

              <div className="empresa-field">
                <label className="empresa-label">Custo em KRN</label>
                <input className="empresa-input" name="custoMoedas" type="number" min="1"
                  value={formVantagem.custoMoedas} onChange={handleVantagemChange}
                  placeholder="Ex.: 150" />
              </div>

              <div className="empresa-field">
                <label className="empresa-label">URL da imagem</label>
                <input className="empresa-input" name="fotoUrl"
                  value={formVantagem.fotoUrl} onChange={handleVantagemChange}
                  placeholder="https://..." />
              </div>

              <div className="empresa-field">
                <label className="empresa-label">Quantidade disponível</label>
                <input className="empresa-input" name="quantidadeDisponivel" type="number" min="0"
                  value={formVantagem.quantidadeDisponivel} onChange={handleVantagemChange}
                  placeholder="Opcional" />
              </div>

              <div className="empresa-field full">
                <label className="empresa-label">Descrição</label>
                <textarea className="empresa-textarea" name="descricao"
                  value={formVantagem.descricao} onChange={handleVantagemChange}
                  placeholder="Descreva como o aluno poderá usar essa vantagem." />
              </div>

              <div className="empresa-checkbox-row">
                <input type="checkbox" name="ativa" id="chk-ativa"
                  checked={formVantagem.ativa} onChange={handleVantagemChange} />
                <label className="empresa-label" htmlFor="chk-ativa">Vantagem ativa</label>
              </div>
            </div>

            <div className="empresa-form-actions">
              <button className="empresa-btn" type="submit">
                {editandoVantagemId ? "Salvar alterações" : "Cadastrar vantagem"}
              </button>
              <button className="empresa-btn-outline" type="button" onClick={limparForm}>
                Limpar
              </button>
            </div>
          </form>
        </section>

        {/* Lista vantagens */}
        <section className="empresa-card" id="lista-vantagens">
          <div className="empresa-card-head">
            <div>
              <h3 className="empresa-card-title">Vantagens cadastradas</h3>
              <p className="empresa-card-desc">Visualize, edite ou remova vantagens.</p>
            </div>
          </div>

          {vantagens.length === 0 ? (
            <div className="empty-state">Nenhuma vantagem cadastrada. Crie a primeira pelo formulário acima.</div>
          ) : (
            <div className="vantagens-grid">
              {vantagens.map((v) => (
                <article className="vantagem-card" key={v.id}>
                  {v.fotoUrl
                    ? <img className="vantagem-img" src={v.fotoUrl} alt={v.titulo} />
                    : <div className="vantagem-img" />
                  }
                  <div className="vantagem-body">
                    <h4 className="vantagem-title">{v.titulo}</h4>
                    <p className="vantagem-desc">{v.descricao}</p>
                    <div className="vantagem-meta">
                      <span className="vtag">{v.custoMoedas} KRN</span>
                      <span className="vtag">Qtd: {v.quantidadeDisponivel ?? "Ilimitada"}</span>
                      <span className={`vtag ${v.ativa ? "on" : "off"}`}>{v.ativa ? "Ativa" : "Inativa"}</span>
                    </div>
                    <div className="vantagem-actions">
                      <button className="empresa-btn-muted" onClick={() => editarVantagem(v)}>Editar</button>
                      <button className="empresa-btn-danger" onClick={() => excluirVantagem(v.id)}>Excluir</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Histórico */}
        <section className="empresa-card" id="historico">
          <div className="empresa-card-head">
            <div>
              <h3 className="empresa-card-title">Histórico de resgates</h3>
              <p className="empresa-card-desc">Resgates realizados pelos alunos aparecerão aqui.</p>
            </div>
          </div>
          <div className="empty-state">
            Nenhum resgate registrado. Quando o módulo de resgate for integrado, os registros aparecerão aqui.
          </div>
        </section>

        {/* Perfil */}
        <section className="empresa-card" id="perfil">
          <div className="empresa-card-head">
            <div>
              <h3 className="empresa-card-title">Perfil da empresa</h3>
              <p className="empresa-card-desc">Visualize e edite os dados cadastrados.</p>
            </div>
            <button className="empresa-btn-outline" onClick={() => setEditandoPerfil((v) => !v)}>
              {editandoPerfil ? "Cancelar" : "Editar perfil"}
            </button>
          </div>

          {!editandoPerfil ? (
            <div className="empresa-info-grid">
              {[
                ["Responsável", empresa?.nome],
                ["Nome fantasia", empresa?.nomeFantasia],
                ["Email", empresa?.email],
                ["CNPJ", empresa?.cnpj],
                ["CPF", empresa?.cpf],
                ["Cidade / Estado", `${empresa?.endereco?.cidade || "—"} / ${empresa?.endereco?.estado || "—"}`],
                ["Endereço", `${empresa?.endereco?.logradouro || "—"}, ${empresa?.endereco?.numero || "—"}`],
                ["CEP", empresa?.endereco?.cep],
              ].map(([label, val]) => (
                <div className="empresa-info-item" key={label}>
                  <label>{label}</label>
                  <span>{val || "—"}</span>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={salvarPerfil}>
              <div className="empresa-form-grid">
                {[
                  ["Nome responsável", "nome"],
                  ["Nome fantasia", "nomeFantasia"],
                  ["Email", "email"],
                  ["CPF", "cpf"],
                  ["CNPJ", "cnpj"],
                ].map(([label, campo]) => (
                  <div className="empresa-field" key={campo}>
                    <label className="empresa-label">{label}</label>
                    <input className="empresa-input" name={campo}
                      value={formPerfil[campo] || ""} onChange={handlePerfilChange} />
                  </div>
                ))}

                {[
                  ["Logradouro", "logradouro"],
                  ["Número", "numero"],
                  ["Complemento", "complemento"],
                  ["Bairro", "bairro"],
                  ["Cidade", "cidade"],
                  ["Estado", "estado"],
                  ["CEP", "cep"],
                  ["País", "pais"],
                ].map(([label, campo]) => (
                  <div className="empresa-field" key={campo}>
                    <label className="empresa-label">{label}</label>
                    <input className="empresa-input" name={campo}
                      value={formPerfil.endereco?.[campo] || ""} onChange={handleEnderecoChange} />
                  </div>
                ))}
              </div>

              <div className="empresa-form-actions">
                <button className="empresa-btn" type="submit">Salvar perfil</button>
                <button className="empresa-btn-outline" type="button" onClick={() => setEditandoPerfil(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </section>

      </main>
    </>
  );
}