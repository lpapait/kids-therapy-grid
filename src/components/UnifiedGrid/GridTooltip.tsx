
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Target, Calendar, MessageSquare } from 'lucide-react';
import { Schedule, Therapist, Child } from '@/types';
import { calculateAge } from '@/lib/dateUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GridTooltipProps {
  children: React.ReactNode;
  schedule: Schedule;
  therapist: Therapist;
  child: Child | null;
}

const GridTooltip: React.FC<GridTooltipProps> = ({ 
  children, 
  schedule, 
  therapist, 
  child 
}) => {
  const age = child ? calculateAge(child.birthDate) : null;
  
  const getStatusLabel = (status: Schedule['status']) => {
    switch (status) {
      case 'completed':
        return 'Realizada';
      case 'cancelled':
        return 'Cancelada';
      case 'rescheduled':
        return 'Remarcada';
      case 'scheduled':
      default:
        return 'Agendada';
    }
  };

  const getStatusVariant = (status: Schedule['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'rescheduled':
        return 'secondary';
      case 'scheduled':
      default:
        return 'outline';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-4">
          <div className="space-y-3">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                  style={{ backgroundColor: therapist.color }}
                />
                <span className="font-medium">{therapist.name}</span>
              </div>
              <Badge variant={getStatusVariant(schedule.status)} className="text-xs">
                {getStatusLabel(schedule.status)}
              </Badge>
            </div>

            {/* Informações da criança */}
            {child && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{child.name}</span>
                {age && (
                  <Badge variant="secondary" className="text-xs">
                    {age} anos
                  </Badge>
                )}
              </div>
            )}

            {/* Detalhes da sessão */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{schedule.activity}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {schedule.duration} minutos
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {format(schedule.date, 'EEEE, dd/MM/yyyy', { locale: ptBR })} às {schedule.time}
                </span>
              </div>
            </div>

            {/* Observações */}
            {schedule.observations && (
              <div className="pt-2 border-t">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-medium text-amber-600">Observações:</span>
                    <p className="text-xs text-gray-600 mt-1">{schedule.observations}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Meta semanal (se aplicável) */}
            {child && (
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500">
                  <strong>Especialidade:</strong> {therapist.specialties.join(', ')}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GridTooltip;
