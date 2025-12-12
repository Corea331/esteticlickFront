

// URL base de la api
const API_BASE_URL = 'https://esteticlick.alwaysdata.net/api'

const apiRequest = async(endpoint, options = {}) => {
  const token = sessionStorage.getItem('authToken');
  console.log('API Request - Token:', token ? 'Present' : 'Missing');

  const config = {
    headers: {
      'Content-Type' : 'application/json',
      'Accept' : 'application/json',
      'X-Requested-With' : 'XMLHttpRequest',
    },
    ...options,
  };

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }

  if(config.body && typeof config.body === 'object'){
    config.body = JSON.stringify(config.body);
  }

  try {
    console.log('Making request to:', `${API_BASE_URL}${endpoint}`);
    console.log('Headers:', config.headers);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Debug: Log de la request
    console.log(`API Request to ${endpoint}:`, {
      method: config.method || 'GET',
      status: response.status
    });

    // Manejo específico de error 500
    if(response.status === 500) {
      console.error('Error 500 del servidor en:', endpoint);

      let serverErrorMessage = 'Error interno del servidor';

      try {
        const errorData = await response.text();
        console.error('Error 500 response:', errorData);
        
        // Intentar parsear como JSON
        try {
          const parsed = JSON.parse(errorData);
          serverErrorMessage = parsed.message || parsed.error || errorMessage;
        } catch {
          // Si no es JSON, usar el texto como está
          if (errorData && errorData.length < 200) { // Solo si no es muy largo
            serverErrorMessage = errorData;
          }
        }
      } catch (e) {
        console.error('No se pudo obtener respuesta del error 500:', e);
      }
      
      throw new Error(`Server Error: ${serverErrorMessage}`);
    }

    if(response.status === 401){
      try{
        const errorData = await response.json();

        // Verificar si el token ha expirado
        if(errorData.code === 'TOKEN_EXPIRED') {
          console.warn('Token expirado: ', errorData.message);

          // Disparar evento en lugar de redirigir directamente
          window.dispatchEvent(new CustomEvent('token-expired', {
            detail: { 
              message: errorData.message || 'Tu sesión ha expirado',
              code: 'TOKEN_EXPIRED'
            }
          }));

          throw new Error('TOKEN_EXPIRED: ' + (errorData.message || 'Token expirado'));
        }
      } catch (jsonError) {
        // Si no se puede parsear JSON, es un error 401 genérico
        console.warn('Error 401 genérico');
      }

      // Disparar evento para logout
      window.dispatchEvent(new CustomEvent('token-expired', {
        detail: { message: 'No autorizado' }
      }));
      
      throw new Error('UNAUTHORIZED: No autorizado');
    }

    if(response.status === 419) {
      console.error('CSRF token no coincide o ha expirado.');
      throw new Error('La sesión expiró. Por favor actualice la página.')
    }

    const data = await response.json();

    if(!response.ok){
      const errorMessage = data.message || data.error || `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);      
    }

    return data;
  } catch(error){
    console.error('API request Error en', endpoint, ':', {
      message: error.message,
      endpoint,
      config: {
        method: config.method,
        hasBody: !!config.body
      },
    });

    // Mensaje de error para el usuario
    let userMessage = error.message;
    if (error.message.includes('500') || error.message.includes('Server Error')) {
      userMessage = 'Error interno del servidor. Por favor, intente más tarde.';
    } else if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('UNAUTHORIZED')) {
      userMessage = 'Credenciales incorrectas.';
    } else if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
      userMessage = 'Error de conexión. Verifique su internet.';
    }
    
    throw new Error(userMessage);
  }
};

//--------------------URL´s principales para usar-------------------------

// autenticación
export const authAPI = {
  login: (credential) => apiRequest('/login', {method:'POST', body: credential}),
  logout : () => apiRequest('/logout', {method: 'POST'}),
  getUser: () => apiRequest('/user'),

  // Rutas para gestión de sesión
  getTokenExpiration: () => apiRequest('/session/expiration'),
  extendSession: (minutes = 120) => apiRequest('/session/extend', {
    method: 'POST',
    body: { minutes }
  }),
};

// servicios
export const serviceAPI = {
  getServices: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/services${queryString ?`?${queryString}`: ''}`);
  },
};

// mensajes de contacto
export const contactMessagesAPI = {
  createMessage: (messageData) => apiRequest('/contact-messages', {
    method: 'POST',
    body: messageData,
  }),
};

// dueños
export const ownersAPI = {
  // Lista de negocios
  getBusinesses: () => apiRequest('/businesses'),

  // Gestión de owners solo para administración
  getOwners: () => apiRequest('/owners'),
  createOwner: (ownerData) => apiRequest('/owners', {method: 'POST', body: ownerData}),
  updateOwner: (id, ownerData) => apiRequest(`/owners/${id}`, {method: 'PUT', body: ownerData}),
  deleteOwner: (id) => apiRequest(`/owners/${id}`, {method: 'DELETE'}),
};

// comentarios de los negocios
export const reviewsAPI = {
  getReviews: (ownerId) => apiRequest(`/owners/${ownerId}/reviews`),
};

// Helper para verificar estado de sesión
export const checkSessionStatus = async () => {
  const token = sessionStorage.getItem('authToken');
  
  if (!token) {
    return { authenticated: false, reason: 'no_token' };
  }
  
  try {
    const expirationInfo = await authAPI.getTokenExpiration();
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
};

// Helper para extender sesión con manejo de errores
export const safelyExtendSession = async (minutes = 120) => {
  try {
    const result = await authAPI.extendSession(minutes);
    
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
    
    // Si el error es 401 (token expirado), limpiar y redirigir
    if (error.message.includes('401') || error.message.includes('No autenticado')) {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('tokenExpiration');
      window.location.href = '/login';
    }
    
    return {
      success: false,
      error: error.message,
      message: 'No se pudo extender la sesión'
    };
  }
};

export default apiRequest;