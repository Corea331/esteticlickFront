import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../../hooks/apihooks.js';
import { useAuth } from '../../hooks/useauth.js'
import ModalContacto from '../modalcontacto/modalcontacto';
import Logo from '../../assets/logo.png';
import './header.css';

function Header() {
  const [showModalContact, setShowModalContact] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const logoutMutation = useLogout()

  const handleSearch = (e) => {
    (e).preventDefault()
    if(searchTerm.trim()) {
      navigate(`service?search=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
    }
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch(error) {
      console.error('Error al desconectarse:', error)
    }
  }

  const isActiveLink = (path) => {
    return location.pathname === path;
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
            width={80} height={80}
            />
          </Link>
          <div className="header-title">
            <h1 className="h4 mb-0">Esteticlick</h1>
            <p className="small mb-0">Tu belleza, nuestra prioridad</p>
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
            <li className="nav-item">
              <Link to="/dashboard" className={`nav-link ${isActiveLink('/dashboard') ? 'active' : ''}`}>
                Panel de Control
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