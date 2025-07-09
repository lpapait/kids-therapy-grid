
import { Schedule, Therapist } from '@/types';
import { AgendaStats, AgendaFilters } from '../types/agenda.types';
import { format, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';

export class AgendaService {
  static filterSchedules(
    schedules: Schedule[],
    therapistId: string,
    selectedWeek: Date,
    filters: AgendaFilters,
    getTherapistById: (id: string) => Therapist | undefined
  ): Schedule[] {
    const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });

    return schedules.filter(schedule => {
      // Filter by therapist and week
      if (schedule.therapistId !== therapistId) return false;
      if (!isWithinInterval(schedule.date, { start: weekStart, end: weekEnd })) return false;

      // Apply filters
      if (filters.status.length > 0 && !filters.status.includes(schedule.status)) return false;
      
      if (filters.specialties.length > 0) {
        const therapist = getTherapistById(schedule.therapistId);
        if (!therapist || !filters.specialties.some(spec => therapist.specialties.includes(spec))) {
          return false;
        }
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const therapist = getTherapistById(schedule.therapistId);
        if (
          !schedule.activity.toLowerCase().includes(query) &&
          !therapist?.name.toLowerCase().includes(query) &&
          !schedule.observations?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }

  static calculateStats(schedules: Schedule[], therapist: Therapist): AgendaStats {
    const totalScheduled = schedules.length;
    const confirmedSessions = schedules.filter(s => s.status === 'scheduled').length;
    const pendingSessions = schedules.filter(s => s.status === 'rescheduled').length;
    const cancelledSessions = schedules.filter(s => s.status === 'cancelled').length;
    const completedSessions = schedules.filter(s => s.status === 'completed').length;
    
    const totalHours = schedules.reduce((sum, schedule) => sum + (schedule.duration / 60), 0);
    const maxHours = therapist?.weeklyWorkloadHours || 40;
    
    return {
      totalScheduled,
      confirmedSessions,
      pendingSessions,
      cancelledSessions,
      completedSessions,
      totalHours,
      maxHours,
      utilizationPercentage: (totalHours / maxHours) * 100
    };
  }
}
