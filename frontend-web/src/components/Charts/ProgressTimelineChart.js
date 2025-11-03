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
import { Box, useTheme } from '@mui/material';

const ProgressTimelineChart = ({ data }) => {
  const theme = useTheme();

  const chartData = data
    .map((entry) => ({
      date: new Date(entry.created_at).getTime(),
      score: entry.deviation_score || 0,
      formattedDate: new Date(entry.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      notes: entry.notes,
    }))
    .reverse();

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
            Score: {payload[0].value.toFixed(1)}%
          </Box>
          {payload[0].payload.notes && (
            <Box sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
              {payload[0].payload.notes}
            </Box>
          )}
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
    <ResponsiveContainer width="100%" height={300}>
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
          label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
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
          strokeWidth={2}
          dot={{ fill: theme.palette.primary.main, r: 5 }}
          activeDot={{ r: 8 }}
          name="Score de Similaridade"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressTimelineChart;

