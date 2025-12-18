import { apiRequest } from './apicore.js'

export const dashboardApi = {
  // Para ADMIN
  getAdminDashboard: async () => {
    try {
      const [users, owners, messages, services] = await Promise.all([
        apiRequest('/users'),
        apiRequest('/owners'),
        apiRequest('/contact-messages?status=new'),
        apiRequest('/services'),
      ]);
      return { 
        users: users || [], 
        owners: owners || [], 
        messages: messages || [], 
        services: services || [],
      };
    } catch (error) {
      console.error('Error en panel de administrador: ', error)
      // Devolvemos las estructuras vacias
      return { 
        users: [], 
        owners: [], 
        messages: [], 
        services: [],
      };
    };
  },

  // Para OWNER
  getOwnerDashboard: async (ownerId) => {
    try {
      const [appointments, services, stats] = await Promise.all([
        apiRequest(`/owners/${ownerId}/appointments`).catch(() => []),
        apiRequest(`/owners/${ownerId}/services`).catch(() => []),
        apiRequest(`/owners/${ownerId}/appointments/stats`).catch(() => null),
      ]);

      // Llamadas separadas por si fallan
      const clients = await apiRequest(`/owners/${ownerId}/clients`).catch(() => ({data: [], total: 0}));
    
      const metrics = await apiRequest(`/owners/${ownerId}/metrics`)
      .catch(() => ({
        revenue: 0, 
        appointments_count: 0, 
        message: 'Sin acceso a las métricas',
        data: [],
      }));

      return { 
        appointments: appointments || [], 
        clients: clients.data || [], 
        metrics: metrics.data || metrics, 
        services: services || [], 
        stats 
      };
    } catch (error) {
      console.error('Error en panel de dueño: ', error);
      // Devolver las estructuras vacias
      return { 
        appointments: [], 
        clients: [], 
        metrics: {}, 
        services: [], 
        stats: null,
      };
    }
  },

  // Para EDITOR
  getEditorDashboard: async (ownerId) => {
    try {
      const [appointments, clients, services] = await Promise.all([
        apiRequest(`/owners/${ownerId}/appointments`).catch(() => []),
        apiRequest(`/owners/${ownerId}/clients`).catch(() => []),
        apiRequest(`/owners/${ownerId}/services`).catch(() => []),
      ]);
      return { 
        appointments: appointments || [], 
        clients: clients || [], 
        services: services || [] 
      };
    } catch (error) {
      console.error('Error en panel de editor:', error);
      // Devolver las estructuras vacias
      return { appointments: [], clients: [], services: [] };
    }
  },

  // Para STAFF
  getStaffDashboard: async (ownerId, userId) => {
    try {
      const [appointments, tenantUsers] = await Promise.all([
        apiRequest(`/owners/${ownerId}/appointments`).catch(() => []),
        apiRequest(`/owners/${ownerId}/users`).catch(() => []),
      ]);
      return { 
        appointments: appointments || [], 
        tenantUsers: tenantUsers || [], 
        userId 
      };
    } catch (error) {
      console.error('Error en panel de staff:', error);
      // Devolver las estructuras vacias
      return { appointments: [], tenantUsers: [], userId };
    }
  },
};