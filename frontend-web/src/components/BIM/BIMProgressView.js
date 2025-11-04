import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  Paper,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { progressAPI } from '../../api/progress';
import ProgressTimelineChart from '../Charts/ProgressTimelineChart';

const BIMProgressView = ({ open, onClose, bimReference, bimIndex }) => {
  const [progressEntries, setProgressEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    count: 0,
    average: 0,
    best: 0,
    worst: 100,
    trend: 0,
  });

  useEffect(() => {
    if (open && bimReference) {
      loadProgressData();
    }
  }, [open, bimReference]);

  const loadProgressData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await progressAPI.listByBIMReference(bimReference.id);
      setProgressEntries(data);
      calculateStats(data);
    } catch (err) {
      setError('Erro ao carregar dados de progresso');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (entries) => {
    if (entries.length === 0) {
      setStats({ count: 0, average: 0, best: 0, worst: 100, trend: 0 });
      return;
    }

    const scores = entries.map(e => e.deviation_score || 0);
    const count = scores.length;
    const average = scores.reduce((a, b) => a + b, 0) / count;
    const best = Math.max(...scores);
    const worst = Math.min(...scores);

    let trend = 0;
    if (entries.length >= 2) {
      const recent = entries.slice(0, Math.min(3, entries.length));
      const older = entries.slice(Math.min(3, entries.length));
      
      if (older.length > 0) {
        const recentAvg = recent.reduce((a, e) => a + (e.deviation_score || 0), 0) / recent.length;
        const olderAvg = older.reduce((a, e) => a + (e.deviation_score || 0), 0) / older.length;
        trend = recentAvg - olderAvg;
      }
    }

    setStats({ count, average, best, worst, trend });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <TimelineIcon />
            <Box>
              <Typography variant="h6">
                Evolução - BIM #{bimIndex + 1}
              </Typography>
              {bimReference?.description && (
                <Typography variant="body2" color="text.secondary">
                  {bimReference.description}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar
                src={bimReference?.presigned_url}
                variant="rounded"
                sx={{ width: 120, height: 120 }}
              />
              
              <Grid container spacing={2} flex={1}>
                <Grid item xs={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      Registros
                    </Typography>
                    <Typography variant="h6">{stats.count}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      Média
                    </Typography>
                    <Typography variant="h6">{stats.average.toFixed(1)}%</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      Melhor
                    </Typography>
                    <Typography variant="h6" color="success.main">{stats.best.toFixed(1)}%</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="caption" color="text.secondary">
                      Tendência
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {stats.trend > 0 ? (
                        <>
                          <TrendingUpIcon fontSize="small" color="success" />
                          <Typography variant="h6" color="success.main">+{stats.trend.toFixed(1)}%</Typography>
                        </>
                      ) : stats.trend < 0 ? (
                        <>
                          <TrendingDownIcon fontSize="small" color="error" />
                          <Typography variant="h6" color="error.main">{stats.trend.toFixed(1)}%</Typography>
                        </>
                      ) : (
                        <Typography variant="h6">-</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {progressEntries.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  Gráfico de Evolução Temporal
                </Typography>
                <Box mb={3}>
                  <ProgressTimelineChart data={progressEntries} />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Histórico de Registros
                </Typography>
                <List>
                  {progressEntries.map((progress, index) => (
                    <React.Fragment key={progress.id}>
                      <ListItem
                        sx={{
                          bgcolor: index % 2 === 0 ? 'background.default' : 'transparent',
                          borderRadius: 1,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={progress.presigned_url} variant="rounded" />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body1">
                                {formatDate(progress.created_at)}
                              </Typography>
                              <Chip
                                label={`${(progress.deviation_score || 0).toFixed(1)}%`}
                                color={getScoreColor(progress.deviation_score || 0)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={progress.notes || 'Sem observações'}
                        />
                      </ListItem>
                      {index < progressEntries.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}

            {progressEntries.length === 0 && (
              <Alert severity="info">
                Nenhum registro de progresso foi feito para esta imagem BIM ainda.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BIMProgressView;

