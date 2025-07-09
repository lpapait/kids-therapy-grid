
import { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Schedule, Therapist } from '@/types';
import { format, isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';

interface UseTherapistAgendaProps {
  therapistId: string;
  selectedWeek: Date;
}

export const useTherapistAgenda = ({ therapistId, selectedWeek }: UseTherapistAgendaProps) => {
  const { schedules, getChildById, getTherapistById } = useData();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const therapist = getTherapistById(therapistId);
  
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });

  // Filtrar agendamentos do terapeuta na semana
  const weekSchedules = useMemo(() => {
    return schedules.filter(schedule => 
      schedule.therapistId === therapistId &&
      isWithinInterval(schedule.date, { start: weekStart, end: weekEnd })
    );
  }, [schedules, therapistId, weekStart, weekEnd]);

  // Filtrar por especialidades selecionadas
  const filteredSchedules = useMemo(() => {
    if (selectedSpecialties.length === 0) return weekSchedules;
    
    return weekSchedules.filter(schedule => {
      const child = getChildById(schedule.childId);
      return child?.weeklyTherapies.some(therapy => 
        selectedSpecialties.includes(therapy.specialty)
      );
    });
  }, [weekSchedules, selectedSpecialties, getChildById]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalScheduled = weekSchedules.length;
    const confirmedSessions = weekSchedules.filter(s => s.status === 'scheduled').length;
    const pendingSessions = weekSchedules.filter(s => s.status === 'rescheduled').length;
    const cancelledSessions = weekSchedules.filter(s => s.status === 'cancelled').length;
    const completedSessions = weekSchedules.filter(s => s.status === 'completed').length;
    
    const totalHours = weekSchedules.reduce((sum, schedule) => sum + (schedule.duration / 60), 0);
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
  }, [weekSchedules, therapist]);

  // Obter especialidades disponíveis
  const availableSpecialties = useMemo(() => {
    if (!therapist) return [];
    return therapist.specialties;
  }, [therapist]);

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const clearFilters = () => {
    setSelectedSpecialties([]);
  };

  return {
    therapist,
    weekSchedules: filteredSchedules,
    selectedSpecialties,
    availableSpecialties,
    stats,
    toggleSpecialty,
    clearFilters,
    getChildById
  };
};
