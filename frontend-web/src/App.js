import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import metroTheme from './theme/metroTheme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ConstructionsList from './pages/Constructions/ConstructionsList';
import ConstructionView from './pages/Constructions/ConstructionView';
import ProgressView from './pages/Progress/ProgressView';
import UsersList from './pages/Users/UsersList';

function App() {
  return (
    <ThemeProvider theme={metroTheme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Constructions Routes */}
              <Route
                path="/constructions"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ConstructionsList />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/constructions/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ConstructionView />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Progress Routes */}
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ProgressView />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* BIM/IFC Routes - Placeholder */}
              <Route
                path="/bim"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <div>BIM/IFC - Em desenvolvimento</div>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Reports Routes - Placeholder */}
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <div>Relatórios - Em desenvolvimento</div>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Users Routes (ADMIN/SUPERVISOR only) */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute requireRole={['ADMIN', 'SUPERVISOR']}>
                    <MainLayout>
                      <UsersList />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Profile Route - Placeholder */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <div>Perfil - Em desenvolvimento</div>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
