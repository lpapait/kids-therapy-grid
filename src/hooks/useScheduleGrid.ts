
import { useState, useCallback, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Schedule, Child } from '@/types';
import { format, isSameDay } from 'date-fns';
import { useDragFeedback, MoveImpact } from '@/hooks/useDragFeedback';
import { useToast } from '@/hooks/use-toast';

export interface GridConfig {
  timeSlotDuration: number; // in minutes
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  showWeekends: boolean;
}

export const useScheduleGrid = (selectedWeek: Date, selectedChild: Child | null) => {
  const { schedules, addSchedule, updateSchedule } = useData();
  const { calculateMoveImpact } = useDragFeedback();
  const { toast } = useToast();
  
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    timeSlotDuration: 60,
    startTime: '08:00',
    endTime: '18:00',
    showWeekends: false
  });

  const [draggedSession, setDraggedSession] = useState<Schedule | null>(null);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [dragFeedback, setDragFeedback] = useState<MoveImpact | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Generate time slots based on configuration
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const [startHour, startMin] = gridConfig.startTime.split(':').map(Number);
    const [endHour, endMin] = gridConfig.endTime.split(':').map(Number);
    
    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      slots.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      currentMinutes += gridConfig.timeSlotDuration;
    }
    
    return slots;
  }, [gridConfig]);

  // Get schedules for the selected week and child - Optimized for performance
  const weekSchedules = useMemo(() => {
    if (!selectedChild) return [];
    
    const weekStart = new Date(selectedWeek);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(selectedWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
    weekEnd.setHours(23, 59, 59, 999);
    
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return schedule.childId === selectedChild.id && 
             scheduleDate >= weekStart && 
             scheduleDate <= weekEnd;
    });
  }, [schedules, selectedChild?.id, selectedWeek.getTime()]);

  // Handle drag start
  const handleDragStart = useCallback((session: Schedule) => {
    setDraggedSession(session);
  }, []);

  // Handle drag over with feedback calculation
  const handleDragOver = useCallback((date: Date, time: string, e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedSession || !selectedChild) return;
    
    // Calculate impact of moving to this slot
    const impact = calculateMoveImpact(draggedSession, date, time, selectedChild, selectedWeek);
    setDragFeedback(impact);
    setDragPosition({ x: e.clientX, y: e.clientY });
  }, [draggedSession, selectedChild, selectedWeek, calculateMoveImpact]);

  // Handle drop
  const handleDrop = useCallback((date: Date, time: string) => {
    if (!draggedSession || !selectedChild) return;
    
    // Get final impact calculation
    const impact = calculateMoveImpact(draggedSession, date, time, selectedChild, selectedWeek);
    
    // Show error if there are conflicts
    if (impact.severity === 'error') {
      toast({
        title: "Erro ao mover sessão",
        description: impact.message,
        variant: "destructive"
      });
      setDraggedSession(null);
      setDragFeedback(null);
      return;
    }
    
    // Show warning but allow the move
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
    setDragFeedback(null);
  }, [draggedSession, selectedChild, selectedWeek, calculateMoveImpact, updateSchedule, toast]);

  // Handle session selection
  const toggleSessionSelection = useCallback((sessionId: string) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  }, []);

  // Bulk operations
  const bulkCancel = useCallback((reason: string) => {
    selectedSessions.forEach(sessionId => {
      updateSchedule(sessionId, {
        status: 'cancelled',
        updatedBy: 'user'
      }, reason);
    });
    setSelectedSessions([]);
  }, [selectedSessions, updateSchedule]);

  const bulkReschedule = useCallback((newDate: Date, reason: string) => {
    selectedSessions.forEach(sessionId => {
      const session = schedules.find(s => s.id === sessionId);
      if (session) {
        updateSchedule(sessionId, {
          date: newDate,
          status: 'rescheduled',
          updatedBy: 'user'
        }, reason);
      }
    });
    setSelectedSessions([]);
  }, [selectedSessions, schedules, updateSchedule]);

  return {
    gridConfig,
    setGridConfig,
    timeSlots,
    weekSchedules,
    draggedSession,
    selectedSessions,
    dragFeedback,
    dragPosition,
    handleDragStart,
    handleDragOver,
    handleDrop,
    toggleSessionSelection,
    bulkCancel,
    bulkReschedule
  };
};
