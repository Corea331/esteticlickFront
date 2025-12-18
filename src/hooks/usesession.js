import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from 'react'
import { sessionApi } from '../apis'

export const useCheckSessionStatus = () => {
  return useQuery({
    queryKey: ['session-status'],
    queryFn: sessionApi.checkStatus,
    refetchInterval: 60 * 1000,
    enabled: !!sessionStorage.getItem('authToken'),
    retry: false,
  });
};

export const useExtendSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sessionApi.extend,
    onSuccess: () => {
      //console.log('Sesión extendida: ', data.message);

      // Invalidar la query de expiración para que se refresque
      queryClient.invalidateQueries(['session-expiration']);

      // Disparar evento de sesión extendida
      window.dispatchEvent(new CustomEvent('session-extended', {
        detail: {
          message: 'Sesión extendida exitosamente.',
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
  const { data: sessionData, error } = useCheckSessionStatus();
  
  useEffect(() => {
    if (error) {
      console.warn('Error en monitor de sesión:', error);
      window.dispatchEvent(new CustomEvent('session-error', {
        detail: { error: error.message }
      }));
      return;
    }
    
    if (sessionData && sessionData.authenticated ) {
      const { remaining_seconds, expires_soon, is_expired } = sessionData;

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