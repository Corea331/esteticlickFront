import { Box } from '@mantine/core';
import { useHeadroom } from '@mantine/hooks';
import Header from '../navigation/globalHeader';
import StickyNavbar from '../navigation/stickyNavbar';
import Footer from '../footer/globalFooter';

const GlobalLayout = ({ children }) => {
  // useHeadroom nos da un valor booleano cuando scrolleamos hacia abajo
  const pinned = useHeadroom({ fixedAt: 0 });
  
  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-fondo)',
      }}
    >
      {/* Contenedor para el header sticky */}
      <Box style={{ position: 'relative', height: '150' }}>
        {/* Header - STICKY, se mueve con el scroll */}
        <Box
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 200,
            background: 'var(--color-header)',
            borderBottom: '3px solid var(--color-botones)',
          }}
        >
          <Header />
        </Box>
        
        {/* Navbar - También sticky, debajo del header */}
        <Box
          style={{
            position: 'fixed',
            width: '100%',
            top: 0, // Debajo del header (ajustar según altura del header)
            zIndex: 199,
          }}
        >
          <StickyNavbar />
        </Box>
      </Box>
      
      {/* Contenido principal */}
      <Box
        style={{
          flex: 1,
          padding: '1rem',
          maxWidth: '100%',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {children}
      </Box>
      
      {/* Footer */}
      <Box
        style={{
          background: 'var(--color-footer)',
          borderTop: '3px solid var(--color-botones)',
          marginTop: 'auto',
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
};

export default GlobalLayout;