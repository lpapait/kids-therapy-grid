
import React from 'react';
import { Child, Schedule, Therapist } from '@/types';
import UnifiedScheduleGrid from '@/components/UnifiedGrid/UnifiedScheduleGrid';
import { useScheduleGridHandlers } from '@/hooks/useScheduleGridHandlers';

interface ScheduleGridContainerProps {
  selectedWeek: Date;
  selectedChild: Child;
  onScheduleClick: (date: Date, time: string, schedule?: Schedule) => void;
}

const ScheduleGridContainer: React.FC<ScheduleGridContainerProps> = ({
  selectedWeek,
  selectedChild,
  onScheduleClick
}) => {
  const { handleSelectTherapist } = useScheduleGridHandlers(selectedChild, onScheduleClick);

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

export default ScheduleGridContainer;
