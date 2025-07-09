
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { isSameWeek } from '@/lib/dateUtils';

interface PlanningPendency {
  id: string;
  type: 'incomplete_child' | 'unassigned_session' | 'empty_slot';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export const usePlanningPendencies = (selectedWeek: Date) => {
  const { children, schedules, therapists } = useData();

  return useMemo(() => {
    const pendencies: PlanningPendency[] = [];

    // Check children with incomplete therapy coverage
    children.forEach(child => {
      const childSchedules = schedules.filter(schedule => 
        schedule.childId === child.id &&
        isSameWeek(schedule.date, selectedWeek) &&
        schedule.status !== 'cancelled'
      );

      const totalHours = childSchedules.reduce((sum, schedule) => 
        sum + (schedule.duration || 60) / 60, 0
      );

      // Assuming ideal coverage is 8-10 hours per week
      const idealHours = 8;
      const coveragePercentage = (totalHours / idealHours) * 100;

      if (coveragePercentage < 50) {
        pendencies.push({
          id: `incomplete-${child.id}`,
          type: 'incomplete_child',
          title: `${child.name} - Cobertura baixa`,
          description: `Apenas ${totalHours.toFixed(1)}h de ${idealHours}h planejadas`,
          priority: coveragePercentage < 25 ? 'high' : 'medium'
        });
      }
    });

    // Check for unassigned sessions (sessions without therapist)
    const unassignedSessions = schedules.filter(schedule => 
      isSameWeek(schedule.date, selectedWeek) &&
      !schedule.therapistId &&
      schedule.status === 'scheduled'
    );

    unassignedSessions.forEach(session => {
      const child = children.find(c => c.id === session.childId);
      pendencies.push({
        id: `unassigned-${session.id}`,
        type: 'unassigned_session',
        title: 'Sessão sem terapeuta',
        description: `${child?.name} - ${session.activity} em ${session.date.toLocaleDateString()}`,
        priority: 'high'
      });
    });

    // Check therapists with very low utilization (empty slots)
    therapists.forEach(therapist => {
      const therapistSchedules = schedules.filter(schedule => 
        schedule.therapistId === therapist.id &&
        isSameWeek(schedule.date, selectedWeek) &&
        schedule.status !== 'cancelled'
      );

      const totalHours = therapistSchedules.reduce((sum, schedule) => 
        sum + (schedule.duration || 60) / 60, 0
      );

      const utilizationPercentage = (totalHours / therapist.weeklyWorkloadHours) * 100;

      if (utilizationPercentage < 30 && therapistSchedules.length > 0) {
        pendencies.push({
          id: `underutilized-${therapist.id}`,
          type: 'empty_slot',
          title: `${therapist.name} - Subutilizado`,
          description: `Apenas ${utilizationPercentage.toFixed(0)}% da capacidade`,
          priority: 'low'
        });
      }
    });

    return pendencies.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [children, schedules, therapists, selectedWeek]);
};
