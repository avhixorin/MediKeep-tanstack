export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

export enum AppointmentStatus {
  "IDLE" = "request",
  "REQUESTED" = "requested" ,
  "SCHEDULED" = "scheduled" , 
  "COMPLETED" = "completed" , 
  "RESCHEDULED" = "rescheduled" , 
  "CANCELLED" = "cancelled",
  "DECLINED" = "declined"
}

export type RegistrationFormData = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone: string;
  medicalLicenseNumber?: string;
  password: string;
  confirmPassword: string;
};

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  profilePicture?: string;
  bio?: string;
  about?: string;
  settingPreferences?: UserSettingsPreferences;
  connections: string[];
  connectionRequests: string[];
  appointments: Appointment[];
  appointmentRequests: Appointment[];
  notifications: Notification[];
  messages?: ChatMessage[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Populated on /users/verify: the clinically-connected patients (for a
  // doctor) or doctors (for a patient), sourced from the User model's
  // patients[]/doctors[] arrays.
  patients?: User[];
  doctors?: User[];
}

export interface UserSettingsPreferences {
  general?: {
    theme?: 'light' | 'dark';
    language?: 'en' | 'hi';
    accountPrivacy?: 'Public' | 'Private';
  };
  security?: {
    twoFactorAuth?: boolean;
    isAccountActive?: boolean;
  };
  billing?: {
    plan?: 'Free' | 'Premium';
    creditCard?: {
      cardNumber?: string;
      expiryDate?: string;
      cvv?: string;
    };
    billingAddress?: {
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    billingHistory?: Array<{
      date: string;
      amount: number;
      status: string;
    }>;
  };
  notifications?: {
    isEnabled?: boolean;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
    promotionalEmails?: boolean;
    notificationSound?: boolean;
    weeklyDigest?: boolean;
  };
}

export interface Doctor extends User {
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  hospital?: string;
}

export interface Notification {
  type: 'connection' | 'appointment' | 'message' | 'system';
  message: string;
  time: string;
  read: boolean;
  from?: Partial<User>;
}

export interface ChatMessage {
  messageId: string;
  message: string;
  sender: string;
  timestamp: string;
  isRead?: boolean;
  attachments?: FileAttachment[];
}

export interface ChatConversation {
  friendId: string;
  chatHistory: ChatMessage[];
  friend?: User;
  unreadCount?: number;
}

export interface FileAttachment {
  name: string;
  type: string;
  size: number;
  url: string;
}

export type ProcessingStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type DocumentType =
  | 'PRESCRIPTION'
  | 'BLOOD_REPORT'
  | 'ECG_REPORT'
  | 'XRAY_REPORT'
  | 'OTHER';

export interface MedicalRecord {
  _id: string;
  title?: string;
  notes?: string;
  fileName: string;
  fileType: string;
  size?: number;
  url?: string;
  uploadedBy: User;
  patient: User;
  doctor: User;
  uploadedByRole?: 'PATIENT' | 'DOCTOR';
  connectionId: string;
  uploadedAt: string;
  extractedText?: string;

  processingStatus: ProcessingStatus;
  documentType?: DocumentType;
  documentDate?: string;
  structuredData?: Record<string, unknown>;
  chunkCount: number;
  processingError?: string;
  processingStartedAt?: string;
  processingCompletedAt?: string;
  retryCount: number;
}

export interface Appointment {
  _id: string;
  patient: User;
  doctor: User;
  date: string;
  time: string;
  status: AppointmentStatus;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentRequestData {
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  status?: AppointmentStatus;
}

export interface AppointmentRescheduleData {
  date?: string;
  time?: string;
  reason?: string;
}

export interface AppointmentsData {
  appointments: Appointment[];
  appointmentRequests: Appointment[];
}

export interface HealthVital {
  _id: string;
  userId: string;
  type: 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'weight' | 'height' | 'temperature' | 'oxygen_saturation';
  value: number;
  unit: string;
  recordedAt: string;
  notes?: string;
}

export interface VideoCallState {
  isInCall: boolean;
  isIncomingCall: boolean;
  caller?: User;
  callee?: User;
  roomId?: string;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}
