

// URL base de la api
const API_BASE_URL = 'https://esteticlick.alwaysdata.net/api'

const apiRequest = async(endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');

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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if(response.status === 401){
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
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
    console.error('API request Error:', error);
    throw error;
  }
};

//--------------------URL´s principales para usar-------------------------

// autenticación
export const authAPI = {
  login: (credential) => apiRequest('/login', {method:'POST', body: credential}),
  logout : () => apiRequest('/logout', {method: 'POST'}),
  getUser: () => apiRequest('/user'),
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

export default apiRequest;