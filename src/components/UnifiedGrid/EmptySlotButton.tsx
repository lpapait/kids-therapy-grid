
import React from 'react';
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
    // TODO: Implementar lógica de sugestão de terapeutas
    console.log('Empty slot clicked:', { selectedChild, date, time });
  };

  return (
    <button 
      className="w-8 h-8 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
      onClick={handleClick}
    >
      +
    </button>
  );
};

export default EmptySlotButton;
