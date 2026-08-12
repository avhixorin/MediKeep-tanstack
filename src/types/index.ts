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
  connections: string[];
  connectionRequests: string[];
  appointments: Appointment[];
  notifications: Notification[];
  messages?: ChatMessage[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor extends User {
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  hospital?: string;
  appointmentRequests: string[];
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

export interface MedicalRecord {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  files: MedicalFile[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicalFile {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Appointment {
  _id: string;
  patient: User;
  doctor: User;
  date: string;
  time: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
