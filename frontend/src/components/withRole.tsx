import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, PawPrint } from 'lucide-react';

type Role = 'user' | 'vet' | 'admin';

interface WithRoleOptions {
  allowedRoles: Role[];
  redirectTo?: string;
}

/**
 * Higher-order component for role-based authorization
 * Wraps a component to ensure only users with specific roles can access it
 */
export function withRole<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithRoleOptions
) {
  const { allowedRoles, redirectTo = '/' } = options;

  const WithRoleComponent: React.FC<P> = (props) => {
    const { user, isLoading, isAdmin, isVet } = useAuth();
    const location = useLocation();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Redirect if not authenticated
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has one of the allowed roles
    const hasAccess = allowedRoles.some(role => {
      if (role === 'admin') return isAdmin();
      if (role === 'vet') return isVet();
      if (role === 'user') return true; // Any authenticated user
      return false;
    });

    if (!hasAccess) {
      return <UnauthorizedPrompt userRole={user.role} allowedRoles={allowedRoles} />;
    }

    return <WrappedComponent {...props} />;
  };

  WithRoleComponent.displayName = `withRole(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithRoleComponent;
}

const UnauthorizedPrompt: React.FC<{ 
  userRole: string;
  allowedRoles: Role[];
}> = ({ userRole, allowedRoles }) => {
  const getRoleMessage = (): { title: string; description: string } => {
    if (allowedRoles.includes('admin')) {
      return {
        title: 'Administrator Access Required',
        description: 'This page is restricted to administrators only. You do not have the necessary permissions to access this area.'
      };
    }

    if (allowedRoles.includes('vet')) {
      return {
        title: 'Veterinarian Access Required',
        description: 'This page is restricted to verified veterinarians only. If you are a veterinarian, please contact support to verify your account.'
      };
    }

    return {
      title: 'Access Denied',
      description: 'You do not have the necessary permissions to access this page.'
    };
  };

  const { title, description } = getRoleMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <PawPrint className="h-8 w-8 text-primary" />
            <span className="font-brand text-2xl font-extrabold tracking-tight">HappyTails</span>
          </div>
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">
            {description}
          </CardDescription>
          <div className="mt-2 text-xs text-muted-foreground">
            Your current role: {userRole}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button asChild className="w-full" variant="default">
              <Link to="/">
                Return to Home
              </Link>
            </Button>
            {allowedRoles.includes('vet') && (
              <Button asChild variant="outline" className="w-full">
                <a href="mailto:support@happytails.com?subject=Veterinarian Account Verification">
                  Request Veterinarian Access
                </a>
              </Button>
            )}
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Need help? Contact{' '}
              <a href="mailto:support@happytails.com" className="text-primary hover:underline">
                support@happytails.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default withRole;
