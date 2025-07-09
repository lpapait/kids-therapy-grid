
import React from 'react';
import { Child, Schedule } from '@/types';
import EmptyChildState from './EmptyChildState';
import ScheduleGridContainer from './ScheduleGridContainer';

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
  if (!selectedChild) {
    return <EmptyChildState />;
  }

  return (
    <ScheduleGridContainer
      selectedWeek={selectedWeek}
      selectedChild={selectedChild}
      onScheduleClick={onScheduleClick}
    />
  );
};

export default ScheduleGrid;
