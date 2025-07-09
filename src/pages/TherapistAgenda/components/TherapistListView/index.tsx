
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Eye, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { TherapistOverviewCard } from '../../types/therapist-agenda.types';
import { useTherapistAgendaContext } from '../../context/TherapistAgendaContext';

interface TherapistListViewProps {
  cards: TherapistOverviewCard[];
  isLoading?: boolean;
}

const TherapistListView: React.FC<TherapistListViewProps> = ({
  cards,
  isLoading = false
}) => {
  const { dispatch } = useTherapistAgendaContext();

  const handleViewAgenda = (therapistId: string) => {
    dispatch({ type: 'OPEN_AGENDA_PREVIEW', payload: therapistId });
  };

  const handleQuickSchedule = (therapistId: string) => {
    dispatch({ type: 'OPEN_QUICK_SCHEDULE', payload: { therapistId } });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50';
      case 'near_limit': return 'text-yellow-600 bg-yellow-50';
      case 'overloaded': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <TrendingDown className="h-4 w-4" />;
      case 'near_limit': return <Minus className="h-4 w-4" />;
      case 'overloaded': return <TrendingUp className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'near_limit': return 'Próximo ao Limite';
      case 'overloaded': return 'Sobrecarregado';
      default: return 'Desconhecido';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4" />
                  <div className="h-3 bg-gray-300 rounded w-1/6" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-300 rounded w-20" />
                  <div className="h-2 bg-gray-300 rounded w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum terapeuta encontrado
          </h3>
          <p className="text-gray-500">
            Ajuste os filtros para encontrar os terapeutas desejados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => {
        const initials = card.therapist.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        return (
          <Card key={card.therapist.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Therapist Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback 
                      className="text-white text-lg font-medium"
                      style={{ backgroundColor: card.therapist.color }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {card.therapist.name}
                      </h3>
                      <Badge className={getStatusColor(card.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(card.status)}
                          <span>{getStatusLabel(card.status)}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600">{card.therapist.professionalType}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {card.therapist.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {card.therapist.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{card.therapist.specialties.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {card.therapist.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{card.therapist.phone}</span>
                        </div>
                      )}
                      {card.therapist.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{card.therapist.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Workload & Stats */}
                <div className="flex items-center space-x-8">
                  {/* Sessions Today/Week */}
                  <div className="text-center">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {card.todaySessionsCount}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Hoje</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {card.weekSessionsCount}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Semana</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Workload Progress */}
                  <div className="w-48">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Carga Semanal</span>
                      <span className="font-medium">
                        {card.currentWeekHours}h / {card.maxWeeklyHours}h
                      </span>
                    </div>
                    <Progress 
                      value={card.utilizationPercentage} 
                      className={`h-2 ${
                        card.status === 'overloaded' ? '[&>div]:bg-red-500' :
                        card.status === 'near_limit' ? '[&>div]:bg-yellow-500' :
                        '[&>div]:bg-green-500'
                      }`}
                    />
                    <div className="text-xs text-gray-500 text-center mt-1">
                      {card.utilizationPercentage}% utilizado
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewAgenda(card.therapist.id)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Ver Agenda</span>
                    </Button>
                    {card.status !== 'overloaded' && (
                      <Button
                        size="sm"
                        onClick={() => handleQuickSchedule(card.therapist.id)}
                        className="flex items-center space-x-1"
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Agendar</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Session Info */}
              {card.nextSession && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Próxima Sessão:
                      </span>
                    </div>
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">{card.nextSession.time}</span> - 
                      <span className="ml-1">{card.nextSession.childName}</span> 
                      <span className="ml-1 text-blue-600">({card.nextSession.activity})</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TherapistListView;
