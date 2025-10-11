// User and Authentication Types
export interface User {
  _id: string;
  id?: string; // Keep for backward compatibility
  email: string;
  fullName: string;
  role: 'user' | 'vet' | 'admin';
  petName?: string;
  petType?: string;
  phoneNumber?: string;
  address?: string;
  isBanned?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  petName?: string;
  petType?: string;
  phoneNumber?: string;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  isNewUser?: boolean;
}

// Pet Types
export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  color?: string;
  medicalHistory?: string;
  allergies?: string;
  photoUrl?: string;
  owner: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePetRequest {
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  color?: string;
  medicalHistory?: string;
  allergies?: string;
}

// Vet Types
export interface Vet {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  specialization?: string;
  experience?: number;
  verified: boolean;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVetRequest {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  specialization?: string;
  experience?: number;
}

export interface VetSearchParams {
  latitude?: number;
  longitude?: number;
  maxDistance?: number;
  specialization?: string;
  verified?: boolean;
}

// Appointment Types
export interface Appointment {
  id: string;
  userId: string;
  vetId: string;
  petId: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  user?: User;
  vet?: Vet;
  pet?: Pet;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppointmentRequest {
  vetId: string;
  petId: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
}

// Symptom Checker Types
export interface SymptomAnalysisRequest {
  symptoms: string;
  petType?: string;
  petAge?: number;
  photoUrl?: string;
}

export interface SymptomAnalysisResponse {
  conditions: Array<{
    name: string;
    urgency: 'low' | 'moderate' | 'high';
    description: string;
    firstAidTips: string[];
    recommendations: string[];
  }>;
  overallUrgency: 'low' | 'moderate' | 'high';
  disclaimerShown: boolean;
}

// Resource/Article Types
export interface Article {
  id: string;
  title: string;
  content: string;
  category: 'nutrition' | 'training' | 'health' | 'general';
  author?: string;
  imageUrl?: string;
  tags?: string[];
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  category: 'nutrition' | 'training' | 'health' | 'general';
  author?: string;
  imageUrl?: string;
  tags?: string[];
  published?: boolean;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  totalPets: number;
  totalVets: number;
  totalAppointments: number;
  totalArticles?: number;
  activeUsers?: number;
  pendingAppointments: number;
  publishedArticles?: number;
  recentUsers?: number;
  recentAppointments?: number;
  usersByRole?: Record<string, number>;
  appointmentsByStatus?: Record<string, number>;
  articlesByCategory?: Record<string, number>;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasMore: boolean;
  };
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
