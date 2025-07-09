
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Settings } from 'lucide-react';
import { Child, Therapist, Schedule } from '@/types';
import { getWeekDays, getDayName } from '@/lib/dateUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUnifiedGrid } from '@/hooks/useUnifiedGrid';
import UnifiedGridCell from './UnifiedGridCell';
import GridHeader from './GridHeader';
import GridFilters from './GridFilters';
import GridActions from './GridActions';

interface UnifiedScheduleGridProps {
  selectedWeek: Date;
  mode: 'child' | 'therapist' | 'overview';
  targetEntity?: Child | Therapist;
  title?: string;
  description?: string;
  onScheduleClick?: (date: Date, time: string, schedule?: Schedule) => void;
  onSelectTherapist?: (therapist: Therapist) => void;
  showFilters?: boolean;
  showActions?: boolean;
}

const UnifiedScheduleGrid: React.FC<UnifiedScheduleGridProps> = ({
  selectedWeek,
  mode,
  targetEntity,
  title,
  description,
  onScheduleClick,
  onSelectTherapist,
  showFilters = true,
  showActions = true
}) => {
  const {
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
  } = useUnifiedGrid(selectedWeek, mode, targetEntity);

  const weekDays = getWeekDays(selectedWeek).filter(day => {
    if (config.showWeekends) return true;
    const dayOfWeek = day.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  });

  const getScheduleForSlot = (date: Date, time: string) => {
    return filteredSchedules.find(schedule => 
      format(schedule.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
      schedule.time === time
    ) || null;
  };

  const handleCellClick = (date: Date, time: string, schedule?: Schedule, e?: React.MouseEvent) => {
    if (schedule && e?.ctrlKey) {
      toggleSelection(schedule.id);
    } else if (onScheduleClick) {
      onScheduleClick(date, time, schedule);
    }
  };

  const getGridTitle = () => {
    if (title) return title;
    if (mode === 'child' && targetEntity) return `Agenda - ${targetEntity.name}`;
    if (mode === 'therapist' && targetEntity) return `Agenda - ${targetEntity.name}`;
    return 'Grade de Agendamentos';
  };

  const getGridDescription = () => {
    if (description) return description;
    const weekText = format(selectedWeek, 'dd/MM/yyyy', { locale: ptBR });
    return `Semana de ${weekText} • ${filteredSchedules.length} sessões encontradas`;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {showFilters && (
        <GridFilters
          filters={filters}
          onFiltersChange={setFilters}
          mode={mode}
        />
      )}

      {showActions && selectedSessions.length > 0 && (
        <GridActions
          selectedCount={selectedSessions.length}
          onBulkUpdate={bulkUpdateStatus}
          onClearSelection={clearSelection}
        />
      )}

      <Card className="hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>{getGridTitle()}</span>
            </div>
            <button
              onClick={() => {/* TODO: Open config modal */}}
              className="p-2 hover:bg-muted rounded-md transition-colors"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
          </CardTitle>
          <CardDescription>
            {getGridDescription()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <div className="grid gap-0 min-w-[800px]" style={{ 
                gridTemplateColumns: `120px repeat(${weekDays.length}, 1fr)` 
              }}>
                <GridHeader weekDays={weekDays} />

                {timeSlots.map((time) => (
                  <div key={time} className="contents">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-r p-3 text-sm font-medium text-gray-900 flex items-center sticky left-0 z-10">
                      <div className="text-center w-full">{time}</div>
                    </div>
                    
                    {weekDays.map((day) => {
                      const schedule = getScheduleForSlot(day, time);
                      
                      return (
                        <UnifiedGridCell
                          key={`${day.toISOString()}-${time}`}
                          date={day}
                          time={time}
                          schedule={schedule}
                          mode={mode}
                          targetEntity={targetEntity}
                          isSelected={schedule ? selectedSessions.includes(schedule.id) : false}
                          isDraggedOver={false}
                          cellHeight={cellHeight}
                          onScheduleClick={handleCellClick}
                          onDragStart={handleDragStart}
                          onDrop={handleDrop}
                          onSelectTherapist={onSelectTherapist}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedScheduleGrid;
