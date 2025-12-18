import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente simple que escucha un solo evento para navegación
 * Evento: 'app-navigate' con detail: { to: 'ruta', replace: boolean }
 */
const NavigationHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Único handler para todas las navegaciones
    const handleAppNavigate = (event) => {
      const { to, replace = false, state } = event.detail || {};
      
      if (!to) {
        console.warn('⚠️ Evento app-navigate sin ruta:', event);
        return;
      }

      //console.log(`📍 Navegando a: ${to}`, { replace, state });
      
      try {
        if (replace) {
          navigate(to, { replace: true, state });
        } else {
          navigate(to, { state });
        }
      } catch (error) {
        console.error('❌ Error al navegar:', error);
      }
    };

    // Registrar el único evento
    window.addEventListener('app-navigate', handleAppNavigate);

    // Cleanup
    return () => {
      window.removeEventListener('app-navigate', handleAppNavigate);
    };
  }, [navigate]);

  return null; // No renderiza nada
};

export default NavigationHandler;