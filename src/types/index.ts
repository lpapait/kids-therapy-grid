export interface User {
  id: string;
  name: string;
  email: string;
  role: 'moderator' | 'therapist';
  licenseNumber?: string;
  education?: string;
  specialties?: string[];
  createdAt: Date;
}

export interface Child {
  id: string;
  name: string;
  birthDate: Date;
  gender: 'male' | 'female';
  cpf?: string;
  susCard?: string;
  medications?: string;
  diagnosis: string;
  address?: Address;
  guardians: Guardian[];
  weeklyTherapies: WeeklyTherapy[];
  createdAt: Date;
  createdBy: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export interface WeeklyTherapy {
  specialty: string;
  hoursRequired: number;
}

export interface Guardian {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  cpf?: string;
}

export interface Therapist {
  id: string;
  name: string;
  cpf?: string;
  licenseNumber: string;
  education: string;
  professionalType: string;
  specialties: string[];
  phone?: string;
  email?: string;
  address?: Address;
  workSchedule?: WorkSchedule;
  color: string;
  weeklyWorkloadHours: number;
  createdAt: Date;
}

export interface WorkSchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface ScheduleTemplate {
  id: string;
  childId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  time: string; // HH:mm format
  activity: string;
  therapistId: string;
  duration: number; // Duration in minutes
}

export interface Schedule {
  id: string;
  childId: string;
  therapistId: string;
  date: Date;
  time: string;
  activity: string;
  duration: number; // Duration in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
}

export interface ScheduleHistory {
  id: string;
  scheduleId: string;
  changeType: 'created' | 'updated' | 'cancelled' | 'rescheduled' | 'completed';
  previousValues: Partial<Schedule>;
  newValues: Partial<Schedule>;
  changedFields: string[];
  reason?: string;
  changedBy: string;
  changedAt: Date;
}

export interface ScheduleChange {
  field: keyof Schedule;
  oldValue: any;
  newValue: any;
}

export interface TherapyCoverage {
  specialty: string;
  hoursRequired: number;
  hoursScheduled: number;
  percentage: number;
  status: 'complete' | 'partial' | 'missing';
}

export interface TherapistWorkload {
  therapistId: string;
  hoursScheduled: number;
  maxHours: number;
  percentage: number;
  status: 'available' | 'near_limit' | 'overloaded';
  remainingHours: number;
  suggestedActions?: string[];
}

export const SPECIALTIES = [
  'Terapia Ocupacional',
  'Fisioterapia',
  'Fonoaudiologia',
  'Psicologia',
  'Psicopedagogia',
  'Musicoterapia',
  'Equoterapia',
  'Hidroterapia'
];

export const PROFESSIONAL_TYPES = [
  'Terapeuta Ocupacional',
  'Fisioterapeuta',
  'Fonoaudiólogo',
  'Psicólogo',
  'Psicopedagogo',
  'Musicoterapeuta',
  'Educador Físico',
  'Enfermeiro'
];

export const SESSION_DURATIONS = [30, 45, 60, 90, 120]; // in minutes

export const DURATION_LABELS: Record<number, string> = {
  30: '30 min',
  45: '45 min',
  60: '1 hora',
  90: '1h 30min',
  120: '2 horas'
};

export const RELATIONSHIP_TYPES = [
  'Mãe',
  'Pai',
  'Avó',
  'Avô',
  'Tia',
  'Tio',
  'Responsável Legal',
  'Outro'
];

export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export interface ScheduleSuggestion {
  id: string;
  dayOfWeek: number;
  date: Date;
  time: string;
  therapistId: string;
  therapistName: string;
  therapistWorkload: number;
  maxWorkload: number;
  priority: number;
  available: boolean;
  conflictReason?: string;
}
