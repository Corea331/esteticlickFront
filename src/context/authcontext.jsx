import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react'
import { useUser, useLogout, useExtendSession, checkAuth } from '../hooks'
import { redirectToLogin, redirectToHome } from '../utils/navigation.js'
import { useAlert } from './alertcontext'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  role: null,
  sessionExpiration: null,
  sessionWarning: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      const userRoles = action.payload.user?.roles || [];
      const mainRole = userRoles.length > 0 ? userRoles[0].name : null;

      return {
        ...state,
        user:action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        role: mainRole,
        sessionWarning: null,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'UPDATE_USER':
      const updatedRoles = action.payload?.roles || [];
      const updatedRole = updatedRoles.length > 0 ? updatedRoles[0].name : state.role;

      return {
        ...state,
        user: action.payload,
        role: updatedRole,
      };
    case 'SET_SESSION_EXPIRATION':
      return {
        ...state,
        sessionExpiration: action.payload,
      };
    case 'SET_SESSION_WARNING':
      return {
        ...state,
        sessionWarning: action.payload,
      };
    case 'CLEAR_SESSION_WARNING':
      return {
        ...state,
        sessionWarning: null,
      };
    default :
      return state;
  }
};

const AuthContext = createContext();

// Claves para sessionstorage
const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { refetch: fetchUser } = useUser();
  const logoutMutation = useLogout();
  const extendSessionMutation = useExtendSession();
  const { showInfo, showWarning, showSuccess } = useAlert() || {};

  // Ref para evitar multiples alarmas
  const warningShownRef = useRef(false);
  const lastWarningLevelRef = useRef('');

  // Manejo del logout automático
  const handleAutoLogout = useCallback(async (message) => {
    try {
      const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        await logoutMutation.mutateAsync();
      }
    } catch (error) {
      console.error('Error al cerrar sesión automáticamente:', error);
    } finally {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      dispatch({ type: 'LOGOUT' });
      warningShownRef.current = false;
      lastWarningLevelRef.current = '';

      if (showInfo) {
        showInfo(message);
      }

      // Emitir evento para permitir navegación segura
      setTimeout(() => {
        redirectToLogin('Tu sesión ha expirado');
      }, 100);
    }
  }, [logoutMutation, showInfo]);

  // Mostrar advertencia simple de sesión
  const showSessionWarning = useCallback((minutesLeft) => {
    if (showWarning) {
      showWarning(
        `Tu sesión expirará en ${minutesLeft} minutos.`,
        'Sesión por expirar',
        {
          autoDismiss: true,
          duration: 10000,
        }
      );
    }
  }, [showWarning]);

  // Mostrar oferta para extender sesión
  const showExtendSessionOffer = useCallback((minutesLeft) => {
    if (showWarning) {
      showWarning(
        `Tu sesión expirará en ${minutesLeft} minutos. ¿Deseas extenderla?`,
        'Extender sesión',
        {
          autoDismiss: false,
          children: (
            <div className="d-flex gap-2 mt-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={async () => {
                  try {
                    await extendSessionMutation.mutateAsync({ minutes: 120 });
                  } catch (error) {
                    console.error('Error al extender sesión: ', error);
                  }
                }}
              >
                Sí, extender sesión
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  warningShownRef.current = false;
                }}
              >
                No, gracias
              </button>
            </div>
          )
        }
      );
    }
  }, [showWarning, extendSessionMutation]);

  // Escuchar eventos de token expirado desde api.js
  useEffect(() => {
    const handleTokenExpired = (event) => {
      const message = event.detail?.message || 'Tu sesión ha expirado';
      handleAutoLogout(message);
    };

    window.addEventListener('token-expired', handleTokenExpired);

    return () => {
      window.removeEventListener('token-expired', handleTokenExpired);
    };
  }, [handleAutoLogout]);

  // Escuchar eventos de estado de sesión desde useSessionMonitor
  useEffect(() => {
    const handleSessionStatus = (event) => {
      const { type, severity, message, minutes, showExtend, canExtend } = event.detail || {};

      dispatch({
        type: 'SET_SESSION_WARNING',
        payload: { type, severity, message, minutes, showExtend, canExtend }
      });

      if (lastWarningLevelRef.current === type) {
        return;
      }

      lastWarningLevelRef.current = type;

      switch (type) {
        case 'EXPIRED':
          handleAutoLogout(message);
          break;

        case 'IMMINENT':
          if (showWarning) {
            showWarning(
              `¡Sesión a punto de expirar! ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} restantes`,
              'Sesión por expirar',
              {
                autoDismiss: false,
                variant: 'danger',
                duration: 30000,
              }
            );
          }
          break;

        case 'URGENT':
          if (showExtend && canExtend) {
            showExtendSessionOffer(minutes);
            warningShownRef.current = true;
          }
          break;

        case 'WARNING':
          if (!warningShownRef.current) {
            showSessionWarning(minutes);
            warningShownRef.current = true;
          }
          break;

        default:
          console.log('Estado de sesión:', type, message);
      }
    };

    const handleSessionExtended = (event) => {
      const { message } = event.detail || {};
      if (showSuccess) {
        showSuccess(message || 'Sesión extendida', 'Sesión activa');
      }

      dispatch({ type: 'CLEAR_SESSION_WARNING' });
      warningShownRef.current = false;
      lastWarningLevelRef.current = '';
    };

    const handleSessionUpdate = (event) => {
      const { remainingSeconds, expiresSoon, isExpired } = event.detail || {};

      // Si la sesión está expirada, hacer logout automático
      if (isExpired) {
        console.log('Sesión expirada detectada en session-update');
        handleAutoLogout('Tu sesión ha expirado');
        return; // Salir temprano
      }

      if (!expiresSoon && warningShownRef.current) {
        console.log(`Sesión renovada: ${remainingSeconds} segundos restantes`);
        dispatch({ type: 'CLEAR_SESSION_WARNING' });
        warningShownRef.current = false;
        lastWarningLevelRef.current = '';
      }

      if (showSuccess) {
        showSuccess('Sesión renovada exitosamente');
      }
    };

    const handleSessionError = (event) => {
      console.warn('Error en sesión:', event.detail?.error);
    };

    window.addEventListener('session-status', handleSessionStatus);
    window.addEventListener('session-extended', handleSessionExtended);
    window.addEventListener('session-update', handleSessionUpdate);
    window.addEventListener('session-error', handleSessionError);

    return () => {
      window.removeEventListener('session-status', handleSessionStatus);
      window.removeEventListener('session-extended', handleSessionExtended);
      window.removeEventListener('session-update', handleSessionUpdate);
      window.removeEventListener('session-error', handleSessionError);
    };
  }, [ handleAutoLogout, showExtendSessionOffer, showSessionWarning]);

  // Efecto ÚNICO para carga inicial y verificación de token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = sessionStorage.getItem(USER_KEY);

      if (!token || !storedUser) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const userData = JSON.parse(storedUser);

        dispatch({
          type: 'LOGIN',
          payload: { user: userData, token },
        });

        try {
          const { data: freshUser } = await fetchUser();

          if (!freshUser) {
            throw new Error('Token inválido o expirado');
          }

          dispatch({
            type: 'UPDATE_USER',
            payload: freshUser,
          });
          sessionStorage.setItem(USER_KEY, JSON.stringify(freshUser));
        } catch (fetchError) {
          console.warn('Token inválido o expirado:', fetchError);
        }
      } catch (error) {
        console.error('Error al cargar sesión:', error);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, [fetchUser]);

  const login = useCallback((userData, token) => {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(userData));

    warningShownRef.current = false;
    lastWarningLevelRef.current = '';

    dispatch({
      type: 'LOGIN',
      payload: { user: userData, token },
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      if (sessionStorage.getItem(AUTH_TOKEN_KEY)) {
        await logoutMutation.mutateAsync();
      }
    } catch (error) {
      console.error('Error al cerrar sesión: ', error);
    } finally {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      warningShownRef.current = false;
      lastWarningLevelRef.current = '';
      dispatch({ type: 'LOGOUT' });

      // Emitir evento para permitir navegación segura
      setTimeout(() => {
        redirectToHome();
      }, 100);
    }
  }, [logoutMutation]);

  const updateUser = useCallback((userData) => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(userData));
    dispatch({ type: 'UPDATE_USER', payload: userData });
  }, []);

  const dismissWarning = useCallback(() => {
    dispatch({ type: 'CLEAR_SESSION_WARNING' });
    warningShownRef.current = false;
  }, []);

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    dismissWarning,
    checkAuth: () => checkAuth(),
    extendSession: (minutes = 120) => extendSessionMutation.mutate({ minutes }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};