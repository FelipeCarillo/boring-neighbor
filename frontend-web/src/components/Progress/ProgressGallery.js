import React, { useState, useMemo } from 'react';
import {
  Grid,
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  CompareArrows as CompareArrowsIcon,
  Image as ImageIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import EmptyState from '../Common/EmptyState';
import { formatDateTime, formatDeviationScore, getDeviationColor, getDeviationLabel } from '../../utils/formatters';

const ProgressGallery = ({ progressList, onRegisterProgress, bimReferences = [] }) => {
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [viewMode, setViewMode] = useState('single');
  const [selectedBimFilter, setSelectedBimFilter] = useState('all');

  const groupedByBim = useMemo(() => {
    const groups = {};
    
    progressList.forEach(progress => {
      const bimId = progress.bim_reference_id || 'unknown';
      if (!groups[bimId]) {
        groups[bimId] = {
          bim: progress.bim_reference || null,
          bimId: bimId,
          entries: []
        };
      }
      groups[bimId].entries.push(progress);
    });
    
    Object.values(groups).forEach(group => {
      group.entries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });
    
    return groups;
  }, [progressList]);

  const filteredProgress = useMemo(() => {
    if (selectedBimFilter === 'all') {
      return progressList;
    }
    return progressList.filter(p => p.bim_reference_id === selectedBimFilter);
  }, [progressList, selectedBimFilter]);

  const handleView = (progress) => {
    setSelectedProgress(progress);
    setViewMode('single');
  };

  const handleClose = () => {
    setSelectedProgress(null);
  };

  const hasComparison = selectedProgress?.bim_reference;

  const getBimLabel = (bim, bimId) => {
    if (!bim) return `BIM #${bimId?.substring(0, 8)}`;
    const bimIndex = bimReferences.findIndex(ref => ref.id === bimId);
    return `BIM #${bimIndex >= 0 ? bimIndex + 1 : bimId?.substring(0, 8)}`;
  };

  if (!progressList || progressList.length === 0) {
    return (
      <EmptyState
        title="Nenhum progresso registrado"
        description="Comece registrando o primeiro progresso desta obra"
        action={onRegisterProgress}
        actionLabel="Registrar Progresso"
      />
    );
  }

  return (
    <Box>
      <Box mb={3}>
        <FormControl fullWidth>
          <InputLabel>Filtrar por Imagem BIM</InputLabel>
          <Select
            value={selectedBimFilter}
            onChange={(e) => setSelectedBimFilter(e.target.value)}
            label="Filtrar por Imagem BIM"
          >
            <MenuItem value="all">
              <Box display="flex" alignItems="center" gap={1}>
                <ImageIcon fontSize="small" />
                <Typography>Todas as BIMs ({progressList.length} registros)</Typography>
              </Box>
            </MenuItem>
            {Object.values(groupedByBim).map(group => (
              <MenuItem key={group.bimId} value={group.bimId}>
                <Box display="flex" alignItems="center" gap={2}>
                  {group.bim && (
                    <Avatar 
                      src={group.bim.presigned_url} 
                      variant="rounded"
                      sx={{ width: 40, height: 40 }}
                    />
                  )}
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {getBimLabel(group.bim, group.bimId)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {group.entries.length} registro{group.entries.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedBimFilter === 'all' ? (
        <Box>
          {Object.values(groupedByBim).map(group => (
            <Accordion key={group.bimId} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={2} flex={1}>
                  {group.bim && (
                    <Avatar 
                      src={group.bim.presigned_url} 
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  )}
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="bold">
                      {getBimLabel(group.bim, group.bimId)}
                    </Typography>
                    {group.bim?.description && (
                      <Typography variant="body2" color="text.secondary">
                        {group.bim.description}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {group.entries.length} registro{group.entries.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    {group.entries[0]?.deviation_score !== null && (
                      <Chip
                        label={`Melhor: ${formatDeviationScore(Math.max(...group.entries.map(e => e.deviation_score || 0)))}`}
                        color={getDeviationColor(Math.max(...group.entries.map(e => e.deviation_score || 0)))}
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {group.entries.map((progress, index) => (
                    <React.Fragment key={progress.id}>
                      <ListItem
                        sx={{
                          py: 2,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                          borderRadius: 1,
                        }}
                        onClick={() => handleView(progress)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            variant="rounded"
                            src={progress.presigned_url}
                            sx={{ width: 80, height: 80, mr: 2 }}
                          >
                            <ImageIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {formatDateTime(progress.created_at)}
                              </Typography>
                              {progress.deviation_score !== null && (
                                <Chip
                                  label={formatDeviationScore(progress.deviation_score)}
                                  color={getDeviationColor(progress.deviation_score)}
                                  size="small"
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box mt={0.5}>
                              {progress.notes && (
                                <Typography variant="body2" color="text.secondary" component="div">
                                  {progress.notes}
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary" component="div" mt={0.5}>
                                {getDeviationLabel(progress.deviation_score)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < group.entries.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Paper elevation={0} variant="outlined">
          <List>
            {filteredProgress.map((progress, index) => (
              <React.Fragment key={progress.id}>
                <ListItem
                  sx={{
                    py: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => handleView(progress)}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={progress.presigned_url}
                      sx={{ width: 80, height: 80, mr: 2 }}
                    >
                      <ImageIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {formatDateTime(progress.created_at)}
                        </Typography>
                        {progress.deviation_score !== null && (
                          <Chip
                            label={formatDeviationScore(progress.deviation_score)}
                            color={getDeviationColor(progress.deviation_score)}
                            size="small"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box mt={0.5}>
                        {progress.notes && (
                          <Typography variant="body2" color="text.secondary" component="div">
                            {progress.notes}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" component="div" mt={0.5}>
                          {getDeviationLabel(progress.deviation_score)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < filteredProgress.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedProgress}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        {selectedProgress && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">Detalhes do Progresso</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(selectedProgress.created_at || selectedProgress.uploaded_at)}
                  </Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  {hasComparison && (
                    <Button
                      size="small"
                      startIcon={<CompareArrowsIcon />}
                      onClick={() => setViewMode(viewMode === 'single' ? 'comparison' : 'single')}
                    >
                      {viewMode === 'single' ? 'Ver Comparação' : 'Ver Foto'}
                    </Button>
                  )}
                  <IconButton onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent>
              {/* Deviation Score */}
              {hasComparison && (
                <Box mb={3}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Typography variant="body2" fontWeight="bold">
                      Índice de Conformidade:
                    </Typography>
                    <Chip
                      label={formatDeviationScore(selectedProgress.deviation_score)}
                      color={getDeviationColor(selectedProgress.deviation_score)}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {getDeviationLabel(selectedProgress.deviation_score)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Baseado na comparação SSIM com a imagem BIM de referência
                  </Typography>
                </Box>
              )}

              {/* Images */}
              {viewMode === 'single' ? (
                <Box
                  component="img"
                  src={selectedProgress.presigned_url || selectedProgress.photo_url}
                  alt="Progresso"
                  sx={{
                    width: '100%',
                    maxHeight: 600,
                    objectFit: 'contain',
                    borderRadius: 1,
                  }}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Foto do Progresso
                    </Typography>
                    <Box
                      component="img"
                      src={selectedProgress.presigned_url || selectedProgress.photo_url}
                      alt="Progresso"
                      sx={{
                        width: '100%',
                        maxHeight: 400,
                        objectFit: 'contain',
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'divider',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Referência BIM
                    </Typography>
                    <Box
                      component="img"
                      src={selectedProgress.bim_reference?.presigned_url}
                      alt="Referência BIM"
                      sx={{
                        width: '100%',
                        maxHeight: 400,
                        objectFit: 'contain',
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'divider',
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Notes */}
              {selectedProgress.notes && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Observações
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedProgress.notes}
                    </Typography>
                  </Box>
                </>
              )}

              {/* Metadata */}
              <Divider sx={{ my: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Registrado por
                  </Typography>
                  <Typography variant="body2">
                    {selectedProgress.uploaded_by_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Data e hora
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(selectedProgress.uploaded_at)}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Fechar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ProgressGallery;

