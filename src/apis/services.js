import { apiRequest } from './apicore.js'


export const servicesApi = {
  getServices: () => apiRequest('/services'),
  
  createService: (data) => apiRequest('/services', { 
    method: 'POST', 
    body: data 
  }),
  
  updateService: (id, data) => apiRequest(`/services/${id}`, { 
    method: 'PUT', 
    body: data 
  }),
  
  deleteService: (id) => apiRequest(`/services/${id}`, { 
    method: 'DELETE' 
  }),
};