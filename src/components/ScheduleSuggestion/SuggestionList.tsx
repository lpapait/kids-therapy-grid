import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';
import { ScheduleSuggestion, Child } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

interface SuggestionListProps {
  suggestions: ScheduleSuggestion[];
  child: Child;
  specialty: string;
  onScheduleCreated: () => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  child,
  specialty,
  onScheduleCreated
}) => {
  const { addSchedule } = useData();
  const { toast } = useToast();

  const handleScheduleNow = (suggestion: ScheduleSuggestion) => {
    if (!suggestion.available) return;

    try {
      addSchedule({
        childId: child.id,
        therapistId: suggestion.therapistId,
        date: suggestion.date,
        time: suggestion.time,
        activity: specialty,
        duration: 60, // 1 hora por padrão
        status: 'scheduled',
        updatedBy: 'system'
      });

      toast({
        title: 'Agendamento criado',
        description: `Sessão de ${specialty} agendada para ${format(suggestion.date, 'EEEE, dd/MM', { locale: ptBR })} às ${suggestion.time}`
      });

      onScheduleCreated();
    } catch (error) {
      toast({
        title: 'Erro ao agendar',
        description: 'Não foi possível criar o agendamento',
        variant: 'destructive'
      });
    }
  };

  const getWorkloadBadgeColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'destructive';
    if (percentage >= 75) return 'secondary';
    return 'outline';
  };

  const getWorkloadIcon = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return <AlertTriangle className="h-3 w-3" />;
    if (percentage >= 75) return <Clock className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-lg font-medium mb-2">Nenhum horário disponível</p>
        <p className="text-sm">
          Não há horários disponíveis para {specialty} nesta semana.
          Tente verificar outras semanas ou ajustar a carga horária dos terapeutas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground mb-4">
        {suggestions.filter(s => s.available).length} horários disponíveis encontrados
      </div>
      
      {suggestions.map((suggestion) => (
        <Card 
          key={suggestion.id} 
          className={`transition-all ${
            !suggestion.available 
              ? 'opacity-60 bg-muted/50' 
              : 'hover:shadow-md cursor-pointer'
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="font-medium">
                    {format(suggestion.date, 'EEEE, dd/MM', { locale: ptBR })}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.time}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="h-3 w-3" />
                  <span>{suggestion.therapistName}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={getWorkloadBadgeColor(suggestion.therapistWorkload, suggestion.maxWorkload)}
                    className="text-xs"
                  >
                    {getWorkloadIcon(suggestion.therapistWorkload, suggestion.maxWorkload)}
                    <span className="ml-1">
                      {suggestion.therapistWorkload}h/{suggestion.maxWorkload}h
                    </span>
                  </Badge>
                  
                  {!suggestion.available && suggestion.conflictReason && (
                    <Badge variant="destructive" className="text-xs">
                      {suggestion.conflictReason}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="ml-4">
                <Button
                  size="sm"
                  onClick={() => handleScheduleNow(suggestion)}
                  disabled={!suggestion.available}
                  className="min-w-[100px]"
                >
                  {suggestion.available ? 'Agendar' : 'Indisponível'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SuggestionList;