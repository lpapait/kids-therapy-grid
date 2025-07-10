
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, User, Clock, Edit, Trash2, CheckCircle } from 'lucide-react';

interface Session {
  id: string;
  childName: string;
  activity: string;
  specialty: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

interface SessionPopoverProps {
  session: Session;
  time: string;
  therapistColor: string;
  onSessionClick?: (sessionId: string) => void;
}

const SessionPopover: React.FC<SessionPopoverProps> = ({
  session,
  time,
  therapistColor,
  onSessionClick
}) => {
  const isAdministrative = session.specialty === 'Administrativo';
  
  const getStatusColor = (status: Session['status']) => {
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

  const getStatusIcon = (status: Session['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'cancelled':
        return '❌';
      case 'rescheduled':
        return '⚠️';
      default:
        return '📅';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 p-1 w-full justify-start text-left hover:opacity-80"
          style={{ 
            backgroundColor: isAdministrative ? '#f8fafc' : therapistColor + '20',
            borderLeft: `3px solid ${isAdministrative ? '#64748b' : therapistColor}`
          }}
          onClick={() => onSessionClick?.(session.id)}
        >
          <div className="space-y-1 w-full min-w-0">
            <div className="flex items-center justify-between gap-1">
              <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                {getStatusIcon(session.status)}
              </Badge>
              <span className="text-xs text-gray-500">{time}</span>
            </div>
            
            <div className="text-xs space-y-1">
              <div className="font-medium text-gray-900 flex items-center gap-1 truncate">
                {isAdministrative ? (
                  <FileText className="h-3 w-3 text-gray-600 flex-shrink-0" />
                ) : (
                  <User className="h-3 w-3 text-gray-600 flex-shrink-0" />
                )}
                <span className="truncate">{session.childName}</span>
              </div>
              
              <div className="text-gray-600 truncate">{session.activity}</div>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isAdministrative ? (
                  <FileText className="h-4 w-4 text-gray-600" />
                ) : (
                  <User className="h-4 w-4 text-blue-600" />
                )}
                <h4 className="font-medium text-gray-900">
                  {isAdministrative ? 'Tempo Administrativo' : 'Sessão de Terapia'}
                </h4>
              </div>
              <Badge className={`${getStatusColor(session.status)} text-xs`}>
                {getStatusIcon(session.status)}
                <span className="ml-1 capitalize">{session.status}</span>
              </Badge>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {time}
              </div>
            </div>
          </div>

          <Separator />

          {/* Detalhes */}
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {isAdministrative ? 'Atividade' : 'Paciente'}
              </span>
              <p className="text-sm font-medium text-gray-900">{session.childName}</p>
            </div>
            
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {isAdministrative ? 'Tipo' : 'Terapia'}
              </span>
              <p className="text-sm text-gray-700">{session.activity}</p>
            </div>

            <div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Especialidade
              </span>
              <p className="text-sm text-gray-700">{session.specialty}</p>
            </div>
          </div>

          <Separator />

          {/* Ações */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Edit className="h-3 w-3 mr-1" />
              Editar
            </Button>
            {session.status === 'scheduled' && (
              <Button size="sm" variant="outline" className="flex-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                Concluir
              </Button>
            )}
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SessionPopover;
