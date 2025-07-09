
import { Schedule, Therapist, Child } from '@/types';

export interface AgendaFilters {
  specialties: string[];
  status: Schedule['status'][];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery: string;
}

export interface AgendaStats {
  totalScheduled: number;
  confirmedSessions: number;
  pendingSessions: number;
  cancelledSessions: number;
  completedSessions: number;
  totalHours: number;
  maxHours: number;
  utilizationPercentage: number;
}

export interface SessionActionContext {
  schedule: Schedule;
  therapist: Therapist;
  child: Child | null;
}

export interface WorkloadAnalysis {
  current: number;
  maximum: number;
  percentage: number;
  status: 'available' | 'near_limit' | 'overloaded';
  suggestions: string[];
}
