import React, { useState } from 'react';
import { Schedule, Therapist, Child } from '@/types';
import { getTherapistColor } from '@/lib/therapistColors';
import { Badge } from '@/components/ui/badge';
import SlotSummaryPopover from '@/components/SlotSummary/SlotSummaryPopover';

interface EnhancedGridCellProps {
  date: Date;
  time: string;
  schedule?: Schedule;
  therapist?: Therapist;
  isSelected: boolean;
  isDragOver: boolean;
  selectedChild: Child | null;
  selectedWeek: Date;
  onScheduleClick: (date: Date, time: string, schedule?: Schedule) => void;
  onDragStart: (schedule: Schedule) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onSelectToggle: (sessionId: string) => void;
  onSelectTherapist: (therapist: Therapist) => void;
}

const EnhancedGridCell: React.FC<EnhancedGridCellProps> = ({
  date,
  time,
  schedule,
  therapist,
  isSelected,
  isDragOver,
  selectedChild,
  selectedWeek,
  onScheduleClick,
  onDragStart,
  onDragOver,
  onDrop,
  onSelectToggle,
  onSelectTherapist
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (schedule && e.ctrlKey) {
      onSelectToggle(schedule.id);
    } else if (schedule) {
      onScheduleClick(date, time, schedule);
    } else {
      // Para células vazias, abrir o popover ao invés de criar agendamento direto
      setPopoverOpen(true);
    }
  };

  const handleSelectTherapist = (therapist: Therapist) => {
    onSelectTherapist(therapist);
    onScheduleClick(date, time, undefined);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (schedule) {
      onDragStart(schedule);
    }
  };

  return (
    <div
      className={`
        h-16 border border-border/50 relative transition-all
        ${isDragOver ? 'bg-primary/10 border-primary' : ''}
        ${isSelected ? 'ring-2 ring-primary' : ''}
        ${schedule ? 'p-1 cursor-pointer hover:bg-muted/50' : 'flex items-center justify-center'}
      `}
      onClick={schedule ? handleClick : undefined}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {schedule && therapist ? (
        <div
          className="h-full rounded p-1 text-xs flex flex-col justify-between cursor-grab active:cursor-grabbing"
          style={{ backgroundColor: getTherapistColor(therapist.id) + '20' }}
          draggable
          onDragStart={handleDragStart}
        >
          <div className="flex-1">
            <div className="font-medium text-foreground truncate">
              {schedule.activity}
            </div>
            <div className="text-muted-foreground truncate">
              {therapist.name}
            </div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-muted-foreground">
              {schedule.duration}min
            </span>
            <Badge 
              variant={
                schedule.status === 'completed' ? 'default' :
                schedule.status === 'cancelled' ? 'destructive' :
                'secondary'
              }
              className="text-xs px-1 py-0"
            >
              {schedule.status === 'completed' ? '✓' :
               schedule.status === 'cancelled' ? '✗' : '?'}
            </Badge>
          </div>
        </div>
      ) : (
        <SlotSummaryPopover
          selectedChild={selectedChild}
          selectedWeek={selectedWeek}
          slotDate={date}
          slotTime={time}
          onSelectTherapist={handleSelectTherapist}
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
        >
          <button className="w-8 h-8 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
            +
          </button>
        </SlotSummaryPopover>
      )}
    </div>
  );
};

export default EnhancedGridCell;