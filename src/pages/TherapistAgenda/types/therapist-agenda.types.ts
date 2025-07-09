
export interface TherapistOverviewCard {
  therapist: {
    id: string;
    name: string;
    professionalType: string;
    specialties: string[];
    color: string;
    phone?: string;
    email?: string;
    weeklyWorkloadHours: number;
  };
  currentWeekHours: number;
  maxWeeklyHours: number;
  utilizationPercentage: number;
  status: 'available' | 'near_limit' | 'overloaded';
  todaySessionsCount: number;
  weekSessionsCount: number;
  availableHours: number;
  nextSession?: {
    time: string;
    childName: string;
    activity: string;
    date: Date;
  };
  upcomingSessions: Array<{
    id: string;
    time: string;
    childName: string;
    activity: string;
    date: Date;
  }>;
}

export interface TherapistFilters {
  searchQuery: string;
  specialties: string[];
  statusFilter: ('available' | 'near_limit' | 'overloaded')[];
  availabilityFilter: 'all' | 'available_today' | 'has_capacity' | 'free_now';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface CapacityInsight {
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  therapistId?: string;
  priority: number;
}

export interface QuickScheduleRequest {
  therapistId: string;
  childId?: string;
  specialty?: string;
  preferredTime?: string;
  duration?: number;
  notes?: string;
}

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ComponentType;
  action: (therapistIds: string[]) => void;
  requiresConfirmation?: boolean;
}

export type ViewMode = 'grid' | 'list' | 'calendar' | 'capacity';

export interface AgendaPreviewData {
  therapistId: string;
  sessions: Array<{
    id: string;
    time: string;
    date: Date;
    childName: string;
    activity: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    duration: number;
  }>;
  availableSlots: Array<{
    time: string;
    date: Date;
    duration: number;
  }>;
  workloadSummary: {
    totalHours: number;
    completedHours: number;
    remainingHours: number;
    utilizationPercentage: number;
  };
}
