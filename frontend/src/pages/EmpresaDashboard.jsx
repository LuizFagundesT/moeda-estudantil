import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { empresaService } from "../services/empresaService";
import { vantagemService } from "../services/vantagemService";

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
    padding: 40px;
    font-family: 'Play', sans-serif;
    color: #26215C;
  }

  .empresa-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 28px;
  }

  .empresa-title {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
  }

  .empresa-subtitle {
    color: rgba(83,74,183,.65);
    font-size: 13px;
    margin: 8px 0 0;
  }

  .empresa-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .empresa-pill {
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    border-radius: 16px;
    padding: 14px 22px;
    font-size: 14px;
    font-weight: 700;
    box-shadow: 0 10px 24px rgba(83,74,183,.18);
  }

  .empresa-btn,
  .empresa-btn-outline,
  .empresa-btn-danger,
  .empresa-btn-muted {
    border: none;
    cursor: pointer;
    padding: 11px 18px;
    border-radius: 12px;
    font-family: 'Play', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .8px;
    transition: all .2s;
  }

  .empresa-btn {
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
  }

  .empresa-btn-outline {
    background: transparent;
    color: #534AB7;
    border: 1px solid rgba(83,74,183,0.3);
  }

  .empresa-btn-danger {
    background: rgba(220, 53, 69, .10);
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

  .empresa-nav {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 10px;
    margin-bottom: 22px;
  }

  .empresa-nav button {
    flex: 0 0 auto;
    border: 1px solid rgba(83,74,183,.18);
    background: rgba(255,255,255,.35);
    color: rgba(38,33,92,.72);
    padding: 12px 18px;
    border-radius: 999px;
    cursor: pointer;
    font-family: 'Play', sans-serif;
    font-weight: 700;
  }

  .empresa-nav button.active {
    background: linear-gradient(135deg, #534AB7, #7F77DD);
    color: #fff;
    box-shadow: 0 10px 22px rgba(83,74,183,.18);
  }

  .empresa-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 22px;
  }

  .empresa-stat,
  .empresa-card {
    background: rgba(220,232,248,0.55);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.45);
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(83,74,183,0.10);
  }

  .empresa-stat {
    padding: 20px;
  }

  .empresa-stat label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,0.58);
    margin-bottom: 10px;
  }

  .empresa-stat strong {
    font-size: 28px;
    color: #26215C;
  }

  .empresa-card {
    padding: 26px;
    margin-bottom: 22px;
  }

  .empresa-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }

  .empresa-card h3 {
    color: #534AB7;
    margin: 0;
    font-size: 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .empresa-card p.helper {
    margin: 6px 0 0;
    color: rgba(83,74,183,.62);
    font-size: 13px;
  }

  .empresa-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(220px, 1fr));
    gap: 14px;
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
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,0.65);
  }

  .empresa-input,
  .empresa-textarea,
  .empresa-select {
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(83,74,183,0.2);
    background: rgba(255,255,255,.55);
    font-family: 'Play', sans-serif;
    font-size: 13px;
    color: #26215C;
    outline: none;
    transition: border .2s, box-shadow .2s;
  }

  .empresa-input:focus,
  .empresa-textarea:focus,
  .empresa-select:focus {
    border-color: #534AB7;
    box-shadow: 0 0 0 4px rgba(83,74,183,.08);
  }

  .empresa-textarea {
    min-height: 96px;
    resize: vertical;
  }

  .empresa-form-actions {
    display: flex;
    gap: 10px;
    margin-top: 18px;
    flex-wrap: wrap;
  }

  .vantagens-carousel {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(280px, 340px);
    gap: 16px;
    overflow-x: auto;
    padding: 4px 4px 12px;
    scroll-snap-type: x mandatory;
  }

  .vantagem-card {
    scroll-snap-align: start;
    background: rgba(255,255,255,.46);
    border: 1px solid rgba(255,255,255,.6);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(83,74,183,.09);
  }

  .vantagem-img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    background: linear-gradient(135deg, rgba(83,74,183,.18), rgba(127,119,221,.10));
  }

  .vantagem-body {
    padding: 16px;
  }

  .vantagem-title {
    font-size: 17px;
    margin: 0 0 8px;
    color: #26215C;
  }

  .vantagem-desc {
    font-size: 13px;
    color: rgba(38,33,92,.72);
    line-height: 1.45;
    min-height: 56px;
  }

  .vantagem-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin: 14px 0;
  }

  .tag {
    border-radius: 999px;
    padding: 7px 10px;
    background: rgba(83,74,183,.10);
    color: #534AB7;
    font-size: 12px;
    font-weight: 700;
  }

  .tag.off {
    background: rgba(220, 53, 69, .10);
    color: #b42336;
  }

  .vantagem-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .empresa-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 12px;
  }

  .empresa-info-item label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(60,52,137,0.6);
    margin-bottom: 4px;
  }

  .empresa-info-item span {
    font-size: 14px;
    color: #26215C;
  }

  .empty-state {
    border: 1px dashed rgba(83,74,183,.28);
    background: rgba(255,255,255,.28);
    border-radius: 18px;
    padding: 26px;
    color: rgba(38,33,92,.68);
    text-align: center;
  }

  .message {
    margin-bottom: 16px;
    padding: 12px 14px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
  }

  .message.success {
    background: rgba(34, 197, 94, .12);
    color: #167341;
  }

  .message.error {
    background: rgba(220, 53, 69, .10);
    color: #b42336;
  }

  @media (max-width: 980px) {
    .empresa-page { padding: 24px; }
    .empresa-header { align-items: flex-start; flex-direction: column; }
    .empresa-grid { grid-template-columns: repeat(2, 1fr); }
    .empresa-form-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 620px) {
    .empresa-page { padding: 18px; }
    .empresa-grid { grid-template-columns: 1fr; }
    .vantagens-carousel { grid-auto-columns: minmax(250px, 88vw); }
  }
