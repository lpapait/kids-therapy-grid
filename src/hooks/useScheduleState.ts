import { useState, useCallback, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Schedule, Child } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface ScheduleState {
  selectedWeek: Date;
  selectedChild: Child | null;
  editingSession: {
    date: Date;
    time: string;
    schedule?: Schedule;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export const useScheduleState = () => {
  const { addSchedule, updateSchedule, schedules } = useData();
  const { toast } = useToast();

  const [state, setState] = useState<ScheduleState>({
    selectedWeek: new Date(),
    selectedChild: null,
    editingSession: null,
    isLoading: false,
    error: null
  });

  const setSelectedWeek = useCallback((week: Date) => {
    setState(prev => ({ ...prev, selectedWeek: week }));
  }, []);

  const setSelectedChild = useCallback((child: Child | null) => {
    setState(prev => ({ ...prev, selectedChild: child }));
  }, []);

  const setEditingSession = useCallback((session: ScheduleState['editingSession']) => {
    setState(prev => ({ ...prev, editingSession: session }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const createSchedule = useCallback(async (scheduleData: any) => {
    setLoading(true);
    setError(null);
    try {
      await addSchedule(scheduleData);
      toast({ title: 'Sessão criada com sucesso' });
      setEditingSession(null);
    } catch (error) {
      const errorMessage = 'Erro ao criar sessão';
      setError(errorMessage);
      toast({ title: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [addSchedule, toast]);

  const updateScheduleData = useCallback(async (id: string, data: any, reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      await updateSchedule(id, data, reason);
      toast({ title: 'Sessão atualizada com sucesso' });
      setEditingSession(null);
    } catch (error) {
      const errorMessage = 'Erro ao atualizar sessão';
      setError(errorMessage);
      toast({ title: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [updateSchedule, toast]);

  return {
    state,
    actions: {
      setSelectedWeek,
      setSelectedChild,
      setEditingSession,
      setLoading,
      setError,
      createSchedule,
      updateScheduleData
    }
  };
};