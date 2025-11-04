import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Box, useTheme, Typography } from '@mui/material';

const ConstructionTimelineChart = ({ data }) => {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Nenhum dado de progresso disponível ainda
        </Typography>
      </Box>
    );
  }

  const chartData = data.map((entry) => ({
    date: new Date(entry.date).getTime(),
    score: entry.score,
    formattedDate: new Date(entry.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    bimCount: entry.bim_count,
    totalBims: entry.total_bims,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Box sx={{ fontWeight: 'medium', mb: 1 }}>
            {payload[0].payload.formattedDate}
          </Box>
          <Box sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            Progresso: {payload[0].value.toFixed(1)}%
          </Box>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 0.5 }}>
            {payload[0].payload.bimCount} de {payload[0].payload.totalBims} BIM{payload[0].payload.totalBims !== 1 ? 's' : ''} com registros
          </Box>
        </Box>
      );
    }
    return null;
  };

  const formatXAxis = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis
          dataKey="date"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={formatXAxis}
          stroke={theme.palette.text.secondary}
        />
        <YAxis
          domain={[0, 100]}
          stroke={theme.palette.text.secondary}
          label={{ value: 'Progresso (%)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <ReferenceLine
          y={90}
          stroke={theme.palette.success.main}
          strokeDasharray="3 3"
          label={{ value: 'Meta', position: 'right' }}
        />
        <ReferenceLine
          y={70}
          stroke={theme.palette.warning.main}
          strokeDasharray="3 3"
          label={{ value: 'Atenção', position: 'right' }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke={theme.palette.primary.main}
          strokeWidth={3}
          dot={{ fill: theme.palette.primary.main, r: 6 }}
          activeDot={{ r: 8 }}
          name="Progresso Geral"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ConstructionTimelineChart;

