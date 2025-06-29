
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Zap, Plus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Child, Therapist } from '@/types';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface QuickSchedulerProps {
  selectedChild: Child | null;
  selectedWeek: Date;
  onScheduleCreated: () => void;
}

const QuickScheduler: React.FC<QuickSchedulerProps> = ({
  selectedChild,
  selectedWeek,
  onScheduleCreated
}) => {
  const { therapists, addSchedule, schedules } = useData();
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  
  const activities = [
    'Terapia Ocupacional',
    'Fisioterapia',
    'Fonoaudiologia',
    'Psicologia',
    'Musicoterapia',
    'Hidroterapia'
  ];

  // Find available slots for the selected therapist
  const findAvailableSlots = (therapistId: string) => {
    const slots: { date: Date; time: string }[] = [];
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(selectedWeek, i));
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

    weekDays.forEach(day => {
      // Skip weekends
      if (day.getDay() === 0 || day.getDay() === 6) return;
      
      timeSlots.forEach(time => {
        const existingSchedule = schedules.find(s => 
          s.therapistId === therapistId &&
          format(s.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
          s.time === time &&
          s.status !== 'cancelled'
        );
        
        if (!existingSchedule) {
          slots.push({ date: day, time });
        }
      });
    });

    return slots.slice(0, 5); // Return first 5 available slots
  };

  const handleQuickSchedule = (slot: { date: Date; time: string }) => {
    if (!selectedChild || !selectedTherapist || !selectedActivity) return;

    addSchedule({
      childId: selectedChild.id,
      therapistId: selectedTherapist,
      date: slot.date,
      time: slot.time,
      activity: selectedActivity,
      duration: 60,
      status: 'scheduled',
      updatedBy: 'user'
    });

    onScheduleCreated();
  };

  if (!selectedChild) return null;

  const availableSlots = selectedTherapist ? findAvailableSlots(selectedTherapist) : [];
  const therapist = therapists.find(t => t.id === selectedTherapist);

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-900">
          <Zap className="h-4 w-4" />
          <span>Agendamento Rápido</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-green-900">Terapeuta</label>
            <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o terapeuta" />
              </SelectTrigger>
              <SelectContent>
                {therapists.map((therapist) => (
                  <SelectItem key={therapist.id} value={therapist.id}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full border" 
                        style={{ backgroundColor: therapist.color }}
                      />
                      <span>{therapist.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-green-900">Atividade</label>
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a atividade" />
              </SelectTrigger>
              <SelectContent>
                {activities.map((activity) => (
                  <SelectItem key={activity} value={activity}>
                    {activity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedTherapist && selectedActivity && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-green-900">
                Horários Disponíveis
              </label>
              {therapist && (
                <Badge variant="outline" className="border-green-300 text-green-700">
                  {therapist.name}
                </Badge>
              )}
            </div>
            
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {availableSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSchedule(slot)}
                    className="justify-between border-green-300 hover:bg-green-100"
                  >
                    <span>
                      {format(slot.date, 'EEEE, dd/MM', { locale: ptBR })} - {slot.time}
                    </span>
                    <Plus className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-green-700 bg-green-100 p-2 rounded">
                Nenhum horário disponível para este terapeuta nesta semana.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickScheduler;
