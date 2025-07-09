
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import WeekSelector from './WeekSelector';
import TherapistWorkloadPanel from './TherapistWorkloadPanel';
import { useTherapistWorkload } from '@/hooks/useTherapistWorkload';
import { useTherapistAgenda } from '@/hooks/useTherapistAgenda';
import SpecialtyFilters from './TherapistAgenda/SpecialtyFilters';
import StatsCards from './TherapistAgenda/StatsCards';
import WeeklyAgendaGrid from './TherapistAgenda/WeeklyAgendaGrid';
import { useToast } from '@/hooks/use-toast';
import { Schedule } from '@/types';

interface TherapistWeeklyViewProps {
  therapistId: string;
  showWeekSelector?: boolean;
}

const TherapistWeeklyView: React.FC<TherapistWeeklyViewProps> = ({ 
  therapistId, 
  showWeekSelector = true 
}) => {
  const { updateSchedule } = useData();
  const { toast } = useToast();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  
  const therapistWorkload = useTherapistWorkload(therapistId, selectedWeek);
  const {
    therapist,
    weekSchedules,
    selectedSpecialties,
    availableSpecialties,
    stats,
    toggleSpecialty,
    clearFilters,
    getChildById
  } = useTherapistAgenda({ therapistId, selectedWeek });

  const handleEditSession = (schedule: Schedule) => {
    console.log('Editar sessão:', schedule);
    toast({
      title: "Editar sessão",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleDeleteSession = (schedule: Schedule) => {
    updateSchedule(schedule.id, {
      status: 'cancelled',
      updatedBy: 'user'
    });
    toast({
      title: "Sessão cancelada",
      description: "A sessão foi cancelada com sucesso",
    });
  };

  const handleViewChild = (child: any) => {
    console.log('Ver criança:', child);
    toast({
      title: "Ver ficha da criança",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleMarkCompleted = (schedule: Schedule) => {
    updateSchedule(schedule.id, {
      status: 'completed',
      updatedBy: 'user'
    });
    toast({
      title: "Sessão marcada como realizada",
      description: "Status atualizado com sucesso",
    });
  };

  if (!therapist) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">Terapeuta não encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {showWeekSelector && (
        <WeekSelector
          selectedWeek={selectedWeek}
          onWeekChange={setSelectedWeek}
        />
      )}

      {/* Painel de Carga de Trabalho */}
      <TherapistWorkloadPanel
        therapist={therapist}
        workloadData={therapistWorkload}
      />

      {/* Estatísticas Rápidas */}
      <StatsCards
        stats={stats}
        therapist={therapist}
        schedules={weekSchedules}
        selectedWeek={selectedWeek}
        getChildById={getChildById}
      />

      {/* Filtros por Especialidade */}
      <SpecialtyFilters
        availableSpecialties={availableSpecialties}
        selectedSpecialties={selectedSpecialties}
        onToggleSpecialty={toggleSpecialty}
        onClearFilters={clearFilters}
      />

      {/* Grade da Agenda */}
      <WeeklyAgendaGrid
        therapist={therapist}
        weekSchedules={weekSchedules}
        selectedWeek={selectedWeek}
        getChildById={getChildById}
        stats={stats}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteSession}
        onViewChild={handleViewChild}
        onMarkCompleted={handleMarkCompleted}
      />
    </div>
  );
};

export default TherapistWeeklyView;
