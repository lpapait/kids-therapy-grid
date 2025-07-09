
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import WeekSelector from '@/components/WeekSelector';
import TherapistWorkloadPanel from '@/components/TherapistWorkloadPanel';
import { useTherapistWorkload } from '@/hooks/useTherapistWorkload';
import { useAgendaFilters } from '../../hooks/useAgendaFilters';
import { useSessionActions } from '../../hooks/useSessionActions';
import { AgendaService } from '../../services/agendaService';
import StatsPanel from './StatsPanel';
import FilterPanel from './FilterPanel';
import WeeklyGrid from './WeeklyGrid';

interface WeeklyViewProps {
  therapistId: string;
  showWeekSelector?: boolean;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ 
  therapistId, 
  showWeekSelector = true 
}) => {
  const { schedules, getTherapistById, getChildById } = useData();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  
  const therapist = getTherapistById(therapistId);
  const therapistWorkload = useTherapistWorkload(therapistId, selectedWeek);
  
  const {
    filters,
    toggleSpecialty,
    clearFilters,
    hasActiveFilters
  } = useAgendaFilters();

  const {
    editSession,
    deleteSession,
    markCompleted,
    viewChild
  } = useSessionActions();

  if (!therapist) {
    return (
      <div className="p-6 text-center text-gray-500">
        Terapeuta não encontrado
      </div>
    );
  }

  const filteredSchedules = AgendaService.filterSchedules(
    schedules,
    therapistId,
    selectedWeek,
    filters,
    getTherapistById
  );

  const stats = AgendaService.calculateStats(filteredSchedules, therapist);

  return (
    <div className="space-y-6">
      {showWeekSelector && (
        <WeekSelector
          selectedWeek={selectedWeek}
          onWeekChange={setSelectedWeek}
        />
      )}

      <TherapistWorkloadPanel
        therapist={therapist}
        workloadData={therapistWorkload}
      />

      <StatsPanel
        stats={stats}
        therapist={therapist}
        schedules={filteredSchedules}
        selectedWeek={selectedWeek}
        getChildById={getChildById}
      />

      <FilterPanel
        availableSpecialties={therapist.specialties}
        filters={filters}
        onToggleSpecialty={toggleSpecialty}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <WeeklyGrid
        therapist={therapist}
        weekSchedules={filteredSchedules}
        selectedWeek={selectedWeek}
        getChildById={getChildById}
        stats={stats}
        onEditSession={editSession}
        onDeleteSession={deleteSession}
        onViewChild={viewChild}
        onMarkCompleted={markCompleted}
      />
    </div>
  );
};

export default WeeklyView;
