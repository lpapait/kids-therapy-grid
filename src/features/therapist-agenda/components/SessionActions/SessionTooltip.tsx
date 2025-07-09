
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Target } from 'lucide-react';
import { Schedule, Child } from '@/types';
import { calculateAge } from '@/lib/dateUtils';

interface SessionTooltipProps {
  children: React.ReactNode;
  schedule: Schedule;
  child: Child;
}

const SessionTooltip: React.FC<SessionTooltipProps> = ({ children, schedule, child }) => {
  const age = calculateAge(child.birthDate);
  
  const weeklyProgress = child.weeklyTherapies.find(therapy => 
    schedule.activity.includes(therapy.specialty)
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{child.name}</span>
              <Badge variant="secondary" className="text-xs">
                {age} anos
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {schedule.duration} minutos
              </span>
            </div>

            {weeklyProgress && (
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">
                  Meta: {weeklyProgress.hoursRequired}h semanais
                </span>
              </div>
            )}

            {schedule.observations && (
              <div className="text-xs text-gray-500 pt-1 border-t">
                <strong>Observações:</strong> {schedule.observations}
              </div>
            )}

            <div className="pt-1 border-t">
              <Badge 
                variant={
                  schedule.status === 'scheduled' ? 'default' :
                  schedule.status === 'completed' ? 'secondary' :
                  schedule.status === 'cancelled' ? 'destructive' :
                  'outline'
                }
                className="text-xs"
              >
                {schedule.status === 'scheduled' ? 'Confirmado' :
                 schedule.status === 'completed' ? 'Realizado' :
                 schedule.status === 'cancelled' ? 'Cancelado' :
                 'Pendente'}
              </Badge>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SessionTooltip;
