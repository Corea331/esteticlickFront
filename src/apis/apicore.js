
// URL base de la api
const API_BASE_URL = 'https://esteticlick.alwaysdata.net/api'

const apiRequest = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('authToken');
  console.log('API Request - Token:', token ? 'Present' : 'Missing');

  const config = {
    ...options,
    headers: {
      'Content-Type' : 'application/json',
      'Accept' : 'application/json',
      'X-Requested-With' : 'XMLHttpRequest',
      ...(options.headers || {}),
    },
  };

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }

  if(config.body && typeof config.body === 'object' && !(config.body instanceof FormData)){
    config.body = JSON.stringify(config.body);
  }

  try {

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Debug para desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`API ${config.method || 'GET'} ${endpoint}:`, {
        status: response.status,
        ok: response.ok
      });
    }

    // Manejar errores
    if(!response.ok) {
      let errorMessage = `Error: ${response.status}`;

      try {
        // Intentar obtener el mensaje de error
        let errorText = await response.text();
        
        // Intentar parsear como JSON
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =errorData.message ||errorData.error || errorMessage;
        } catch {
          // Si no es JSON, usar el texto limitado a 200 caracteres
          if (errorText && errorText.length < 200) {
            errorMessage = errorText;
          }
        }
      } catch (e) {
        console.error('No se pudo obtener mensaje de error:', e);
      }
      
      throw new Error(errorMessage);
    }

    // Si no hay error retornar los datos parseados
    return await response.json()

  } catch(error){
    console.error('API request Error: ', endpoint, error);

    // Mensaje de error para el usuario, de manera entendible
    let userMessage = error.message;

    if(error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
      userMessage = 'Error de conexión. Verifica tu internet.';
    }else if (error.message.includes('500') || error.message.includes('Server Error')) {
      userMessage = 'Error interno del servidor. Por favor, intente más tarde.';
    } else if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('UNAUTHORIZED')) {
      userMessage = 'No autorizado. Tu sesión puede haber expirado';

      // Disparar evento para manejo de sesión expirada
      window.dispatchEvent(new CustomEvent('token-expired'));
    } else if (error.message.includes('404')) {
      userMessage = 'Recurso no encontrado.';
    }
    
    throw new Error(userMessage);
  }
};

export { apiRequest };