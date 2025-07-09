
export interface TherapistScheduleOverview {
  therapistId: string;
  therapistName: string;
  specialties: string[];
  color: string;
  hoursScheduled: number;
  maxHours: number;
  percentage: number;
  status: 'available' | 'near_limit' | 'overloaded';
  weeklyGrid: Array<Array<{
    date: Date;
    time: string;
    session?: {
      id: string;
      childName: string;
      activity: string;
      specialty: string;
      status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    };
    isEmpty: boolean;
  }>>;
  availableSlots: number;
  sessionsCount: number;
  administrativeHours: number;
}

export interface TherapistOverviewCardProps {
  therapist: TherapistScheduleOverview;
  onSessionClick?: (sessionId: string) => void;
  onSlotClick?: (therapistId: string, date: Date, time: string) => void;
}
