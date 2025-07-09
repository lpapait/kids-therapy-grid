import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Activity, FileText } from 'lucide-react';
import { getTherapistColorStyles } from '@/lib/therapistColors';
import { Schedule, Therapist, Child } from '@/types';
import { AgendaStats } from '../../../types/agenda.types';
import SessionTooltip from '../../SessionActions/SessionTooltip';
import SlotSuggestionPopover from '../../SessionActions/SlotSuggestionPopover';
import SessionActions from '../../SessionActions/ActionsDropdown';

interface GridCellProps {
  day: Date;
  time: string;
  schedule?: Schedule;
  therapist: Therapist;
  getChildById: (id: string) => Child | undefined;
  stats: AgendaStats;
  onEditSession: (schedule: Schedule) => void;
  onDeleteSession: (schedule: Schedule) => void;
  onViewChild: (child: Child) => void;
  onMarkCompleted: (schedule: Schedule) => void;
}

const GridCell: React.FC<GridCellProps> = ({
  day,
  time,
  schedule,
  therapist,
  getChildById,
  stats,
  onEditSession,
  onDeleteSession,
  onViewChild,
  onMarkCompleted
}) => {
  const child = schedule?.childId ? getChildById(schedule.childId) : null;
  const isAdministrative = schedule?.type === 'administrative';
  
  const colorStyles = schedule ? (
    isAdministrative ? 
      { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' } : 
      getTherapistColorStyles(therapist.color, true)
  ) : {};

  const getStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
      default:
        return '📅';
    }
  };

  return (
    <div
      className="border-b border-r p-2 min-h-[100px] transition-colors group relative"
      style={schedule ? colorStyles : {}}
    >
      {schedule ? (
        isAdministrative ? (
          <div className="h-full">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-slate-100 text-slate-800 border-slate-200 mb-1"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Administrativo
                </Badge>
              </div>
              <div className="text-sm space-y-1">
                <div className="font-medium text-slate-700 flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  Tempo Administrativo
                </div>
                <div className="flex items-center text-slate-600 text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  {schedule.activity || 'Atividades Administrativas'}
                </div>
                <div className="text-xs text-slate-500">
                  {schedule.duration} min
                </div>
                <div className="text-xs text-slate-500 bg-slate-50 p-1 rounded mt-2">
                  Relatórios e registros
                </div>
              </div>
            </div>
          </div>
        ) : (
          <SessionTooltip schedule={schedule} child={child}>
            <div className="h-full cursor-pointer">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getStatusColor(schedule.status)} mb-1`}
                  >
                    {getStatusIcon(schedule.status)}
                  </Badge>
                  <SessionActions
                    schedule={schedule}
                    child={child}
                    onEdit={onEditSession}
                    onDelete={onDeleteSession}
                    onViewChild={onViewChild}
                    onMarkCompleted={onMarkCompleted}
                  />
                </div>
                <div className="text-sm space-y-1">
                  <div className="font-medium text-gray-900 flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1 border" 
                      style={{ backgroundColor: therapist.color }}
                    />
                    {child?.name || 'Paciente'}
                  </div>
                  <div className="flex items-center text-blue-600 text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    {schedule.activity}
                  </div>
                  <div className="text-xs text-gray-500">
                    {schedule.duration} min
                  </div>
                  {schedule.observations && (
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {schedule.observations}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SessionTooltip>
        )
      ) : (
        <div className="h-full flex items-center justify-center">
          <SlotSuggestionPopover
            therapist={therapist}
            date={day}
            time={time}
            currentWorkload={stats.totalHours}
            maxWorkload={stats.maxHours}
          />
        </div>
      )}
    </div>
  );
};

export default GridCell;
