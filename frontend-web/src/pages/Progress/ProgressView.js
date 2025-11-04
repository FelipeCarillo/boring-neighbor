import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  Fab,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { progressAPI } from '../../api/progress';
import { constructionsAPI } from '../../api/constructions';
import { useAuth } from '../../contexts/AuthContext';
import ProgressForm from '../../components/Progress/ProgressForm';
import ProgressGallery from '../../components/Progress/ProgressGallery';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorAlert from '../../components/Common/ErrorAlert';

const ProgressView = () => {
  const [constructions, setConstructions] = useState([]);
  const [selectedConstruction, setSelectedConstruction] = useState(null);
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadConstructions();
  }, []);

  useEffect(() => {
    if (selectedConstruction) {
      loadProgress(selectedConstruction.id);
    }
  }, [selectedConstruction]);

  const loadConstructions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await constructionsAPI.list();
      setConstructions(data);
      if (data.length > 0) {
        setSelectedConstruction(data[0]);
      }
    } catch (err) {
      setError('Erro ao carregar obras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async (constructionId) => {
    try {
      const data = await progressAPI.listByConstruction(constructionId);
      setProgressList(data);
    } catch (err) {
      console.error('Erro ao carregar progresso:', err);
      enqueueSnackbar('Erro ao carregar progresso', { variant: 'error' });
    }
  };

  const handleSubmit = async (formData, setUploadProgress) => {
    if (!selectedConstruction) return;

    setFormLoading(true);
    try {
      formData.append('construction_id', selectedConstruction.id);
      
      // Simulate upload progress (adjust based on actual API)
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await progressAPI.register(formData);
      
      clearInterval(interval);
      setUploadProgress(100);

      enqueueSnackbar('Progresso registrado com sucesso!', { variant: 'success' });
      setFormOpen(false);
      loadProgress(selectedConstruction.id);
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.detail || 'Erro ao registrar progresso',
        { variant: 'error' }
      );
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando obras..." />;
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <ErrorAlert error={error} onRetry={loadConstructions} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <div>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Progresso das Obras
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visualize e registre o progresso das obras
          </Typography>
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          disabled={!selectedConstruction}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Registrar Progresso
        </Button>
      </Box>

      {/* Construction Selector */}
      {constructions.length > 0 && (
        <Box mb={4}>
          <TextField
            select
            label="Selecione a Obra"
            value={selectedConstruction?.id || ''}
            onChange={(e) => {
              const construction = constructions.find(c => c.id === e.target.value);
              setSelectedConstruction(construction);
            }}
            sx={{ minWidth: 300 }}
          >
            {constructions.map((construction) => (
              <MenuItem key={construction.id} value={construction.id}>
                {construction.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      {/* Progress Gallery */}
      {selectedConstruction && (
        <ProgressGallery
          progressList={progressList}
          onRegisterProgress={() => setFormOpen(true)}
        />
      )}

      {/* FAB for mobile */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' },
        }}
        onClick={() => setFormOpen(true)}
        disabled={!selectedConstruction}
      >
        <AddIcon />
      </Fab>

      {/* Progress Form */}
      {selectedConstruction && (
        <ProgressForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
          construction={selectedConstruction}
          loading={formLoading}
        />
      )}
    </Container>
  );
};

export default ProgressView;

