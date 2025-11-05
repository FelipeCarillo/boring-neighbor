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
  Fade,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LoginOutlined as LoginIcon,
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0455BF 0%, #00903E 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={600}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              {/* Logo/Header */}
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  mb: 4,
                  animation: 'fadeInUp 0.6s ease-out',
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2.5,
                    borderRadius: 3,
                    background: 'white',
                    mb: 2.5,
                    boxShadow: '0 8px 24px rgba(4, 85, 191, 0.3)',
                  }}
                >
                  <Box
                    component="img"
                    src={`${process.env.PUBLIC_URL}/metro-logo.png`}
                    alt="Metro SP"
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'contain',
                    }}
                  />
                </Box>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom 
                  fontWeight="700"
                  sx={{
                    background: 'linear-gradient(135deg, #0455BF 0%, #00903E 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Metro SP
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                  Sistema de Gestão de Obras
                </Typography>
              </Box>

              {/* Error Alert */}
              {error && (
                <Fade in>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-message': {
                        width: '100%',
                      },
                    }}
                  >
                    {error}
                  </Alert>
                </Fade>
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
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          tabIndex={-1}
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
                  startIcon={!loading && <LoginIcon />}
                  sx={{ 
                    mt: 4, 
                    mb: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #0455BF 0%, #00903E 100%)',
                    boxShadow: '0 4px 14px rgba(4, 85, 191, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #023E8A 0%, #00632B 100%)',
                      boxShadow: '0 6px 20px rgba(4, 85, 191, 0.5)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </Box>

              {/* Footer */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  © 2024 Metrô de São Paulo
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;

