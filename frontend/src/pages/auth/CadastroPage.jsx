import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import CadastroCard from "../../components/CadastroCard";
import { alunoService } from "../../services/alunoService";
import { toast } from "../shared/Toast";

const pageStyles = `
  .cadastro-page {
    position: relative;
    width: 100%;
    min-height: 100vh;
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
    padding: 90px 180px 60px;
    box-sizing: border-box;
  }

  @media (max-width: 1024px) {
    .cadastro-content {
      justify-content: center;
      padding: 90px 30px 60px;
    }
  }

  @media (max-width: 768px) {
    .cadastro-content { padding: 90px 20px 40px; }
  }
`;

export default function CadastroPage() {
  const navigate = useNavigate();

  async function handleCadastro(tipo, dados) {
    try {
      if (tipo === "aluno") {
        await alunoService.cadastrar(dados);
        toast.success("Cadastro realizado! Faça login para continuar.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Não foi possível concluir o cadastro.",
      );
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
