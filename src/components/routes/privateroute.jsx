import { Navigate } from "react-router"
import { useAuth } from '../../context/authcontext'

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if(isLoading) {
    return <div className="text-center py-5">
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>;
  }

  if(!isAuthenticated) {
    return <Navigate to="/login" replace/>;
  }

  if(allowedRoles.length > 0 ) {
    const userRoles = user?.roles || [];
    const userRoleNames = userRoles.map(role => role.name);

    const hasAllowedRole = allowedRoles.some(role => userRoleNames.includes(role));

    if(!hasAllowedRole) {
      console.log('Acceso denegado. Usuario tiene roles:', userRoleNames, 'Se requieren:', allowedRoles);
      return <Navigate to="/unauthorized" replace/>;
    }
  }

  return children;
}

export default PrivateRoute;