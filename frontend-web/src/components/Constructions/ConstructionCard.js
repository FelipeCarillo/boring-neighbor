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
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Construction as ConstructionIcon,
  ArrowForward as ArrowForwardIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import { CONSTRUCTION_STATUS_LABELS, CONSTRUCTION_STATUS_COLORS } from '../../utils/constants';

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

  const progressPercentage = construction.progress_percentage || 0;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
        },
      }}
      onClick={handleViewDetails}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="flex-start" 
          mb={2.5}
        >
          <Box display="flex" gap={1.5} alignItems="flex-start" flex={1} minWidth={0}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ConstructionIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box flex={1} minWidth={0}>
              <Typography 
                variant="h6" 
                component="div" 
                fontWeight={600}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.3,
                  mb: 0.5,
                }}
              >
                {construction.name}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={CONSTRUCTION_STATUS_LABELS[construction.status] || construction.status}
            color={CONSTRUCTION_STATUS_COLORS[construction.status] || 'default'}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
              ml: 1,
              flexShrink: 0,
            }}
          />
        </Box>

        {/* Description */}
        {construction.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            mb={2.5}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.6,
            }}
          >
            {construction.description}
          </Typography>
        )}

        {/* Info */}
        <Stack spacing={1.5}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <LocationIcon fontSize="small" sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {construction.location}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1.5}>
            <CalendarIcon fontSize="small" sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Início: {formatDate(construction.start_date)}
            </Typography>
          </Box>

          {construction.assigned_users && construction.assigned_users.length > 0 && (
            <Box display="flex" alignItems="center" gap={1.5}>
              <PeopleIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {construction.assigned_users.length} {construction.assigned_users.length === 1 ? 'usuário' : 'usuários'}
              </Typography>
            </Box>
          )}

          {/* Progresso Total */}
          {progressPercentage !== undefined && (
            <Box mt={1.5}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Progresso Total
                </Typography>
                <Typography variant="body2" fontWeight="700" color="primary.main">
                  {Math.round(progressPercentage)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progressPercentage} 
                sx={{ 
                  height: 8, 
                  borderRadius: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.06)',
                }}
                color={
                  progressPercentage === 100 ? 'success' :
                  progressPercentage >= 70 ? 'primary' :
                  progressPercentage >= 30 ? 'info' : 'warning'
                }
              />
            </Box>
          )}
        </Stack>
      </CardContent>

      <CardActions 
        sx={{ 
          justifyContent: 'space-between', 
          px: 3, 
          pb: 2.5,
          pt: 0,
        }}
      >
        <Button 
          size="medium" 
          endIcon={<ArrowForwardIcon />}
          onClick={handleViewDetails}
          sx={{ fontWeight: 600 }}
        >
          Ver Detalhes
        </Button>
        {onEdit && (
          <Tooltip title="Editar" arrow>
            <IconButton 
              size="small" 
              onClick={handleEdit}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
};

export default ConstructionCard;

