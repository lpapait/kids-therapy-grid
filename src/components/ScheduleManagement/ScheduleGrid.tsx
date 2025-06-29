
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Child } from '@/types';
import { useScheduleGrid } from '@/hooks/useScheduleGrid';
import { useData } from '@/contexts/DataContext';
import { getWeekDays, getDayName } from '@/lib/dateUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EnhancedGridCell from './EnhancedGridCell';
import GridConfigPanel from './GridConfigPanel';
import BulkOperationsPanel from './BulkOperationsPanel';

interface ScheduleGridProps {
  selectedWeek: Date;
  selectedChild: Child | null;
  onScheduleClick: (date: Date, time: string, schedule?: any) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  selectedWeek,
  selectedChild,
  onScheduleClick
}) => {
  const { getTherapistById } = useData();
  
  const {
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
  } = useScheduleGrid(selectedWeek, selectedChild);

  console.log('ScheduleGrid rendered - weekSchedules:', weekSchedules);

  // Validação de segurança
  if (!selectedChild) {
    return (
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Grade de Agendamentos</span>
            </CardTitle>
            <CardDescription>
              Selecione uma criança para visualizar os agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Nenhuma criança selecionada</p>
              <p className="text-sm mt-2">Escolha uma criança para começar a gerenciar os agendamentos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const weekDays = getWeekDays(selectedWeek).filter(day => {
    if (gridConfig.showWeekends) return true;
    const dayOfWeek = day.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Exclude Saturday and Sunday
  });

  const getScheduleForSlot = (date: Date, time: string) => {
    const schedule = weekSchedules.find(schedule => 
      format(schedule.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
      schedule.time === time
    ) || null;
    
    console.log(`Looking for schedule on ${format(date, 'yyyy-MM-dd')} at ${time}:`, schedule);
    return schedule;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCellDrop = (date: Date, time: string) => (e: React.DragEvent) => {
    e.preventDefault();
    handleDrop(date, time);
  };

  const clearSelection = () => {
    weekSchedules.forEach(schedule => {
      if (selectedSessions.includes(schedule.id)) {
        toggleSessionSelection(schedule.id);
      }
    });
  };

  return (
    <div className="lg:col-span-3 space-y-4">
      <GridConfigPanel
        config={gridConfig}
        onConfigChange={setGridConfig}
      />

      <BulkOperationsPanel
        selectedCount={selectedSessions.length}
        onBulkCancel={bulkCancel}
        onBulkReschedule={bulkReschedule}
        onClearSelection={clearSelection}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Grade de Agendamentos - {selectedChild.name}</span>
          </CardTitle>
          <CardDescription>
            Arraste sessões para movê-las. Use Ctrl+Click para seleção múltipla.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-white rounded-lg border overflow-hidden overflow-x-auto">
            <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${weekDays.length}, 1fr)` }}>
              {/* Header */}
              <div className="bg-gray-50 border-b border-r p-3 font-medium text-gray-900 sticky left-0 z-10">
                Horário
              </div>
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="bg-gray-50 border-b border-r p-3 text-center min-w-[160px]">
                  <div className="font-medium text-gray-900">
                    {getDayName(day)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(day, 'dd/MM', { locale: ptBR })}
                  </div>
                </div>
              ))}

              {/* Time slots - CORRIGIDO: substituindo React.Fragment por div */}
              {timeSlots.map((time) => (
                <div key={time} className="contents">
                  <div className="bg-gray-50 border-b border-r p-3 text-sm font-medium text-gray-900 flex items-center sticky left-0 z-10">
                    <div className="text-center w-full">
                      {time}
                    </div>
                  </div>
                  {weekDays.map((day) => {
                    const schedule = getScheduleForSlot(day, time);
                    const therapist = schedule ? getTherapistById(schedule.therapistId) : null;
                    
                    return (
                      <EnhancedGridCell
                        key={`${day.toISOString()}-${time}`}
                        date={day}
                        time={time}
                        schedule={schedule || undefined}
                        therapist={therapist || undefined}
                        isSelected={schedule ? selectedSessions.includes(schedule.id) : false}
                        isDragOver={false}
                        onScheduleClick={onScheduleClick}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleCellDrop(day, time)}
                        onSelectToggle={toggleSessionSelection}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleGrid;
