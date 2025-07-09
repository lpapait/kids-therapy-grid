import React from 'react';
import WeekSelector from '@/components/WeekSelector';
import ScheduleGridSkeleton from '@/components/ScheduleManagement/ScheduleGridSkeleton';
import SessionEditModal from '@/components/SessionEditModal';
import ScheduleHeader from '@/components/ScheduleManagement/ScheduleHeader';
import ChildSelector from '@/components/ScheduleManagement/ChildSelector';
import ScheduleSidebar from '@/components/ScheduleManagement/ScheduleSidebar';
import ScheduleGrid from '@/components/ScheduleManagement/ScheduleGrid';
import LazyPanel from '@/components/LazyPanel';
import { useTherapyCoverage } from '@/hooks/useTherapyCoverage';
import { useOptimizedWorkload } from '@/hooks/useOptimizedWorkload';
import { useScheduleManagement } from '@/hooks/useScheduleManagement';

const ScheduleManagementLayout = () => {
  const {
    children,
    selectedWeek,
    selectedChild,
    editingSession,
    refreshKey,
    isGridLoading,
    debouncedSelectedWeek,
    debouncedSelectedChild,
    selectedTherapist,
    selectedTherapistId,
    setSelectedWeek,
    setSelectedChild,
    handleScheduleClick,
    handleCloseModal,
    handleDuplicateWeek,
    handleQuickAction,
    handleAlertClick
  } = useScheduleManagement();

  const therapyCoverage = useTherapyCoverage(debouncedSelectedChild, debouncedSelectedWeek);
  const therapistWorkload = useOptimizedWorkload(selectedTherapistId, debouncedSelectedWeek);

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
              {isGridLoading ? (
                <ScheduleGridSkeleton />
              ) : (
                <ScheduleGrid
                  key={`${refreshKey}-${selectedChild.id}-${debouncedSelectedWeek.getTime()}`}
                  selectedWeek={debouncedSelectedWeek}
                  selectedChild={debouncedSelectedChild}
                  onScheduleClick={handleScheduleClick}
                />
              )}
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

export default ScheduleManagementLayout;