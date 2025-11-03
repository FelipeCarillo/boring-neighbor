import React, { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  ViewInAr as ViewInArIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateRegistro, validateRequired } from '../utils/validators';

const Login = () => {
  const [registro, setRegistro] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!validateRequired(registro)) {
      setError('Registro é obrigatório');
      return;
    }

    if (!validateRegistro(registro)) {
      setError('Registro deve ter 7 dígitos');
      return;
    }

    if (!validateRequired(password)) {
      setError('Senha é obrigatória');
      return;
    }

    setLoading(true);

    try {
      const result = await login(registro, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistroChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 7);
    setRegistro(value);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Card>
          <CardContent sx={{ p: 4 }}>
            {/* Logo/Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <ViewInArIcon
                sx={{
                  fontSize: 60,
                  color: 'primary.main',
                  mb: 2,
                }}
              />
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Metro SP
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sistema de Gestão de Obras
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Registro"
                value={registro}
                onChange={handleRegistroChange}
                placeholder="0000000"
                helperText="Seu registro de 7 dígitos"
                margin="normal"
                autoFocus
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                © 2024 Metrô de São Paulo
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;

