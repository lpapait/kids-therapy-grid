
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
    
    console.log('=== AGENDA SERVICE DEBUG ===');
    console.log('Total schedules:', schedules.length);
    console.log('Filtering for therapist:', therapistId);
    console.log('Week range:', format(weekStart, 'yyyy-MM-dd'), 'to', format(weekEnd, 'yyyy-MM-dd'));

    const therapistSchedules = schedules.filter(schedule => {
      const matchesTherapist = schedule.therapistId === therapistId;
      
      if (matchesTherapist) {
        const scheduleDate = format(schedule.date, 'yyyy-MM-dd');
        const isInWeek = isWithinInterval(schedule.date, { start: weekStart, end: weekEnd });
        console.log(`Schedule ${schedule.id}: ${scheduleDate}, time: ${schedule.time}, activity: ${schedule.activity}, inWeek: ${isInWeek}`);
      }
      
      return matchesTherapist;
    });

    console.log(`Found ${therapistSchedules.length} schedules for therapist ${therapistId}`);

    const filteredSchedules = therapistSchedules.filter(schedule => {
      // Filter by week
      const isInWeek = isWithinInterval(schedule.date, { start: weekStart, end: weekEnd });
      if (!isInWeek) return false;

      // Apply additional filters
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

    console.log(`Final filtered schedules: ${filteredSchedules.length}`);
    console.log('=== END DEBUG ===');

    return filteredSchedules;
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
