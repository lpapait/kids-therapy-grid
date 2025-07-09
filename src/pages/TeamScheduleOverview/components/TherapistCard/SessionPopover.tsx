
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, User, Calendar, CheckCircle, AlertTriangle, XCircle, Circle, FileText } from 'lucide-react';

interface SessionPopoverProps {
  session: {
    id: string;
    childName: string;
    activity: string;
    specialty: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  };
  time: string;
  therapistColor: string;
  onSessionClick?: (sessionId: string) => void;
}

const getSessionStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-3 w-3 text-green-500" />;
    case 'cancelled': return <XCircle className="h-3 w-3 text-red-500" />;
    case 'rescheduled': return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
    default: return <Circle className="h-3 w-3 text-blue-500" />;
  }
};

const getSessionBackgroundColor = (session: any) => {
  if (session?.specialty === 'Administrativo') {
    return 'bg-slate-100 border-slate-300';
  }
  return `${session.therapistColor}15`;
};

const getSessionBorderColor = (session: any) => {
  if (session?.specialty === 'Administrativo') {
    return 'border-slate-300';
  }
  return `${session.therapistColor}40`;
};

const SessionPopover: React.FC<SessionPopoverProps> = ({ 
  session, 
  time, 
  therapistColor, 
  onSessionClick 
}) => {
  const isAdministrative = session.specialty === 'Administrativo';
  const sessionWithColor = { ...session, therapistColor };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`h-8 p-1 border text-xs hover:shadow-sm ${getSessionBackgroundColor(sessionWithColor)} ${getSessionBorderColor(sessionWithColor)}`}
        >
          <div className="flex flex-col items-center justify-center min-w-0 w-full">
            <div className="truncate max-w-full text-[10px] leading-tight">
              {isAdministrative ? (
                <div className="flex items-center gap-1">
                  <FileText className="h-2 w-2" />
                  <span>Admin</span>
                </div>
              ) : (
                session.childName
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {getSessionStatusIcon(session.status)}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-64 p-3">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm flex items-center gap-2">
              {isAdministrative ? (
                <>
                  <FileText className="h-4 w-4 text-slate-600" />
                  Tempo Administrativo
                </>
              ) : (
                session.childName
              )}
            </h4>
            {getSessionStatusIcon(session.status)}
          </div>
          
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {time}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              {session.specialty}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              {session.activity}
            </div>
            {isAdministrative && (
              <div className="text-xs text-slate-500 mt-2 p-2 bg-slate-50 rounded">
                Reservado para atividades administrativas: 
                preenchimento de sistema ou relatórios
              </div>
            )}
          </div>
          
          <div className="pt-2 border-t">
            <Button 
              size="sm" 
              className="w-full text-xs"
              onClick={() => onSessionClick?.(session.id)}
            >
              Ver Detalhes
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SessionPopover;
