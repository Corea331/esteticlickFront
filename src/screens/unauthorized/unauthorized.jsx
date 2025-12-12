import { Link } from "react-router-dom"
import './unauthorized.css'

function Unauthorized() {
  return (
    <div className="unauthorized-container text-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body p-5">
                <h1 className="display-1 text-danger mb-4">
                  <i className="bi bi-shield-exclamation"></i>
                </h1>
                <h2 className="mb-4">Acceso No Autorizado</h2>
                <p className="lead mb-4">
                  No tienes permisos suficientes para acceder a esta página.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/" className="btn btn-primary">
                    <i className="bi bi-house me-2"></i> Volver al inicio
                  </Link>
                  <button 
                    onClick={() => window.history.back()} 
                    className="btn btn-outline-secondary"
                  >
                    <i className="bi bi-arrow-left me-2"></i> Volver atrás
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;