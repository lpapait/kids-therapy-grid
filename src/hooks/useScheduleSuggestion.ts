import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Child, TherapyCoverage, ScheduleSuggestion, Therapist } from '@/types';
import { startOfWeek, endOfWeek, addDays, isSameDay, isWithinInterval, format } from 'date-fns';

interface UseScheduleSuggestionProps {
  child: Child | null;
  specialty: string;
  selectedWeek: Date;
  hoursNeeded: number;
}

export const useScheduleSuggestion = ({
  child,
  specialty,
  selectedWeek,
  hoursNeeded
}: UseScheduleSuggestionProps) => {
  const { therapists, schedules } = useData();

  const suggestions = useMemo(() => {
    if (!child || !specialty || hoursNeeded <= 0) {
      return [];
    }

    // Filtrar terapeutas da especialidade
    const specialtyTherapists = therapists.filter(t => 
      t.specialties.includes(specialty)
    );

    if (specialtyTherapists.length === 0) {
      return [];
    }

    const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });

    // Calcular carga horária atual de cada terapeuta na semana
    const therapistWorkloads = new Map<string, number>();
    
    schedules.forEach(schedule => {
      if (isWithinInterval(schedule.date, { start: weekStart, end: weekEnd }) && 
          schedule.status !== 'cancelled') {
        const current = therapistWorkloads.get(schedule.therapistId) || 0;
        const duration = schedule.duration || 60;
        therapistWorkloads.set(schedule.therapistId, current + (duration / 60));
      }
    });

    // Obter agendamentos existentes da criança na semana
    const childSchedules = schedules.filter(s => 
      s.childId === child.id &&
      isWithinInterval(s.date, { start: weekStart, end: weekEnd }) &&
      s.status !== 'cancelled'
    );

    const suggestions: ScheduleSuggestion[] = [];

    // Gerar sugestões para cada dia da semana
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDate = addDays(weekStart, dayOffset);
      
      // Pular fins de semana por padrão
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue;
      }

      // Horários disponíveis (8h às 18h)
      const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', 
        '14:00', '15:00', '16:00', '17:00'
      ];

      timeSlots.forEach(time => {
        specialtyTherapists.forEach(therapist => {
          const currentWorkload = therapistWorkloads.get(therapist.id) || 0;
          const wouldExceedLimit = (currentWorkload + 1) > therapist.weeklyWorkloadHours;
          
          // Verificar se há conflito com agendamento existente da criança
          const hasChildConflict = childSchedules.some(s => 
            isSameDay(s.date, currentDate) && s.time === time
          );

          // Verificar se há conflito com agendamento existente do terapeuta
          const hasTherapistConflict = schedules.some(s => 
            s.therapistId === therapist.id &&
            isSameDay(s.date, currentDate) && 
            s.time === time &&
            s.status !== 'cancelled'
          );

          let available = true;
          let conflictReason = '';

          if (hasChildConflict) {
            available = false;
            conflictReason = 'Criança já tem agendamento neste horário';
          } else if (hasTherapistConflict) {
            available = false;
            conflictReason = 'Terapeuta não disponível';
          } else if (wouldExceedLimit) {
            available = false;
            conflictReason = 'Excederia carga horária do terapeuta';
          }

          // Calcular prioridade (menor carga = maior prioridade)
          const priority = available ? (100 - currentWorkload) : 0;

          suggestions.push({
            id: `${therapist.id}-${format(currentDate, 'yyyy-MM-dd')}-${time}`,
            dayOfWeek: currentDate.getDay(),
            date: currentDate,
            time,
            therapistId: therapist.id,
            therapistName: therapist.name,
            therapistWorkload: currentWorkload,
            maxWorkload: therapist.weeklyWorkloadHours,
            priority,
            available,
            conflictReason
          });
        });
      });
    }

    // Ordenar por disponibilidade e prioridade
    return suggestions
      .sort((a, b) => {
        if (a.available && !b.available) return -1;
        if (!a.available && b.available) return 1;
        return b.priority - a.priority;
      })
      .slice(0, 10); // Limitar a 10 sugestões
  }, [child, specialty, selectedWeek, hoursNeeded, therapists, schedules]);

  return suggestions;
};