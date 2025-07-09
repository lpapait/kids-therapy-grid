
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, User, Eye, Phone, MessageSquare } from 'lucide-react';
import { TherapistOverviewCard } from '../../types/therapist-agenda.types';

interface TherapistCardProps {
  card: TherapistOverviewCard;
  onViewAgenda: (therapistId: string) => void;
  onQuickSchedule: (therapistId: string) => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({
  card,
  onViewAgenda,
  onQuickSchedule
}) => {
  const getStatusColor = () => {
    switch (card.status) {
      case 'available': return 'bg-green-500';
      case 'near_limit': return 'bg-yellow-500';
      case 'overloaded': return 'bg-red-500';
    }
  };

  const getStatusLabel = () => {
    switch (card.status) {
      case 'available': return 'Disponível';
      case 'near_limit': return 'Próx. Limite';
      case 'overloaded': return 'Sobrecarregado';
    }
  };

  const getStatusBadgeVariant = () => {
    switch (card.status) {
      case 'available': return 'default';
      case 'near_limit': return 'secondary';
      case 'overloaded': return 'destructive';
    }
  };

  const getProgressBarClass = () => {
    switch (card.status) {
      case 'available': return '[&>div]:bg-green-500';
      case 'near_limit': return '[&>div]:bg-yellow-500';
      case 'overloaded': return '[&>div]:bg-red-500';
    }
  };

  const initials = card.therapist.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardContent className="p-4">
        {/* Header with Avatar and Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarFallback 
                  className="text-white text-sm font-medium"
                  style={{ backgroundColor: card.therapist.color }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div 
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor()}`}
                title={getStatusLabel()}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {card.therapist.name}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {card.therapist.professionalType}
              </p>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant()}>
            {getStatusLabel()}
          </Badge>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1 mb-3">
          {card.therapist.specialties.slice(0, 2).map((specialty) => (
            <Badge key={specialty} variant="outline" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {card.therapist.specialties.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{card.therapist.specialties.length - 2}
            </Badge>
          )}
        </div>

        {/* Workload Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Carga Semanal</span>
            <span className="font-medium">
              {card.currentWeekHours}h / {card.maxWeeklyHours}h
            </span>
          </div>
          <Progress 
            value={card.utilizationPercentage} 
            className={`h-2 ${getProgressBarClass()}`}
          />
          <div className="text-xs text-gray-500 text-center">
            {card.utilizationPercentage}% utilizado
          </div>
        </div>

        {/* Sessions Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Calendar className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600">Hoje</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {card.todaySessionsCount}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="h-3 w-3 text-purple-600" />
              <span className="text-xs text-gray-600">Semana</span>
            </div>
            <div className="text-lg font-bold text-purple-600">
              {card.weekSessionsCount}
            </div>
          </div>
        </div>

        {/* Next Session */}
        {card.nextSession && (
          <div className="p-2 bg-blue-50 rounded-lg mb-4">
            <div className="text-xs text-blue-600 font-medium mb-1">
              Próxima Sessão
            </div>
            <div className="text-sm">
              <div className="font-medium">{card.nextSession.time}</div>
              <div className="text-gray-600 truncate">
                {card.nextSession.childName} - {card.nextSession.activity}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => onViewAgenda(card.therapist.id)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Ver Agenda
          </Button>
          {card.status !== 'overloaded' && (
            <Button
              size="sm"
              variant="default"
              className="flex-1 text-xs"
              onClick={() => onQuickSchedule(card.therapist.id)}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Agendar
            </Button>
          )}
        </div>

        {/* Hidden quick actions on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2 flex justify-center space-x-2">
          <Button size="sm" variant="ghost" className="p-2">
            <Phone className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" className="p-2">
            <MessageSquare className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" className="p-2">
            <User className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistCard;
