// components/modales/globalModal.jsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Box, LoadingOverlay } from '@mantine/core';
import { X } from 'lucide-react';
import { useMediaQuery } from '@mantine/hooks';

function GlobalModal({ 
  opened,
  onClose,
  title,
  size = 'lg',
  centered = true,
  loading = false,
  children,
  withCloseButton = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  padding = 'md',
  fullScreen = false,
  zIndex = 1000
}) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Manejar escape key
  useEffect(() => {
    if (!closeOnEscape || !opened) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, opened, onClose]);
  
  // Bloquear scroll del body
  useEffect(() => {
    if (opened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [opened]);
  
  // Crear elemento para el portal si no existe
  useEffect(() => {
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
  }, []);
  
  // Manejar click fuera del modal
  const handleBackdropClick = (e) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!opened) return null;
  
  // Tamaños del modal
  const sizeStyles = {
    xs: { maxWidth: '400px', width: '90%' },
    sm: { maxWidth: '500px', width: '90%' },
    md: { maxWidth: '600px', width: '90%' },
    lg: { maxWidth: '800px', width: '90%' },
    xl: { maxWidth: '1000px', width: '95%' }
  };
  
  const modalStyle = fullScreen 
    ? {
        width: '100vw',
        height: '100vh',
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: 0
      }
    : {
        ...sizeStyles[size],
        maxHeight: '90vh',
        borderRadius: 'var(--mantine-radius-lg)'
      };
  
  const modalContent = (
    <>
      {/* Backdrop */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: zIndex,
          display: 'flex',
          alignItems: centered ? 'center' : 'flex-start',
          justifyContent: 'center',
          padding: isMobile ? '1rem' : '2rem',
          overflow: 'auto'
        }}
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <Box
          style={{
            backgroundColor: 'white',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            ...modalStyle,
            marginTop: centered ? 0 : '2rem',
            marginBottom: '2rem',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Loading Overlay */}
          <LoadingOverlay 
            visible={loading} 
            zIndex={1001}
            overlayProps={{ blur: 2 }}
            loaderProps={{ type: 'bars' }}
          />
          
          {/* Header */}
          {(title || withCloseButton) && (
            <Box
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--mantine-color-gray-3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                flexShrink: 0
              }}
            >
              {title && (
                <Box
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--mantine-color-gray-9)'
                  }}
                >
                  {title}
                </Box>
              )}
              
              {withCloseButton && (
                <Box
                  component="button"
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: 'var(--mantine-radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--mantine-color-gray-6)',
                    marginLeft: 'auto',
                    transition: 'background-color 0.2s',
                    ':hover': {
                      backgroundColor: 'var(--mantine-color-gray-1)',
                      color: 'var(--mantine-color-gray-8)'
                    }
                  }}
                  aria-label="Cerrar modal"
                >
                  <X size={20} />
                </Box>
              )}
            </Box>
          )}
          
          {/* Content */}
          <Box
            style={{
              flex: 1,
              overflow: 'auto',
              padding: padding === 'none' ? 0 : 
                      padding === 'xs' ? '0.75rem' :
                      padding === 'sm' ? '1rem' :
                      padding === 'md' ? '1.5rem' :
                      padding === 'lg' ? '2rem' : '1.5rem'
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
  
  // Usar portal si existe el root, si no renderizar directamente
  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) {
    return createPortal(modalContent, modalRoot);
  }
  
  // Fallback: renderizar directamente (no ideal pero funcional)
  return modalContent;
}

export default GlobalModal;