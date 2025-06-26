
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
  medications?: string;
  diagnosis: string;
  guardians: Guardian[];
  createdAt: Date;
  createdBy: string;
}

export interface Guardian {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Therapist {
  id: string;
  name: string;
  licenseNumber: string;
  education: string;
  professionalType: string;
  specialties: string[];
  createdAt: Date;
}

export interface ScheduleTemplate {
  id: string;
  childId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  time: string; // HH:mm format
  activity: string;
  therapistId: string;
}

export interface Schedule {
  id: string;
  childId: string;
  therapistId: string;
  date: Date;
  time: string;
  activity: string;
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
