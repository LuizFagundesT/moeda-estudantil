import Spline from "@splinetool/react-spline";
import LoginCard from "../components/LoginCard";

const pageStyles = `
  .login-page {
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow: hidden;
    background: linear-gradient(135deg, #eef3ff 0%, #dfe8ff 100%);
  }

  /* Fundo spline */
  .login-spline {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .login-spline canvas {
    width: 100% !important;
    height: 100% !important;
  }

  /* Conteúdo */
  .login-content {
    position: relative;
    z-index: 2;

    width: 100%;
    min-height: 100vh;

    display: flex;
    align-items: center;
    justify-content: flex-end;

    padding: 120px 180px 40px 40px;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    .login-content {
      justify-content: center;
      padding: 100px 40px 40px;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .login-page {
      min-height: 100vh;
    }

    .login-content {
      justify-content: center;
      align-items: center;
      padding: 90px 20px 20px;
    }
  }
`;

export default function Login() {
  function handleLogin(dados) {
    console.log("Login:", dados);
  }

  return (
    <>
      <style>{pageStyles}</style>

      <main className="login-page">
        {/* Fundo 3D */}
        <div className="login-spline">
          <Spline scene="https://prod.spline.design/7lUdd58BSxMkb31m/scene.splinecode" />
        </div>

        {/* Card */}
        <div className="login-content">
          <LoginCard onSubmit={handleLogin} />
        </div>
      </main>
    </>
  );
}