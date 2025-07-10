
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Clock, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdministrativeSuggestion {
  date: Date;
  time: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  activityType: string;
  estimatedDuration: number;
}

interface AdministrativeScheduleSuggesterProps {
  therapistId: string;
  therapistName: string;
  suggestions: AdministrativeSuggestion[];
  onScheduleClick: (therapistId: string, date: Date, time: string) => void;
}

const AdministrativeScheduleSuggester: React.FC<AdministrativeScheduleSuggesterProps> = ({
  therapistId,
  therapistName,
  suggestions,
  onScheduleClick
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Lightbulb className="h-5 w-5" />
          Sugestões de Tempo Administrativo
        </CardTitle>
        <CardDescription>
          Horários recomendados para {therapistName} completar atividades administrativas
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {suggestions.slice(0, 3).map((suggestion, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge className={`${getPriorityColor(suggestion.priority)} text-xs`}>
                  {getPriorityIcon(suggestion.priority)} {suggestion.priority.toUpperCase()}
                </Badge>
                <span className="text-sm font-medium">{suggestion.activityType}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(suggestion.date, 'dd/MM', { locale: ptBR })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {suggestion.time}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {suggestion.estimatedDuration}min
                </div>
              </div>
              
              <p className="text-xs text-gray-500">{suggestion.reason}</p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onScheduleClick(therapistId, suggestion.date, suggestion.time)}
              className="ml-3"
            >
              Agendar
            </Button>
          </div>
        ))}

        {suggestions.length > 3 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-blue-600">
              Ver todas as {suggestions.length} sugestões
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdministrativeScheduleSuggester;
