import { apiRequest } from './apicore.js'

export const tenantApi = {
  // Appointments
  getAppointments: (ownerId) => apiRequest(`/owners/${ownerId}/appointments`),
  
  getAppointmentStats: (ownerId) => apiRequest(`/owners/${ownerId}/appointments/stats`),
  
  createAppointment: (ownerId, data) => apiRequest(`/owners/${ownerId}/appointments`, {
    method: 'POST',
    body: data,
  }),
  
  updateAppointmentStatus: (ownerId, appointmentId, status) => 
    apiRequest(`/owners/${ownerId}/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      body: { status },
    }),
  
  // Clients
  getClients: (ownerId) => apiRequest(`/owners/${ownerId}/clients`),
  
  findOrCreateClient: (ownerId, data) => 
    apiRequest(`/owners/${ownerId}/clients/find-or-create`, {
      method: 'POST',
      body: data,
    }),
  
  // Services
  getTenantServices: (ownerId) => apiRequest(`/owners/${ownerId}/services`),
  
  createTenantService: (ownerId, data) => 
    apiRequest(`/owners/${ownerId}/services`, { 
      method: 'POST', 
      body: data 
    }),
  
  updateTenantService: (ownerId, serviceId, data) => 
    apiRequest(`/owners/${ownerId}/services/${serviceId}`, {
      method: 'PUT',
      body: data,
    }),
  
  // Metrics
  getMetrics: (ownerId) => apiRequest(`/owners/${ownerId}/metrics`),
  
  // Reviews
  getReviews: (ownerId) => apiRequest(`/owners/${ownerId}/reviews`),
  
  createReview: (ownerId, data) => 
    apiRequest(`/owners/${ownerId}/reviews`, { 
      method: 'POST', 
      body: data 
    }),
  
  // Users
  getTenantUsers: (ownerId) => apiRequest(`/owners/${ownerId}/users`),
  
  getAvailableTenantUsers: (ownerId) => apiRequest(`/owners/${ownerId}/users/available`),
  
  createTenantUser: (ownerId, data) => 
    apiRequest(`/owners/${ownerId}/users`, { 
      method: 'POST', 
      body: data 
    }),
};