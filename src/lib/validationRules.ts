
import { Schedule, Therapist } from '@/types';
import { addMinutes, differenceInMinutes, format, isSameDay } from 'date-fns';

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  rule: string;
  message: string;
  severity: 'error' | 'warning';
  conflictingSchedules?: Schedule[];
}

export interface ValidationWarning {
  rule: string;
  message: string;
  suggestion?: string;
}

export interface ScheduleValidationContext {
  schedule: Partial<Schedule>;
  existingSchedules: Schedule[];
  therapist: Therapist;
  date: Date;
  time: string;
  duration: number;
}

// Validation Rules Configuration
export const VALIDATION_RULES: ValidationRule[] = [
  {
    id: 'no_double_booking',
    name: 'Prevenção de Duplo Agendamento',
    description: 'Impede agendamentos sobrepostos para o mesmo terapeuta',
    isActive: true,
    priority: 'high'
  },
  {
    id: 'mandatory_break',
    name: 'Intervalo Obrigatório',
    description: 'Garante intervalo mínimo entre sessões',
    isActive: true,
    priority: 'high'
  },
  {
    id: 'daily_limit',
    name: 'Limite Diário',
    description: 'Limita horas máximas por dia',
    isActive: true,
    priority: 'medium'
  },
  {
    id: 'specialty_match',
    name: 'Compatibilidade de Especialidade',
    description: 'Verifica se terapeuta tem especialidade adequada',
    isActive: true,
    priority: 'medium'
  }
];

// Configuration
export const BREAK_TIME_MINUTES = 15; // Minimum break between sessions
export const MAX_DAILY_HOURS = 8; // Maximum hours per day
export const TRAVEL_TIME_MINUTES = 10; // Travel time between locations

// Helper functions
export const parseTimeSlot = (timeSlot: string) => {
  const [startTime] = timeSlot.split('-');
  const [hours, minutes] = startTime.split(':').map(Number);
  return { hours, minutes };
};

export const createDateTime = (date: Date, timeSlot: string) => {
  const { hours, minutes } = parseTimeSlot(timeSlot);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

export const getSessionEndTime = (startTime: Date, duration: number) => {
  return addMinutes(startTime, duration);
};

// Validation functions
export const validateDoubleBooking = (context: ScheduleValidationContext): ValidationResult => {
  const { schedule, existingSchedules, therapist, date, time, duration } = context;
  
  const sessionStart = createDateTime(date, time);
  const sessionEnd = getSessionEndTime(sessionStart, duration);
  
  const conflicts = existingSchedules.filter(existing => 
    existing.therapistId === therapist.id &&
    existing.id !== schedule.id &&
    existing.status !== 'cancelled' &&
    isSameDay(existing.date, date)
  ).filter(existing => {
    const existingStart = createDateTime(existing.date, existing.time);
    const existingEnd = getSessionEndTime(existingStart, existing.duration || 60);
    
    // Check for overlap
    return sessionStart < existingEnd && sessionEnd > existingStart;
  });
  
  return {
    isValid: conflicts.length === 0,
    errors: conflicts.length > 0 ? [{
      rule: 'no_double_booking',
      message: `Conflito de horário detectado. ${therapist.name} já possui ${conflicts.length} sessão(ões) agendada(s) neste período.`,
      severity: 'error',
      conflictingSchedules: conflicts
    }] : [],
    warnings: []
  };
};

export const validateMandatoryBreak = (context: ScheduleValidationContext): ValidationResult => {
  const { schedule, existingSchedules, therapist, date, time, duration } = context;
  
  const sessionStart = createDateTime(date, time);
  const sessionEnd = getSessionEndTime(sessionStart, duration);
  
  const nearbySchedules = existingSchedules.filter(existing => 
    existing.therapistId === therapist.id &&
    existing.id !== schedule.id &&
    existing.status !== 'cancelled' &&
    isSameDay(existing.date, date)
  );
  
  const breakViolations = nearbySchedules.filter(existing => {
    const existingStart = createDateTime(existing.date, existing.time);
    const existingEnd = getSessionEndTime(existingStart, existing.duration || 60);
    
    // Check if there's insufficient break time
    const timeBetween = Math.min(
      Math.abs(differenceInMinutes(sessionStart, existingEnd)),
      Math.abs(differenceInMinutes(existingStart, sessionEnd))
    );
    
    return timeBetween > 0 && timeBetween < BREAK_TIME_MINUTES;
  });
  
  return {
    isValid: breakViolations.length === 0,
    errors: breakViolations.length > 0 ? [{
      rule: 'mandatory_break',
      message: `Intervalo insuficiente entre sessões. Necessário ${BREAK_TIME_MINUTES} minutos de intervalo.`,
      severity: 'error',
      conflictingSchedules: breakViolations
    }] : [],
    warnings: []
  };
};

export const validateDailyLimit = (context: ScheduleValidationContext): ValidationResult => {
  const { schedule, existingSchedules, therapist, date, duration } = context;
  
  const daySchedules = existingSchedules.filter(existing => 
    existing.therapistId === therapist.id &&
    existing.id !== schedule.id &&
    existing.status !== 'cancelled' &&
    isSameDay(existing.date, date)
  );
  
  const totalMinutes = daySchedules.reduce((total, existing) => 
    total + (existing.duration || 60), 0
  ) + duration;
  
  const totalHours = totalMinutes / 60;
  const isValid = totalHours <= MAX_DAILY_HOURS;
  
  return {
    isValid,
    errors: !isValid ? [{
      rule: 'daily_limit',
      message: `Limite diário excedido. Total: ${totalHours.toFixed(1)}h (máximo: ${MAX_DAILY_HOURS}h)`,
      severity: 'error'
    }] : [],
    warnings: totalHours > MAX_DAILY_HOURS * 0.8 ? [{
      rule: 'daily_limit',
      message: `Aproximando do limite diário: ${totalHours.toFixed(1)}h de ${MAX_DAILY_HOURS}h`,
      suggestion: 'Considere distribuir as sessões em outros dias'
    }] : []
  };
};

export const validateSpecialtyMatch = (context: ScheduleValidationContext): ValidationResult => {
  const { schedule, therapist } = context;
  
  if (!schedule.activity) {
    return { isValid: true, errors: [], warnings: [] };
  }
  
  const activitySpecialties = schedule.activity.toLowerCase();
  const therapistSpecialties = therapist.specialties.map(s => s.toLowerCase());
  
  const hasMatchingSpecialty = therapistSpecialties.some(specialty => 
    activitySpecialties.includes(specialty.toLowerCase()) ||
    specialty.includes(activitySpecialties)
  );
  
  return {
    isValid: hasMatchingSpecialty,
    errors: !hasMatchingSpecialty ? [{
      rule: 'specialty_match',
      message: `Especialidade incompatível. ${therapist.name} não possui especialidade em "${schedule.activity}"`,
      severity: 'warning'
    }] : [],
    warnings: []
  };
};

// Main validation function
export const validateSchedule = (context: ScheduleValidationContext): ValidationResult => {
  const validationFunctions = [
    validateDoubleBooking,
    validateMandatoryBreak,
    validateDailyLimit,
    validateSpecialtyMatch
  ];
  
  const results = validationFunctions.map(fn => fn(context));
  
  const allErrors = results.flatMap(result => result.errors);
  const allWarnings = results.flatMap(result => result.warnings);
  
  return {
    isValid: allErrors.filter(error => error.severity === 'error').length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};
