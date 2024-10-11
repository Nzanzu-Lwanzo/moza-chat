import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useHasCookie } from "../../hooks/useAuth";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  let hasCookie = useHasCookie();

  if (!hasCookie) return <Navigate to="/client/auth/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
