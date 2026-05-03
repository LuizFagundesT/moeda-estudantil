import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import LoginCard from "../components/LoginCard";
import { alunoService } from "../services/alunoService";

const pageStyles = `
  .login-page {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
  }

  .login-spline {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .login-spline canvas {
    width: 100% !important;
    height: 100% !important;
  }

  .login-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 180px;
  }

  @media (max-width: 1024px) {
    .login-content {
      justify-content: center;
      padding: 30px;
    }
  }

  @media (max-width: 768px) {
    .login-page {
      height: auto;
      min-height: 100vh;
    }
    .login-content {
      padding: 20px;
    }
  }
`;

export default function Login() {
  const navigate = useNavigate();

  async function handleLogin(form) {
    try {
      const { data } = await alunoService.login({
        email: form.email,
        senha: form.senha,
      });

      // Salva token + dados do usuário no localStorage
      localStorage.setItem("usuarioLogado", JSON.stringify(data));

      // Redireciona pelo tipo de usuário
      if (data.tipo === "ALUNO") {
        navigate("/aluno/dashboard");
      } else if (data.tipo === "PROFESSOR") {
        navigate("/professor/dashboard");
      } else if (data.tipo === "EMPRESA_PARCEIRA") {
        navigate("/empresa/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Email ou senha inválidos.");
    }
  }

  return (
    <>
      <style>{pageStyles}</style>

      <main className="login-page">
        <div className="login-spline">
          <Spline scene="https://prod.spline.design/7lUdd58BSxMkb31m/scene.splinecode" />
        </div>

        <div className="login-content">
          <LoginCard onSubmit={handleLogin} />
        </div>
      </main>
    </>
  );
}