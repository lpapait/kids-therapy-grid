
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Child, Schedule } from '@/types';
import UnifiedScheduleGrid from '@/components/UnifiedGrid/UnifiedScheduleGrid';

interface ScheduleGridProps {
  selectedWeek: Date;
  selectedChild: Child | null;
  onScheduleClick: (date: Date, time: string, schedule?: Schedule) => void;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  selectedWeek,
  selectedChild,
  onScheduleClick
}) => {
  // Validação de segurança
  if (!selectedChild) {
    return (
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Grade de Agendamentos</span>
            </CardTitle>
            <CardDescription>
              Selecione uma criança para visualizar os agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Nenhuma criança selecionada</p>
              <p className="text-sm mt-2">Escolha uma criança para começar a gerenciar os agendamentos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSelectTherapist = (therapist: any) => {
    // Criar agendamento temporário com o terapeuta selecionado
    const tempSchedule = {
      id: '',
      childId: selectedChild?.id || '',
      therapistId: therapist.id,
      date: new Date(),
      time: '08:00',
      duration: 60,
      activity: `Sessão de ${therapist.specialties[0] || 'Terapia'}`,
      status: 'scheduled' as const,
      observations: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: 'user'
    };
    onScheduleClick(new Date(), '08:00', tempSchedule);
  };

  return (
    <div className="lg:col-span-3">
      <UnifiedScheduleGrid
        selectedWeek={selectedWeek}
        mode="child"
        targetEntity={selectedChild}
        onScheduleClick={onScheduleClick}
        onSelectTherapist={handleSelectTherapist}
        showFilters={true}
        showActions={true}
      />
    </div>
  );
};

export default ScheduleGrid;
