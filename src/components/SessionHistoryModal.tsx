
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Activity, FileText, History } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScheduleHistory, Schedule, ScheduleChange } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

interface SessionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule;
}

const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({
  isOpen,
  onClose,
  schedule
}) => {
  const { getScheduleHistory, getChildById, getTherapistById } = useData();
  const { user } = useAuth();
  
  const history = getScheduleHistory(schedule.id);
  const child = getChildById(schedule.childId);
  const therapist = getTherapistById(schedule.therapistId);

  const getChangeTypeLabel = (changeType: ScheduleHistory['changeType']) => {
    switch (changeType) {
      case 'created': return 'Criada';
      case 'updated': return 'Atualizada';
      case 'cancelled': return 'Cancelada';
      case 'rescheduled': return 'Remarcada';
      case 'completed': return 'Realizada';
      default: return 'Modificada';
    }
  };

  const getChangeTypeColor = (changeType: ScheduleHistory['changeType']) => {
    switch (changeType) {
      case 'created': return 'bg-blue-100 text-blue-800';
      case 'updated': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'time': return 'Horário';
      case 'date': return 'Data';
      case 'activity': return 'Atividade';
      case 'therapistId': return 'Terapeuta';
      case 'status': return 'Status';
      case 'observations': return 'Observações';
      default: return field;
    }
  };

  const formatValue = (field: string, value: any) => {
    if (field === 'date' && value instanceof Date) {
      return format(value, 'dd/MM/yyyy');
    }
    if (field === 'therapistId') {
      const therapist = getTherapistById(value);
      return therapist ? therapist.name : value;
    }
    if (field === 'status') {
      switch (value) {
        case 'scheduled': return 'Agendado';
        case 'completed': return 'Realizado';
        case 'cancelled': return 'Cancelado';
        case 'rescheduled': return 'Remarcado';
        default: return value;
      }
    }
    return value || '-';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <History className="h-5 w-5 text-blue-600" />
            <span>Histórico da Sessão</span>
          </DialogTitle>
        </DialogHeader>

        {/* Informações da sessão */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Criança:</span>
              <span>{child?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Data:</span>
              <span>{format(schedule.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Horário:</span>
              <span>{schedule.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Atividade:</span>
              <span>{schedule.activity}</span>
            </div>
          </div>
        </div>

        {/* Timeline do histórico */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Timeline de Alterações</h3>
          
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma alteração registrada</p>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {index < history.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-px bg-gray-200" />
                  )}
                  
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                        <div className={`w-3 h-3 rounded-full ${getChangeTypeColor(entry.changeType).replace('text-', 'bg-').replace('100', '500')}`} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getChangeTypeColor(entry.changeType)}>
                          {getChangeTypeLabel(entry.changeType)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(entry.changedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        Por: <span className="font-medium">{entry.changedBy}</span>
                      </div>
                      
                      {entry.reason && (
                        <div className="text-sm text-gray-700 mb-2">
                          <span className="font-medium">Motivo:</span> {entry.reason}
                        </div>
                      )}
                      
                      {entry.changedFields.length > 0 && (
                        <div className="bg-gray-50 p-3 rounded border">
                          <div className="text-xs font-medium text-gray-700 mb-2">Campos alterados:</div>
                          <div className="space-y-1">
                            {entry.changedFields.map((field) => {
                              const oldValue = entry.previousValues[field as keyof Schedule];
                              const newValue = entry.newValues[field as keyof Schedule];
                              
                              return (
                                <div key={field} className="text-xs">
                                  <span className="font-medium">{getFieldLabel(field)}:</span>
                                  {entry.changeType !== 'created' && (
                                    <>
                                      <span className="text-red-600 line-through ml-1">
                                        {formatValue(field, oldValue)}
                                      </span>
                                      <span className="mx-1">→</span>
                                    </>
                                  )}
                                  <span className="text-green-600">
                                    {formatValue(field, newValue)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionHistoryModal;
