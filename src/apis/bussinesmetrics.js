import { apiRequest } from './apicore.js'

export const businessMetricsApi = {
  
  getBusinessMetrics: () => apiRequest('/business-metrics'),
  
  getOwnerMetrics: (ownerId) => apiRequest(`/owners/${ownerId}/metrics`),
  
  // Métricas del sistema (solo para admin)
  calculateMetrics: (year, month) => apiRequest('/business-metrics/calculate', {
    method: 'POST',
    body: { year, month }
  }),
  
  // Métricas del owner
  calculateOwnerMetrics: (ownerId, year, month) => 
    apiRequest(`/owners/${ownerId}/metrics/calculate`, {
      method: 'POST',
      body: { year, month }
    }),
};