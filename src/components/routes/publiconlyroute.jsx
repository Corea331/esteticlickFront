import { Navigate } from "react-router"
import { useAuth } from '../../context/authcontext'

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if(isLoading) {
    return <div className="text-center py-5">Cargando...</div>;
  }

  if(isAuthenticated) {
    return <Navigate to="/" replace/>;
  }

  return children;
}

export default PublicOnlyRoute;