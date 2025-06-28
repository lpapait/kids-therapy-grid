
import { useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Schedule, Therapist } from '@/types';
import { isSameWeek, addDays } from '@/lib/dateUtils';

export const useQuickActions = () => {
  const { schedules, updateSchedule, addSchedule, therapists } = useData();
  const { toast } = useToast();

  const redistributeTherapistSessions = useCallback(async (
    therapistId: string, 
    selectedWeek: Date
  ): Promise<boolean> => {
    try {
      // Get overloaded therapist sessions
      const therapistSessions = schedules.filter(schedule => 
        schedule.therapistId === therapistId &&
        isSameWeek(schedule.date, selectedWeek) &&
        schedule.status !== 'cancelled'
      );

      if (therapistSessions.length === 0) {
        toast({
          title: 'Nenhuma sessão encontrada',
          description: 'Não há sessões para redistribuir nesta semana.',
          variant: 'default'
        });
        return false;
      }

      // Find available therapists (those with less than 80% workload)
      const availableTherapists = therapists.filter(t => {
        if (t.id === therapistId) return false;
        
        const therapistWeekSchedules = schedules.filter(s => 
          s.therapistId === t.id &&
          isSameWeek(s.date, selectedWeek) &&
          s.status !== 'cancelled'
        );
        
        const totalMinutes = therapistWeekSchedules.reduce((total, s) => 
          total + (s.duration || 60) + 15, 0
        );
        const hoursScheduled = totalMinutes / 60;
        const percentage = (hoursScheduled / t.weeklyWorkloadHours) * 100;
        
        return percentage < 80; // Available if less than 80% capacity
      });

      if (availableTherapists.length === 0) {
        toast({
          title: 'Nenhum terapeuta disponível',
          description: 'Todos os terapeutas estão próximos da capacidade máxima.',
          variant: 'destructive'
        });
        return false;
      }

      // Redistribute sessions (move some to available therapists)
      const sessionsToRedistribute = therapistSessions.slice(-2); // Move last 2 sessions
      let redistributedCount = 0;

      for (const session of sessionsToRedistribute) {
        const availableTherapist = availableTherapists[redistributedCount % availableTherapists.length];
        
        await updateSchedule(session.id, {
          ...session,
          therapistId: availableTherapist.id
        });
        
        redistributedCount++;
      }

      toast({
        title: 'Redistribuição concluída',
        description: `${redistributedCount} sessões foram redistribuídas para outros terapeutas.`,
        variant: 'default'
      });

      return true;
    } catch (error) {
      console.error('Erro na redistribuição:', error);
      toast({
        title: 'Erro na redistribuição',
        description: 'Não foi possível redistribuir as sessões. Tente novamente.',
        variant: 'destructive'
      });
      return false;
    }
  }, [schedules, updateSchedule, therapists, toast]);

  const createNewSession = useCallback(async (
    therapistId: string,
    selectedWeek: Date,
    childId?: string
  ): Promise<boolean> => {
    try {
      // Find next available slot for the therapist
      const weekDays = Array.from({ length: 7 }, (_, i) => addDays(selectedWeek, i));
      const availableSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      
      for (const day of weekDays) {
        for (const time of availableSlots) {
          const existingSchedule = schedules.find(s => 
            s.therapistId === therapistId &&
            s.date.toDateString() === day.toDateString() &&
            s.time === time &&
            s.status !== 'cancelled'
          );
          
          if (!existingSchedule) {
            const newSchedule: Omit<Schedule, 'id'> = {
              childId: childId || '', // Will need to be filled by user
              therapistId,
              date: day,
              time,
              duration: 60,
              activity: 'Terapia Individual',
              status: 'scheduled',
              updatedBy: 'system', // Add the missing updatedBy property
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            await addSchedule(newSchedule);
            
            toast({
              title: 'Nova sessão criada',
              description: `Sessão agendada para ${day.toLocaleDateString()} às ${time}`,
              variant: 'default'
            });
            
            return true;
          }
        }
      }
      
      toast({
        title: 'Nenhum horário disponível',
        description: 'Terapeuta sem horários livres nesta semana.',
        variant: 'destructive'
      });
      
      return false;
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      toast({
        title: 'Erro ao criar sessão',
        description: 'Não foi possível criar a nova sessão.',
        variant: 'destructive'
      });
      return false;
    }
  }, [schedules, addSchedule, toast]);

  const openTherapistSchedule = useCallback((therapistId: string) => {
    // Navigate to therapist agenda page
    const url = `/therapist-agenda?therapist=${therapistId}`;
    window.open(url, '_blank');
    
    toast({
      title: 'Abrindo agenda',
      description: 'Agenda do terapeuta foi aberta em nova aba.',
      variant: 'default'
    });
  }, [toast]);

  return {
    redistributeTherapistSessions,
    createNewSession,
    openTherapistSchedule
  };
};
