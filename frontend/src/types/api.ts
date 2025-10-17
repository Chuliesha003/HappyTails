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

export interface FileAttachment {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileType: string; // 'pdf', 'doc', 'docx', 'image', etc.
  uploadedAt?: string;
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
  age?: number;
  ageUnit?: string;
  dateOfBirth?: string;
  weight?: number;
  weightUnit?: string;
  gender?: string;
  color?: string;
  microchipId?: string;
  owner: string | User;
  medicalHistory?: MedicalRecord[];
  vaccinations?: Vaccination[];
  vaccineCards?: VaccineCard[];
  medicalReports?: MedicalReport[];
  surgeries?: Surgery[];
  prescriptions?: Prescription[];
  allergies?: string[];
  medications?: Medication[];
  specialNeeds?: string;
  photoUrl?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalRecord {
  date: string;
  condition: string;
  diagnosis?: string;
  treatment?: string;
  veterinarian?: string;
  notes?: string;
  medications?: Medication[];
  attachments?: FileAttachment[];
}

export interface Vaccination {
  name: string;
  date: string;
  nextDueDate?: string;
  administeredBy?: string;
  notes?: string;
}

export interface VaccineCard {
  cardNumber?: string;
  issueDate: string;
  expiryDate?: string;
  issuingAuthority?: string;
  cardImageUrl?: string;
  notes?: string;
  attachments?: FileAttachment[];
}

export interface MedicalReport {
  reportType: string;
  reportDate: string;
  veterinarian: string;
  diagnosis?: string;
  findings?: string;
  recommendations?: string;
  reportFileUrl?: string;
  notes?: string;
}

export interface Surgery {
  surgeryType: string;
  surgeryDate: string;
  surgeon: string;
  clinic?: string;
  anesthesia?: string;
  complications?: string;
  recoveryInstructions?: string;
  followUpDate?: string;
  surgeryReportUrl?: string;
  notes?: string;
}

export interface Prescription {
  medicationName: string;
  prescriptionDate: string;
  prescribingVet: string;
  dosage: string;
  frequency: string;
  duration?: string;
  quantity?: string;
  refillsRemaining?: number;
  instructions?: string;
  prescriptionFileUrl?: string;
  status?: 'Active' | 'Completed' | 'Discontinued';
  notes?: string;
}

export interface Medication {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface CreatePetRequest {
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  gender: 'Male' | 'Female' | 'Unknown';
  color?: string;
  allergies?: string[];
}

// Vet Types
export interface Vet {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string; // legacy client-side field; actual values live under location
  city?: string;    // legacy; prefer location.city
  state?: string;   // legacy; prefer location.state
  zipCode?: string; // legacy; prefer location.zipCode
  clinicName?: string;
  licenseNumber?: string;
  specialization?: string | string[];
  experience?: number; // legacy; prefer yearsOfExperience
  yearsOfExperience?: number;
  verified?: boolean;   // legacy; prefer isVerified
  isVerified?: boolean;
  reviewCount?: number;
  rating?: number;
  consultationFee?: number;
  active?: boolean;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
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
  city?: string;
  specialization?: string;
  verified?: boolean;

  // ✅ add this line to make it compatible with Record<string, unknown>
  [key: string]: string | number | boolean | undefined;
}


export interface VetCitiesResponse {
  cities: string[];
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
  // Optional detailed per-condition responses populated by the backend
  detailedResponses?: Record<
    string,
    {
      headline: string;
      summary: string;
      immediateCare?: string[];
      redFlags?: string[];
      prevention?: string[];
      whatToTellVet?: string;
    }
  >;
}

// Symptom Check Types
export interface SymptomCheck {
  _id: string;
  user?: string;
  pet?: {
    _id: string;
    name: string;
    species: string;
    breed?: string;
  };
  symptoms: string;
  imageUrl?: string;
  aiResponse: {
    possibleConditions: Array<{
      name: string;
      severity: 'low' | 'moderate' | 'high' | 'emergency';
      confidence?: number;
      description?: string;
      recommendations?: string[];
    }>;
    urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
    recommendations: string[];
    disclaimer: string;
  };
  followUpAction: 'none' | 'monitor' | 'schedule' | 'emergency';
  appointmentBooked: boolean;
  relatedAppointment?: string;
  guestSession?: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
  timeSince?: string;
  isUrgent?: boolean;
}
export interface Article {
  id: string;
  title: string;
  content: string;
  category: 'nutrition' | 'training' | 'health' | 'general';
  author?: string;
  authorName?: string;
  imageUrl?: string;
  images?: string[];
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
