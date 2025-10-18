import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthPrompt from './AuthPrompt';

interface WithAuthOptions {
  requiresAuth?: boolean;
  requiredRole?: 'user' | 'vet' | 'admin';
  redirectTo?: string;
  showAuthPrompt?: boolean;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requiresAuth = true,
    requiredRole,
    redirectTo = '/login',
    showAuthPrompt = true
  } = options;

  const WithAuthComponent: React.FC<P> = (props) => {
    const { user, isLoading, isAdmin, isVet } = useAuth();
    const location = useLocation();

    // Debug logging
    console.log('[withAuth] Path:', location.pathname, 'User:', user, 'IsLoading:', isLoading);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Check basic authentication requirement
    if (requiresAuth && !user) {
      console.log('[withAuth] Access denied - no user authenticated');
      if (showAuthPrompt) {
        return <AuthPrompt currentPath={location.pathname} />;
      }
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check role requirement
    if (requiredRole && user) {
      let hasAccess = false;

      if (requiredRole === 'admin') {
        hasAccess = isAdmin();
      } else if (requiredRole === 'vet') {
        hasAccess = isVet() || isAdmin(); // Admins can access vet routes
      } else if (requiredRole === 'user') {
        hasAccess = true; // Any authenticated user
      }

      if (!hasAccess) {
        if (showAuthPrompt) {
          return <AuthPrompt currentPath={location.pathname} requiredRole={requiredRole} />;
        }
        return <Navigate to="/" state={{ from: location }} replace />;
      }
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithAuthComponent;
}

export default withAuth;
