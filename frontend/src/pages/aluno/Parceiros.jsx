import { useEffect, useState } from "react";
import { empresaService } from "../../services/empresaService";

export default function Parceiros() {

    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarEmpresas();
    }, []);

    async function carregarEmpresas() {

        try {

            const response = await empresaService.listar();

            setEmpresas(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    }

    const styles = `
  
    .parceiros-page {
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
      font-size: 52px;
      color: #534AB7;
      margin-bottom: 14px;
    }

    .hero p {
      color: #6b6bb3;
      font-size: 18px;
    }

    .parceiros-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 28px;
    }

    .parceiro-card {
      background: rgba(255,255,255,.55);
      backdrop-filter: blur(16px);
      border-radius: 26px;
      padding: 28px;
      border: 1px solid rgba(255,255,255,.4);
      box-shadow: 0 10px 24px rgba(83,74,183,.08);
      transition: .3s;
    }

    .parceiro-card:hover {
      transform: translateY(-6px);
    }

    .logo {
      width: 74px;
      height: 74px;
      border-radius: 50%;
      background: linear-gradient(135deg, #534AB7, #7F77DD);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .nome {
      font-size: 24px;
      font-weight: bold;
      color: #534AB7;
      margin-bottom: 14px;
    }

    .info {
      color: #6666a3;
      margin-bottom: 10px;
      line-height: 1.5;
    }

    .cidade {
      margin-top: 18px;
      color: #8a86c9;
      font-size: 14px;
    }

    .loading {
      text-align: center;
      padding: 80px;
      font-size: 22px;
      color: #534AB7;
    }

    .empty {
      text-align: center;
      padding: 80px;
      color: #777;
      font-size: 22px;
    }

    @media (max-width: 768px) {

      .parceiros-page {
        padding: 20px;
      }

      .hero h1 {
        font-size: 38px;
      }

    }

  `;

    if (loading) {
        return (
            <>
                <style>{styles}</style>

                <div className="loading">
                    Carregando parceiros...
                </div>
            </>
        );
    }

    return (
        <>
            <style>{styles}</style>

            <div className="parceiros-page">

                <section className="hero">

                    <h1>Empresas parceiras</h1>

                    <p>
                        Conheça as empresas que oferecem benefícios exclusivos
                        para alunos da plataforma KRN.
                    </p>

                </section>

                {empresas.length === 0 ? (

                    <div className="empty">
                        Nenhuma empresa parceira cadastrada.
                    </div>

                ) : (

                    <div className="parceiros-grid">

                        {empresas.map((empresa) => (

                            <div
                                className="parceiro-card"
                                key={empresa.id}
                            >

                                <div className="logo">
                                    {empresa.nomeFantasia?.charAt(0)}
                                </div>

                                <div className="nome">
                                    {empresa.nomeFantasia}
                                </div>

                                <div className="info">
                                    <strong>Email:</strong> {empresa.email}
                                </div>

                                <div className="info">
                                    <strong>CNPJ:</strong> {empresa.cnpj}
                                </div>

                                <div className="cidade">

                                    📍 {empresa.endereco?.cidade} - {empresa.endereco?.estado}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>
        </>
    );
}