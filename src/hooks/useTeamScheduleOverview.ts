
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { isSameWeek, format, startOfWeek, addDays } from 'date-fns';
import { BREAK_TIME_MINUTES } from '@/lib/validationRules';

interface TherapistScheduleOverview {
  therapistId: string;
  therapistName: string;
  specialties: string[];
  color: string;
  hoursScheduled: number;
  maxHours: number;
  percentage: number;
  status: 'available' | 'near_limit' | 'overloaded';
  weeklyGrid: WeeklySlot[][];
  availableSlots: number;
  sessionsCount: number;
}

interface WeeklySlot {
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
}

interface TeamInsights {
  overloadedTherapists: string[];
  availableTherapists: { id: string; name: string; availableHours: number }[];
  topSpecialties: { specialty: string; count: number; percentage: number }[];
  pendingGoals: number;
  totalSessions: number;
  totalAvailableSlots: number;
}

export const useTeamScheduleOverview = (
  selectedWeek: Date,
  specialtyFilter?: string,
  therapistSearch?: string
) => {
  const { schedules, therapists, children } = useData();

  const filteredTherapists = useMemo(() => {
    let filtered = therapists;
    
    if (specialtyFilter) {
      filtered = filtered.filter(t => t.specialties.includes(specialtyFilter));
    }
    
    if (therapistSearch) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(therapistSearch.toLowerCase())
      );
    }
    
    return filtered;
  }, [therapists, specialtyFilter, therapistSearch]);

  const therapistOverviews = useMemo((): TherapistScheduleOverview[] => {
    const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    const workingHours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    
    return filteredTherapists.map(therapist => {
      const weekSchedules = schedules.filter(schedule => 
        schedule.therapistId === therapist.id &&
        isSameWeek(schedule.date, selectedWeek) &&
        schedule.status !== 'cancelled'
      );

      // Calculate workload
      const totalMinutesScheduled = weekSchedules.reduce((total, schedule) => {
        const sessionDuration = schedule.duration || 60;
        return total + sessionDuration + BREAK_TIME_MINUTES;
      }, 0);
      
      const adjustedMinutes = Math.max(0, totalMinutesScheduled - BREAK_TIME_MINUTES);
      const hoursScheduled = Math.round((adjustedMinutes / 60) * 10) / 10;
      const maxHours = therapist.weeklyWorkloadHours;
      const percentage = Math.round((hoursScheduled / maxHours) * 100);

      let status: TherapistScheduleOverview['status'];
      if (percentage >= 100) {
        status = 'overloaded';
      } else if (percentage >= 80) {
        status = 'near_limit';
      } else {
        status = 'available';
      }

      // Build weekly grid (5 days x 9 hours)
      const weeklyGrid: WeeklySlot[][] = [];
      
      for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
        const currentDate = addDays(weekStart, dayIndex);
        const daySlots: WeeklySlot[] = [];
        
        for (const timeSlot of workingHours) {
          const daySchedule = weekSchedules.find(s => 
            format(s.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd') &&
            s.time === timeSlot
          );
          
          if (daySchedule) {
            const child = children.find(c => c.id === daySchedule.childId);
            const specialty = therapist.specialties.find(s => 
              daySchedule.activity.toLowerCase().includes(s.toLowerCase())
            ) || therapist.specialties[0];
            
            daySlots.push({
              date: currentDate,
              time: timeSlot,
              session: {
                id: daySchedule.id,
                childName: child?.name || 'Paciente',
                activity: daySchedule.activity,
                specialty,
                status: daySchedule.status as any
              },
              isEmpty: false
            });
          } else {
            daySlots.push({
              date: currentDate,
              time: timeSlot,
              isEmpty: true
            });
          }
        }
        
        weeklyGrid.push(daySlots);
      }

      const availableSlots = weeklyGrid.flat().filter(slot => slot.isEmpty).length;

      return {
        therapistId: therapist.id,
        therapistName: therapist.name,
        specialties: therapist.specialties,
        color: therapist.color,
        hoursScheduled,
        maxHours,
        percentage,
        status,
        weeklyGrid,
        availableSlots,
        sessionsCount: weekSchedules.length
      };
    });
  }, [filteredTherapists, schedules, children, selectedWeek]);

  const teamInsights = useMemo((): TeamInsights => {
    const overloadedTherapists = therapistOverviews
      .filter(t => t.status === 'overloaded')
      .map(t => t.therapistName);

    const availableTherapists = therapistOverviews
      .filter(t => t.status === 'available')
      .map(t => ({
        id: t.therapistId,
        name: t.therapistName,
        availableHours: Math.round((t.maxHours - t.hoursScheduled) * 10) / 10
      }))
      .sort((a, b) => b.availableHours - a.availableHours);

    // Calculate specialty distribution
    const specialtyCount: Record<string, number> = {};
    let totalSessionsForSpecialties = 0;
    
    therapistOverviews.forEach(therapist => {
      therapist.weeklyGrid.flat().forEach(slot => {
        if (slot.session) {
          const specialty = slot.session.specialty;
          specialtyCount[specialty] = (specialtyCount[specialty] || 0) + 1;
          totalSessionsForSpecialties++;
        }
      });
    });

    const topSpecialties = Object.entries(specialtyCount)
      .map(([specialty, count]) => ({
        specialty,
        count,
        percentage: Math.round((count / totalSessionsForSpecialties) * 100) || 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const totalSessions = therapistOverviews.reduce((sum, t) => sum + t.sessionsCount, 0);
    const totalAvailableSlots = therapistOverviews.reduce((sum, t) => sum + t.availableSlots, 0);

    // Mock pending goals calculation
    const pendingGoals = children.reduce((total, child) => {
      return total + child.weeklyTherapies.reduce((childTotal, therapy) => {
        const scheduledHours = schedules
          .filter(s => 
            s.childId === child.id && 
            isSameWeek(s.date, selectedWeek) &&
            s.activity.toLowerCase().includes(therapy.specialty.toLowerCase()) &&
            s.status !== 'cancelled'
          )
          .reduce((hours, s) => hours + ((s.duration || 60) / 60), 0);
        
        return childTotal + Math.max(0, therapy.hoursRequired - scheduledHours);
      }, 0);
    }, 0);

    return {
      overloadedTherapists,
      availableTherapists,
      topSpecialties,
      pendingGoals: Math.round(pendingGoals),
      totalSessions,
      totalAvailableSlots
    };
  }, [therapistOverviews, children, schedules, selectedWeek]);

  return {
    therapistOverviews,
    teamInsights,
    isLoading: false
  };
};
