
import { useState, useCallback, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Schedule, Child } from '@/types';
import { format, isSameDay } from 'date-fns';

export interface GridConfig {
  timeSlotDuration: number; // in minutes
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  showWeekends: boolean;
}

export const useScheduleGrid = (selectedWeek: Date, selectedChild: Child | null) => {
  const { schedules, addSchedule, updateSchedule } = useData();
  
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    timeSlotDuration: 60,
    startTime: '08:00',
    endTime: '18:00',
    showWeekends: false
  });

  const [draggedSession, setDraggedSession] = useState<Schedule | null>(null);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

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

  // Get schedules for the selected week and child - força recálculo sempre que schedules mudar
  const weekSchedules = useMemo(() => {
    if (!selectedChild) return [];
    
    const weekStart = new Date(selectedWeek);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(selectedWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
    weekEnd.setHours(23, 59, 59, 999);
    
    console.log('Filtering schedules for child:', selectedChild.id, 'between:', weekStart, 'and:', weekEnd);
    console.log('All schedules:', schedules);
    
    const filtered = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return schedule.childId === selectedChild.id &&
             scheduleDate >= weekStart &&
             scheduleDate <= weekEnd;
    });
    
    console.log('Filtered schedules:', filtered);
    return filtered;
  }, [schedules, selectedChild, selectedWeek]);

  // Handle drag start
  const handleDragStart = useCallback((session: Schedule) => {
    setDraggedSession(session);
  }, []);

  // Handle drop
  const handleDrop = useCallback((date: Date, time: string) => {
    if (!draggedSession) return;
    
    console.log('Dropping session:', draggedSession.id, 'to:', date, time);
    
    updateSchedule(draggedSession.id, {
      date,
      time,
      updatedBy: 'user'
    });
    
    setDraggedSession(null);
  }, [draggedSession, updateSchedule]);

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
    console.log('Bulk cancel sessions:', selectedSessions);
    selectedSessions.forEach(sessionId => {
      updateSchedule(sessionId, {
        status: 'cancelled',
        updatedBy: 'user'
      }, reason);
    });
    setSelectedSessions([]);
  }, [selectedSessions, updateSchedule]);

  const bulkReschedule = useCallback((newDate: Date, reason: string) => {
    console.log('Bulk reschedule sessions:', selectedSessions, 'to:', newDate);
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
    handleDragStart,
    handleDrop,
    toggleSessionSelection,
    bulkCancel,
    bulkReschedule
  };
};
