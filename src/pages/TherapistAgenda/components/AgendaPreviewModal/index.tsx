
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, Activity, Plus, ExternalLink } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useTherapistAgendaContext } from '../../context/TherapistAgendaContext';
import { format, isSameWeek, isToday } from 'date-fns';

const AgendaPreviewModal: React.FC = () => {
  const { state, dispatch } = useTherapistAgendaContext();
  const { therapists, schedules, getChildById } = useData();
  
  const therapist = therapists.find(t => t.id === state.agendaPreview.therapistId);
  
  const therapistSchedules = schedules.filter(schedule => 
    schedule.therapistId === state.agendaPreview.therapistId &&
    isSameWeek(schedule.date, state.selectedWeek) &&
    schedule.status !== 'cancelled'
  ).sort((a, b) => a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time));

  const todaySchedules = therapistSchedules.filter(schedule => isToday(schedule.date));
  const weekStats = {
    totalSessions: therapistSchedules.length,
    completedSessions: therapistSchedules.filter(s => s.status === 'completed').length,
    totalHours: therapistSchedules.reduce((sum, s) => sum + (s.duration || 60) / 60, 0),
  };

  const handleClose = () => {
    dispatch({ type: 'CLOSE_AGENDA_PREVIEW' });
  };

  const handleQuickSchedule = () => {
    if (therapist) {
      dispatch({ type: 'CLOSE_AGENDA_PREVIEW' });
      dispatch({ type: 'OPEN_QUICK_SCHEDULE', payload: { therapistId: therapist.id } });
    }
  };

  const handleViewFullAgenda = () => {
    // TODO: Navigate to full agenda view
    console.log('Navigate to full agenda for therapist:', therapist?.id);
    handleClose();
  };

  if (!therapist) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={state.agendaPreview.isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: therapist.color }}
              >
                {therapist.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{therapist.name}</h3>
                <p className="text-sm text-muted-foreground">{therapist.professionalType}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={handleQuickSchedule}>
                <Plus className="h-4 w-4 mr-1" />
                Agendar
              </Button>
              <Button size="sm" onClick={handleViewFullAgenda}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Ver Agenda Completa
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Weekly Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{weekStats.totalSessions}</div>
                <div className="text-sm text-muted-foreground">Sessões da Semana</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{weekStats.completedSessions}</div>
                <div className="text-sm text-muted-foreground">Concluídas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{weekStats.totalHours.toFixed(1)}h</div>
                <div className="text-sm text-muted-foreground">Total de Horas</div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Sessions */}
          {todaySchedules.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Sessões de Hoje ({todaySchedules.length})</span>
              </h4>
              <div className="space-y-2">
                {todaySchedules.map((schedule) => {
                  const child = getChildById(schedule.childId);
                  return (
                    <Card key={schedule.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{schedule.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3 text-gray-500" />
                              <span className="font-medium">{child?.name || 'Desconhecido'}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Activity className="h-3 w-3" />
                              <span>{schedule.activity}</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status === 'completed' ? 'Concluída' : 
                             schedule.status === 'scheduled' ? 'Agendada' : 'Cancelada'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weekly Sessions */}
          <div>
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span>Todas as Sessões da Semana ({therapistSchedules.length})</span>
            </h4>
            {therapistSchedules.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma sessão agendada para esta semana</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {therapistSchedules.map((schedule) => {
                  const child = getChildById(schedule.childId);
                  return (
                    <Card key={schedule.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm">
                              <div className="font-medium">
                                {format(schedule.date, 'dd/MM')} - {schedule.time}
                              </div>
                              <div className="text-muted-foreground">
                                {child?.name} • {schedule.activity}
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status === 'completed' ? 'Concluída' : 
                             schedule.status === 'scheduled' ? 'Agendada' : 'Cancelada'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgendaPreviewModal;
