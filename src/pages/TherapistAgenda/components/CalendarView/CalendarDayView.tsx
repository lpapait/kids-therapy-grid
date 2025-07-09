
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Clock, User, Activity, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CalendarDayViewProps {
  selectedDay: Date;
  onClose: () => void;
  calendarData: {
    days: Array<{
      date: Date;
      sessions: Array<{
        id: string;
        time: string;
        childName: string;
        therapistName: string;
        therapistId: string;
        activity: string;
        status: string;
        color: string;
      }>;
      hasConflicts: boolean;
      sessionCount: number;
    }>;
  };
}

const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  selectedDay,
  onClose,
  calendarData
}) => {
  const dayData = calendarData.days.find(day => 
    isSameDay(day.date, selectedDay)
  );

  const sessions = dayData?.sessions || [];
  const hasConflicts = dayData?.hasConflicts || false;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Concluída', variant: 'default' as const, color: 'text-green-600' };
      case 'cancelled':
        return { label: 'Cancelada', variant: 'destructive' as const, color: 'text-red-600' };
      case 'rescheduled':
        return { label: 'Remarcada', variant: 'secondary' as const, color: 'text-yellow-600' };
      default:
        return { label: 'Agendada', variant: 'outline' as const, color: 'text-blue-600' };
    }
  };

  const groupedSessions = sessions.reduce((acc, session) => {
    if (!acc[session.time]) {
      acc[session.time] = [];
    }
    acc[session.time].push(session);
    return acc;
  }, {} as Record<string, typeof sessions>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Calendário</span>
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold">
              {format(selectedDay, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h1>
            <p className="text-muted-foreground">
              {sessions.length} sessão{sessions.length !== 1 ? 'ões' : ''} agendada{sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {hasConflicts && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Conflitos detectados</span>
          </div>
        )}
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhuma sessão agendada</h3>
              <p>Não há sessões agendadas para este dia.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSessions)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([time, timeSessions]) => (
              <Card key={time}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>{time}</span>
                    </CardTitle>
                    {timeSessions.length > 1 && (
                      <Badge variant="outline">
                        {timeSessions.length} sessões simultâneas
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {timeSessions.map((session, index) => {
                      const statusInfo = getStatusInfo(session.status);
                      
                      return (
                        <div key={session.id}>
                          {index > 0 && <Separator className="my-4" />}
                          
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-4 h-4 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: session.color }}
                                />
                                <div>
                                  <h4 className="font-medium">{session.childName}</h4>
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <User className="h-3 w-3" />
                                      <span>{session.therapistName}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Activity className="h-3 w-3" />
                                      <span>{session.activity}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <Badge 
                              variant={statusInfo.variant}
                              className={statusInfo.color}
                            >
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default CalendarDayView;
