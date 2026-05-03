import Spline from "@splinetool/react-spline";
import CadastroCard from "../components/CadastroCard"; // ajuste o caminho se necessário

const pageStyles = `
  .cadastro-page {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
  }

  /* spline no fundo */
  .cadastro-spline {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .cadastro-spline canvas {
    width: 100% !important;
    height: 100% !important;
  }

  /* conteúdo acima */
  .cadastro-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 350px 180px;
  }

  @media (max-width: 1024px) {
    .cadastro-content {
      justify-content: center;
      padding: 30px;
    }
  }

  @media (max-width: 768px) {
    .cadastro-page {
      height: auto;
      min-height: 100vh;
    }

    .cadastro-content {
      padding: 20px;
    }
  }
`;

export default function CadastroPage() {
  function handleCadastro(tipo, dados) {
    console.log("Tipo:", tipo);
    console.log("Dados:", dados);
  }

  return (
    <>
      <style>{pageStyles}</style>

      <main className="cadastro-page">
        {/* Fundo 3D */}
        <div className="cadastro-spline">
          <Spline scene="https://prod.spline.design/7lUdd58BSxMkb31m/scene.splinecode" />
        </div>

        {/* Card à direita */}
        <div className="cadastro-content">
          <CadastroCard onSubmit={handleCadastro} />
        </div>
      </main>
    </>
  );
}