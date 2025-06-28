
import { useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { addWeeks, isSameWeek } from 'date-fns';
import { Schedule, Child } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useWeekDuplication = () => {
  const { schedules, addSchedule } = useData();
  const { toast } = useToast();

  const duplicateWeek = useCallback(async (
    selectedChild: Child,
    targetWeek: Date,
    sourceWeek?: Date
  ) => {
    try {
      // Use previous week as source if not specified
      const source = sourceWeek || addWeeks(targetWeek, -1);
      
      // Get all schedules for the child in the source week
      const sourceSchedules = schedules.filter(schedule => 
        schedule.childId === selectedChild.id &&
        isSameWeek(schedule.date, source) &&
        schedule.status !== 'cancelled'
      );

      if (sourceSchedules.length === 0) {
        toast({
          title: 'Nenhuma sessão encontrada',
          description: `Não foram encontradas sessões para duplicar na semana de ${source.toLocaleDateString()}.`,
          variant: 'default'
        });
        return;
      }

      // Check if target week already has schedules
      const existingSchedules = schedules.filter(schedule => 
        schedule.childId === selectedChild.id &&
        isSameWeek(schedule.date, targetWeek)
      );

      if (existingSchedules.length > 0) {
        toast({
          title: 'Semana já possui agendamentos',
          description: 'A semana selecionada já possui sessões agendadas. Cancele ou remova-as antes de duplicar.',
          variant: 'destructive'
        });
        return;
      }

      // Calculate the day difference between source and target weeks
      const daysDifference = Math.round((targetWeek.getTime() - source.getTime()) / (1000 * 60 * 60 * 24));

      // Duplicate each schedule
      const duplicatedSchedules: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>[] = [];

      sourceSchedules.forEach(schedule => {
        const newDate = new Date(schedule.date);
        newDate.setDate(newDate.getDate() + daysDifference);

        duplicatedSchedules.push({
          childId: schedule.childId,
          therapistId: schedule.therapistId,
          date: newDate,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          duration: schedule.duration,
          specialty: schedule.specialty,
          status: 'scheduled',
          notes: schedule.notes ? `${schedule.notes} (Duplicado da semana anterior)` : 'Duplicado da semana anterior',
          updatedBy: 'system'
        });
      });

      // Add all duplicated schedules
      duplicatedSchedules.forEach(schedule => {
        addSchedule(schedule);
      });

      toast({
        title: 'Semana duplicada com sucesso!',
        description: `${duplicatedSchedules.length} sessões foram copiadas para a nova semana.`,
        variant: 'default'
      });

      return duplicatedSchedules.length;

    } catch (error) {
      console.error('Error duplicating week:', error);
      toast({
        title: 'Erro ao duplicar semana',
        description: 'Ocorreu um erro ao tentar duplicar as sessões. Tente novamente.',
        variant: 'destructive'
      });
      return 0;
    }
  }, [schedules, addSchedule, toast]);

  return { duplicateWeek };
};
