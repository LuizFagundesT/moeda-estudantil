import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import CadastroCard from "../components/CadastroCard";
import { alunoService } from "../services/alunoService";

const pageStyles = `
  .cadastro-page {
    position: relative;
    width: 100%;
    background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
  }

  .cadastro-spline {
    position: fixed;
    inset: 0;
    z-index: 1;
  }

  .cadastro-spline canvas {
    width: 100% !important;
    height: 100% !important;
  }

  .cadastro-content {
    position: relative;
    z-index: 2;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 20px 180px 60px 180px;
  }

  @media (max-width: 1024px) {
    .cadastro-content {
      justify-content: center;
      padding: 20px 30px 60px 30px;
    }
  }

  @media (max-width: 768px) {
    .cadastro-content {
      padding: 20px 20px 60px 20px;
    }
  }
`;

export default function CadastroPage() {
  const navigate = useNavigate();

  async function handleCadastro(tipo, dados) {
    try {
      if (tipo === "aluno") {
        await alunoService.cadastrar(dados);
        alert("Cadastro realizado! Faça login para continuar.");
        navigate("/login");
      }
      // empresa: implementar depois
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao cadastrar. Tente novamente.");
    }
  }

  return (
    <>
      <style>{pageStyles}</style>

      <main className="cadastro-page">
        <div className="cadastro-spline">
          <Spline scene="https://prod.spline.design/7lUdd58BSxMkb31m/scene.splinecode" />
        </div>

        <div className="cadastro-content">
          <CadastroCard onSubmit={handleCadastro} />
        </div>
      </main>
    </>
  );
}