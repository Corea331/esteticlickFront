import { redirectToLogin } from '../utils/navigation.js';
import { apiRequest } from './apicore.js'

export const sessionApi = {
  // Verificar el estado de la sesión
  checkStatus: async () => {
    const token = sessionStorage.getItem('authToken');
  
    if (!token) {
      return { authenticated: false, reason: 'no_token' };
    }
  
    try {
      const expirationInfo = await apiRequest('/session/expiration');
      return {
        authenticated: true,
        ...expirationInfo,
        tokenExists: true
      };
    } catch (error) {
      console.warn('Error al verificar sesión:', error);
      
      // Si es error 401, limpiar token
      if (error.message.includes('401') || error.message.includes('No autenticado')) {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('tokenExpiration');

        redirectToLogin('Sesión expirada');

        return { 
          authenticated: false, 
          reason: 'token_invalid',
          error: error.message 
        };
      }
      
      return { 
        authenticated: false, 
        reason: 'check_failed',
        error: error.message 
      };
    }
  },

  // Extender el tiempo de la sesión
  extend: async (minutes = 120) => {
    try {
      const result = await apiRequest('/session/extend', {
        method: 'POST',
        body: { minutes }
      });
      
      // Guardar nueva expiración en sessionStorage si viene en la respuesta
      if (result.expires_at) {
        sessionStorage.setItem('tokenExpiration', result.expires_at);
      }
      
      return {
        success: true,
        data: result,
        message: result.message || 'Sesión extendida exitosamente'
      };
    } catch (error) {
      console.error('Error al extender sesión:', error);
      
      // Si el error es 401 (token expirado), limpiar y recargar
      if (error.message.includes('401') || error.message.includes('No autenticado')) {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('tokenExpiration');
  
        redirectToLogin('Sesión expirada');
      }
      
      return {
        success: false,
        error: error.message,
        message: 'No se pudo extender la sesión'
      };
    }
  },

  // Limpiar sesión
  clear: () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('tokenExpiration');

    redirectToLogin('Sesión expirada');
  }
};

// Evento para token expirado
window.addEventListener('token-expired', () => {
  console.log('Token expirado, limpiando sesión...');
  sessionApi.clear();
  
  redirectToLogin('Sesión expirada');
});