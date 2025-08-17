import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'guest' | 'basic' | 'premium' | 'veterinarian';

export interface User {
  id?: string;
  email?: string;
  fullName?: string;
  role: UserRole;
  features: string[];
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  guestUsageCount: number;
  maxGuestUsage: number;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  incrementGuestUsage: () => void;
  canUseSymptomChecker: () => boolean;
  canAccessFeature: (feature: string) => boolean;
  isRegistered: () => boolean;
  isGuest: () => boolean;
  isPremium: () => boolean;
  isVeterinarian: () => boolean;
  getUserRole: () => UserRole;
}

export interface RegisterData {
  fullName: string;
  email: string;
  petName: string;
  petType: string;
  password: string;
}

// Email-based role configuration
const EMAIL_ROLES: Record<string, { role: UserRole; features: string[] }> = {
  // Veterinarian accounts (full access)
  'vet@happytails.com': { 
    role: 'veterinarian', 
    features: ['symptom-checker', 'vet-finder', 'pet-records', 'vet-dashboard', 'premium-support', 'analytics'] 
  },
  'dr.smith@vetclinic.com': { 
    role: 'veterinarian', 
    features: ['symptom-checker', 'vet-finder', 'pet-records', 'vet-dashboard', 'premium-support', 'analytics'] 
  },
  'admin@happytails.com': { 
    role: 'veterinarian', 
    features: ['symptom-checker', 'vet-finder', 'pet-records', 'vet-dashboard', 'premium-support', 'analytics'] 
  },
  
  // Premium user accounts (most features)
  'premium@test.com': { 
    role: 'premium', 
    features: ['symptom-checker', 'vet-finder', 'pet-records', 'premium-support'] 
  },
  'john.doe@gmail.com': { 
    role: 'premium', 
    features: ['symptom-checker', 'vet-finder', 'pet-records', 'premium-support'] 
  },
  'sarah.wilson@email.com': { 
    role: 'premium', 
    features: ['symptom-checker', 'vet-finder', 'pet-records', 'premium-support'] 
  },
  
  // Basic user accounts (limited features)
  'user@test.com': { 
    role: 'basic', 
    features: ['symptom-checker', 'vet-finder'] 
  },
  'basic@example.com': { 
    role: 'basic', 
    features: ['symptom-checker', 'vet-finder'] 
  },
  'demo@happytails.com': { 
    role: 'basic', 
    features: ['symptom-checker', 'vet-finder'] 
  }
};

const DEFAULT_BASIC_FEATURES = ['symptom-checker', 'vet-finder'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'happytails_user',
  GUEST_USAGE: 'happytails_guest_usage'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestUsageCount, setGuestUsageCount] = useState(0);
  const maxGuestUsage = 3;

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const savedUsage = localStorage.getItem(STORAGE_KEYS.GUEST_USAGE);
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Set as guest user
        setUser({ role: 'guest', features: [] });
      }
      
      if (savedUsage) {
        setGuestUsageCount(parseInt(savedUsage, 10));
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      setUser({ role: 'guest', features: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Check if email has specific role configuration
      const emailConfig = EMAIL_ROLES[email.toLowerCase()];
      
      let loggedInUser: User;
      if (emailConfig) {
        // Use configured role and features
        loggedInUser = {
          id: Date.now().toString(),
          email,
          fullName: emailConfig.role === 'veterinarian' ? 'Dr. ' + email.split('@')[0] : 
                    emailConfig.role === 'premium' ? 'Premium User' : 'Basic User',
          role: emailConfig.role,
          features: emailConfig.features
        };
      } else {
        // Default to basic user for unlisted emails
        loggedInUser = {
          id: Date.now().toString(),
          email,
          fullName: 'Basic User',
          role: 'basic',
          features: DEFAULT_BASIC_FEATURES
        };
      }
      
      setUser(loggedInUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser));
      
      // Clear guest usage when user logs in
      setGuestUsageCount(0);
      localStorage.removeItem(STORAGE_KEYS.GUEST_USAGE);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Check if email has specific role configuration
      const emailConfig = EMAIL_ROLES[userData.email.toLowerCase()];
      
      let newUser: User;
      if (emailConfig) {
        // Use configured role and features
        newUser = {
          id: Date.now().toString(),
          email: userData.email,
          fullName: userData.fullName,
          role: emailConfig.role,
          features: emailConfig.features
        };
      } else {
        // Default to basic user for unlisted emails
        newUser = {
          id: Date.now().toString(),
          email: userData.email,
          fullName: userData.fullName,
          role: 'basic',
          features: DEFAULT_BASIC_FEATURES
        };
      }
      
      setUser(newUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      
      // Clear guest usage when user registers
      setGuestUsageCount(0);
      localStorage.removeItem(STORAGE_KEYS.GUEST_USAGE);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser({ role: 'guest', features: [] });
    localStorage.removeItem(STORAGE_KEYS.USER);
    // Keep guest usage count when logging out
  };

  const incrementGuestUsage = () => {
    if (user?.role === 'guest') {
      const newCount = guestUsageCount + 1;
      setGuestUsageCount(newCount);
      localStorage.setItem(STORAGE_KEYS.GUEST_USAGE, newCount.toString());
    }
  };

  const canUseSymptomChecker = (): boolean => {
    if (user?.role !== 'guest') return true;
    return guestUsageCount < maxGuestUsage;
  };

  const canAccessFeature = (feature: string): boolean => {
    if (!user) return false;
    if (user.role === 'guest') return false;
    return user.features.includes(feature);
  };

  const isRegistered = (): boolean => user?.role !== 'guest' && user?.role !== undefined;
  const isGuest = (): boolean => user?.role === 'guest';
  const isPremium = (): boolean => user?.role === 'premium';
  const isVeterinarian = (): boolean => user?.role === 'veterinarian';
  const getUserRole = (): UserRole => user?.role || 'guest';

  const value: AuthContextType = {
    user,
    isLoading,
    guestUsageCount,
    maxGuestUsage,
    login,
    register,
    logout,
    incrementGuestUsage,
    canUseSymptomChecker,
    canAccessFeature,
    isRegistered,
    isGuest,
    isPremium,
    isVeterinarian,
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
