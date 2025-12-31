import { useUser, useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      openSignIn({
        forceRedirectUrl: "/", 
      });
    }
  }, [isLoaded, isSignedIn, openSignIn]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
