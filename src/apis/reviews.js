import { apiRequest } from './apicore.js'


// comentarios de los negocios
export const reviewsApi = {
  getReviews: (ownerId) => apiRequest(`/owners/${ownerId}/reviews`),
  
  // Crear review (pública)
  createReview: (ownerId, data) => apiRequest(`/owners/${ownerId}/reviews`, {
    method: 'POST',
    body: data
  }),
  
  // Aprobar review (admin/owner only)
  approveReview: (ownerId, reviewId) => 
    apiRequest(`/owners/${ownerId}/reviews/${reviewId}/approve`, {
      method: 'PATCH'
    }),
  
  // Eliminar review (admin/owner only)
  deleteReview: (ownerId, reviewId) => 
    apiRequest(`/owners/${ownerId}/reviews/${reviewId}`, {
      method: 'DELETE'
    }),
};