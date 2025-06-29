
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, User, Clock, AlertTriangle } from 'lucide-react';
import { Schedule, Therapist } from '@/types';
import { getTherapistColorStyles } from '@/lib/therapistColors';

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
  hasConflict?: boolean;
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
  onSelectToggle,
  hasConflict = false
}) => {
  const colorStyles = therapist ? getTherapistColorStyles(therapist.color, false) : {};

  const getStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: Schedule['status']) => {
    switch (status) {
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      case 'rescheduled': return '⚠️';
      case 'scheduled':
      default: return '📅';
    }
  };

  const handleCellClick = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Multi-select with Ctrl/Cmd
      if (schedule) {
        onSelectToggle(schedule.id);
      }
    } else {
      onScheduleClick(date, time, schedule);
    }
  };

  return (
    <div
      className={`
        border-b border-r p-2 min-h-[100px] cursor-pointer transition-all duration-200
        ${isDragOver ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-50'}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${hasConflict ? 'ring-2 ring-red-500 bg-red-50' : ''}
        relative
      `}
      style={schedule ? colorStyles : {}}
      onClick={handleCellClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {schedule ? (
        <div
          className="space-y-1 h-full"
          draggable
          onDragStart={() => onDragStart(schedule)}
        >
          {/* Conflict indicator */}
          {hasConflict && (
            <div className="absolute top-1 right-1">
              <AlertTriangle className="h-3 w-3 text-red-500" />
            </div>
          )}

          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute top-1 left-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={`text-xs ${getStatusColor(schedule.status)}`}>
              {getStatusIcon(schedule.status)}
            </Badge>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {schedule.duration || 60}min
            </div>
          </div>

          <div className="text-sm space-y-1">
            <div className="flex items-center text-blue-600 font-medium text-xs">
              <Activity className="h-3 w-3 mr-1" />
              <span className="truncate">{schedule.activity || 'Atividade não definida'}</span>
            </div>
            
            {therapist && (
              <div className="flex items-center text-gray-600 text-xs">
                <div 
                  className="w-2 h-2 rounded-full mr-1 border" 
                  style={{ backgroundColor: therapist.color || '#gray' }}
                />
                <User className="h-3 w-3 mr-1" />
                <span className="truncate">{therapist.name || 'Terapeuta não identificado'}</span>
              </div>
            )}
            
            {schedule.observations && (
              <div className="text-xs text-gray-500 truncate" title={schedule.observations}>
                {schedule.observations}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            + Agendar
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedGridCell;
