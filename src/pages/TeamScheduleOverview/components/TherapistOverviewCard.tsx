import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, User, Calendar, CheckCircle, AlertTriangle, XCircle, Circle, FileText } from 'lucide-react';

interface TherapistOverviewCardProps {
  therapist: {
    therapistId: string;
    therapistName: string;
    specialties: string[];
    color: string;
    hoursScheduled: number;
    maxHours: number;
    percentage: number;
    status: 'available' | 'near_limit' | 'overloaded';
    weeklyGrid: Array<Array<{
      date: Date;
      time: string;
      session?: {
        id: string;
        childName: string;
        activity: string;
        specialty: string;
        status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
      };
      isEmpty: boolean;
    }>>;
    availableSlots: number;
    sessionsCount: number;
  };
  onSessionClick?: (sessionId: string) => void;
  onSlotClick?: (therapistId: string, date: Date, time: string) => void;
}

const TherapistOverviewCard: React.FC<TherapistOverviewCardProps> = ({
  therapist,
  onSessionClick,
  onSlotClick
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50 border-green-200';
      case 'near_limit': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'overloaded': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

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
    return `${therapist.color}15`;
  };

  const getSessionBorderColor = (session: any) => {
    if (session?.specialty === 'Administrativo') {
      return 'border-slate-300';
    }
    return `${therapist.color}40`;
  };

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: therapist.color }}
              />
              <h3 className="font-semibold text-lg text-gray-900">
                {therapist.therapistName}
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {therapist.specialties.map(specialty => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
          
          <Badge className={`${getStatusColor(therapist.status)} font-medium`}>
            {therapist.status === 'available' && 'Disponível'}
            {therapist.status === 'near_limit' && 'Próximo do Limite'}
            {therapist.status === 'overloaded' && 'Sobrecarregado'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Carga Horária</span>
            <span className="font-medium">
              {therapist.hoursScheduled}h / {therapist.maxHours}h
            </span>
          </div>
          
          {/* Detalhamento da carga horária */}
          {therapist.administrativeHours && therapist.administrativeHours > 0 && (
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>• Sessões:</span>
                <span>{(therapist.hoursScheduled - therapist.administrativeHours).toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span>• Administrativo:</span>
                <span>{therapist.administrativeHours}h</span>
              </div>
            </div>
          )}
          
          <div className="relative">
            <Progress value={therapist.percentage} className="h-2" />
            <div 
              className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(therapist.percentage)}`}
              style={{ width: `${Math.min(therapist.percentage, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>{therapist.percentage}% utilização</span>
            <span>{therapist.availableSlots} slots livres</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Grade Semanal</h4>
          
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Header with days */}
              <div className="grid grid-cols-6 gap-1 mb-1">
                <div className="text-xs font-medium text-gray-500 p-1"></div>
                {weekDays.map(day => (
                  <div key={day} className="text-xs font-medium text-gray-500 text-center p-1">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Time slots and sessions */}
              {timeSlots.map((time, timeIndex) => (
                <div key={time} className="grid grid-cols-6 gap-1 mb-1">
                  <div className="text-xs text-gray-500 p-1 text-right">
                    {time}
                  </div>
                  
                  {therapist.weeklyGrid.map((daySlots, dayIndex) => {
                    const slot = daySlots[timeIndex];
                    
                    if (slot.isEmpty) {
                      return (
                        <Button
                          key={`${dayIndex}-${timeIndex}`}
                          variant="ghost"
                          className="h-8 p-1 border border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          onClick={() => onSlotClick?.(therapist.therapistId, slot.date, slot.time)}
                        >
                          <div className="text-xs text-gray-400">+</div>
                        </Button>
                      );
                    }

                    const isAdministrative = slot.session?.specialty === 'Administrativo';

                    return (
                      <Popover key={`${dayIndex}-${timeIndex}`}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`h-8 p-1 border text-xs hover:shadow-sm ${getSessionBackgroundColor(slot.session)} ${getSessionBorderColor(slot.session)}`}
                          >
                            <div className="flex flex-col items-center justify-center min-w-0 w-full">
                              <div className="truncate max-w-full text-[10px] leading-tight">
                                {isAdministrative ? (
                                  <div className="flex items-center gap-1">
                                    <FileText className="h-2 w-2" />
                                    <span>Admin</span>
                                  </div>
                                ) : (
                                  slot.session?.childName
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                {getSessionStatusIcon(slot.session?.status || 'scheduled')}
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
                                  slot.session?.childName
                                )}
                              </h4>
                              {getSessionStatusIcon(slot.session?.status || 'scheduled')}
                            </div>
                            
                            <div className="space-y-1 text-xs text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {slot.time}
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                {slot.session?.specialty}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {slot.session?.activity}
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
                                onClick={() => slot.session && onSessionClick?.(slot.session.id)}
                              >
                                Ver Detalhes
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistOverviewCard;
