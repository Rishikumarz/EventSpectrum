import { useContext } from "react";
import { useLocation } from "wouter";
import { AuthContext } from "@/context/AuthContext";

export const useRequireAuth = (redirectTo = "/") => {
  const auth = useContext(AuthContext);
  const [, setLocation] = useLocation();

  if (!auth) {
    throw new Error("useRequireAuth must be used within an AuthProvider");
  }

  const { isAuthenticated, isLoading } = auth;

  if (!isLoading && !isAuthenticated) {
    setLocation(redirectTo);
  }

  return auth;
};

export default useRequireAuth;
