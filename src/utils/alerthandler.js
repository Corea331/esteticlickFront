/**
 * Sistema centralizado para procesar errores y crear alertas
 */

/**
 * Procesa errores de API y devuelve objeto de alerta configurado
 */
export const processApiError = (error) => {
  // Si ya es un objeto de alerta configurado, devolverlo tal cual
  if (error && typeof error === 'object' && error.type && error.message) {
    return error;
  }

  // Configuración base para errores
  let alertConfig = {
    type: 'error',
    autoDismiss: false,
  };

  // Si es string simple
  if (typeof error === 'string') {
    return {
      ...alertConfig,
      message: error
    };
  }

  // Error de Laravel con mensaje
  if (error?.response?.data?.message) {
    return {
      ...alertConfig,
      message: error.response.data.message
    };
  }

  // Error de Laravel con validación (errors array)
  if (error?.response?.data?.errors) {
    const errors = Object.values(error.response.data.errors).flat();
    return {
      ...alertConfig,
      message: errors.join(', ')
    };
  }

  // Errores HTTP específicos
  if (error?.response?.status === 401) {
    return {
      ...alertConfig,
      message: 'Credenciales incorrectas. Verifique su email y contraseña.'
    };
  }

  if (error?.response?.status === 403) {
    return {
      ...alertConfig,
      message: 'No tiene permisos para realizar esta acción.'
    };
  }

  if (error?.response?.status === 404) {
    return {
      ...alertConfig,
      message: 'Recurso no encontrado.'
    };
  }

  if (error?.response?.status === 422) {
    return {
      ...alertConfig,
      message: 'Datos de formulario inválidos. Por favor, revise los campos.'
    };
  }

  if (error?.response?.status === 500) {
    return {
      ...alertConfig,
      message: 'Error interno del servidor. Por favor, intente más tarde.'
    };
  }

  // Error con propiedad message
  if (error?.message) {
    return {
      ...alertConfig,
      message: error.message
    };
  }

  // Error de red
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return {
      ...alertConfig,
      message: 'Error de conexión. Verifique su internet o intente más tarde.'
    };
  }

  // Default
  return {
    ...alertConfig,
    message: 'Ha ocurrido un error. Por favor, intente nuevamente.'
  };
};

/**
 * Crea configuración para alerta de éxito
 */
export const createSuccessAlert = (message, title = '¡Éxito!', options = {}) => {
  return {
    type: 'success',
    message,
    title,
    autoDismiss: true,
    duration: 4000,
    ...options
  };
};

/**
 * Crea configuración para alerta de información
 */
export const createInfoAlert = (message, title = 'Información', options = {}) => {
  return {
    type: 'info',
    message,
    title,
    autoDismiss: true,
    duration: 6000,
    ...options
  };
};

/**
 * Crea configuración para alerta de advertencia
 */
export const createWarningAlert = (message, title = 'Advertencia', options = {}) => {
  return {
    type: 'warning',
    message,
    title,
    autoDismiss: false,
    ...options
  };
};

/**
 * Log de errores para desarrollo (solo en desarrollo)
 */
export const logError = (error, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`🔴 ERROR [${context}]:`, {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      stack: error?.stack
    });
  }
};