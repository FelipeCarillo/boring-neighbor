import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

/**
 * Formata uma data para o formato brasileiro
 * @param date - Data ISO string ou Date
 * @param includeTime - Se deve incluir hora
 */
export const formatDate = (date: string | Date, includeTime = false): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, includeTime ? "dd/MM/yyyy 'às' HH:mm" : 'dd/MM/yyyy', {
      locale: ptBR,
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data inválida';
  }
};

/**
 * Formata uma data/hora para o formato completo brasileiro
 * @param date - Data ISO string ou Date
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, true);
};

/**
 * Formata uma data para formato relativo (ex: "há 2 horas")
 * @param date - Data ISO string ou Date
 */
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: ptBR,
    });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Data inválida';
  }
};

/**
 * Formata um número para porcentagem
 * @param value - Valor numérico (0-100)
 * @param decimals - Número de casas decimais
 */
export const formatPercentage = (value: number, decimals = 0): string => {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formata o score de desvio com label
 * @param score - Score de desvio (0-100)
 */
export const formatDeviationScore = (score: number): string => {
  if (typeof score !== 'number' || isNaN(score)) return 'N/A';
  return `${Math.round(score)}% de similaridade`;
};

/**
 * Retorna a label de qualidade baseada no score de desvio
 * @param score - Score de desvio (0-100)
 */
export const getDeviationLabel = (score: number): string => {
  if (typeof score !== 'number' || isNaN(score)) return 'Sem comparação';
  if (score >= 90) return 'Excelente';
  if (score >= 70) return 'Bom';
  if (score >= 50) return 'Aceitável';
  return 'Necessita atenção';
};

/**
 * Retorna a cor baseada no score de desvio
 * @param score - Score de desvio (0-100)
 */
export const getDeviationColor = (score: number): string => {
  if (typeof score !== 'number' || isNaN(score)) return '#9E9E9E';
  if (score >= 90) return '#00903E'; // success
  if (score >= 70) return '#0455BF'; // primary
  if (score >= 50) return '#0288D1'; // info
  return '#FBD12D'; // warning
};

/**
 * Formata o tamanho do arquivo
 * @param bytes - Tamanho em bytes
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formata o registro do usuário (adiciona zeros à esquerda)
 * @param registro - Registro do usuário
 */
export const formatRegistro = (registro: string): string => {
  if (!registro) return '';
  return registro.padStart(7, '0');
};

/**
 * Valida se o registro tem 7 dígitos
 * @param registro - Registro do usuário
 */
export const validateRegistro = (registro: string): boolean => {
  return /^\d{7}$/.test(registro);
};

/**
 * Valida se um campo é obrigatório
 * @param value - Valor do campo
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Valida email
 * @param email - Email a ser validado
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Trunca texto com reticências
 * @param text - Texto a ser truncado
 * @param maxLength - Tamanho máximo
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Retorna as iniciais de um nome
 * @param name - Nome completo
 */
export const getInitials = (name: string): string => {
  if (!name) return 'U';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

