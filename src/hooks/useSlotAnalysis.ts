import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Child, Therapist, Schedule } from '@/types';
import { format, isSameDay, parse } from 'date-fns';

interface SlotAnalysis {
  date: Date;
  time: string;
  pendingSpecialties: PendingSpecialty[];
  availableTherapists: TherapistAvailability[];
}

interface PendingSpecialty {
  name: string;
  current: number;
  target: number;
  remaining: number;
  isComplete: boolean;
}

interface TherapistAvailability {
  therapist: Therapist;
  isAvailable: boolean;
  currentLoad: number;
  maxLoad: number;
  loadPercentage: number;
  reason?: string;
}

export const useSlotAnalysis = (
  selectedChild: Child | null,
  selectedWeek: Date,
  slotDate: Date,
  slotTime: string
): SlotAnalysis | null => {
  const { therapists, schedules } = useData();
  
  // Mock therapy goals for now - replace with actual data later
  const therapyGoals = selectedChild ? [
    { id: '1', childId: selectedChild.id, specialty: 'Fonoaudiologia', weeklyGoal: 240 },
    { id: '2', childId: selectedChild.id, specialty: 'Musicoterapia', weeklyGoal: 360 },
  ] : [];

  return useMemo(() => {
    if (!selectedChild) return null;

    // Calcular especialidades pendentes na semana
    const weekSchedules = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      const weekStart = new Date(selectedWeek);
      const weekEnd = new Date(selectedWeek);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      return schedule.childId === selectedChild.id &&
             scheduleDate >= weekStart && 
             scheduleDate <= weekEnd;
    });

    // Agrupar por especialidade
    const specialtyHours: Record<string, number> = {};
    weekSchedules.forEach(schedule => {
      const therapist = therapists.find(t => t.id === schedule.therapistId);
      if (therapist && schedule.status !== 'cancelled' && therapist.specialties.length > 0) {
        const specialty = therapist.specialties[0]; // Use first specialty for now
        specialtyHours[specialty] = (specialtyHours[specialty] || 0) + schedule.duration;
      }
    });

    // Calcular especialidades pendentes
    const childGoals = therapyGoals.filter(goal => goal.childId === selectedChild.id);
    const pendingSpecialties: PendingSpecialty[] = childGoals.map(goal => {
      const current = specialtyHours[goal.specialty] || 0;
      const remaining = Math.max(0, goal.weeklyGoal - current);
      
      return {
        name: goal.specialty,
        current: current / 60, // converter para horas
        target: goal.weeklyGoal / 60,
        remaining: remaining / 60,
        isComplete: remaining === 0
      };
    }).filter(specialty => !specialty.isComplete);

    // Analisar terapeutas disponíveis
    const requiredSpecialties = pendingSpecialties.map(p => p.name);
    const compatibleTherapists = therapists.filter(t => 
      t.specialties.some(specialty => requiredSpecialties.includes(specialty))
    );

    const availableTherapists: TherapistAvailability[] = compatibleTherapists.map(therapist => {
      // Verificar conflitos de horário no mesmo dia/hora
      const hasConflict = schedules.some(schedule => {
        const scheduleDate = new Date(schedule.date);
        return schedule.therapistId === therapist.id &&
               isSameDay(scheduleDate, slotDate) &&
               schedule.time === slotTime &&
               schedule.status !== 'cancelled';
      });

      // Calcular carga horária atual na semana
      const weekStart = new Date(selectedWeek);
      const weekEnd = new Date(selectedWeek);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const therapistWeekSchedules = schedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return schedule.therapistId === therapist.id &&
               scheduleDate >= weekStart && 
               scheduleDate <= weekEnd &&
               schedule.status !== 'cancelled';
      });

      const currentLoad = therapistWeekSchedules.reduce((total, schedule) => total + schedule.duration, 0) / 60;
      const maxLoad = therapist.weeklyWorkloadHours;
      const loadPercentage = (currentLoad / maxLoad) * 100;

      let isAvailable = true;
      let reason = '';

      if (hasConflict) {
        isAvailable = false;
        reason = 'Conflito de horário';
      } else if (currentLoad >= maxLoad) {
        isAvailable = false;
        reason = `Carga completa (${currentLoad.toFixed(1)}h/${maxLoad}h)`;
      }

      return {
        therapist,
        isAvailable,
        currentLoad,
        maxLoad,
        loadPercentage,
        reason
      };
    });

    // Ordenar por disponibilidade e carga
    availableTherapists.sort((a, b) => {
      if (a.isAvailable && !b.isAvailable) return -1;
      if (!a.isAvailable && b.isAvailable) return 1;
      return a.loadPercentage - b.loadPercentage;
    });

    return {
      date: slotDate,
      time: slotTime,
      pendingSpecialties,
      availableTherapists
    };
  }, [selectedChild, selectedWeek, slotDate, slotTime, therapists, schedules, therapyGoals]);
};