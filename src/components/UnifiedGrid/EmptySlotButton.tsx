
import React from 'react';
import { Button } from '@/components/ui/button';
import { Child, Therapist } from '@/types';

interface EmptySlotButtonProps {
  selectedChild: Child | null;
  date: Date;
  time: string;
  onSelectTherapist?: (therapist: Therapist) => void;
}

const EmptySlotButton: React.FC<EmptySlotButtonProps> = ({
  selectedChild,
  date,
  time,
  onSelectTherapist
}) => {
  const handleClick = () => {
    console.log('Empty slot clicked:', { selectedChild, date, time });
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-xs"
      disabled={!selectedChild}
      onClick={handleClick}
    >
      + Agendar
    </Button>
  );
};

export default EmptySlotButton;
