
import { useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { Schedule, Child } from '@/types';

export const useSessionActions = () => {
  const { updateSchedule } = useData();
  const { toast } = useToast();

  const editSession = useCallback((schedule: Schedule) => {
    console.log('Editar sessão:', schedule);
    toast({
      title: "Editar sessão",
      description: "Funcionalidade em desenvolvimento",
    });
  }, [toast]);

  const deleteSession = useCallback((schedule: Schedule) => {
    updateSchedule(schedule.id, {
      status: 'cancelled',
      updatedBy: 'user'
    });
    toast({
      title: "Sessão cancelada",
      description: "A sessão foi cancelada com sucesso",
    });
  }, [updateSchedule, toast]);

  const markCompleted = useCallback((schedule: Schedule) => {
    updateSchedule(schedule.id, {
      status: 'completed',
      updatedBy: 'user'
    });
    toast({
      title: "Sessão marcada como realizada",
      description: "Status atualizado com sucesso",
    });
  }, [updateSchedule, toast]);

  const viewChild = useCallback((child: Child) => {
    console.log('Ver criança:', child);
    toast({
      title: "Ver ficha da criança",
      description: "Funcionalidade em desenvolvimento",
    });
  }, [toast]);

  return {
    editSession,
    deleteSession,
    markCompleted,
    viewChild
  };
};
