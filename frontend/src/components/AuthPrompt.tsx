import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, PawPrint } from 'lucide-react';

interface AuthPromptProps {
  currentPath: string;
  requiredRole?: 'user' | 'vet' | 'admin';
}

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
    case '/book-appointment':
      return 'Vet Appointment Booking';
    case '/user-dashboard':
      return 'User Dashboard';
    default:
      return 'This Feature';
  }
};

const getUpgradeMessage = (
  user: ReturnType<typeof useAuth>['user'],
  currentPath: string,
  requiredRole?: 'user' | 'vet' | 'admin'
): { title: string; description: string; actionText: string } => {
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

const AuthPrompt: React.FC<AuthPromptProps> = ({ currentPath, requiredRole }) => {
  const { user } = useAuth();

  const { title, description, actionText } = getUpgradeMessage(user, currentPath, requiredRole);
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

export default AuthPrompt;
