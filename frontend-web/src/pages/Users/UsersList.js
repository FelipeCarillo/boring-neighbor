import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { usersAPI } from '../../api/users';
import { USER_ROLES } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatters';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorAlert from '../../components/Common/ErrorAlert';

const UsersList = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registro: '',
    password: '',
    role: 'OPERADOR',
  });
  const [formLoading, setFormLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await usersAPI.list();
      setUsers(data);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        registro: user.registro,
        password: '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        registro: '',
        password: '',
        role: 'OPERADOR',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      registro: '',
      password: '',
      role: 'OPERADOR',
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.registro || (!editingUser && !formData.password)) {
      enqueueSnackbar('Preencha todos os campos obrigatórios', { variant: 'warning' });
      return;
    }

    if (formData.registro.length !== 7) {
      enqueueSnackbar('Registro deve ter 7 dígitos', { variant: 'warning' });
      return;
    }

    setFormLoading(true);
    try {
      if (editingUser) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          registro: formData.registro,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await usersAPI.update(editingUser.id, updateData);
        enqueueSnackbar('Usuário atualizado com sucesso!', { variant: 'success' });
      } else {
        await usersAPI.create(formData);
        enqueueSnackbar('Usuário criado com sucesso!', { variant: 'success' });
      }
      handleCloseDialog();
      loadUsers();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao salvar usuário',
        { variant: 'error' }
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await usersAPI.delete(userToDelete.id);
      enqueueSnackbar('Usuário excluído com sucesso!', { variant: 'success' });
      handleCloseDeleteDialog();
      loadUsers();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao excluir usuário',
        { variant: 'error' }
      );
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'SUPERVISOR':
        return 'primary';
      case 'OPERADOR':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'SUPERVISOR':
        return 'Supervisor';
      case 'OPERADOR':
        return 'Operador';
      default:
        return role;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando usuários..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <ErrorAlert error={error} onRetry={loadUsers} />
      </Container>
    );
  }

  return (
    <Box>
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h3" fontWeight="700" gutterBottom sx={{ letterSpacing: '-0.02em' }}>
              Usuários
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={500}>
              Gerencie os usuários do sistema
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ px: 3, py: 1.5 }}
          >
            Novo Usuário
          </Button>
        </Box>

        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Registro</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Função</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Criado em</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ border: 'none' }}>
                      <Box py={8}>
                        <Box
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            bgcolor: 'rgba(0, 0, 0, 0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                        </Box>
                        <Typography variant="h6" color="text.primary" fontWeight={600}>
                          Nenhum usuário cadastrado
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow 
                      key={user.id} 
                      hover
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.02)',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {user.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                          {user.registro}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getRoleLabel(user.role)}
                          color={getRoleColor(user.role)}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(user.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(user)}
                            sx={{
                              bgcolor: 'rgba(4, 85, 191, 0.08)',
                              mr: 1,
                              '&:hover': {
                                bgcolor: 'rgba(4, 85, 191, 0.16)',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDeleteDialog(user)}
                            sx={{
                              bgcolor: 'rgba(238, 49, 36, 0.08)',
                              '&:hover': {
                                bgcolor: 'rgba(238, 49, 36, 0.16)',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>

      {/* Dialog de Criar/Editar */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome Completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              disabled={formLoading}
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
              disabled={formLoading}
            />
            <TextField
              label="Registro"
              value={formData.registro}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').substring(0, 7);
                setFormData({ ...formData, registro: value });
              }}
              fullWidth
              required
              disabled={formLoading}
              placeholder="0000000"
              helperText="Registro de 7 dígitos"
            />
            <TextField
              label={editingUser ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              required={!editingUser}
              disabled={formLoading}
              helperText={editingUser ? 'Preencha apenas se desejar alterar a senha' : 'Mínimo de 6 caracteres'}
            />
            <TextField
              label="Função"
              select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              fullWidth
              required
              disabled={formLoading}
            >
              <MenuItem value="ADMIN">Administrador</MenuItem>
              <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
              <MenuItem value="OPERADOR">Operador</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={formLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={20} /> : null}
          >
            {formLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o usuário <strong>{userToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList;

