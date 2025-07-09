
export type ViewMode = 'grid' | 'list' | 'calendar' | 'capacity';

export interface TherapistFilters {
  searchQuery: string;
  specialties: string[];
  statusFilter: ('available' | 'near_limit' | 'overloaded')[];
  availabilityFilter: 'all' | 'available_today' | 'has_capacity';
}

export interface TherapistOverviewCard {
  therapist: {
    id: string;
    name: string;
    professionalType: string;
    specialties: string[];
    color: string;
    weeklyWorkloadHours: number;
  };
  currentWeekHours: number;
  maxWeeklyHours: number;
  availableHours: number;
  utilizationPercentage: number;
  status: 'available' | 'near_limit' | 'overloaded';
  todaySessionsCount: number;
  weekSessionsCount: number;
  upcomingSessions: Array<{
    time: string;
    childName: string;
    activity: string;
  }>;
  nextSession?: {
    time: string;
    childName: string;
    activity: string;
  };
}

export interface CapacityInsight {
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  priority: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface QuickScheduleRequest {
  therapistId: string;
  childId: string;
  date: Date;
  time: string;
  duration: number;
  activity: string;
  notes?: string;
}
