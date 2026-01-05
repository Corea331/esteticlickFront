import { notifications } from '@mantine/notifications';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { processApiError } from './alerthandler';

/**
 * Sistema de notificaciones Mantine con API similar a AlertContext
 */

// Mostrar alerta (similar a addAlert)
export const showAlert = (alertData) => {
  const type = alertData.type || 'info';
  
  // Mapeo de tipos a configuraciones Mantine
  const configMap = {
    success: {
      color: 'green',
      icon: <Check size={18} />,
      autoClose: alertData.autoDismiss !== false ? 4000 : false,
    },
    info: {
      color: 'blue',
      icon: <Info size={18} />,
      autoClose: alertData.autoDismiss !== false ? 6000 : false,
    },
    error: {
      color: 'red',
      icon: <X size={18} />,
      autoClose: false, // Errores no se autocierran
    },
    warning: {
      color: 'yellow',
      icon: <AlertCircle size={18} />,
      autoClose: false, // Warnings no se autocierran
    },
  };

  const config = {
    ...configMap[type],
    title: alertData.title || type.charAt(0).toUpperCase() + type.slice(1),
    message: alertData.message,
    withBorder: true,
    radius: 'md',
  };

  return notifications.show(config);
};

// Métodos de conveniencia (MISMA API que AlertContext)
export const showError = (error) => {
  if (typeof error === 'string') {
    return showAlert({
      type: 'error',
      message: error,
    });
  }
  
  return showAlert({
    type: 'error',
    ...error,
  });
};

export const showSuccess = (message, title, options = {}) => {
  return showAlert({
    type: 'success',
    message,
    title: title || undefined,
    ...options,
  });
};

export const showInfo = (message, title, options = {}) => {
  return showAlert({
    type: 'info',
    message,
    title: title || undefined,
    ...options,
  });
};

export const showWarning = (message, title, options = {}) => {
  return showAlert({
    type: 'warning',
    message,
    title: title || undefined,
    ...options,
  });
};

// Helper para usar con processApiError
export const showApiError = (error) => {
  const processedError = processApiError ? processApiError(error) : error;
  return showError(processedError);
};