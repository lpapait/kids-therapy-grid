
import { Therapist, Schedule, Child } from '@/types';

export interface TherapistOverviewCard {
  therapist: Therapist;
  currentWeekHours: number;
  maxWeeklyHours: number;
  utilizationPercentage: number;
  status: 'available' | 'near_limit' | 'overloaded';
  todaySessionsCount: number;
  weekSessionsCount: number;
  nextSession?: {
    time: string;
    childName: string;
    activity: string;
  };
}

export interface TherapistFilters {
  searchQuery: string;
  specialties: string[];
  statusFilter: ('available' | 'near_limit' | 'overloaded')[];
  availabilityFilter: 'all' | 'available_today' | 'has_capacity';
}

export interface ViewMode {
  current: 'grid' | 'list' | 'calendar' | 'capacity';
}

export interface CapacityInsight {
  type: 'warning' | 'critical' | 'info' | 'success';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  onClick: (therapistId: string) => void;
  visible: (therapist: Therapist) => boolean;
}
