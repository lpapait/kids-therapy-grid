
import { useMemo } from 'react';
import { Child, Schedule, TherapyCoverage } from '@/types';
import { useData } from '@/contexts/DataContext';
import { isSameWeek } from '@/lib/dateUtils';

export const useTherapyCoverage = (child: Child, selectedWeek: Date): TherapyCoverage[] => {
  const { schedules, therapists } = useData();

  return useMemo(() => {
    // Get schedules for the child in the selected week
    const weekSchedules = schedules.filter(schedule => 
      schedule.childId === child.id &&
      isSameWeek(schedule.date, selectedWeek) &&
      schedule.status !== 'cancelled'
    );

    // Calculate hours per specialty for the week
    const hoursPerSpecialty: Record<string, number> = {};
    
    weekSchedules.forEach(schedule => {
      const therapist = therapists.find(t => t.id === schedule.therapistId);
      if (therapist) {
        // For simplicity, assume each session is 1 hour
        // In a real implementation, you might want to store session duration
        const sessionDuration = 1;
        
        therapist.specialties.forEach(specialty => {
          hoursPerSpecialty[specialty] = (hoursPerSpecialty[specialty] || 0) + sessionDuration;
        });
      }
    });

    // Calculate coverage for each required therapy
    return child.weeklyTherapies.map((weeklyTherapy): TherapyCoverage => {
      const hoursScheduled = hoursPerSpecialty[weeklyTherapy.specialty] || 0;
      const percentage = Math.min(100, Math.round((hoursScheduled / weeklyTherapy.hoursRequired) * 100));
      
      let status: TherapyCoverage['status'];
      if (percentage === 0) {
        status = 'missing';
      } else if (percentage >= 100) {
        status = 'complete';
      } else {
        status = 'partial';
      }

      return {
        specialty: weeklyTherapy.specialty,
        hoursRequired: weeklyTherapy.hoursRequired,
        hoursScheduled,
        percentage,
        status
      };
    });
  }, [child, selectedWeek, schedules, therapists]);
};
