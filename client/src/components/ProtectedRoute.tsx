import { Navigate, useLocation } from 'react-router-dom';

import useAuth from "../hooks/useAuth"

const ProtectedRoute = ({children}: React.PropsWithChildren) => {
  const auth = useAuth();

  let location = useLocation();

  // TODO: Verify valid user with JWT
  if(!auth.authContext.user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <> {children} </>
};

export default ProtectedRoute;