`;

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
  const [mensagem, setMensagem] = useState(null);

  const totalAtivas = useMemo(
    () => vantagens.filter((vantagem) => vantagem.ativa).length,
    [vantagens]
  );

  const custoMedio = useMemo(() => {
    if (!vantagens.length) return 0;
    const soma = vantagens.reduce((acc, item) => acc + Number(item.custoMoedas || 0), 0);
    return Math.round(soma / vantagens.length);
  }, [vantagens]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      const { data } = await empresaService.listar();
      const minhaEmpresa = data.find((item) => item.email === usuarioLogado?.email);

      if (!minhaEmpresa) {
        setMensagem({ tipo: "error", texto: "Empresa logada não encontrada." });
        return;
      }

      setEmpresa(minhaEmpresa);
      prepararFormPerfil(minhaEmpresa);

      const vantagensResponse = await vantagemService.listarPorEmpresa(minhaEmpresa.id);
      setVantagens(vantagensResponse.data);
    } catch (error) {
      console.error(error);
      setMensagem({ tipo: "error", texto: "Erro ao carregar dados da empresa." });
    } finally {
      setLoading(false);
    }
  }

  function prepararFormPerfil(dadosEmpresa) {
    setFormPerfil({
      nome: dadosEmpresa.nome || "",
      email: dadosEmpresa.email || "",
      cpf: dadosEmpresa.cpf || "",
      cnpj: dadosEmpresa.cnpj || "",
      nomeFantasia: dadosEmpresa.nomeFantasia || "",
      endereco: {
        logradouro: dadosEmpresa.endereco?.logradouro || "",
        numero: dadosEmpresa.endereco?.numero || "",
        complemento: dadosEmpresa.endereco?.complemento || "",
        bairro: dadosEmpresa.endereco?.bairro || "",
        cidade: dadosEmpresa.endereco?.cidade || "",
        estado: dadosEmpresa.endereco?.estado || "",
        cep: dadosEmpresa.endereco?.cep || "",
        pais: dadosEmpresa.endereco?.pais || "",
      },
    });
  }

  function mostrarMensagem(tipo, texto) {
    setMensagem({ tipo, texto });
    window.setTimeout(() => setMensagem(null), 3500);
  }

  function handleSair() {
    localStorage.removeItem("usuarioLogado");
    navigate("/login");
  }

  function handleVantagemChange(e) {
    const { name, value, type, checked } = e.target;
    setFormVantagem((formAtual) => ({
      ...formAtual,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function montarPayloadVantagem() {
    return {
      titulo: formVantagem.titulo.trim(),
      descricao: formVantagem.descricao.trim(),
      custoMoedas: Number(formVantagem.custoMoedas),
      fotoUrl: formVantagem.fotoUrl.trim(),
      quantidadeDisponivel: formVantagem.quantidadeDisponivel === ""
        ? null
        : Number(formVantagem.quantidadeDisponivel),
      ativa: Boolean(formVantagem.ativa),
    };
  }

  function validarVantagem() {
    if (!formVantagem.titulo.trim()) return "Informe o título da vantagem.";
    if (!formVantagem.descricao.trim()) return "Informe a descrição da vantagem.";
    if (!formVantagem.custoMoedas || Number(formVantagem.custoMoedas) <= 0) {
      return "Informe um custo em moedas maior que zero.";
    }
    return null;
  }

  async function salvarVantagem(e) {
    e.preventDefault();

    const erro = validarVantagem();
    if (erro) {
      mostrarMensagem("error", erro);
      return;
    }

    try {
      const payload = montarPayloadVantagem();

      if (editandoVantagemId) {
        const { data } = await vantagemService.atualizar(editandoVantagemId, payload);
        setVantagens((lista) => lista.map((item) => item.id === data.id ? data : item));
        mostrarMensagem("success", "Vantagem atualizada com sucesso!");
      } else {
        const { data } = await vantagemService.criar(empresa.id, payload);
        setVantagens((lista) => [data, ...lista]);
        mostrarMensagem("success", "Vantagem criada com sucesso!");
      }

      limparFormularioVantagem();
    } catch (error) {
      console.error(error);
      mostrarMensagem("error", error.response?.data?.message || "Erro ao salvar vantagem.");
    }
  }

  function editarVantagem(vantagem) {
    setEditandoVantagemId(vantagem.id);
    setFormVantagem({
      titulo: vantagem.titulo || "",
      descricao: vantagem.descricao || "",
      custoMoedas: vantagem.custoMoedas || "",
      fotoUrl: vantagem.fotoUrl || "",
      quantidadeDisponivel: vantagem.quantidadeDisponivel ?? "",
      ativa: vantagem.ativa ?? true,
    });
    document.getElementById("form-vantagem")?.scrollIntoView({ behavior: "smooth" });
  }

  async function excluirVantagem(id) {
    const confirmou = window.confirm("Deseja excluir esta vantagem?");
    if (!confirmou) return;

    try {
      await vantagemService.deletar(id);
      setVantagens((lista) => lista.filter((item) => item.id !== id));
      mostrarMensagem("success", "Vantagem excluída com sucesso!");
    } catch (error) {
      console.error(error);
      mostrarMensagem("error", "Erro ao excluir vantagem.");
    }
  }

  function limparFormularioVantagem() {
    setFormVantagem(emptyVantagem);
    setEditandoVantagemId(null);
  }

  function handlePerfilChange(e) {
    const { name, value } = e.target;
    setFormPerfil((formAtual) => ({ ...formAtual, [name]: value }));
  }

  function handleEnderecoChange(e) {
    const { name, value } = e.target;
    setFormPerfil((formAtual) => ({
      ...formAtual,
      endereco: {
        ...formAtual.endereco,
        [name]: value,
      },
    }));
  }

  async function salvarPerfil(e) {
    e.preventDefault();

    try {
      const { data } = await empresaService.atualizar(empresa.id, formPerfil);
      setEmpresa(data);
      prepararFormPerfil(data);
      setEditandoPerfil(false);

      const usuarioAtualizado = {
        ...usuarioLogado,
        nome: data.nome,
        email: data.email,
      };
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
      window.dispatchEvent(new Event("usuarioLogado"));

      mostrarMensagem("success", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      mostrarMensagem("error", "Erro ao atualizar perfil.");
    }
  }

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="empresa-page">Carregando painel da empresa...</div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <main className="empresa-page">
        <header className="empresa-header" id="topo">
          <div>
            <h1 className="empresa-title">Olá, {empresa?.nomeFantasia || empresa?.nome}! 🏢</h1>
            <p className="empresa-subtitle">
              Gerencie as vantagens, acompanhe resgates e mantenha os dados da empresa atualizados.
            </p>
          </div>

          <div className="empresa-actions">
            <div className="empresa-pill">{vantagens.length} vantagens cadastradas</div>
            <button className="empresa-btn-outline" onClick={handleSair}>Sair</button>
          </div>
        </header>

        <nav className="empresa-nav" aria-label="Navegação da empresa parceira">
          <button className="active" onClick={() => document.getElementById("topo")?.scrollIntoView({ behavior: "smooth" })}>Dashboard</button>
          <button onClick={() => document.getElementById("form-vantagem")?.scrollIntoView({ behavior: "smooth" })}>Criar vantagem</button>
          <button onClick={() => document.getElementById("lista-vantagens")?.scrollIntoView({ behavior: "smooth" })}>Listar vantagens</button>
          <button onClick={() => document.getElementById("historico")?.scrollIntoView({ behavior: "smooth" })}>Histórico de resgates</button>
          <button onClick={() => document.getElementById("perfil")?.scrollIntoView({ behavior: "smooth" })}>Perfil</button>
        </nav>

        {mensagem && (
          <div className={`message ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <section className="empresa-grid">
          <div className="empresa-stat">
            <label>Total de vantagens</label>
            <strong>{vantagens.length}</strong>
          </div>
          <div className="empresa-stat">
            <label>Vantagens ativas</label>
            <strong>{totalAtivas}</strong>
          </div>
          <div className="empresa-stat">
            <label>Custo médio</label>
            <strong>{custoMedio} 🪙</strong>
          </div>
          <div className="empresa-stat">
            <label>Resgates</label>
            <strong>0</strong>
          </div>
        </section>

        <section className="empresa-card" id="form-vantagem">
          <div className="empresa-card-head">
            <div>
              <h3>{editandoVantagemId ? "Editar vantagem" : "Criar vantagem"}</h3>
              <p className="helper">Cadastre benefícios que os alunos poderão trocar por moedas.</p>
            </div>
            {editandoVantagemId && (
              <button className="empresa-btn-muted" onClick={limparFormularioVantagem}>Cancelar edição</button>
            )}
          </div>

          <form onSubmit={salvarVantagem}>
            <div className="empresa-form-grid">
              <div className="empresa-field">
                <label className="empresa-label">Título</label>
                <input
                  className="empresa-input"
                  name="titulo"
                  value={formVantagem.titulo}
                  onChange={handleVantagemChange}
                  placeholder="Ex.: 20% de desconto no almoço"
                />
              </div>

              <div className="empresa-field">
                <label className="empresa-label">Custo em moedas</label>
                <input
                  className="empresa-input"
                  name="custoMoedas"
                  type="number"
                  min="1"
                  value={formVantagem.custoMoedas}
                  onChange={handleVantagemChange}
                  placeholder="Ex.: 150"
                />
              </div>

              <div className="empresa-field">
                <label className="empresa-label">URL da imagem</label>
                <input
                  className="empresa-input"
                  name="fotoUrl"
                  value={formVantagem.fotoUrl}
                  onChange={handleVantagemChange}
                  placeholder="https://..."
                />
              </div>

              <div className="empresa-field">
                <label className="empresa-label">Quantidade disponível</label>
                <input
                  className="empresa-input"
                  name="quantidadeDisponivel"
                  type="number"
                  min="0"
                  value={formVantagem.quantidadeDisponivel}
                  onChange={handleVantagemChange}
                  placeholder="Opcional"
                />
              </div>

              <div className="empresa-field full">
                <label className="empresa-label">Descrição</label>
                <textarea
                  className="empresa-textarea"
                  name="descricao"
                  value={formVantagem.descricao}
                  onChange={handleVantagemChange}
                  placeholder="Descreva como o aluno poderá usar essa vantagem."
                />
              </div>

              <label className="empresa-field full" style={{ flexDirection: "row", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="ativa"
                  checked={formVantagem.ativa}
                  onChange={handleVantagemChange}
                />
                <span className="empresa-label">Vantagem ativa</span>
              </label>
            </div>

            <div className="empresa-form-actions">
              <button className="empresa-btn" type="submit">
                {editandoVantagemId ? "Salvar alterações" : "Cadastrar vantagem"}
              </button>
              <button className="empresa-btn-outline" type="button" onClick={limparFormularioVantagem}>
                Limpar
              </button>
            </div>
          </form>
        </section>

        <section className="empresa-card" id="lista-vantagens">
          <div className="empresa-card-head">
            <div>
              <h3>Listar vantagens</h3>
              <p className="helper">Use o carrossel para visualizar, editar ou excluir vantagens cadastradas.</p>
            </div>
          </div>

          {vantagens.length === 0 ? (
            <div className="empty-state">
              Nenhuma vantagem cadastrada ainda. Crie a primeira vantagem pelo formulário acima.
            </div>
          ) : (
            <div className="vantagens-carousel">
              {vantagens.map((vantagem) => (
                <article className="vantagem-card" key={vantagem.id}>
                  {vantagem.fotoUrl ? (
                    <img className="vantagem-img" src={vantagem.fotoUrl} alt={vantagem.titulo} />
                  ) : (
                    <div className="vantagem-img" />
                  )}

                  <div className="vantagem-body">
                    <h4 className="vantagem-title">{vantagem.titulo}</h4>
                    <p className="vantagem-desc">{vantagem.descricao}</p>

                    <div className="vantagem-meta">
                      <span className="tag">🪙 {vantagem.custoMoedas} moedas</span>
                      <span className="tag">Qtd: {vantagem.quantidadeDisponivel ?? "Ilimitada"}</span>
                      <span className={`tag ${vantagem.ativa ? "" : "off"}`}>
                        {vantagem.ativa ? "Ativa" : "Inativa"}
                      </span>
                    </div>

                    <div className="vantagem-actions">
                      <button className="empresa-btn-muted" onClick={() => editarVantagem(vantagem)}>Editar</button>
                      <button className="empresa-btn-danger" onClick={() => excluirVantagem(vantagem.id)}>Excluir</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="empresa-card" id="historico">
          <div className="empresa-card-head">
            <div>
              <h3>Histórico de resgates</h3>
              <p className="helper">Área preparada para integração com os resgates dos alunos.</p>
            </div>
          </div>

          <div className="empty-state">
            Ainda não há resgates registrados para esta empresa. Quando o módulo de resgate do aluno for integrado,
            os códigos de conferência aparecerão aqui.
          </div>
        </section>

        <section className="empresa-card" id="perfil">
          <div className="empresa-card-head">
            <div>
              <h3>Perfil da empresa</h3>
              <p className="helper">Visualize e edite os dados cadastrados da empresa parceira.</p>
            </div>
            <button className="empresa-btn-outline" onClick={() => setEditandoPerfil((valor) => !valor)}>
              {editandoPerfil ? "Cancelar" : "Editar perfil"}
            </button>
          </div>

          {!editandoPerfil ? (
            <div className="empresa-info-grid">
              <div className="empresa-info-item"><label>Nome responsável</label><span>{empresa?.nome || "-"}</span></div>
              <div className="empresa-info-item"><label>Nome fantasia</label><span>{empresa?.nomeFantasia || "-"}</span></div>
              <div className="empresa-info-item"><label>Email</label><span>{empresa?.email || "-"}</span></div>
              <div className="empresa-info-item"><label>CNPJ</label><span>{empresa?.cnpj || "-"}</span></div>
              <div className="empresa-info-item"><label>CPF</label><span>{empresa?.cpf || "-"}</span></div>
              <div className="empresa-info-item"><label>Cidade / Estado</label><span>{empresa?.endereco?.cidade || "-"} - {empresa?.endereco?.estado || "-"}</span></div>
              <div className="empresa-info-item"><label>Endereço</label><span>{empresa?.endereco?.logradouro || "-"}, {empresa?.endereco?.numero || "-"}</span></div>
              <div className="empresa-info-item"><label>CEP</label><span>{empresa?.endereco?.cep || "-"}</span></div>
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
                    <input
                      className="empresa-input"
                      name={campo}
                      value={formPerfil[campo] || ""}
                      onChange={handlePerfilChange}
                    />
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
                    <input
                      className="empresa-input"
                      name={campo}
                      value={formPerfil.endereco?.[campo] || ""}
                      onChange={handleEnderecoChange}
                    />
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
