import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'guest' | 'registered' | 'admin';

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
  isAdmin: () => boolean;
  getUserRole: () => UserRole;
}

export interface RegisterData {
  fullName: string;
  email: string;
  petName: string;
  petType: string;
  password: string;
}

// Email-based role configuration with specific credentials
const EMAIL_ROLES: Record<string, { role: UserRole; features: string[]; password?: string }> = {
  // Admin accounts (full access)
  'admin@happytails.com': { 
    role: 'admin', 
    features: ['symptom-checker', 'vet-finder', 'pet-records', 'admin-dashboard'],
    password: 'admin123'
  },

  // Demo admin account
  'demo.admin@happytails.com': { 
    role: 'admin', 
    features: ['symptom-checker', 'vet-finder', 'pet-records', 'admin-dashboard'],
    password: 'demo123'
  },

  // Regular user accounts
  'user@happytails.com': { 
    role: 'registered', 
    features: ['symptom-checker', 'vet-finder', 'pet-records', 'user-dashboard'],
    password: 'user123'
  },

  // Demo user accounts
  'demo.user@happytails.com': { 
    role: 'registered', 
    features: ['symptom-checker', 'vet-finder', 'pet-records', 'user-dashboard'],
    password: 'demo123'
  },
};

const DEFAULT_REGISTERED_FEATURES = ['symptom-checker', 'vet-finder', 'pet-records', 'user-dashboard'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'happytails_user',
  GUEST_USAGE: 'happytails_guest_usage'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestUsageCount, setGuestUsageCount] = useState(0);
  const maxGuestUsage = 2;

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const savedUsage = sessionStorage.getItem(STORAGE_KEYS.GUEST_USAGE);
      
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
        // Validate password for configured accounts
        if (emailConfig.password && password !== emailConfig.password) {
          return false; // Invalid password
        }
        
        // Use configured role and features
        const getFullName = (email: string, role: UserRole) => {
          if (email === 'admin@happytails.com') return 'Administrator';
          if (email === 'demo.admin@happytails.com') return 'Demo Administrator';
          if (email === 'user@happytails.com') return 'User';
          if (email === 'demo.user@happytails.com') return 'Demo User';
          
          // Generate name from email
          const namePart = email.split('@')[0].replace(/[._]/g, ' ');
          return namePart.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        };

        loggedInUser = {
          id: Date.now().toString(),
          email,
          fullName: getFullName(email, emailConfig.role),
          role: emailConfig.role,
          features: emailConfig.features
        };
      } else {
        // Default to registered user for unlisted emails
        loggedInUser = {
          id: Date.now().toString(),
          email,
          fullName: 'Registered User',
          role: 'registered',
          features: DEFAULT_REGISTERED_FEATURES
        };
      }
      
      setUser(loggedInUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser));
      
      // Clear guest usage when user logs in
      setGuestUsageCount(0);
      sessionStorage.removeItem(STORAGE_KEYS.GUEST_USAGE);
      
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
        // Default to registered user for unlisted emails
        newUser = {
          id: Date.now().toString(),
          email: userData.email,
          fullName: userData.fullName,
          role: 'registered',
          features: DEFAULT_REGISTERED_FEATURES
        };
      }
      
      setUser(newUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      
      // Clear guest usage when user registers
      setGuestUsageCount(0);
      sessionStorage.removeItem(STORAGE_KEYS.GUEST_USAGE);
      
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
      sessionStorage.setItem(STORAGE_KEYS.GUEST_USAGE, newCount.toString());
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
  const isAdmin = (): boolean => user?.role === 'admin';
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
    isAdmin,
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
