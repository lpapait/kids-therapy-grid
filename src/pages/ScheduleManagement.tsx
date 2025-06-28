
import React, { useState } from 'react';
import WeekSelector from '@/components/WeekSelector';
import SessionEditModal from '@/components/SessionEditModal';
import ScheduleHeader from '@/components/ScheduleManagement/ScheduleHeader';
import ChildSelector from '@/components/ScheduleManagement/ChildSelector';
import ScheduleSidebar from '@/components/ScheduleManagement/ScheduleSidebar';
import ScheduleGrid from '@/components/ScheduleManagement/ScheduleGrid';
import { useData } from '@/contexts/DataContext';
import { Child, Schedule } from '@/types';
import { useTherapyCoverage } from '@/hooks/useTherapyCoverage';
import { useTherapistWorkload } from '@/hooks/useTherapistWorkload';

const ScheduleManagement = () => {
  const { children, getTherapistById } = useData();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [editingSession, setEditingSession] = useState<{
    date: Date;
    time: string;
    schedule?: Schedule;
  } | null>(null);

  const therapyCoverage = useTherapyCoverage(selectedChild, selectedWeek);
  
  // Get the therapist from the selected session or null
  const selectedTherapistId = editingSession?.schedule?.therapistId || null;
  const selectedTherapist = selectedTherapistId ? getTherapistById(selectedTherapistId) : null;
  const therapistWorkload = useTherapistWorkload(selectedTherapistId, selectedWeek);

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

  const handleDuplicateWeek = () => {
    // Implementar duplicação da semana anterior
    console.log('Duplicar semana anterior');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add_session':
        console.log('Adding new session for therapist:', selectedTherapistId);
        break;
      case 'view_schedule':
        console.log('Viewing schedule for therapist:', selectedTherapistId);
        break;
      case 'redistribute':
        console.log('Redistributing sessions for therapist:', selectedTherapistId);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleAlertClick = (therapistId: string) => {
    const therapist = getTherapistById(therapistId);
    if (therapist) {
      console.log(`Focusing on therapist: ${therapist.name}`);
    }
  };

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
            <ScheduleSidebar
              child={selectedChild}
              coverageData={therapyCoverage}
              selectedTherapist={selectedTherapist}
              therapistWorkload={therapistWorkload}
              selectedWeek={selectedWeek}
              hasEditingSession={!!editingSession?.schedule}
              onQuickAction={handleQuickAction}
              onAlertClick={handleAlertClick}
            />

            <ScheduleGrid
              selectedWeek={selectedWeek}
              selectedChild={selectedChild}
              onScheduleClick={handleScheduleClick}
            />
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
