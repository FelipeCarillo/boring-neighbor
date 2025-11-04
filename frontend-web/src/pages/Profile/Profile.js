import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Fade,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Lock as LockIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI } from '../../api/users';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // Estado para edição de perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    registro: user?.registro || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Estado para alteração de senha
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Atualizar dados do perfil
  const handleProfileSubmit = async () => {
    if (!profileData.name || !profileData.email) {
      enqueueSnackbar('Preencha todos os campos obrigatórios', { variant: 'warning' });
      return;
    }

    setProfileLoading(true);
    try {
      const updatedUser = await usersAPI.update(user.id, {
        name: profileData.name,
        email: profileData.email,
        registro: profileData.registro,
      });
      
      updateUser(updatedUser);
      enqueueSnackbar('Perfil atualizado com sucesso!', { variant: 'success' });
      setIsEditingProfile(false);
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao atualizar perfil',
        { variant: 'error' }
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Validar senha
  const validatePassword = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'Nova senha é obrigatória';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'A senha deve ter no mínimo 6 caracteres';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Alterar senha
  const handlePasswordSubmit = async () => {
    if (!validatePassword()) return;

    setPasswordLoading(true);
    try {
      await usersAPI.update(user.id, {
        password: passwordData.newPassword,
      });
      
      enqueueSnackbar('Senha alterada com sucesso!', { variant: 'success' });
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao alterar senha',
        { variant: 'error' }
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false);
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      registro: user?.registro || '',
    });
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({});
  };

  const getRoleLabel = (role) => {
    const roles = {
      ADMIN: 'Administrador',
      SUPERVISOR: 'Supervisor',
      OPERADOR: 'Operador',
    };
    return roles[role] || role;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Box>
      {/* Header */}
      <Fade in timeout={400}>
        <Box mb={4}>
          <Typography 
            variant="h3" 
            fontWeight="700"
            gutterBottom
            sx={{ letterSpacing: '-0.02em' }}
          >
            Meu Perfil
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Gerencie suas informações pessoais e configurações
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* Card de Informações do Usuário */}
        <Grid item xs={12} md={4}>
          <Fade in timeout={600}>
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                textAlign: 'center',
                py: 3,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'primary.main',
                      fontSize: '3rem',
                      fontWeight: 700,
                      boxShadow: '0 8px 24px rgba(4, 85, 191, 0.3)',
                    }}
                  >
                    {getInitials(user?.name)}
                  </Avatar>

                  <Box>
                    <Typography variant="h5" fontWeight="700" gutterBottom>
                      {user?.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary.main"
                      fontWeight={600}
                      sx={{
                        px: 2,
                        py: 0.5,
                        bgcolor: 'rgba(4, 85, 191, 0.1)',
                        borderRadius: 2,
                        display: 'inline-block',
                      }}
                    >
                      {getRoleLabel(user?.role)}
                    </Typography>
                  </Box>

                  <Divider sx={{ width: '100%', my: 1 }} />

                  <Box sx={{ width: '100%', textAlign: 'left' }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <BadgeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                        {user?.registro}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Cards de Edição */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Card de Edição de Perfil */}
            <Grid item xs={12}>
              <Fade in timeout={700}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight="700" gutterBottom>
                          Informações Pessoais
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Atualize seus dados pessoais
                        </Typography>
                      </Box>
                      {!isEditingProfile && (
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => setIsEditingProfile(true)}
                        >
                          Editar
                        </Button>
                      )}
                    </Box>

                    {isEditingProfile ? (
                      <Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Nome Completo"
                              value={profileData.name}
                              onChange={(e) =>
                                setProfileData({ ...profileData, name: e.target.value })
                              }
                              disabled={profileLoading}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PersonIcon fontSize="small" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) =>
                                setProfileData({ ...profileData, email: e.target.value })
                              }
                              disabled={profileLoading}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EmailIcon fontSize="small" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Registro"
                              value={profileData.registro}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').substring(0, 7);
                                setProfileData({ ...profileData, registro: value });
                              }}
                              disabled={profileLoading}
                              placeholder="0000000"
                              helperText="Registro de 7 dígitos"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <BadgeIcon fontSize="small" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>

                        <Box display="flex" gap={2} mt={3}>
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleProfileSubmit}
                            disabled={profileLoading}
                            fullWidth
                          >
                            {profileLoading ? 'Salvando...' : 'Salvar Alterações'}
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            onClick={handleCancelProfileEdit}
                            disabled={profileLoading}
                            fullWidth
                          >
                            Cancelar
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Nome
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {user?.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Email
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {user?.email}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Registro
                          </Typography>
                          <Typography variant="body1" fontWeight={500} fontFamily="monospace">
                            {user?.registro}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Função
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {getRoleLabel(user?.role)}
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Fade>
            </Grid>

            {/* Card de Alteração de Senha */}
            <Grid item xs={12}>
              <Fade in timeout={800}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight="700" gutterBottom>
                          Segurança
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Altere sua senha
                        </Typography>
                      </Box>
                      {!isChangingPassword && (
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<LockIcon />}
                          onClick={() => setIsChangingPassword(true)}
                        >
                          Alterar Senha
                        </Button>
                      )}
                    </Box>

                    {isChangingPassword ? (
                      <Box>
                        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                          Sua nova senha deve ter no mínimo 6 caracteres
                        </Alert>

                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Senha Atual"
                              type={showPasswords.current ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  currentPassword: e.target.value,
                                })
                              }
                              error={!!passwordErrors.currentPassword}
                              helperText={passwordErrors.currentPassword}
                              disabled={passwordLoading}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon fontSize="small" />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() =>
                                        setShowPasswords({
                                          ...showPasswords,
                                          current: !showPasswords.current,
                                        })
                                      }
                                      edge="end"
                                      size="small"
                                    >
                                      {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Nova Senha"
                              type={showPasswords.new ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  newPassword: e.target.value,
                                })
                              }
                              error={!!passwordErrors.newPassword}
                              helperText={passwordErrors.newPassword}
                              disabled={passwordLoading}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon fontSize="small" />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() =>
                                        setShowPasswords({
                                          ...showPasswords,
                                          new: !showPasswords.new,
                                        })
                                      }
                                      edge="end"
                                      size="small"
                                    >
                                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Confirmar Nova Senha"
                              type={showPasswords.confirm ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  confirmPassword: e.target.value,
                                })
                              }
                              error={!!passwordErrors.confirmPassword}
                              helperText={passwordErrors.confirmPassword}
                              disabled={passwordLoading}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon fontSize="small" />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() =>
                                        setShowPasswords({
                                          ...showPasswords,
                                          confirm: !showPasswords.confirm,
                                        })
                                      }
                                      edge="end"
                                      size="small"
                                    >
                                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>

                        <Box display="flex" gap={2} mt={3}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handlePasswordSubmit}
                            disabled={passwordLoading}
                            fullWidth
                          >
                            {passwordLoading ? 'Alterando...' : 'Alterar Senha'}
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            onClick={handleCancelPasswordChange}
                            disabled={passwordLoading}
                            fullWidth
                          >
                            Cancelar
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box textAlign="center" py={2}>
                        <LockIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Sua senha está protegida. Clique em "Alterar Senha" para modificá-la.
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;

