import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import { CONSTRUCTION_STATUS_LABELS, CONSTRUCTION_STATUS_COLORS } from '../../utils/constants';
import { LinearProgress } from '@mui/material';

const ConstructionCard = ({ construction, onEdit }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/constructions/${construction.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(construction);
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" gap={1} alignItems="center">
            <ConstructionIcon color="primary" />
            <Typography variant="h6" component="div" noWrap>
              {construction.name}
            </Typography>
          </Box>
          <Chip
            label={CONSTRUCTION_STATUS_LABELS[construction.status]}
            color={CONSTRUCTION_STATUS_COLORS[construction.status]}
            size="small"
          />
        </Box>

        {/* Description */}
        {construction.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {construction.description}
          </Typography>
        )}

        {/* Info */}
        <Stack spacing={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {construction.location}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Início: {formatDate(construction.start_date)}
            </Typography>
          </Box>

          {construction.assigned_users && (
            <Box display="flex" alignItems="center" gap={1}>
              <PeopleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {construction.assigned_users.length} {construction.assigned_users.length === 1 ? 'usuário' : 'usuários'}
              </Typography>
            </Box>
          )}

          {/* Progresso Total */}
          {construction.progress_percentage !== undefined && construction.progress_percentage !== null && (
            <Box mt={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Progresso Total
                </Typography>
                <Typography variant="caption" fontWeight="bold">
                  {Math.round(construction.progress_percentage)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={construction.progress_percentage} 
                sx={{ height: 6, borderRadius: 1 }}
                color={
                  construction.progress_percentage === 100 ? 'success' :
                  construction.progress_percentage >= 70 ? 'primary' :
                  construction.progress_percentage >= 30 ? 'info' : 'warning'
                }
              />
            </Box>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button size="small" onClick={handleViewDetails}>
          Ver Detalhes
        </Button>
        {onEdit && (
          <Button size="small" variant="outlined" onClick={handleEdit}>
            Editar
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ConstructionCard;

