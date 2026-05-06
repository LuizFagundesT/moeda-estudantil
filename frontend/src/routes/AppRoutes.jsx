import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../Layout/MainLayout";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import CadastroPage from "../pages/CadastroPage";
import AlunoDashboard from "../pages/AlunoDashboard";
import EmpresaDashboard from "../pages/EmpresaDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Públicas */}
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroPage />} />

        {/* Protegidas — Aluno */}
        <Route path="/aluno/dashboard" element={
          <ProtectedRoute tipoPermitido="ALUNO">
            <AlunoDashboard />
          </ProtectedRoute>
        } />

        {/* Protegidas — Empresa Parceira */}
        <Route path="/empresa/dashboard" element={
          <ProtectedRoute tipoPermitido="EMPRESA_PARCEIRA">
            <EmpresaDashboard />
          </ProtectedRoute>
        } />

        {/* TODO: Professor */}
      </Route>
    </Routes>
  );
}