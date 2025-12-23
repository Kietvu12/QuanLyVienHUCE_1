import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Si el usuario tiene un role válido pero diferente, redirigir a su dashboard
    if (user.role) {
      return <Navigate to={`/${user.role}/dashboard`} replace />;
    } else {
      // Si no tiene role válido, redirigir al login
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

