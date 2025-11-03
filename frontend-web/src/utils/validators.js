// Form validators

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRegistro = (registro) => {
  const clean = String(registro).replace(/\D/g, '');
  return clean.length === 7;
};

export const validatePassword = (password) => {
  // Mínimo 6 caracteres
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateDate = (date) => {
  return date && !isNaN(new Date(date).getTime());
};

export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  return new Date(startDate) <= new Date(endDate);
};

export const validateFileSize = (file, maxSize) => {
  return file && file.size <= maxSize;
};

export const validateFileType = (file, acceptedTypes) => {
  if (!file) return false;
  return acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type);
    }
    return file.type === type;
  });
};

// Form validation helpers
export const getErrorMessage = (field, value, rules = {}) => {
  if (rules.required && !validateRequired(value)) {
    return `${field} é obrigatório`;
  }
  
  if (rules.email && value && !validateEmail(value)) {
    return 'Email inválido';
  }
  
  if (rules.registro && value && !validateRegistro(value)) {
    return 'Registro deve ter 7 dígitos';
  }
  
  if (rules.password && value && !validatePassword(value)) {
    return 'Senha deve ter no mínimo 6 caracteres';
  }
  
  if (rules.minLength && value && value.length < rules.minLength) {
    return `Mínimo de ${rules.minLength} caracteres`;
  }
  
  if (rules.maxLength && value && value.length > rules.maxLength) {
    return `Máximo de ${rules.maxLength} caracteres`;
  }
  
  return '';
};
