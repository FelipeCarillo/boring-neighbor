import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Fab,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { constructionsAPI } from '../../api/constructions';
import { useAuth } from '../../contexts/AuthContext';
import ConstructionCard from '../../components/Constructions/ConstructionCard';
import ConstructionForm from '../../components/Constructions/ConstructionForm';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import ErrorAlert from '../../components/Common/ErrorAlert';
import ConfirmDialog from '../../components/Common/ConfirmDialog';

const ConstructionsList = () => {
  const [constructions, setConstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedConstruction, setSelectedConstruction] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const { isSupervisor } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadConstructions();
  }, []);

  const loadConstructions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await constructionsAPI.list();
      setConstructions(data);
    } catch (err) {
      setError('Erro ao carregar obras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (construction = null) => {
    setSelectedConstruction(construction);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelectedConstruction(null);
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedConstruction) {
        await constructionsAPI.update(selectedConstruction.id, formData);
        enqueueSnackbar('Obra atualizada com sucesso!', { variant: 'success' });
      } else {
        await constructionsAPI.create(formData);
        enqueueSnackbar('Obra criada com sucesso!', { variant: 'success' });
      }
      handleCloseForm();
      loadConstructions();
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao salvar obra',
        { variant: 'error' }
      );
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando obras..." />;
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <div>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Obras
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie todas as obras do Metrô SP
          </Typography>
        </div>

        {isSupervisor() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenForm()}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Nova Obra
          </Button>
        )}
      </Box>

      {error && <ErrorAlert error={error} onRetry={loadConstructions} />}

      {!error && constructions.length === 0 && (
        <EmptyState
          title="Nenhuma obra cadastrada"
          description="Comece criando sua primeira obra"
          action={isSupervisor() ? () => handleOpenForm() : null}
          actionLabel="Nova Obra"
        />
      )}

      {!error && constructions.length > 0 && (
        <Grid container spacing={3}>
          {constructions.map((construction) => (
            <Grid item xs={12} sm={6} md={4} key={construction.id}>
              <ConstructionCard
                construction={construction}
                onEdit={isSupervisor() ? handleOpenForm : null}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* FAB for mobile */}
      {isSupervisor() && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', sm: 'none' },
          }}
          onClick={() => handleOpenForm()}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Form Dialog */}
      <ConstructionForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        construction={selectedConstruction}
        loading={formLoading}
      />
    </Container>
  );
};

export default ConstructionsList;

