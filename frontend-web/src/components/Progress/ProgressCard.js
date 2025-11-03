import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { formatDateTime, formatDeviationScore, getDeviationColor, getDeviationLabel } from '../../utils/formatters';

const ProgressCard = ({ progress, onView }) => {
  const hasComparison = progress.deviation_score !== null && progress.deviation_score !== undefined;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Photo */}
      <CardMedia
        component="img"
        height="200"
        image={progress.presigned_url || progress.photo_url}
        alt="Progress photo"
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Deviation Score */}
        {hasComparison ? (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Chip
              icon={progress.deviation_score >= 70 ? <CheckCircleIcon /> : <WarningIcon />}
              label={formatDeviationScore(progress.deviation_score)}
              color={getDeviationColor(progress.deviation_score)}
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              {getDeviationLabel(progress.deviation_score)}
            </Typography>
          </Box>
        ) : (
          <Chip
            icon={<PhotoCameraIcon />}
            label="Sem comparação"
            size="small"
            color="default"
            sx={{ mb: 1 }}
          />
        )}

        {/* Notes */}
        {progress.notes && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1,
            }}
          >
            {progress.notes}
          </Typography>
        )}

        {/* User and Date */}
        <Box display="flex" alignItems="center" gap={1} mt={2}>
          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
            {progress.uploaded_by_name?.charAt(0)}
          </Avatar>
          <Typography variant="caption" color="text.secondary">
            {formatDateTime(progress.uploaded_at)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={() => onView(progress)} fullWidth>
          Ver Detalhes
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProgressCard;

