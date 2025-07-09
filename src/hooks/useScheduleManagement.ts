import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { useDebounce, useDebouncedCallback } from '@/hooks/useDebounce';
import { useWeekDuplication } from '@/hooks/useWeekDuplication';
import { Child, Schedule } from '@/types/index';

export const useScheduleManagement = () => {
  const { children, getTherapistById, schedules } = useData();
  const { toast } = useToast();
  const { duplicateWeek } = useWeekDuplication();
  
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [editingSession, setEditingSession] = useState<{
    date: Date;
    time: string;
    schedule?: Schedule;
  } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isGridLoading, setIsGridLoading] = useState(false);

  // Optimized: Only refresh when schedules actually change
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [schedules.length]);

  // Debounce the selected week to avoid too many recalculations
  const debouncedSelectedWeek = useDebounce(selectedWeek, 300);
  const debouncedSelectedChild = useDebounce(selectedChild, 200);

  // Get the therapist from the selected session or null
  const selectedTherapistId = editingSession?.schedule?.therapistId || null;
  const selectedTherapist = selectedTherapistId ? getTherapistById(selectedTherapistId) : null;

  const handleScheduleClick = (date: Date, time: string, schedule?: Schedule) => {
    if (!selectedChild) {
      toast({
        title: 'Selecione uma criança',
        description: 'É necessário selecionar uma criança antes de agendar uma sessão.',
        variant: 'destructive'
      });
      return;
    }
    
    setEditingSession({
      date,
      time,
      schedule
    });
  };

  const handleCloseModal = () => {
    setEditingSession(null);
    // Force refresh of the grid to show new/updated schedules
    setRefreshKey(prev => prev + 1);
  };

  const handleDuplicateWeek = useDebouncedCallback(async () => {
    if (!selectedChild) {
      toast({
        title: 'Selecione uma criança',
        description: 'É necessário selecionar uma criança antes de duplicar a semana.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const duplicatedCount = await duplicateWeek(selectedChild, selectedWeek);
      if (duplicatedCount && duplicatedCount > 0) {
        // Force refresh to show duplicated schedules
        setRefreshKey(prev => prev + 1);
        toast({
          title: 'Semana duplicada',
          description: `${duplicatedCount} agendamentos foram duplicados com sucesso.`,
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Erro ao duplicar semana:', error);
      toast({
        title: 'Erro ao duplicar semana',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        variant: 'destructive'
      });
    }
  }, 500);

  const handleQuickAction = useDebouncedCallback((action: string) => {
    if (!selectedTherapistId) return;

    try {
      switch (action) {
        case 'add_session':
          toast({
            title: 'Adicionando nova sessão',
            description: `Preparando nova sessão para ${selectedTherapist?.name || 'terapeuta'}`,
            variant: 'default'
          });
          break;
        case 'view_schedule':
          toast({
            title: 'Visualizando agenda',
            description: `Abrindo agenda de ${selectedTherapist?.name || 'terapeuta'}`,
            variant: 'default'
          });
          break;
        case 'redistribute':
          toast({
            title: 'Redistribuindo sessões',
            description: `Iniciando redistribuição para ${selectedTherapist?.name || 'terapeuta'}`,
            variant: 'default'
          });
          break;
        default:
          console.log('Unknown action:', action);
      }
    } catch (error) {
      console.error('Erro na ação rápida:', error);
      toast({
        title: 'Erro na operação',
        description: 'Não foi possível executar a ação solicitada.',
        variant: 'destructive'
      });
    }
  }, 300);

  const handleAlertClick = useDebouncedCallback((therapistId: string) => {
    try {
      const therapist = getTherapistById(therapistId);
      if (therapist) {
        toast({
          title: 'Focalizando terapeuta',
          description: `Visualizando detalhes de ${therapist.name}`,
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Erro ao focar no terapeuta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível visualizar os detalhes do terapeuta.',
        variant: 'destructive'
      });
    }
  }, 200);

  return {
    // State
    children,
    selectedWeek,
    selectedChild,
    editingSession,
    refreshKey,
    isGridLoading,
    debouncedSelectedWeek,
    debouncedSelectedChild,
    selectedTherapist,
    selectedTherapistId,
    
    // Setters
    setSelectedWeek,
    setSelectedChild,
    setIsGridLoading,
    
    // Handlers
    handleScheduleClick,
    handleCloseModal,
    handleDuplicateWeek,
    handleQuickAction,
    handleAlertClick
  };
};