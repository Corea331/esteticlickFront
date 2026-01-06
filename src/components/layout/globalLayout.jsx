import { AppShell } from '@mantine/core';
import Header from '../header/globalHeader';
import Footer from '../footer/globalFooter';
import './globallayout.css';

const Layout = ({ children }) => {

  return (
    <AppShell
      header={{ height: 'auto' }}
      footer={{ height: 'auto' }}
      padding={0}
    >
      {/* Header con estilos del CSS */}
      <AppShell.Header className="mantine-header">
        <Header />
      </AppShell.Header>

      {/* Contenido principal */}
      <AppShell.Main className="layout-main">
        {children}
      </AppShell.Main>

      {/* Footer con estilos del CSS */}
      <AppShell.Footer className="mantine-footer">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default Layout;