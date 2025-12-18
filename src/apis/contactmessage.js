import { apiRequest } from './apicore.js'

// mensajes de contacto
export const contactMessagesApi = {
  getMessages: () => apiRequest('/contact-messages'),
  
  createMessage: (data) => apiRequest('/contact-messages', { 
    method: 'POST', 
    body: data 
  }),
  
  updateStatus: (id, status) => apiRequest(`/contact-messages/${id}/status`, { 
    method: 'PATCH', 
    body: { status } 
  }),
  
  deleteMessage: (id) => apiRequest(`/contact-messages/${id}`, { 
    method: 'DELETE' 
  }),
};