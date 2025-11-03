import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/formatters';
import EmptyState from '../Common/EmptyState';

const ReportsList = ({ reports, loading, constructionId }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedReport(null);
  };

  const getDeviationColor = (score) => {
    if (score === null || score === undefined) return 'default';
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const getDeviationLabel = (score) => {
    if (score === null || score === undefined) return 'N/A';
    if (score >= 90) return 'Excelente';
    if (score >= 70) return 'Bom';
    if (score >= 50) return 'Aceitável';
    return 'Crítico';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <EmptyState
        icon={AssessmentIcon}
        title="Nenhum relatório gerado"
        description="Clique em 'Gerar Novo Relatório' para criar o primeiro relatório de análise desta obra"
      />
    );
  }

  return (
    <Box>
      <List sx={{ bgcolor: 'background.paper' }}>
        {reports.map((report, index) => (
          <React.Fragment key={report.id}>
            <ListItem
              sx={{
                py: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Avatar sx={{ bgcolor: getDeviationColor(report.deviation_score) + '.main', mr: 2 }}>
                <AssessmentIcon />
              </Avatar>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Relatório #{report.id.substring(0, 8)}
                    </Typography>
                    <Chip
                      label={getDeviationLabel(report.deviation_score)}
                      color={getDeviationColor(report.deviation_score)}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Box mt={0.5}>
                    <Typography variant="body2" color="text.secondary" component="span">
                      Gerado em {formatDateTime(report.created_at)}
                    </Typography>
                    {report.deviation_score !== null && (
                      <Typography variant="body2" component="span" sx={{ ml: 2 }}>
                        Score: <strong>{report.deviation_score.toFixed(1)}/100</strong>
                      </Typography>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => handleViewReport(report)}
                >
                  <VisibilityIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {index < reports.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* Dialog de Visualização */}
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        {selectedReport && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">
                    Relatório de Análise
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Gerado em {formatDateTime(selectedReport.created_at)}
                  </Typography>
                </Box>
                <Chip
                  label={getDeviationLabel(selectedReport.deviation_score)}
                  color={getDeviationColor(selectedReport.deviation_score)}
                />
              </Box>
            </DialogTitle>

            <DialogContent>
              {selectedReport.deviation_score !== null && (
                <Box mb={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Score Médio de Desvio
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color={getDeviationColor(selectedReport.deviation_score) + '.main'}>
                    {selectedReport.deviation_score.toFixed(2)}/100
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Análise Técnica da IA
              </Typography>

              {selectedReport.ai_analysis ? (
                <Box
                  sx={{
                    bgcolor: 'grey.50',
                    p: 2,
                    borderRadius: 1,
                    mt: 1,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    maxHeight: 500,
                    overflowY: 'auto',
                  }}
                >
                  {selectedReport.ai_analysis}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Análise não disponível
                </Typography>
              )}
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

export default ReportsList;

