import { apiRequest } from './apicore.js'


// autenticación
export const authApi = {
  login: (credentials) => apiRequest('/login',
    {method:'POST', 
    body: credentials
    }),

  logout : () => apiRequest('/logout', {method: 'POST'}),

  getUser: () => apiRequest('/user'),

  register: (data) => apiRequest('/register', {
    method: 'POST',
    body: data,
  }),
};