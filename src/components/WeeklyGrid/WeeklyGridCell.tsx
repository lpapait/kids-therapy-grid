
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Activity, AlertTriangle } from 'lucide-react';
import { getTherapistColorStyles } from '@/lib/therapistColors';
import { Schedule, Child, Therapist } from '@/types';
import { useTherapistWorkload } from '@/hooks/useTherapistWorkload';

interface WeeklyGridCellProps {
  date: Date;
  time: string;
  schedule: Schedule | null;
  therapist: Therapist | null;
  selectedChild: Child | null;
  onScheduleClick: (date: Date, time: string, schedule?: Schedule) => void;
}

const WeeklyGridCell: React.FC<WeeklyGridCellProps> = ({
  date,
  time,
  schedule,
  therapist,
  selectedChild,
  onScheduleClick
}) => {
  const workloadData = useTherapistWorkload(schedule?.therapistId || '', date);
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

  const getStatusLabel = (status: Schedule['status']) => {
    switch (status) {
      case 'completed':
        return 'Realizado';
      case 'cancelled':
        return 'Cancelado';
      case 'rescheduled':
        return 'Remarcado';
      case 'scheduled':
      default:
        return 'Agendado';
    }
  };

  return (
    <div
      className="border-b border-r p-3 min-h-[120px] hover:bg-gray-50 cursor-pointer transition-colors relative"
      style={schedule ? colorStyles : {}}
      onClick={() => onScheduleClick(date, time, schedule || undefined)}
    >
      {schedule ? (
        <div className="space-y-2">
          {/* Workload Alert */}
          {schedule.therapistId && workloadData && workloadData.status !== 'available' && (
            <div className="absolute top-1 right-1">
              <AlertTriangle 
                className={`h-3 w-3 ${
                  workloadData.status === 'overloaded' ? 'text-red-500' : 'text-yellow-500'
                }`}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={`text-xs ${getStatusColor(schedule.status)}`}>
              {getStatusIcon(schedule.status)} {getStatusLabel(schedule.status)}
            </Badge>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex items-center text-blue-600 font-medium">
              <Activity className="h-3 w-3 mr-1" />
              {schedule.activity || 'Atividade não definida'}
            </div>
            {therapist && (
              <div className="flex items-center text-gray-600 text-xs">
                <div 
                  className="w-3 h-3 rounded-full mr-1 border" 
                  style={{ backgroundColor: therapist.color || '#gray' }}
                />
                <User className="h-3 w-3 mr-1" />
                {therapist.name || 'Terapeuta não identificado'}
              </div>
            )}
            {schedule.observations && (
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
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
            className="text-xs"
            disabled={!selectedChild}
          >
            + Agendar
          </Button>
        </div>
      )}
    </div>
  );
};

export default WeeklyGridCell;
