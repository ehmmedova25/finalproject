import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) return null; // 👈 Gözləmə zamanı heç nə göstərmə
if (loading) return <div>Yüklənir...</div>; // və ya spinner göstər

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
