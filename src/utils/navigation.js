/**
 * Utilidades simples para navegación SPA segura
 */

/**
 * Navegar a una ruta (reemplaza window.location.href)
 */
export const navigateTo = (to, options = {}) => {
  const { replace = false, state } = options;
  
  window.dispatchEvent(new CustomEvent('app-navigate', {
    detail: { to, replace, state }
  }));
};

/**
 * Recargar la página actual (reemplaza window.location.reload())
 */
export const reloadPage = () => {
  // Navega a la misma ruta para "recargar"
  window.dispatchEvent(new CustomEvent('app-navigate', {
    detail: { 
      to: window.location.pathname + window.location.search,
      replace: true 
    }
  }));
};

/**
 * Redirigir a login (para sesión expirada)
 */
export const redirectToLogin = (message = 'Sesión expirada') => {
  window.dispatchEvent(new CustomEvent('app-navigate', {
    detail: { 
      to: '/login',
      replace: true,
      state: { message }
    }
  }));
};

/**
 * Redirigir a home
 */
export const redirectToHome = () => {
  window.dispatchEvent(new CustomEvent('app-navigate', {
    detail: { 
      to: '/',
      replace: true 
    }
  }));
};

/**
 * Hook para usar en componentes
 */
export const useAppNavigation = () => {
  return {
    navigateTo,
    reloadPage,
    redirectToLogin,
    redirectToHome
  };
};