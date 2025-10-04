import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock, PawPrint } from 'lucide-react';

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

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Check basic authentication requirement
    if (requiresAuth && !user) {
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

const AuthPrompt: React.FC<{ 
  currentPath: string;
  requiredRole?: 'user' | 'vet' | 'admin';
}> = ({ currentPath, requiredRole }) => {
  const { user } = useAuth();

  const getFeatureName = (path: string): string => {
    switch (path) {
      case '/pet-records':
        return 'Pet Records';
      case '/vet-dashboard':
        return 'Vet Dashboard';
      case '/admin-dashboard':
        return 'Admin Dashboard';
      case '/symptom-checker':
        return 'Symptom Checker';
      case '/vets':
        return 'Find a Vet';
      case '/appointments':
        return 'Book Appointment';
      default:
        return 'This Feature';
    }
  };

  const getUpgradeMessage = (): { title: string; description: string; actionText: string } => {
    if (!user) {
      return {
        title: 'Sign In Required',
        description: `${getFeatureName(currentPath)} requires you to be signed in to access.`,
        actionText: 'Sign In'
      };
    }

    if (requiredRole === 'admin') {
      return {
        title: 'Admin Only',
        description: `${getFeatureName(currentPath)} is restricted to administrators only.`,
        actionText: 'Back to Home'
      };
    }

    if (requiredRole === 'vet') {
      return {
        title: 'Veterinarian Only',
        description: `${getFeatureName(currentPath)} is restricted to verified veterinarians only.`,
        actionText: 'Back to Home'
      };
    }

    return {
      title: 'Access Required',
      description: `${getFeatureName(currentPath)} requires additional permissions.`,
      actionText: 'Back to Home'
    };
  };

  const { title, description, actionText } = getUpgradeMessage();
  const currentUserInfo = user ? `Signed in as: ${user.email} (${user.role})` : 'Not signed in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <PawPrint className="h-8 w-8 text-primary" />
            <span className="font-brand text-2xl font-extrabold tracking-tight">HappyTails</span>
          </div>
          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">
            {description}
          </CardDescription>
          <div className="mt-2 text-xs text-muted-foreground">
            {currentUserInfo}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {!user ? (
              <>
                <Button asChild className="w-full" variant="brand">
                  <Link to="/login" state={{ from: currentPath }}>
                    {actionText}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/register">
                    Create Free Account
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild className="w-full" variant="default">
                <Link to="/">
                  {actionText}
                </Link>
              </Button>
            )}
          </div>
          
          <div className="pt-4 border-t">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default withAuth;
