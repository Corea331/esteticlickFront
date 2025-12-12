import { createContext, useContext, useReducer, useCallback } from "react"



const AlertContext = createContext();

// Manejo de los estados de las alertas
const alertReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts].slice(0, 5),
      };
    case 'REMOVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload),
      };
    case 'CLEAR_ALERT':
      return {
        ...state,
        alerts: [],
      };
    default :
      return state;
  }
};
// Generar un ID único para cada alerta
const generateAlertId = () => {
  return `alert-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

// Alertas por defecto (tipo y tiempo de duración)
const ALERT_DEFAULTS = {
  success: {
    autoDismiss: true,
    duration: 4000,
    title: '¡Exito!',
  },
  info: {
    autoDismiss: true,
    duration: 6000,
    title: 'Información',
  },
  error: {
    autoDismiss: false,
    duration: null,
    title: 'Error',
  },
  warning: {
    autoDismiss: false,
    duration: null,
    title: 'Advertencia',
  },
};

export const AlertProvider = ({children}) => {
  const [state, dispatch] = useReducer(alertReducer, {alerts: [] });

  // Recibe las alertas y genera una id unica para cada una
  const addAlert = useCallback((alertData) => {
    const type = alertData.type || 'info';
    const defaults = ALERT_DEFAULTS[type] || ALERT_DEFAULTS.info;

    const finalAlert = {
      ...defaults,
      ...alertData,
      type,
      id: generateAlertId(),
      createdAt: Date.now(),
    };

    dispatch({ type: 'ADD_ALERT', payload: finalAlert });

    // Configurar auto-dismiss si esta activado y tiene duración
    if(finalAlert.autoDismiss && finalAlert.duration) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_ALERT', payload: finalAlert.id});
      }, finalAlert.duration);
    }

    return finalAlert.id;
  }, []);

  const removeAlert = useCallback((id) => {
    dispatch({ type: 'REMOVE_ALERT', payload: id});
  }, []);

  const clearAlert = useCallback(() => {
    dispatch({ type: 'CLEAR_ALERT' });
  }, []);

  // Métodos de conveniencia
  const showError = useCallback((error) => {
    let alertConfig;
    
    if (typeof error === 'string') {
      alertConfig = {
        type: 'error',
        message: error
      };
    } else {
      alertConfig = {
        type: 'error',
        ...error
      };
    }
    
    return addAlert(alertConfig);
  }, [addAlert]);

  const showSuccess = useCallback((message, title, options = {}) => {
    return addAlert({
      type: 'success',
      message,
      title: title || undefined,
      ...options
    });
  }, [addAlert]);

  const showInfo = useCallback((message, title, options = {}) => {
    return addAlert({
      type: 'info',
      message,
      title: title || undefined,
      ...options
    });
  }, [addAlert]);

  const showWarning = useCallback((message, title, options = {}) => {
    return addAlert({
      type: 'warning',
      message,
      title: title || undefined,
      ...options
    });
  }, [addAlert]);

  const value = {
    alerts: state.alerts,
    addAlert,
    removeAlert,
    clearAlert,
    showError,
    showSuccess,
    showInfo,
    showWarning
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert debe usarse dentro de AlertProvider');
  }
  return context;
};