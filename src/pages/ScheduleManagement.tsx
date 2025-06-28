
import React, { useState } from 'react';
import WeekSelector from '@/components/WeekSelector';
import SessionEditModal from '@/components/SessionEditModal';
import ScheduleHeader from '@/components/ScheduleManagement/ScheduleHeader';
import ChildSelector from '@/components/ScheduleManagement/ChildSelector';
import ScheduleSidebar from '@/components/ScheduleManagement/ScheduleSidebar';
import ScheduleGrid from '@/components/ScheduleManagement/ScheduleGrid';
import LazyPanel from '@/components/LazyPanel';
import { useData } from '@/contexts/DataContext';
import { Child, Schedule } from '@/types';
import { useTherapyCoverage } from '@/hooks/useTherapyCoverage';
import { useOptimizedWorkload } from '@/hooks/useOptimizedWorkload';
import { useDebounce, useDebouncedCallback } from '@/hooks/useDebounce';
import { useWeekDuplication } from '@/hooks/useWeekDuplication';
import { useToast } from '@/hooks/use-toast';

const ScheduleManagement = () => {
  const { children, getTherapistById } = useData();
  const { toast } = useToast();
  const { duplicateWeek } = useWeekDuplication();
  
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [editingSession, setEditingSession] = useState<{
    date: Date;
    time: string;
    schedule?: Schedule;
  } | null>(null);

  // Debounce the selected week to avoid too many recalculations
  const debouncedSelectedWeek = useDebounce(selectedWeek, 300);
  const debouncedSelectedChild = useDebounce(selectedChild, 200);

  const therapyCoverage = useTherapyCoverage(debouncedSelectedChild, debouncedSelectedWeek);
  
  // Get the therapist from the selected session or null
  const selectedTherapistId = editingSession?.schedule?.therapistId || null;
  const selectedTherapist = selectedTherapistId ? getTherapistById(selectedTherapistId) : null;
  const therapistWorkload = useOptimizedWorkload(selectedTherapistId, debouncedSelectedWeek);

  const handleScheduleClick = (date: Date, time: string, schedule?: Schedule) => {
    if (!selectedChild) return;
    
    setEditingSession({
      date,
      time,
      schedule
    });
  };

  const handleCloseModal = () => {
    setEditingSession(null);
  };

  const handleDuplicateWeek = useDebouncedCallback(async () => {
    if (!selectedChild) {
      toast({
        title: 'Selecione uma criança',
        description: 'É necessário selecionar uma criança antes de duplicar a semana.',
        variant: 'destructive'
      });
      return;
    }

    const duplicatedCount = await duplicateWeek(selectedChild, selectedWeek);
    if (duplicatedCount > 0) {
      // Force re-render by updating the selected week state
      setSelectedWeek(new Date(selectedWeek));
    }
  }, 500);

  const handleQuickAction = useDebouncedCallback((action: string) => {
    if (!selectedTherapistId) return;

    switch (action) {
      case 'add_session':
        toast({
          title: 'Adicionando nova sessão',
          description: `Preparando nova sessão para ${selectedTherapist?.name}`,
          variant: 'default'
        });
        break;
      case 'view_schedule':
        toast({
          title: 'Visualizando agenda',
          description: `Abrindo agenda de ${selectedTherapist?.name}`,
          variant: 'default'
        });
        break;
      case 'redistribute':
        toast({
          title: 'Redistribuindo sessões',
          description: `Iniciando redistribuição para ${selectedTherapist?.name}`,
          variant: 'default'
        });
        break;
      default:
        console.log('Unknown action:', action);
    }
  }, 300);

  const handleAlertClick = useDebouncedCallback((therapistId: string) => {
    const therapist = getTherapistById(therapistId);
    if (therapist) {
      toast({
        title: 'Focalizando terapeuta',
        description: `Visualizando detalhes de ${therapist.name}`,
        variant: 'default'
      });
    }
  }, 200);

  return (
    <div className="space-y-6">
      <ScheduleHeader
        selectedChild={selectedChild}
        onDuplicateWeek={handleDuplicateWeek}
      />

      <ChildSelector
        children={children}
        selectedChild={selectedChild}
        onChildSelect={setSelectedChild}
      />

      {selectedChild && (
        <>
          <WeekSelector
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <LazyPanel className="lg:col-span-1">
              <ScheduleSidebar
                child={debouncedSelectedChild}
                coverageData={therapyCoverage}
                selectedTherapist={selectedTherapist}
                therapistWorkload={therapistWorkload}
                selectedWeek={debouncedSelectedWeek}
                hasEditingSession={!!editingSession?.schedule}
                onQuickAction={handleQuickAction}
                onAlertClick={handleAlertClick}
              />
            </LazyPanel>

            <LazyPanel className="lg:col-span-3">
              <ScheduleGrid
                selectedWeek={debouncedSelectedWeek}
                selectedChild={debouncedSelectedChild}
                onScheduleClick={handleScheduleClick}
              />
            </LazyPanel>
          </div>
        </>
      )}

      {editingSession && selectedChild && (
        <SessionEditModal
          isOpen={!!editingSession}
          onClose={handleCloseModal}
          schedule={editingSession.schedule}
          date={editingSession.date}
          time={editingSession.time}
          child={selectedChild}
        />
      )}
    </div>
  );
};

export default ScheduleManagement;
