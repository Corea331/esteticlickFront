import { useAuth } from '../../context/authcontext';
import './dashboard.css';

const IntegratedDashboard = () => {
  const { role, user } = useAuth();
  
  // DEBUG: Verificar datos
  console.log('🔍 Dashboard Debug:');
  console.log('- Usuario:', user);
  console.log('- Rol detectado:', role);
  console.log('- Roles array:', user?.roles);
  
  // Función para título según rol
  const getDashboardTitle = () => {
    const titles = {
      admin: 'Panel de Administración',
      owner: 'Panel del Dueño', 
      editor: 'Panel del Editor',
      staff: 'Panel del Staff'
    };
    return titles[role] || 'Panel de Control';
  };
  
  // Función para color según rol
  const getRoleColor = () => {
    const colors = {
      admin: 'danger',
      owner: 'warning',
      editor: 'info',
      staff: 'primary'
    };
    return colors[role] || 'secondary';
  };
  
  // Función para icono según rol
  const getRoleIcon = () => {
    const icons = {
      admin: 'shield-shaded',
      owner: 'building',
      editor: 'pencil-square',
      staff: 'person-badge'
    };
    return icons[role] || 'person';
  };
  
  return (
    <div className="integrated-dashboard">
      {/* Header con información del usuario */}
      <div className="dashboard-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="dashboard-title mb-2">{getDashboardTitle()}</h1>
            <div className="user-info">
              <span className="text-muted">
                <i className="bi bi-person-circle me-2"></i>
                {user?.name || 'Usuario'}
              </span>
              <span className="text-muted ms-3">
                <i className="bi bi-envelope me-2"></i>
                {user?.email}
              </span>
            </div>
          </div>
          
          <div className="role-display">
            <span className={`badge bg-${getRoleColor()} p-3 fs-6`}>
              <i className={`bi ${getRoleIcon()} me-2`}></i>
              {role ? role.toUpperCase() : 'SIN ROL'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="dashboard-content mt-4">
        {/* Panel de información */}
        <div className="info-panel card border-0 shadow-sm">
          <div className="card-body">
            <h4 className="card-title">
              <i className="bi bi-info-circle text-primary me-2"></i>
              Dashboard funcionando correctamente
            </h4>
            <div className="row mt-3">
              <div className="col-md-6">
                <h5>Datos del usuario:</h5>
                <ul className="list-unstyled">
                  <li><strong>ID:</strong> {user?.id}</li>
                  <li><strong>Nombre:</strong> {user?.name}</li>
                  <li><strong>Email:</strong> {user?.email}</li>
                  <li><strong>Estado:</strong> {user?.is_active ? 'Activo' : 'Inactivo'}</li>
                </ul>
              </div>
              <div className="col-md-6">
                <h5>Roles asignados:</h5>
                <div className="roles-list">
                  {user?.roles && user.roles.length > 0 ? (
                    user.roles.map((rol, index) => (
                      <div key={index} className="role-item mb-2">
                        <span className={`badge bg-${getRoleColor()}`}>
                          {rol.name}
                        </span>
                        <small className="text-muted ms-2">
                          (ID: {rol.id})
                        </small>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No hay roles asignados</p>
                  )}
                </div>
              </div>
            </div>
            
            <hr />
            
            <div className="next-steps">
              <h5>Próximos pasos:</h5>
              <ol>
                <li>Verificar que el rol "{role}" se detecta correctamente</li>
                <li>Crear componentes modulares para estadísticas</li>
                <li>Configurar permisos específicos por rol</li>
                <li>Conectar con endpoints de datos reales</li>
              </ol>
            </div>
          </div>
        </div>
        
        {/* Acciones rápidas básicas */}
        <div className="quick-actions mt-4">
          <h4 className="mb-3">
            <i className="bi bi-lightning text-warning me-2"></i>
            Acciones disponibles
          </h4>
          <div className="row g-3">
            <div className="col-md-3">
              <button className="btn btn-outline-primary w-100 py-3">
                <i className="bi bi-person-plus fs-4 d-block mb-2"></i>
                Gestionar usuarios
              </button>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-success w-100 py-3">
                <i className="bi bi-shop fs-4 d-block mb-2"></i>
                Ver negocios
              </button>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-warning w-100 py-3">
                <i className="bi bi-calendar-check fs-4 d-block mb-2"></i>
                Citas de hoy
              </button>
            </div>
            <div className="col-md-3">
              <button className="btn btn-outline-info w-100 py-3">
                <i className="bi bi-bar-chart fs-4 d-block mb-2"></i>
                Reportes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedDashboard;