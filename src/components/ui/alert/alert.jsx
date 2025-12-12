import { useState, useEffect } from 'react'
import './alert.css';

const Alert = ({ 
  type = 'info',
  title,
  message,
  onDismiss,
  children,
  autoDismiss = false,
  duration = 5000,
}) => {
  const [isExiting, setIsExiting ] = useState(false);

  // Configurar autoDismiss
  useEffect(() => {
    if(autoDismiss && onDismiss && duration) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);

    }
  }, [autoDismiss, duration, onDismiss ]);

  if (!message && !children && !title) return null;

  const handleDismiss = () => {
    if(!onDismiss) return;

    setIsExiting(true);

    setTimeout(() => { onDismiss() }, 300);
  };

  // Mapeo de tipos a clases CSS
  const alertClasses = {
    error: 'alert-error',
    success: 'alert-success',
    warning: 'alert-warning',
    info: 'alert-info'
  };

  // Mapeo de tipos a íconos de Bootstrap Icons
  const iconClasses = {
    error: 'bi-exclamation-triangle-fill',
    success: 'bi-check-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill'
  };

  // Texto para el tipo de alerta
  const getTypeLabel = (type) => {
    const labels = {
      error: 'Error',
      success: 'Éxito',
      warning: 'Advertencia',
      info: 'Información'
    };
    return labels[type] || 'Alerta';
  };

  return (
    <div 
      className={`alert ${alertClasses[type]} ${isExiting ? 'alert-exiting' : ''}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="alert-header">
        <div className="alert-title">
          <i className={`bi ${iconClasses[type]} me-2`}></i>
          <strong>{title || getTypeLabel(type)}</strong>
        </div>
        
        {onDismiss && (
          <button 
            type="button" 
            className="alert-close"
            aria-label="Cerrar alerta"
            onClick={handleDismiss}
            disabled={isExiting}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>
      
      <div className="alert-body">
        {message && <p className="alert-message">{message}</p>}
        {children}
      </div>
    </div>
  );
};

export default Alert;