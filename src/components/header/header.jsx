import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authcontext'
import ModalContacto from '../modalcontacto/modalcontacto';
import Logo from '../../assets/logo.png';
import './header.css';

function Header() {
  const [showModalContact, setShowModalContact] = useState(false)
  const location = useLocation()

  const { isAuthenticated, user, logout, isLoading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch(error) {
      console.error('Error al desconectarse:', error)
    }
  }

  const isActiveLink = (path) => {
    return location.pathname === path;
  }

  if(isLoading) {
    return (
      <header className='container-fluid header-loading'>
        <nav className="navbar navbar-expand-xxl navbar-bg-body py-3">
          <div className="d-flex align-items-center">
            <Link className="navbar-brand ms-3" to="/">
              <img 
                src={Logo} 
                alt="Logo" 
                className="img-thumbnail rounded-circle border-2 border-light" 
                width={100} 
                height={100}
              />
            </Link>
            <div className="header-title">
              <h1 className="h4 mb-0">Esteticlick</h1>
              <p className="small mb-0">Tu Belleza, Nuestra Prioridad</p>
            </div>
          </div>
          <div className="ms-auto">
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
  <>
    <header className='container-fluid'>
      <nav 
      className="navbar navbar-expand-xxl navbar-bg-body  py-3" 
      >
        <div className="d-flex align-items-center">
          <Link 
          className="navbar-brand ms-3" 
          to="/"
          >
            <img 
            src={Logo} 
            alt="Logo" 
            className="img-thumbnail rounded-circle border-2 border-light" 
            width={100} height={100}
            />
          </Link>
          <div className="header-title">
            <h1 className="h4 mb-0">Esteticlick</h1>
            <p className="small mb-0">Tu Belleza, Nuestra Prioridad</p>
          </div>
        </div>
        <ul className="nav nav-tabs header-nav">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}>
              <i className="bi bi-house-fill"></i> Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/services" className={`nav-link ${isActiveLink('/services') ? 'active' : ''}`}>
              <i className="bi bi-scissors"></i> Servicios
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/businesses" className={`nav-link ${isActiveLink('/businesses') ? 'active' : ''}`}>
              <i className="bi bi-buildings-fill"></i> Negocios
            </Link>
          </li>
          {isAuthenticated ? (
            <>
            {(user?.role === 'admin' || user?.role === 'owner') && (
              <li className="nav-item">
                <Link to="/admin" className={`nav-link ${isActiveLink('/admin') ? 'active' : ''}`}>
                  <i className="bi bi-shield-check"></i> Admin
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/dashboard" className={`nav-link ${isActiveLink('/dashboard') ? 'active' : ''}`}>
                Panel de Control
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className={`nav-link ${isActiveLink('/profile') ? 'active' : ''}`}>
                <i className="bi bi-person-circle"></i> {user?.name || 'Perfil'}
              </Link>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className='nav-link header-btn'>
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/login" className={`nav-link ${isActiveLink('/login') ? 'active' : ''}`}>
                <i className="bi bi-box-arrow-in-right"></i> Login
              </Link>
            </li>
          )}
          <li className="nav-item">
            <button onClick={() => setShowModalContact(true)} className='btn header-btn'>
              <i className="bi bi-telephone-fill"></i> Contacto
            </button>
          </li>
        </ul>
      </nav>
    </header>

    <ModalContacto
      show={showModalContact}
      handleClose={() => setShowModalContact(false)}
    />
  </>
  );
}

export default Header