import { AppShell } from '@mantine/core';
import Header from '../header/globalHeader';
import Footer from '../footer/globalFooter';
import './globalLayout.css';

const Layout = ({ children }) => {

  return (
    <AppShell
      header={{ height: { base: 100, sm: 120 } }}
      footer={{ height: { base: 100, sm: 120 } }}
      padding={0}
    >
      {/* Header con estilos del CSS */}
      <AppShell.Header 
        className="mantine-header"
        withBorder={false}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Header />
      </AppShell.Header>

      {/* Contenido principal */}
      <AppShell.Main 
        className="layout-main"
        style={{
          minHeight: 'calc(100vh - 260px)', // 120px header + 140px footer
          overflowY: 'auto',
        }}
      >
        {children}
      </AppShell.Main>

      {/* Footer con estilos del CSS */}
      <AppShell.Footer
        className="mantine-footer"
        withBorder={false}
        style={{
          position: 'relative',
          bottom: 0,
        }}
      >
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default Layout;