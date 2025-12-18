import { apiRequest } from './apicore.js'


export const ownersApi = {
  getOwners: () => apiRequest('/owners'),
  
  getBusinesses: () => apiRequest('/businesses'),

  getOwner: (id) => apiRequest(`/owners/${id}`),
  
  createOwner: (data) => apiRequest('/owners', {
    method: 'POST', 
    body: data,
  }),

  updateOwner: (id, data) => apiRequest(`/owners/${id}`, {
    method: 'PUT', 
    body: data,
  }),

  toggleActive: (id) => apiRequest(`/owners/${id}/toggle-active`, { 
    method: 'PATCH' 
  }),

  getAvailableUsers: () => apiRequest('/owners/available/users'),

  deleteOwner: (id) => apiRequest(`/owners/${id}`, {method: 'DELETE'}),
};