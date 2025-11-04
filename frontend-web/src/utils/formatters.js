import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

// Date formatters
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '-';
  return dayjs(date).format(format);
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

export const formatRelativeTime = (date) => {
  if (!date) return '-';
  return dayjs(date).fromNow();
};

// Number formatters
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '-';
  return new Intl.NumberFormat('pt-BR').format(number);
};

export const formatDecimals = (number, decimals = 2) => {
  if (number === null || number === undefined) return '-';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

// File size formatter
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Deviation score formatter
export const formatDeviationScore = (score) => {
  if (score === null || score === undefined) return 'Sem comparação';
  return `${formatDecimals(score, 1)}%`;
};

export const getDeviationLabel = (score) => {
  if (score === null || score === undefined) return 'Sem dados';
  if (score >= 90) return 'Excelente';
  if (score >= 70) return 'Boa conformidade';
  if (score >= 50) return 'Aceitável';
  return 'Desvio crítico';
};

export const getDeviationColor = (score) => {
  if (score === null || score === undefined) return 'default';
  if (score >= 90) return 'success';
  if (score >= 70) return 'primary';
  if (score >= 50) return 'warning';
  return 'error';
};

// Text formatters
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Registro formatter (7 digits)
export const formatRegistro = (registro) => {
  if (!registro) return '';
  return String(registro).padStart(7, '0');
};

export const validateRegistro = (registro) => {
  const clean = String(registro).replace(/\D/g, '');
  return clean.length === 7 ? clean : null;
};



