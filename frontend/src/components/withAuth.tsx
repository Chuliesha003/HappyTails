import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock, PawPrint } from 'lucide-react';

interface WithAuthOptions {
  requiresAuth?: boolean;
  requiredFeature?: string;
  requiredRole?: 'basic' | 'premium' | 'veterinarian';
  redirectTo?: string;
  showAuthPrompt?: boolean;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requiresAuth = true,
    requiredFeature,
    requiredRole,
    redirectTo = '/login',
    showAuthPrompt = true
  } = options;

  const WithAuthComponent: React.FC<P> = (props) => {
    const { isRegistered, canAccessFeature, getUserRole, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Check basic authentication requirement
    if (requiresAuth && !isRegistered()) {
      if (showAuthPrompt) {
        return <AuthPrompt currentPath={location.pathname} />;
      }
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check feature access requirement
    if (requiredFeature && !canAccessFeature(requiredFeature)) {
      if (showAuthPrompt) {
        return <AuthPrompt currentPath={location.pathname} requiredFeature={requiredFeature} />;
      }
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check role requirement
    if (requiredRole) {
      const userRole = getUserRole();
      const roleHierarchy = { 'basic': 1, 'premium': 2, 'veterinarian': 3 };
      const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
      const requiredLevel = roleHierarchy[requiredRole];
      
      if (userLevel < requiredLevel) {
        if (showAuthPrompt) {
          return <AuthPrompt currentPath={location.pathname} requiredRole={requiredRole} />;
        }
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
      }
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithAuthComponent;
}

const AuthPrompt: React.FC<{ 
  currentPath: string;
  requiredFeature?: string;
  requiredRole?: 'basic' | 'premium' | 'veterinarian';
}> = ({ currentPath, requiredFeature, requiredRole }) => {
  const { getUserRole, user } = useAuth();
  const userRole = getUserRole();

  const getFeatureName = (path: string): string => {
    switch (path) {
      case '/pet-records':
        return 'Pet Records';
      case '/vet-dashboard':
        return 'Vet Dashboard';
      case '/symptom-checker':
        return 'Unlimited Symptom Checker';
      case '/vets':
        return 'Find a Vet';
      default:
        return 'This Feature';
    }
  };

  const getUpgradeMessage = (): { title: string; description: string; actionText: string } => {
    if (!user || userRole === 'guest') {
      return {
        title: 'Sign Up Required',
        description: `${getFeatureName(currentPath)} requires a free HappyTails account to access.`,
        actionText: 'Create Free Account'
      };
    }

    if (requiredRole === 'premium' && userRole === 'basic') {
      return {
        title: 'Premium Feature',
        description: `${getFeatureName(currentPath)} is available for Premium users. Upgrade to unlock unlimited access.`,
        actionText: 'Upgrade to Premium'
      };
    }

    if (requiredRole === 'veterinarian' && userRole !== 'veterinarian') {
      return {
        title: 'Veterinarian Only',
        description: `${getFeatureName(currentPath)} is restricted to verified veterinarians only.`,
        actionText: 'Contact Support'
      };
    }

    if (requiredFeature) {
      return {
        title: 'Feature Not Available',
        description: `Your current plan doesn't include ${getFeatureName(currentPath)}. Please upgrade to access this feature.`,
        actionText: 'View Plans'
      };
    }

    return {
      title: 'Access Required',
      description: `${getFeatureName(currentPath)} requires additional permissions.`,
      actionText: 'Get Access'
    };
  };

  const { title, description, actionText } = getUpgradeMessage();
  const currentUserInfo = user ? `Current user: ${user.email} (${userRole})` : 'Not logged in';

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
            <Button asChild className="w-full" variant="brand">
              <Link to="/get-started" state={{ from: currentPath }}>
                {actionText}
              </Link>
            </Button>
            {(!user || userRole === 'guest') && (
              <Button asChild variant="outline" className="w-full">
                <Link to="/login" state={{ from: currentPath }}>
                  Already have an account? Sign In
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
