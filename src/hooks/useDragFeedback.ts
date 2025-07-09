
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Schedule, Child, Therapist, TherapyCoverage } from '@/types';
import { format, isSameWeek } from 'date-fns';

export interface MoveImpact {
  therapyCoverageChange: {
    specialty: string;
    hoursDiff: number;
    newTotal: number;
    required: number;
  }[];
  therapistWorkloadChange: {
    therapistId: string;
    name: string;
    newWorkload: number;
    maxWorkload: number;
    isOverloaded: boolean;
  };
  conflicts: Schedule[];
  severity: 'success' | 'warning' | 'error';
  message: string;
}

export const useDragFeedback = () => {
  const { schedules, getTherapistById, therapists } = useData();

  const calculateMoveImpact = useMemo(() => {
    return (
      schedule: Schedule,
      newDate: Date,
      newTime: string,
      selectedChild: Child,
      selectedWeek: Date
    ): MoveImpact => {
      const therapist = getTherapistById(schedule.therapistId);
      if (!therapist) {
        return {
          therapyCoverageChange: [],
          therapistWorkloadChange: {
            therapistId: schedule.therapistId,
            name: 'Terapeuta não encontrado',
            newWorkload: 0,
            maxWorkload: 0,
            isOverloaded: false
          },
          conflicts: [],
          severity: 'error',
          message: 'Terapeuta não encontrado'
        };
      }

      // Check for conflicts at new position
      const conflicts = schedules.filter(s => 
        s.id !== schedule.id &&
        format(s.date, 'yyyy-MM-dd') === format(newDate, 'yyyy-MM-dd') &&
        s.time === newTime &&
        (s.therapistId === schedule.therapistId || s.childId === schedule.childId) &&
        s.status !== 'cancelled'
      );

      // Calculate therapist workload change
      const weekSchedules = schedules.filter(s => 
        s.therapistId === schedule.therapistId &&
        isSameWeek(s.date, selectedWeek) &&
        s.status !== 'cancelled'
      );

      const currentWorkload = weekSchedules.reduce((sum, s) => sum + (s.duration || 60) / 60, 0);
      const newWorkload = currentWorkload; // No change in total hours, just position
      const isOverloaded = newWorkload > therapist.weeklyWorkloadHours;

      // Calculate therapy coverage impact (no change as we're just moving)
      const therapyCoverageChange = therapist.specialties.map(specialty => ({
        specialty,
        hoursDiff: 0,
        newTotal: 0,
        required: selectedChild.weeklyTherapies.find(wt => wt.specialty === specialty)?.hoursRequired || 0
      }));

      let severity: 'success' | 'warning' | 'error' = 'success';
      let message = 'Movimentação permitida';

      if (conflicts.length > 0) {
        severity = 'error';
        const conflictType = conflicts[0].therapistId === schedule.therapistId ? 'terapeuta' : 'criança';
        message = `Conflito: ${conflictType} já possui agendamento neste horário`;
      } else if (isOverloaded) {
        severity = 'warning';
        message = `Carga do terapeuta excederá limite: ${newWorkload.toFixed(1)}h/${therapist.weeklyWorkloadHours}h`;
      } else {
        message = `Sessão será movida para ${format(newDate, 'EEEE, dd/MM')} às ${newTime}`;
      }

      return {
        therapyCoverageChange,
        therapistWorkloadChange: {
          therapistId: schedule.therapistId,
          name: therapist.name,
          newWorkload,
          maxWorkload: therapist.weeklyWorkloadHours,
          isOverloaded
        },
        conflicts,
        severity,
        message
      };
    };
  }, [schedules, getTherapistById, therapists]);

  return { calculateMoveImpact };
};
