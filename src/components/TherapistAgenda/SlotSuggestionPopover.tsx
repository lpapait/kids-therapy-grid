
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, User, Clock, Target } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Child, Therapist } from '@/types';
import { calculateAge } from '@/lib/dateUtils';

interface SlotSuggestionPopoverProps {
  therapist: Therapist;
  date: Date;
  time: string;
  currentWorkload: number;
  maxWorkload: number;
}

const SlotSuggestionPopover: React.FC<SlotSuggestionPopoverProps> = ({
  therapist,
  date,
  time,
  currentWorkload,
  maxWorkload
}) => {
  const { children } = useData();
  const [open, setOpen] = useState(false);

  // Encontrar crianças que precisam das especialidades do terapeuta
  const suggestedChildren = children.filter(child =>
    child.weeklyTherapies.some(therapy =>
      therapist.specialties.includes(therapy.specialty)
    )
  ).slice(0, 5); // Limitar a 5 sugestões

  const utilizationPercentage = (currentWorkload / maxWorkload) * 100;

  const handleScheduleSession = (child: Child, specialty: string) => {
    // Implementar lógica de agendamento
    console.log('Agendar sessão:', { child: child.name, specialty, date, time });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Sugestões para este horário</h4>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Clock className="h-3 w-3" />
              <span>
                {date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })} 
                às {time}
              </span>
            </div>
          </div>

          {/* Indicador de Carga */}
          <Card className="bg-gray-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-xs">
                <span>Carga atual do terapeuta</span>
                <Badge variant={utilizationPercentage > 90 ? 'destructive' : utilizationPercentage > 75 ? 'secondary' : 'default'}>
                  {currentWorkload}h/{maxWorkload}h ({utilizationPercentage.toFixed(0)}%)
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    utilizationPercentage > 90 ? 'bg-red-500' :
                    utilizationPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Lista de Crianças Sugeridas */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Crianças que precisam atender:</h5>
            {suggestedChildren.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {suggestedChildren.map((child) => {
                  const relevantTherapies = child.weeklyTherapies.filter(therapy =>
                    therapist.specialties.includes(therapy.specialty)
                  );
                  
                  return (
                    <Card key={child.id} className="p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <User className="h-3 w-3 text-blue-600" />
                            <span className="text-sm font-medium">{child.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {calculateAge(child.birthDate)} anos
                            </Badge>
                          </div>
                          <div className="mt-1 space-y-1">
                            {relevantTherapies.map((therapy) => (
                              <div key={therapy.specialty} className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-1">
                                  <Target className="h-3 w-3 text-green-600" />
                                  <span>{therapy.specialty}</span>
                                </div>
                                <span className="text-gray-500">{therapy.hoursRequired}h/sem</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="ml-2 space-y-1">
                          {relevantTherapies.map((therapy) => (
                            <Button
                              key={therapy.specialty}
                              size="sm"
                              variant="outline"
                              className="text-xs py-1 px-2 h-auto"
                              onClick={() => handleScheduleSession(child, therapy.specialty)}
                            >
                              Agendar
                            </Button>
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma criança pendente para suas especialidades.</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SlotSuggestionPopover;
