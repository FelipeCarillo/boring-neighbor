import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Páginas de autenticação
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Verify from './pages/Verify';

// Páginas principais
import Dashboard from './pages/Dashboard';
import ObrasList from './pages/ObrasList';
import ObraView from './pages/ObraView';
import Historico from './pages/Historico';
import Configuracoes from './pages/Configuracoes';
import NovaObra from './pages/NovaObra';
import GerenciarAnalistas from './pages/GerenciarAnalistas';
import Relatorios from './pages/Relatorios';
import EditarObra from './pages/EditarObra';
import AnalistaView from './pages/AnalistaView';
import EditarAnalista from './pages/EditarAnalista';
import PermissoesAnalista from './pages/PermissoesAnalista';
import HistoricoDetalhes from './pages/HistoricoDetalhes';
import HistoricoRelatorio from './pages/HistoricoRelatorio';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify" element={<Verify />} />
            
            {/* Rota raiz - redirecionar para dashboard se autenticado, senão para login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rotas protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/obras"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ObrasList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/obras/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ObraView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/editar-obra/:id"
              element={
                <ProtectedRoute requiredRole="ADMMaster">
                  <Layout>
                    <EditarObra />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/historico"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Historico />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/historico-detalhes/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HistoricoDetalhes />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/historico-relatorio/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HistoricoRelatorio />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/configuracoes"
              element={
                <ProtectedRoute requiredRole="ADMMaster">
                  <Layout>
                    <Configuracoes />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/nova-obra"
              element={
                <ProtectedRoute requiredRole="ADMMaster">
                  <Layout>
                    <NovaObra />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/gerenciar-analistas"
              element={
                <ProtectedRoute requiredRole="ADMMaster">
                  <Layout>
                    <GerenciarAnalistas />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/relatorios"
              element={
                <ProtectedRoute requiredRole="ADMMaster">
                  <Layout>
                    <Relatorios />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/analista/:id"
              element={
                <ProtectedRoute requiredRole="ADMMaster">
                  <Layout>
                    <AnalistaView />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/editar-analista/:id"
              element={
                <ProtectedRoute requiredRole="ADMMaster">
                  <Layout>
                    <EditarAnalista />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/permissoes-analista/:id"
              element={
                <ProtectedRoute requiredRole="ADMMaster">
                  <Layout>
                    <PermissoesAnalista />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            {/* Rota 404 - redirecionar para dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
