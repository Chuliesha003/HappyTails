import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authService } from '@/services/auth';
import type { User as ApiUser } from '@/types/api';

export type UserRole = 'guest' | 'user' | 'vet' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  petName?: string;
  petType?: string;
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
  logout: () => Promise<void>;
  incrementGuestUsage: () => void;
  canUseSymptomChecker: () => boolean;
  canAccessFeature: (feature: string) => boolean;
  isRegistered: () => boolean;
  isGuest: () => boolean;
  isAdmin: () => boolean;
  isVet: () => boolean;
  getUserRole: () => UserRole;
}

export interface RegisterData {
  fullName: string;
  email: string;
  petName?: string;
  petType?: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  GUEST_USAGE: 'happytails_guest_usage'
};

// Helper to convert API user to local user format
const convertApiUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    fullName: apiUser.fullName,
    role: apiUser.role as UserRole,
    phoneNumber: apiUser.phoneNumber,
    address: apiUser.address,
    petName: apiUser.petName,
    petType: apiUser.petType,
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestUsageCount, setGuestUsageCount] = useState(0);
  const maxGuestUsage = 2;

  // Initialize auth state from Firebase + backend
  useEffect(() => {
    const savedUsage = sessionStorage.getItem(STORAGE_KEYS.GUEST_USAGE);
    if (savedUsage) {
      setGuestUsageCount(parseInt(savedUsage, 10));
    }

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        try {
          // Get user details from backend
          const apiUser = await authService.getCurrentUser();
          setUser(convertApiUser(apiUser));
        } catch (error) {
          console.error('Error fetching user from backend:', error);
          // If backend fails, sign out from Firebase
          await signOut(auth);
          setUser(null);
        }
      } else {
        // No authenticated user - set as guest
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // First, authenticate with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // Firebase will trigger onAuthStateChanged which will:
      // 1. Fetch user from backend
      // 2. Set user state
      
      // Clear guest usage when user logs in
      setGuestUsageCount(0);
      sessionStorage.removeItem(STORAGE_KEYS.GUEST_USAGE);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Starting registration for:', userData.email);
      
      // First, create Firebase account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      console.log('Firebase user created:', userCredential.user.uid);
      
      // Get Firebase ID token to send to backend
      const idToken = await userCredential.user.getIdToken();
      
      console.log('Got Firebase ID token, sending to backend...');
      
      // Register with backend (backend will verify Firebase token)
      const response = await authService.registerOrLogin({
        idToken: idToken,
        fullName: userData.fullName,
      });
      
      console.log('Backend response:', response);
      
      // Set user state
      setUser(convertApiUser(response.user));
      
      // If user provided pet information during registration, create the pet
      if (userData.petName && userData.petType && response.isNewUser) {
        console.log('Creating initial pet:', userData.petName);
        try {
          // Import pets service dynamically to avoid circular dependencies
          const { petsService } = await import('@/services/pets');
          await petsService.createPet({
            name: userData.petName,
            species: userData.petType,
            breed: 'Unknown', // Default value
            age: 0, // Default value - user can update later
            weight: 0, // Default value - user can update later
            gender: 'male', // Default value - user can update later
          });
          console.log('Initial pet created successfully');
        } catch (petError) {
          console.error('Failed to create initial pet:', petError);
          // Don't fail registration if pet creation fails
        }
      }
      
      // Clear guest usage when user registers
      setGuestUsageCount(0);
      sessionStorage.removeItem(STORAGE_KEYS.GUEST_USAGE);
      
      console.log('Registration successful!');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear backend token
      await authService.logout();
      
      // Reset to guest state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if logout fails
      setUser(null);
    }
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
    // All authenticated users can access features
    return true;
  };

  const isRegistered = (): boolean => !!user;
  const isGuest = (): boolean => !user;
  const isAdmin = (): boolean => user?.role === 'admin';
  const isVet = (): boolean => user?.role === 'vet';
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
    isVet,
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
