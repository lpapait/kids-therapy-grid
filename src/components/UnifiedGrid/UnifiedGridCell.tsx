
import React from 'react';
import { Schedule, Child, Therapist } from '@/types';
import { useData } from '@/contexts/DataContext';
import { getTherapistColorStyles } from '@/lib/therapistColors';
import GridCellContent from './GridCellContent';
import EmptySlotButton from './EmptySlotButton';

interface UnifiedGridCellProps {
  date: Date;
  time: string;
  schedule?: Schedule | null;
  mode: 'child' | 'therapist' | 'overview';
  targetEntity?: Child | Therapist;
  isSelected: boolean;
  isDraggedOver: boolean;
  cellHeight: number;
  onScheduleClick: (date: Date, time: string, schedule?: Schedule, e?: React.MouseEvent) => void;
  onDragStart: (schedule: Schedule) => void;
  onDrop: (date: Date, time: string) => void;
  onSelectTherapist?: (therapist: Therapist) => void;
}

const UnifiedGridCell: React.FC<UnifiedGridCellProps> = ({
  date,
  time,
  schedule,
  mode,
  targetEntity,
  isSelected,
  isDraggedOver,
  cellHeight,
  onScheduleClick,
  onDragStart,
  onDrop,
  onSelectTherapist
}) => {
  const { getTherapistById, getChildById } = useData();

  const therapist = schedule ? getTherapistById(schedule.therapistId) : null;
  const child = schedule ? getChildById(schedule.childId) : null;
  const colorStyles = therapist ? getTherapistColorStyles(therapist.color, false) : {};

  const handleClick = (e: React.MouseEvent) => {
    onScheduleClick(date, time, schedule || undefined, e);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (schedule) {
      onDragStart(schedule);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(date, time);
  };

  return (
    <div
      className={`
        border-b border-r transition-all duration-200 relative
        ${isDraggedOver ? 'bg-primary/10 border-primary' : 'hover:bg-muted/30'}
        ${isSelected ? 'ring-2 ring-primary ring-inset' : ''}
        ${schedule ? 'cursor-pointer' : 'flex items-center justify-center'}
      `}
      style={{ 
        height: cellHeight,
        ...(schedule ? colorStyles : {})
      }}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {schedule && therapist ? (
        <GridCellContent
          schedule={schedule}
          therapist={therapist}
          child={child}
          mode={mode}
          isSelected={isSelected}
          onDragStart={handleDragStart}
        />
      ) : (
        <EmptySlotButton
          selectedChild={mode === 'child' ? (targetEntity as Child) : null}
          date={date}
          time={time}
          onSelectTherapist={onSelectTherapist}
        />
      )}
    </div>
  );
};

export default UnifiedGridCell;
