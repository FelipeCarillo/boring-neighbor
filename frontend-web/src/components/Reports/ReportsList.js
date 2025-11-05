import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/formatters';
import EmptyState from '../Common/EmptyState';
import jsPDF from 'jspdf';

const ReportsList = ({ reports, loading, constructionId, constructionName }) => {
  const [downloading, setDownloading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
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

  const getDeviationColorHex = (score) => {
    if (score === null || score === undefined) return '#6B6B6B';
    if (score >= 90) return '#00903E'; // Verde Metro
    if (score >= 70) return '#0455BF'; // Azul Metro
    if (score >= 50) return '#FBD12D'; // Amarelo Metro
    return '#EE3124'; // Vermelho Metro
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const generatePDF = async (report) => {
    setDownloading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Cores do Metrô
      const primaryColor = '#0455BF';
      const secondaryColor = '#EE3124';
      const successColor = '#00903E';
      const warningColor = '#FBD12D';
      const errorColor = '#EE3124';

      // Logo do Metrô no topo do PDF (antes do header)
      let logoDataUrl = null;
      try {
        const logoUrl = `${process.env.PUBLIC_URL}/metro-logo.png`;
        const logoResponse = await fetch(logoUrl);
        if (logoResponse.ok) {
          const logoBlob = await logoResponse.blob();
          logoDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(logoBlob);
          });
        }
      } catch (logoError) {
        console.warn('Erro ao carregar logo:', logoError);
      }

      // Header com gradiente (simulado)
      const headerColor = getDeviationColorHex(report.deviation_score);
      const headerRgb = hexToRgb(headerColor);
      if (headerRgb) {
        doc.setFillColor(headerRgb.r, headerRgb.g, headerRgb.b);
      }
      doc.rect(0, yPosition, pageWidth, 60, 'F');

      // Logo do Metrô do lado esquerdo do header
      const logoWidth = 35;
      const logoHeight = 35;
      const logoX = margin + 5;
      const logoY = yPosition + 12.5; // Centralizado verticalmente no header
      const textStartX = logoX + logoWidth + 10; // Início do texto após a logo

      if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);
      }

      // Título
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Relatório de Análise', textStartX, yPosition + 18);

      // Nome da Obra (se disponível)
      if (constructionName) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(constructionName, textStartX, yPosition + 26);
      }

      // Data
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Gerado em ${formatDateTime(report.created_at)}`, textStartX, yPosition + 34);

      // Status
      const statusLabel = getDeviationLabel(report.deviation_score);
      const statusWidth = doc.getTextWidth(statusLabel) + 10;
      doc.setFillColor(255, 255, 255, 0.3);
      doc.roundedRect(pageWidth - margin - statusWidth, yPosition + 10, statusWidth, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(statusLabel, pageWidth - margin - statusWidth + 5, yPosition + 17);

      // Reset colors
      doc.setTextColor(0, 0, 0);
      yPosition += 75;

      // Score Card
      if (report.deviation_score !== null) {
        const scoreColor = getDeviationColorHex(report.deviation_score);
        const scoreRgb = hexToRgb(scoreColor);
        
        // Background do card (cor clara)
        if (scoreRgb) {
          doc.setFillColor(Math.min(255, scoreRgb.r + 220), Math.min(255, scoreRgb.g + 220), Math.min(255, scoreRgb.b + 220));
        } else {
          doc.setFillColor(245, 245, 245);
        }
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 45, 3, 3, 'F');
        
        // Borda
        if (scoreRgb) {
          doc.setDrawColor(scoreRgb.r, scoreRgb.g, scoreRgb.b);
        }
        doc.setLineWidth(1);
        doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 45, 3, 3, 'S');

        // Label
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Score Médio de Desvio', margin + 5, yPosition + 12);

        // Score
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        if (scoreRgb) {
          doc.setTextColor(scoreRgb.r, scoreRgb.g, scoreRgb.b);
        }
        const scoreText = report.deviation_score.toFixed(2);
        const scoreX = margin + 5;
        doc.text(scoreText, scoreX, yPosition + 28);
        
        // Calcula largura do score com a mesma fonte
        const scoreWidth = doc.getTextWidth(scoreText);
        
        // Símbolo %
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('%', scoreX + scoreWidth + 3, yPosition + 28);

        // Barra de progresso
        const barWidth = pageWidth - 2 * margin - 10;
        const barHeight = 6;
        const barX = margin + 5;
        const barY = yPosition + 33;
        const progressWidth = (barWidth * report.deviation_score) / 100;

        doc.setFillColor(200, 200, 200);
        doc.rect(barX, barY, barWidth, barHeight, 'F');
        
        if (scoreRgb) {
          doc.setFillColor(scoreRgb.r, scoreRgb.g, scoreRgb.b);
        }
        doc.rect(barX, barY, progressWidth, barHeight, 'F');

        yPosition += 55;
      }

      // Análise Técnica da IA
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const primaryRgb = hexToRgb(primaryColor);
      if (primaryRgb) {
        doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      }
      doc.text('Análise Técnica da IA', margin, yPosition);
      yPosition += 10;

      if (report.ai_analysis) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        const lines = report.ai_analysis.split('\n');
        const maxWidth = pageWidth - 2 * margin;
        const lineHeight = 6;

        lines.forEach((line) => {
          // Detecta títulos
          const isTitle = line.match(/^\d+\.\s+[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s]+:/) || 
                         (line.trim().length > 0 && line.trim().match(/^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s]+$/) && line.length < 100);

          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = margin;
          }

          if (isTitle && line.trim()) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            const primaryRgb = hexToRgb(primaryColor);
            if (primaryRgb) {
              doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
            }
            yPosition += 5;
          } else {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
          }

          if (line.trim()) {
            const splitLines = doc.splitTextToSize(line.trim(), maxWidth - 10);
            splitLines.forEach((splitLine) => {
              if (yPosition > pageHeight - 30) {
                doc.addPage();
                yPosition = margin;
              }
              doc.text(splitLine, margin + 5, yPosition);
              yPosition += lineHeight;
            });
          } else {
            yPosition += lineHeight / 2;
          }
        });
      } else {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text('Análise não disponível', margin + 5, yPosition);
      }

      // Nome do arquivo
      const fileName = `Relatorio_Analise_${report.id.substring(0, 8)}_${new Date(report.created_at).toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      setSnackbar({
        open: true,
        message: 'PDF gerado com sucesso!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao gerar PDF. Tente novamente.',
        severity: 'error',
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
                <Box display="flex" gap={1}>
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={() => handleViewReport(report)}
                    title="Visualizar relatório"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={() => generatePDF(report)}
                    disabled={downloading}
                    title="Baixar como PDF"
                  >
                    {downloading ? <CircularProgress size={24} /> : <DownloadIcon />}
                  </IconButton>
                </Box>
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
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        {selectedReport && (
          <>
            <DialogTitle
              sx={{
                background: `linear-gradient(135deg, ${
                  selectedReport.deviation_score >= 70 
                    ? '#0455BF 0%, #4A8CD9 100%' // Azul Metro
                    : selectedReport.deviation_score >= 50
                    ? '#FBD12D 0%, #FFE566 100%' // Amarelo Metro
                    : '#EE3124 0%, #F26659 100%' // Vermelho Metro
                })`,
                color: 'white',
                pb: 3,
                mb: 2, // Espaço entre header e card de score
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  transform: 'translate(30%, -30%)',
                }}
              />
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" position="relative" zIndex={1}>
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <AssessmentIcon sx={{ fontSize: 28 }} />
                    <Typography variant="h5" fontWeight="bold">
                      Relatório de Análise
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <AccessTimeIcon sx={{ fontSize: 16, opacity: 0.9 }} />
                    <Typography variant="body2" sx={{ opacity: 0.95 }}>
                      Gerado em {formatDateTime(selectedReport.created_at)}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={
                    selectedReport.deviation_score >= 70 ? <CheckCircleIcon /> :
                    selectedReport.deviation_score >= 50 ? <WarningIcon /> :
                    <ErrorIcon />
                  }
                  label={getDeviationLabel(selectedReport.deviation_score)}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '& .MuiChip-icon': {
                      color: 'white',
                    }
                  }}
                />
              </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 0 }}>
              {selectedReport.deviation_score !== null && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    mt: 2, // Espaço entre header e card de score
                    background: `linear-gradient(135deg, ${
                      selectedReport.deviation_score >= 70 
                        ? 'rgba(4, 85, 191, 0.08) 0%, rgba(74, 140, 217, 0.12) 100%' // Azul Metro
                        : selectedReport.deviation_score >= 50
                        ? 'rgba(251, 209, 45, 0.12) 0%, rgba(255, 229, 102, 0.16) 100%' // Amarelo Metro
                        : 'rgba(238, 49, 36, 0.08) 0%, rgba(242, 102, 89, 0.12) 100%' // Vermelho Metro
                    })`,
                    borderRadius: 2,
                    border: `2px solid ${
                      selectedReport.deviation_score >= 70 
                        ? '#0455BF' // Azul Metro
                        : selectedReport.deviation_score >= 50
                        ? '#FBD12D' // Amarelo Metro
                        : '#EE3124' // Vermelho Metro
                    }40`,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <TrendingUpIcon 
                      sx={{ 
                        color: getDeviationColor(selectedReport.deviation_score) + '.main',
                        fontSize: 24
                      }} 
                    />
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                      Score Médio de Desvio
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="baseline" gap={1} mb={2}>
                    <Typography 
                      variant="h3" 
                      fontWeight="bold" 
                      sx={{
                        color: getDeviationColor(selectedReport.deviation_score) + '.main',
                        fontSize: { xs: '2rem', sm: '2.5rem' }
                      }}
                    >
                      {selectedReport.deviation_score.toFixed(2)}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      /100
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={selectedReport.deviation_score}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: getDeviationColor(selectedReport.deviation_score) + '.main',
                      }
                    }}
                  />
                </Paper>
              )}

              <Box mt={3}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <PsychologyIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    Análise Técnica da IA
                  </Typography>
                </Box>

                {selectedReport.ai_analysis ? (
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'grey.50',
                      p: 3,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      maxHeight: 500,
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        bgcolor: 'grey.100',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        bgcolor: 'grey.400',
                        borderRadius: '4px',
                        '&:hover': {
                          bgcolor: 'grey.500',
                        },
                      },
                    }}
                  >
                    <Box>
                      {selectedReport.ai_analysis.split('\n').map((line, index) => {
                        // Detecta títulos (linhas numeradas ou em maiúsculas)
                        const isTitle = line.match(/^\d+\.\s+[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s]+:/) || 
                                       (line.trim().length > 0 && line.trim().match(/^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ\s]+$/) && line.length < 100);
                        
                        if (isTitle) {
                          return (
                            <Typography
                              key={index}
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                mt: index > 0 ? 2 : 0,
                                mb: 1,
                                fontSize: '0.875rem',
                                lineHeight: 1.4,
                              }}
                            >
                              {line}
                            </Typography>
                          );
                        }
                        return (
                          <Typography
                            key={index}
                            variant="body2"
                            sx={{
                              mb: 1,
                              color: 'text.secondary',
                              fontSize: '0.8125rem',
                              lineHeight: 1.6,
                            }}
                          >
                            {line || '\u00A0'}
                          </Typography>
                        );
                      })}
                    </Box>
                  </Paper>
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: 'grey.50',
                      border: '1px dashed',
                      borderColor: 'divider',
                      textAlign: 'center',
                    }}
                  >
                    <InfoIcon sx={{ color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Análise não disponível
                    </Typography>
                  </Paper>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
              <Button
                onClick={() => generatePDF(selectedReport)}
                variant="outlined"
                color="primary"
                startIcon={<DownloadIcon />}
                disabled={downloading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {downloading ? 'Gerando PDF...' : 'Baixar PDF'}
              </Button>
              <Button
                onClick={handleClose}
                variant="contained"
                color="primary"
                startIcon={<CloseIcon />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Fechar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportsList;

