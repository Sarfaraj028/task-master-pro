import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import { useRef, useEffect } from "react";

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const hasWarned = useRef(false);

  useEffect(() => {
    if (!user && !hasWarned.current && !loading) {
      toast.warning("You must be logged in!");
      hasWarned.current = true;
    }
  }, [user, loading]);

  if (loading) return null;

  if (!user) return <Navigate to="/sign-in" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
