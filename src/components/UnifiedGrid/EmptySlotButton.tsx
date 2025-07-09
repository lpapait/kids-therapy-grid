
import React from 'react';
import { Button } from '@/components/ui/button';
import { Child, Therapist } from '@/types';

interface EmptySlotButtonProps {
  selectedChild: Child | null;
  date: Date;
  time: string;
  onScheduleClick?: (date: Date, time: string, schedule?: undefined) => void;
  onSelectTherapist?: (therapist: Therapist) => void;
}

const EmptySlotButton: React.FC<EmptySlotButtonProps> = ({
  selectedChild,
  date,
  time,
  onScheduleClick,
  onSelectTherapist
}) => {
  const handleClick = () => {
    console.log('Empty slot clicked:', { selectedChild, date, time });
    
    if (onScheduleClick && selectedChild) {
      onScheduleClick(date, time, undefined);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-xs hover:bg-primary/10 transition-colors"
      disabled={!selectedChild}
      onClick={handleClick}
    >
      + Agendar
    </Button>
  );
};

export default EmptySlotButton;
