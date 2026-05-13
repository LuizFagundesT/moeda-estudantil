import { useEffect, useState } from "react";
import { vantagemService } from "../../services/vantagemService";

export default function Vantagens() {

    const [vantagens, setVantagens] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarVantagens();
    }, []);

    async function carregarVantagens() {
        try {

            const response = await vantagemService.listarAtivas();

            setVantagens(response.data);

        } catch (error) {
            console.error("Erro ao carregar vantagens", error);
        } finally {
            setLoading(false);
        }
    }

    const styles = `
    .vantagens-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
      padding: 40px;
      font-family: 'Play', sans-serif;
      color: #26215C;
    }

    .hero {
      text-align: center;
      margin-bottom: 50px;
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
    }

    .empresa {
      font-size: 14px;
      margin-bottom: 14px;
      color: #8a86c9;
    }

    .footer-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    .resgatar-btn:hover {
      transform: scale(1.05);
    }

    .empty {
      text-align: center;
      padding: 80px;
      color: #777;
      font-size: 20px;
    }

    .loading {
      text-align: center;
      padding: 80px;
      color: #534AB7;
      font-size: 22px;
    }

    @media (max-width: 768px) {

      .vantagens-page {
        padding: 20px;
      }

      .hero h1 {
        font-size: 36px;
      }

    }
  `;

    if (loading) {
        return (
            <>
                <style>{styles}</style>

                <div className="loading">
                    Carregando vantagens...
                </div>
            </>
        );
    }

    return (
        <>
            <style>{styles}</style>

            <div className="vantagens-page">

                <section className="hero">

                    <h1>Vantagens disponíveis</h1>

                    <p>
                        Troque seus KRNs por benefícios exclusivos oferecidos
                        pelas empresas parceiras.
                    </p>

                </section>

                {vantagens.length === 0 ? (

                    <div className="empty">
                        Nenhuma vantagem disponível no momento.
                    </div>

                ) : (

                    <div className="vantagens-grid">

                        {vantagens.map((vantagem) => (

                            <div className="vantagem-card" key={vantagem.id}>

                                <img
                                    src={
                                        vantagem.fotoUrl ||
                                        "https://placehold.co/600x400?text=KRN"
                                    }
                                    alt={vantagem.titulo}
                                    className="vantagem-img"
                                />

                                <div className="vantagem-content">

                                    <div className="vantagem-titulo">
                                        {vantagem.titulo}
                                    </div>

                                    <div className="vantagem-descricao">
                                        {vantagem.descricao}
                                    </div>

                                    <div className="empresa">
                                        Parceiro: {vantagem.empresaNomeFantasia}
                                    </div>

                                    <div className="footer-card">

                                        <div className="custo">
                                            💰 {vantagem.custoMoedas} KRNs
                                        </div>

                                        <button className="resgatar-btn">
                                            Resgatar
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>
        </>
    );
}