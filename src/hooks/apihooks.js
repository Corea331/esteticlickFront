import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from 'react'
import { authAPI, serviceAPI, contactMessagesAPI, ownersAPI } from "../apis/api.js";


// Auth HOOKS
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      const {access_token: token, user} = data;
      if(token) { sessionStorage.setItem('authToken', token); }
      if(user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        queryClient.setQueryData(['user'], user);
      }
    },
    onError: (error) => {
      console.error('Error al iniciar sesión: ', error);
      throw error;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: (data) => {
      console.log('✅ Logout exitoso:', data);
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout API error: ', error);
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      queryClient.clear();
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: authAPI.getUser,
    enabled: false,
    staleTime: 5 * 60 * 1000,
  });
};

// Services HOOKS
export const useServices = (filters = {}) => {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: () => serviceAPI.getServices(filters),
  });
};

// Contact HOOKS
export const useCreateContactMessage = () => {
  return useMutation({
    mutationFn: contactMessagesAPI.createMessage,
    onSuccess: () => { console.log('Mensaje enviado exitosamente.'); },
  });
};

// Business HOOKS - PÚBLICO
export const useBusinesses = () => {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: ownersAPI.getBusinesses,
    staleTime: 5 * 60 * 1000,
  });
};

// Owners HOOKS - ADMIN
export const useOwners = () => {
  return useQuery({
    queryKey: ['owners'],
    queryFn: ownersAPI.getOwners,
    staleTime: 2 * 60 * 1000,
    enabled: false,
  });
};

// Owners Mutations
export const useCreateOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ownersAPI.createOwner,
    onSuccess: () => {
      queryClient.invalidateQueries(['owners']);
    },
  });
};

export const useUpdateOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...ownerData }) => ownersAPI.updateOwner(id, ownerData),
    onSuccess: () => {
      queryClient.invalidateQueries(['owners']);
    },
  });
};

export const useDeleteOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ownersAPI.deleteOwner,
    onSuccess: () => {
      queryClient.invalidateQueries(['owners']);
    },
  });
};

// Helper para verifiar autenticación
export const checkAuth = () => {
  return !!sessionStorage.getItem('authToken');
};

// Control de sesiones
export const useSessionExpiration = () => {
  return useQuery({
    queryKey: ['session-expiration'],
    queryFn: authAPI.getTokenExpiration,
    refetchInterval: 60 * 1000, // cada minuto
    refetchOnWindowFocus: true,
    enabled: !!sessionStorage.getItem('authToken'),
    retry: false,
  });
};

export const useExtendSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ minutes = 120 }) => authAPI.extendSession(minutes),
    onSuccess: (data) => {
      console.log('Sesión extendida: ', data.message);

      // Invalidar la query de expiración para que se refresque
      queryClient.invalidateQueries(['session-expiration']);

      // Disparar evento de sesión extendida
      window.dispatchEvent(new CustomEvent('session-extended', {
        detail: {
          message: 'Sesión extendida exitosamente.',
          newExpiration: data.expires_at,
        },
      }));
    },
    onError: (error) => {
      console.error('Error al extender la sesión: ', error);

      // Si es error 401, limpiar y redirigir al login
      if(error.message.includes('401') || error.message.includes('No autenticado') || error.message === 'TOKEN_EXPIRED') {
        window.dispatchEvent(new CustomEvent('token-expired'));
      }

      throw error;
    },
  });
};

// Helper para verificar periódicamente el tiempo de expiración
export const useSessionMonitor = () => {
  const { data: expirationData, error } = useSessionExpiration();
  
  useEffect(() => {
    if (error) {
      console.warn('Error en monitor de sesión:', error);
      window.dispatchEvent(new CustomEvent('session-error', {
        detail: {
          message: 'Error al verificar sesión',
          error: error.message
        }
      }));
      return;
    }
    
    if (expirationData) {
      const { remaining_seconds, expires_soon, is_expired } = expirationData;

      // Disparar estado actual de la sesíón
      window.dispatchEvent(new CustomEvent('session-update', {
        detail: {
          remainingSeconds: remaining_seconds,
          expiresSoon: expires_soon,
          isExpired: is_expired
        }
      }));
      
      if (is_expired) {
        // Sesión expirada
        window.dispatchEvent(new CustomEvent('session-status', {
          detail: {
            type: 'EXPIRED',
            severity: 'CRITICAL',
            message: 'Tu sesión ha expirado',
            remainingSeconds: remaining_seconds,
            action: 'logout'
          }
        }));
      } else if (expires_soon) {
        // Sesión por expirar - determinar nivel de advertencia
        let warningType = 'WARNING';
        let severity = 'MEDIUM';
        
        if (remaining_seconds < 60) {
          // Menos de 1 minuto
          severity = 'CRITICAL';
          warningType = 'IMMINENT';
        } else if (remaining_seconds < 300) {
          // Menos de 5 minutos
          severity = 'HIGH';
          warningType = 'URGENT';
        } else if (remaining_seconds < 600) {
          // Menos de 10 minutos
          severity = 'MEDIUM';
          warningType = 'WARNING';
        }

        const minutes = Math.ceil(remaining_seconds / 60);
        window.dispatchEvent(new CustomEvent('session-status', {
          detail: {
            type: warningType,
            severity: severity,
            message: `Tu sesión expirará en ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`,
            minutes: minutes,
            seconds: remaining_seconds,
            showExtend: remaining_seconds < 300, // Mostrar opción de extender solo si menos de 5 minutos
            canExtend: true
          }
        }));
      }
    }
  }, [expirationData, error]);
  
  return { expirationData, error };
};