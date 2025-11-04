import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Grid,
  Box,
  Fab,
  TextField,
  InputAdornment,
  Fade,
  Card,
} from '@mui/material';
import { 
  Add as AddIcon,
  Search as SearchIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { constructionsAPI } from '../../api/constructions';
import { useAuth } from '../../contexts/AuthContext';
import ConstructionCard from '../../components/Constructions/ConstructionCard';
import ConstructionForm from '../../components/Constructions/ConstructionForm';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import ErrorAlert from '../../components/Common/ErrorAlert';

const ConstructionsList = () => {
  const [constructions, setConstructions] = useState([]);
  const [filteredConstructions, setFilteredConstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedConstruction, setSelectedConstruction] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isSupervisor } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadConstructions();
  }, []);

  useEffect(() => {
    // Filter constructions based on search term
    if (searchTerm.trim() === '') {
      setFilteredConstructions(constructions);
    } else {
      const filtered = constructions.filter((construction) =>
        construction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        construction.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        construction.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredConstructions(filtered);
    }
  }, [searchTerm, constructions]);

  const loadConstructions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await constructionsAPI.list();
      setConstructions(data);
      setFilteredConstructions(data);
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
    <Box>
      {/* Header */}
      <Fade in timeout={400}>
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} gap={2} flexWrap="wrap">
            <Box>
              <Typography 
                variant="h3" 
                fontWeight="700"
                gutterBottom
                sx={{ letterSpacing: '-0.02em' }}
              >
                Obras
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={500}>
                Gerencie todas as obras do Metrô SP
              </Typography>
            </Box>

            {isSupervisor() && (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => handleOpenForm()}
                sx={{ 
                  display: { xs: 'none', sm: 'flex' },
                  px: 3,
                  py: 1.5,
                }}
              >
                Nova Obra
              </Button>
            )}
          </Box>

          {/* Search Bar */}
          {constructions.length > 0 && (
            <TextField
              fullWidth
              placeholder="Buscar obras por nome, local ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: 600,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                },
              }}
            />
          )}
        </Box>
      </Fade>

      {error && (
        <Box mb={3}>
          <ErrorAlert error={error} onRetry={loadConstructions} />
        </Box>
      )}

      {!error && constructions.length === 0 && (
        <Card sx={{ borderRadius: 3 }}>
          <EmptyState
            icon={ConstructionIcon}
            title="Nenhuma obra cadastrada"
            description="Comece criando sua primeira obra para acompanhar o progresso"
            action={isSupervisor() ? () => handleOpenForm() : null}
            actionLabel="Nova Obra"
          />
        </Card>
      )}

      {!error && constructions.length > 0 && (
        <>
          {filteredConstructions.length > 0 ? (
            <Grid container spacing={3}>
              {filteredConstructions.map((construction, index) => (
                <Grid item xs={12} sm={6} lg={4} key={construction.id}>
                  <Fade in timeout={400} style={{ transitionDelay: `${index * 50}ms` }}>
                    <Box>
                      <ConstructionCard
                        construction={construction}
                        onEdit={isSupervisor() ? handleOpenForm : null}
                      />
                    </Box>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ borderRadius: 3 }}>
              <EmptyState
                icon={SearchIcon}
                title="Nenhuma obra encontrada"
                description={`Nenhuma obra corresponde à busca "${searchTerm}"`}
              />
            </Card>
          )}
        </>
      )}

      {/* FAB for mobile */}
      {isSupervisor() && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: { xs: 'flex', sm: 'none' },
            boxShadow: '0 8px 24px rgba(4, 85, 191, 0.4)',
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
    </Box>
  );
};

export default ConstructionsList;

