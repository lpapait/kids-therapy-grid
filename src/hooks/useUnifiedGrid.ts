
import { useState, useCallback, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Schedule, Child, Therapist } from '@/types';
import { format, isSameDay } from 'date-fns';
import { useDragFeedback } from '@/hooks/useDragFeedback';
import { useToast } from '@/hooks/use-toast';

export interface UnifiedGridConfig {
  timeSlotDuration: number;
  startTime: string;
  endTime: string;
  showWeekends: boolean;
  density: 'compact' | 'normal' | 'comfortable';
  groupBy: 'none' | 'therapist' | 'specialty';
}

export interface GridFilters {
  status?: Schedule['status'][];
  therapists?: string[];
  specialties?: string[];
  searchQuery?: string;
}

export const useUnifiedGrid = (
  selectedWeek: Date,
  mode: 'child' | 'therapist' | 'overview',
  targetEntity?: Child | Therapist
) => {
  const { schedules, addSchedule, updateSchedule, getTherapistById } = useData();
  const { calculateMoveImpact } = useDragFeedback();
  const { toast } = useToast();

  const [config, setConfig] = useState<UnifiedGridConfig>({
    timeSlotDuration: 60,
    startTime: '08:00',
    endTime: '18:00',
    showWeekends: false,
    density: 'normal',
    groupBy: 'none'
  });

  const [filters, setFilters] = useState<GridFilters>({});
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [draggedSession, setDraggedSession] = useState<Schedule | null>(null);

  // Generate time slots
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const [startHour, startMin] = config.startTime.split(':').map(Number);
    const [endHour, endMin] = config.endTime.split(':').map(Number);
    
    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      currentMinutes += config.timeSlotDuration;
    }
    
    return slots;
  }, [config.timeSlotDuration, config.startTime, config.endTime]);

  // Filter schedules based on mode and filters
  const filteredSchedules = useMemo(() => {
    let filtered = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      const weekStart = new Date(selectedWeek);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(selectedWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
      weekEnd.setHours(23, 59, 59, 999);

      if (scheduleDate < weekStart || scheduleDate > weekEnd) return false;

      // Mode-specific filtering
      if (mode === 'child' && targetEntity) {
        if (schedule.childId !== targetEntity.id) return false;
      } else if (mode === 'therapist' && targetEntity) {
        if (schedule.therapistId !== targetEntity.id) return false;
      }

      // Apply filters
      if (filters.status && !filters.status.includes(schedule.status)) return false;
      if (filters.therapists && !filters.therapists.includes(schedule.therapistId)) return false;
      
      if (filters.specialties) {
        const therapist = getTherapistById(schedule.therapistId);
        if (!therapist || !filters.specialties.some(spec => therapist.specialties.includes(spec))) {
          return false;
        }
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const therapist = getTherapistById(schedule.therapistId);
        if (
          !schedule.activity.toLowerCase().includes(query) &&
          !therapist?.name.toLowerCase().includes(query) &&
          !schedule.observations?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      return true;
    });

    return filtered;
  }, [schedules, selectedWeek, mode, targetEntity, filters, getTherapistById]);

  // Grid dimensions based on density
  const cellHeight = useMemo(() => {
    switch (config.density) {
      case 'compact': return 80;
      case 'comfortable': return 120;
      default: return 100;
    }
  }, [config.density]);

  // Handle drag operations
  const handleDragStart = useCallback((session: Schedule) => {
    setDraggedSession(session);
  }, []);

  const handleDrop = useCallback((date: Date, time: string) => {
    if (!draggedSession) return;

    const impact = calculateMoveImpact(
      draggedSession, 
      date, 
      time, 
      targetEntity as Child, 
      selectedWeek
    );

    if (impact.severity === 'error') {
      toast({
        title: "Erro ao mover sessão",
        description: impact.message,
        variant: "destructive"
      });
      setDraggedSession(null);
      return;
    }

    if (impact.severity === 'warning') {
      toast({
        title: "Atenção",
        description: impact.message,
        variant: "default"
      });
    } else {
      toast({
        title: "Sessão movida com sucesso",
        description: impact.message,
        variant: "default"
      });
    }

    updateSchedule(draggedSession.id, {
      date,
      time,
      updatedBy: 'user'
    });

    setDraggedSession(null);
  }, [draggedSession, targetEntity, selectedWeek, calculateMoveImpact, updateSchedule, toast]);

  // Selection management
  const toggleSelection = useCallback((sessionId: string) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSessions([]);
  }, []);

  // Bulk operations
  const bulkUpdateStatus = useCallback((status: Schedule['status'], reason?: string) => {
    selectedSessions.forEach(sessionId => {
      updateSchedule(sessionId, { status, updatedBy: 'user' }, reason);
    });
    clearSelection();
    toast({
      title: "Sessões atualizadas",
      description: `${selectedSessions.length} sessões foram ${status === 'cancelled' ? 'canceladas' : 'atualizadas'}`,
    });
  }, [selectedSessions, updateSchedule, clearSelection, toast]);

  return {
    config,
    setConfig,
    filters,
    setFilters,
    timeSlots,
    filteredSchedules,
    selectedSessions,
    draggedSession,
    cellHeight,
    handleDragStart,
    handleDrop,
    toggleSelection,
    clearSelection,
    bulkUpdateStatus
  };
};
