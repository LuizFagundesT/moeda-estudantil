import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../Layout/MainLayout";
import LandingPage from "../pages/public/LandingPage";
import Login from "../pages/auth/Login";
import CadastroPage from "../pages/auth/CadastroPage";
import AlunoDashboard from "../pages/aluno/AlunoDashboard";
import EmpresaDashboard from "../pages/empresa/EmpresaDashboard";
import ComoFunciona from "../pages/public/ComoFunciona";
import Vantagens from "../pages/aluno/Vantagens";
import Parceiros from "../pages/aluno/Parceiros";
import ProfessorDashboard from "../pages/professor/ProfessorDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Públicas */}
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />

        {/* Protegidas — Aluno */}
        <Route path="/aluno/dashboard" element={
          <ProtectedRoute tipoPermitido="ALUNO">
            <AlunoDashboard />
          </ProtectedRoute>
        } />

        <Route path="/vantagens" element={
          <ProtectedRoute tipoPermitido="ALUNO">
            <Vantagens />
          </ProtectedRoute>
        }
        />

        <Route path="/parceiros" element={
          <ProtectedRoute tipoPermitido="ALUNO">
            <Parceiros />
          </ProtectedRoute>
        }
        />

        {/* Protegidas — Empresa Parceira */}
        <Route path="/empresa/dashboard" element={
          <ProtectedRoute tipoPermitido="EMPRESA_PARCEIRA">
            <EmpresaDashboard />
          </ProtectedRoute>
        } />

        <Route path="/professor/dashboard" element={
          <ProtectedRoute tipoPermitido="PROFESSOR">
            <ProfessorDashboard />
          </ProtectedRoute>
        } />

        {/* TODO: Professor */}
      </Route>
    </Routes>
  );
}