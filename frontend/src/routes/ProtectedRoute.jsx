import { Navigate, useLocation } from "react-router-dom";

const DASHBOARD_POR_TIPO = {
  ALUNO: "/aluno/dashboard",
  PROFESSOR: "/professor/dashboard",
  EMPRESA: "/empresa/dashboard",
  EMPRESA_PARCEIRA: "/empresa/dashboard",
};

export default function ProtectedRoute({ children, tipoPermitido }) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const location = useLocation();

  // Não logado → vai para /login e guarda a rota que tentou acessar
  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Tipo errado → redireciona para o dashboard correto
  if (tipoPermitido && usuario.tipo !== tipoPermitido) {
    const destino = DASHBOARD_POR_TIPO[usuario.tipo] ?? "/";
    return <Navigate to={destino} replace />;
  }

  return children;
}