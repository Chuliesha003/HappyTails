import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Crown, AlertTriangle } from 'lucide-react';

interface GuestLimitBannerProps {
  feature: 'symptom-checker';
  className?: string;
}

export const GuestLimitBanner: React.FC<GuestLimitBannerProps> = ({ 
  feature, 
  className = '' 
}) => {
  const { isGuest, guestUsageCount, maxGuestUsage, canUseSymptomChecker } = useAuth();

  if (!isGuest()) return null;

  const remaining = maxGuestUsage - guestUsageCount;
  const hasReachedLimit = !canUseSymptomChecker();

  if (feature === 'symptom-checker') {
    if (hasReachedLimit) {
      return (
        <Alert className={`border-amber-200 bg-amber-50 ${className}`}>
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>Free limit reached!</strong> You've used all {maxGuestUsage} free symptom checks.
            </div>
            <Button asChild size="sm" variant="brand" className="ml-4">
              <Link to="/get-started">Sign Up for Unlimited Access</Link>
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    if (remaining <= 1) {
      return (
        <Alert className={`border-purple-200 bg-purple-50 ${className}`}>
          <Crown className="h-4 w-4 text-purple-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong>{remaining} free check{remaining !== 1 ? 's' : ''} remaining.</strong> Sign up for unlimited access!
            </div>
            <Button asChild size="sm" variant="outline" className="ml-4">
              <Link to="/get-started">Get Unlimited</Link>
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
  }

  return null;
};

export default GuestLimitBanner;
