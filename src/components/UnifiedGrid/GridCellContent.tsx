
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Activity, AlertTriangle } from 'lucide-react';
import { Schedule, Therapist, Child } from '@/types';
import GridTooltip from './GridTooltip';
import { useTherapistWorkload } from '@/hooks/useTherapistWorkload';

interface GridCellContentProps {
  schedule: Schedule;
  therapist: Therapist;
  child: Child | null;
  mode: 'child' | 'therapist' | 'overview';
  isSelected: boolean;
  onDragStart: (e: React.DragEvent) => void;
}

const GridCellContent: React.FC<GridCellContentProps> = ({
  schedule,
  therapist,
  child,
  mode,
  isSelected,
  onDragStart
}) => {
  const workloadData = useTherapistWorkload(schedule.therapistId, schedule.date);

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
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      case 'rescheduled':
        return '⚠️';
      case 'scheduled':
      default:
        return '📅';
    }
  };

  const getPrimaryText = () => {
    switch (mode) {
      case 'therapist':
        return child?.name || 'Criança não encontrada';
      case 'child':
        return therapist.name;
      case 'overview':
        return `${child?.name || 'N/A'} • ${therapist.name}`;
      default:
        return schedule.activity;
    }
  };

  const getSecondaryText = () => {
    return schedule.activity;
  };

  return (
    <GridTooltip schedule={schedule} therapist={therapist} child={child}>
      <div
        className={`
          h-full p-2 cursor-grab active:cursor-grabbing
          ${isSelected ? 'ring-2 ring-primary ring-inset' : ''}
        `}
        draggable
        onDragStart={onDragStart}
      >
        <div className="flex flex-col justify-between h-full">
          {/* Header com status e workload alert */}
          <div className="flex items-center justify-between mb-1">
            <Badge 
              variant="secondary" 
              className={`text-xs ${getStatusColor(schedule.status)}`}
            >
              {getStatusIcon(schedule.status)}
            </Badge>
            
            {workloadData && workloadData.status !== 'available' && (
              <div 
                className={`h-3 w-3 ${
                  workloadData.status === 'overloaded' ? 'text-red-500' : 'text-yellow-500'
                }`}
                title={`Carga: ${workloadData.hoursScheduled}h/${workloadData.maxHours}h`}
              >
                <AlertTriangle className="h-3 w-3" />
              </div>
            )}
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1 space-y-1">
            <div className="text-sm font-medium text-foreground truncate flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2 border flex-shrink-0" 
                style={{ backgroundColor: therapist.color }}
              />
              {getPrimaryText()}
            </div>
            
            <div className="text-xs text-muted-foreground truncate flex items-center">
              <Activity className="h-3 w-3 mr-1 flex-shrink-0" />
              {getSecondaryText()}
            </div>
          </div>

          {/* Footer com duração */}
          <div className="flex items-center justify-between mt-1">
            <div className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {schedule.duration}min
            </div>
            
            {schedule.observations && (
              <div className="w-2 h-2 rounded-full bg-amber-400" title="Possui observações" />
            )}
          </div>
        </div>
      </div>
    </GridTooltip>
  );
};

export default GridCellContent;
