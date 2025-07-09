
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Schedule, Therapist } from '@/types';
import { format } from 'date-fns';

interface EnhancedGridCellProps {
  date: Date;
  time: string;
  schedule?: Schedule;
  therapist?: Therapist;
  isSelected: boolean;
  isDragOver: boolean;
  onScheduleClick: (date: Date, time: string, schedule?: Schedule) => void;
  onDragStart: (schedule: Schedule) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onSelectToggle: (sessionId: string) => void;
}

const EnhancedGridCell: React.FC<EnhancedGridCellProps> = ({
  date,
  time,
  schedule,
  therapist,
  isSelected,
  isDragOver,
  onScheduleClick,
  onDragStart,
  onDragOver,
  onDrop,
  onSelectToggle
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (e.ctrlKey && schedule) {
      // Multi-select with Ctrl+Click
      onSelectToggle(schedule.id);
    } else {
      onScheduleClick(date, time, schedule);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (schedule) {
      onDragStart(schedule);
    }
  };

  return (
    <div
      className={`
        border-b border-r p-2 min-h-[60px] cursor-pointer transition-all duration-200
        ${isDragOver ? 'bg-blue-100 scale-105 shadow-md' : 'bg-white hover:bg-gray-50'}
        ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
        ${schedule ? 'cursor-move hover:shadow-sm' : 'cursor-pointer hover:bg-blue-50'}
        animate-fade-in
      `}
      onClick={handleClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      draggable={!!schedule}
      onDragStart={handleDragStart}
    >
      {schedule && therapist && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: therapist.color }}
            />
            <Badge
              variant={
                schedule.status === 'completed' ? 'default' :
                schedule.status === 'cancelled' ? 'destructive' :
                schedule.status === 'rescheduled' ? 'secondary' :
                'outline'
              }
              className="text-xs"
            >
              {schedule.status === 'completed' ? 'Realizada' :
               schedule.status === 'cancelled' ? 'Cancelada' :
               schedule.status === 'rescheduled' ? 'Remarcada' :
               'Agendada'}
            </Badge>
          </div>
          
          <div className="text-sm">
            <div className="font-medium text-gray-900 truncate">
              {schedule.activity}
            </div>
            <div className="text-gray-600 text-xs truncate">
              {therapist.name}
            </div>
            <div className="text-gray-500 text-xs">
              {schedule.duration}min
            </div>
          </div>
        </div>
      )}
      
      {!schedule && (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm hover:text-blue-500 transition-colors">
          <span className="text-2xl font-light">+</span>
        </div>
      )}
    </div>
  );
};

export default EnhancedGridCell;
