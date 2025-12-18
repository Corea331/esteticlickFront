import { apiRequest } from './apicore.js'

export const usersApi = {
  getUsers: () => apiRequest('/users'),
  
  getUser: (id) => apiRequest(`/users/${id}`),
  
  createUser: (data) => apiRequest('/users', { 
    method: 'POST', 
    body: data 
  }),
  
  updateUser: (id, data) => apiRequest(`/users/${id}`, { 
    method: 'PUT', 
    body: data 
  }),
  
  toggleActive: (id) => apiRequest(`/users/${id}/toggle-active`, { 
    method: 'PATCH' 
  }),
};