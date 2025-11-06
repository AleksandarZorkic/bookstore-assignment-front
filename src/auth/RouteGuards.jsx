import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function PrivateRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
}

export function RoleRoute({ role, children }) {
  const { isAuth, hasRole } = useAuth();
  if (!isAuth) return <Navigate to="/login" replace />;
  return hasRole(role) ? children : <Navigate to="/forbidden" replace />;
}
