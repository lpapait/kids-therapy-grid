
import { useMemo } from 'react';
import { Child, Schedule, TherapyCoverage } from '@/types';
import { useData } from '@/contexts/DataContext';
import { isSameWeek } from '@/lib/dateUtils';

export const useTherapyCoverage = (child: Child | null, selectedWeek: Date): TherapyCoverage[] => {
  const { schedules, therapists } = useData();

  return useMemo(() => {
    // Return empty array if no child is selected or data is invalid
    if (!child || !selectedWeek || !Array.isArray(child.weeklyTherapies)) {
      return [];
    }

    try {
      // Get schedules for the child in the selected week
      const weekSchedules = schedules.filter(schedule => 
        schedule?.childId === child.id &&
        schedule?.date &&
        isSameWeek(schedule.date, selectedWeek) &&
        schedule.status !== 'cancelled'
      );

      // Calculate hours per specialty for the week
      const hoursPerSpecialty: Record<string, number> = {};
      
      weekSchedules.forEach(schedule => {
        if (!schedule?.therapistId) return;
        
        const therapist = therapists.find(t => t?.id === schedule.therapistId);
        if (therapist && Array.isArray(therapist.specialties)) {
          // For simplicity, assume each session is 1 hour
          // In a real implementation, you might want to store session duration
          const sessionDuration = schedule.duration ? (schedule.duration / 60) : 1;
          
          therapist.specialties.forEach(specialty => {
            if (specialty) {
              hoursPerSpecialty[specialty] = (hoursPerSpecialty[specialty] || 0) + sessionDuration;
            }
          });
        }
      });

      // Calculate coverage for each required therapy
      return child.weeklyTherapies.map((weeklyTherapy): TherapyCoverage => {
        if (!weeklyTherapy?.specialty || !weeklyTherapy?.hoursRequired) {
          return {
            specialty: weeklyTherapy?.specialty || 'Especialidade não definida',
            hoursRequired: 0,
            hoursScheduled: 0,
            percentage: 0,
            status: 'missing'
          };
        }

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
    } catch (error) {
      console.error('Erro ao calcular cobertura de terapias:', error);
      return [];
    }
  }, [child, selectedWeek, schedules, therapists]);
};
