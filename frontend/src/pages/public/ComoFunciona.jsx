import { Link } from "react-router-dom";

export default function ComoFunciona() {

    const styles = `
    .como-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
      padding: 60px 40px;
      font-family: 'Play', sans-serif;
      color: #26215C;
    }

    .hero {
      text-align: center;
      margin-bottom: 70px;
    }

    .hero h1 {
      font-size: 54px;
      margin-bottom: 20px;
      font-weight: 700;
    }

    .hero p {
      font-size: 20px;
      color: #6b6bb3;
      max-width: 700px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .section-title {
      text-align: center;
      font-size: 34px;
      margin-bottom: 40px;
      color: #534AB7;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin-bottom: 80px;
    }

    .step-card {
      background: rgba(255,255,255,.55);
      backdrop-filter: blur(16px);
      border-radius: 24px;
      padding: 35px;
      box-shadow: 0 10px 24px rgba(83,74,183,.08);
      border: 1px solid rgba(255,255,255,.4);
      transition: .3s ease;
    }

    .step-card:hover {
      transform: translateY(-6px);
    }

    .step-icon {
      font-size: 42px;
      margin-bottom: 18px;
    }

    .step-card h3 {
      margin-bottom: 12px;
      font-size: 22px;
      color: #534AB7;
    }

    .step-card p {
      color: #6666a3;
      line-height: 1.6;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 80px;
    }

    .benefit-card {
      background: linear-gradient(135deg, #534AB7, #7F77DD);
      color: white;
      padding: 28px;
      border-radius: 22px;
      box-shadow: 0 10px 24px rgba(83,74,183,.18);
    }

    .benefit-card h3 {
      margin-bottom: 12px;
      font-size: 20px;
    }

    .faq {
      max-width: 900px;
      margin: 0 auto 80px;
    }

    .faq-item {
      background: rgba(255,255,255,.55);
      backdrop-filter: blur(16px);
      border-radius: 18px;
      padding: 24px;
      margin-bottom: 16px;
      box-shadow: 0 8px 20px rgba(83,74,183,.08);
    }

    .faq-item h4 {
      margin-bottom: 10px;
      color: #534AB7;
    }

    .faq-item p {
      color: #6666a3;
      line-height: 1.5;
    }

    .cta {
      text-align: center;
      background: linear-gradient(135deg, #534AB7, #7F77DD);
      color: white;
      padding: 60px 30px;
      border-radius: 30px;
      box-shadow: 0 12px 30px rgba(83,74,183,.20);
    }

    .cta h2 {
      font-size: 38px;
      margin-bottom: 20px;
    }

    .cta p {
      font-size: 18px;
      margin-bottom: 30px;
      opacity: .95;
    }

    .cta-btn {
      background: white;
      color: #534AB7;
      padding: 14px 28px;
      border-radius: 14px;
      text-decoration: none;
      font-weight: bold;
      display: inline-block;
      transition: .3s;
    }

    .cta-btn:hover {
      transform: scale(1.05);
    }

    @media (max-width: 768px) {

      .como-page {
        padding: 40px 20px;
      }

      .hero h1 {
        font-size: 40px;
      }

      .section-title {
        font-size: 28px;
      }

      .cta h2 {
        font-size: 30px;
      }
    }
  `;

    const usuarioLogado = localStorage.getItem("usuarioLogado");

    return (
        <>
            <style>{styles}</style>

            <div className="como-page">

                {/* HERO */}
                <section className="hero">
                    <h1>Como funciona o KRN?</h1>

                    <p>
                        O KRN é uma plataforma de reconhecimento acadêmico onde
                        professores podem recompensar alunos com moedas digitais
                        por participação, dedicação e desempenho.
                    </p>
                </section>

                {/* PASSOS */}
                <section>
                    <h2 className="section-title">Como o sistema funciona</h2>

                    <div className="steps-grid">

                        <div className="step-card">
                            <div className="step-icon">👨‍🏫</div>

                            <h3>Professores enviam moedas</h3>

                            <p>
                                Professores recebem moedas KRN a cada semestre e podem
                                distribuí-las aos alunos como forma de reconhecimento
                                acadêmico.
                            </p>
                        </div>

                        <div className="step-card">
                            <div className="step-icon">🎓</div>

                            <h3>Alunos acumulam KRNs</h3>

                            <p>
                                Os alunos acompanham seu saldo, histórico de movimentações
                                e utilizam as moedas recebidas ao longo do semestre.
                            </p>
                        </div>

                        <div className="step-card">
                            <div className="step-icon">🎁</div>

                            <h3>Troca por vantagens</h3>

                            <p>
                                As moedas podem ser trocadas por descontos, produtos
                                e benefícios oferecidos por empresas parceiras.
                            </p>
                        </div>

                    </div>
                </section>

                {/* BENEFÍCIOS */}
                <section>
                    <h2 className="section-title">Benefícios da plataforma</h2>

                    <div className="benefits-grid">

                        <div className="benefit-card">
                            <h3>🚀 Engajamento</h3>
                            <p>
                                Incentiva participação e desempenho acadêmico.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <h3>🏆 Reconhecimento</h3>
                            <p>
                                Valoriza alunos que se destacam durante o semestre.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <h3>🤝 Parcerias reais</h3>
                            <p>
                                Empresas oferecem vantagens exclusivas aos estudantes.
                            </p>
                        </div>

                        <div className="benefit-card">
                            <h3>💡 Experiência gamificada</h3>
                            <p>
                                O sistema transforma reconhecimento em motivação.
                            </p>
                        </div>

                    </div>
                </section>

                {/* FAQ */}
                <section className="faq">

                    <h2 className="section-title">Perguntas frequentes</h2>

                    <div className="faq-item">
                        <h4>As moedas expiram?</h4>
                        <p>
                            Não imediatamente. O saldo pode acumular durante os semestres.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h4>Como recebo moedas?</h4>
                        <p>
                            Professores podem enviar KRNs como reconhecimento por
                            participação, desempenho ou colaboração.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h4>Como faço o resgate?</h4>
                        <p>
                            Basta acessar a área de vantagens e selecionar o benefício
                            desejado.
                        </p>
                    </div>

                </section>

                {!usuarioLogado && (
                    <section className="cta">

                        <h2>Comece agora sua jornada no KRN</h2>

                        <p>
                            Ganhe reconhecimento acadêmico e troque suas moedas por
                            benefícios exclusivos.
                        </p>

                        <Link to="/login" className="cta-btn">
                            Entrar
                        </Link>

                    </section>
                )}
            </div>
        </>
    );
}