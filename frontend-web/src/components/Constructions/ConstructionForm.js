import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { CONSTRUCTION_STATUS } from '../../utils/constants';

const ConstructionForm = ({ open, onClose, onSubmit, construction, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    start_date: dayjs(),
    end_date: null,
    status: 'PLANNED',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (construction) {
      setFormData({
        name: construction.name || '',
        description: construction.description || '',
        location: construction.location || '',
        start_date: construction.start_date ? dayjs(construction.start_date) : dayjs(),
        end_date: construction.end_date ? dayjs(construction.end_date) : null,
        status: construction.status || 'PLANNED',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        location: '',
        start_date: dayjs(),
        end_date: null,
        status: 'PLANNED',
      });
    }
    setErrors({});
  }, [construction, open]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Local é obrigatório';
    }

    if (formData.end_date && formData.start_date.isAfter(formData.end_date)) {
      newErrors.end_date = 'Data final deve ser após data inicial';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const submitData = {
      ...formData,
      start_date: formData.start_date.format('YYYY-MM-DD'),
      end_date: formData.end_date ? formData.end_date.format('YYYY-MM-DD') : null,
    };

    onSubmit(submitData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {construction ? 'Editar Obra' : 'Nova Obra'}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome da Obra"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                multiline
                rows={3}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Local"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Data de Início"
                value={formData.start_date}
                onChange={(value) => handleChange('start_date', value)}
                disabled={loading}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.start_date,
                    helperText: errors.start_date,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Data de Término"
                value={formData.end_date}
                onChange={(value) => handleChange('end_date', value)}
                disabled={loading}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.end_date,
                    helperText: errors.end_date,
                  },
                }}
              />
            </Grid>

            {construction && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  disabled={loading}
                >
                  {Object.entries(CONSTRUCTION_STATUS).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                      {key.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ConstructionForm;

