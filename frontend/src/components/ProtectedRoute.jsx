import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black dark-grid-bg">
        <div className="flex flex-col items-center space-y-4">
          {/* Elegant SaaS style pulse spinner */}
          <div className="relative flex h-12 w-12 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-8 w-8 bg-brand-600 border border-brand-400"></span>
          </div>
          <p className="text-sm font-medium text-dark-muted animate-pulse">Loading HireIQ...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role.toUpperCase()))) {
    // If the user role is not authorized, redirect them to their respective default home dashboard
    if (user.role.toUpperCase() === 'RECRUITER') {
      return <Navigate to="/recruiter/dashboard" replace />;
    } else if (user.role.toUpperCase() === 'CANDIDATE') {
      return <Navigate to="/candidate/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
