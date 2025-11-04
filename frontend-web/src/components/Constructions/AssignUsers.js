import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  TextField,
  Box,
  Typography,
  Chip,
  Avatar,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { usersAPI } from '../../api/users';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

const AssignUsers = ({ open, onClose, construction, onAssign }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      loadUsers();
      if (construction?.assigned_users) {
        setSelectedUsers(construction.assigned_users.map(u => u.id));
      }
    }
  }, [open, construction]);

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

  const handleToggle = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    onAssign(selectedUsers);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Atribuir Usuários
        <Typography variant="body2" color="text.secondary">
          Selecione os usuários que terão acesso a esta obra
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Buscar usuário..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ mb: 2 }}
        />

        {loading && <LoadingSpinner message="Carregando usuários..." />}
        {error && <ErrorAlert error={error} onRetry={loadUsers} />}

        {!loading && !error && (
          <>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              {selectedUsers.length} selecionado(s)
            </Typography>

            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {filteredUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.id);
                const isAlreadyAssigned = construction?.assigned_users?.some(u => u.id === user.id);

                return (
                  <ListItem
                    key={user.id}
                    dense
                    button
                    onClick={() => handleToggle(user.id)}
                    sx={{
                      border: 1,
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      mb: 0.5,
                      bgcolor: isSelected ? 'primary.50' : 'background.paper',
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={isSelected}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>

                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          {user.name}
                          {isAlreadyAssigned && (
                            <Chip label="Atribuído" size="small" color="success" />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          {user.email}
                          <Chip label={user.role} size="small" sx={{ ml: 1 }} />
                        </>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          disabled={loading || selectedUsers.length === 0}
        >
          Atribuir {selectedUsers.length > 0 && `(${selectedUsers.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignUsers;

