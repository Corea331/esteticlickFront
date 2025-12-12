import { Navigate } from "react-router"
import { useAuth } from '../../context/authcontext'

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, role } = useAuth();

  if(isLoading) {
    return <div className="text-center py-5">Cargando...</div>;
  }

  if(!isAuthenticated) {
    return <Navigate to="/login" replace/>;
  }

  if(allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace/>;
  }

  return children;
}

export default PrivateRoute;