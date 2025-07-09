import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Child, TherapyCoverage } from '@/types';
import ScheduleSuggestionModal from './ScheduleSuggestionModal';

interface ScheduleSuggestionButtonProps {
  child: Child | null;
  therapy: TherapyCoverage;
  selectedWeek: Date;
  onScheduleCreated: () => void;
}

const ScheduleSuggestionButton: React.FC<ScheduleSuggestionButtonProps> = ({
  child,
  therapy,
  selectedWeek,
  onScheduleCreated
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Só mostrar o botão se a terapia estiver incompleta
  if (!child || therapy.status === 'complete') {
    return null;
  }

  const hoursNeeded = therapy.hoursRequired - therapy.hoursScheduled;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="mt-2 text-xs"
      >
        <Clock className="h-3 w-3 mr-1" />
        Sugerir horários
      </Button>

      <ScheduleSuggestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        child={child}
        specialty={therapy.specialty}
        hoursNeeded={hoursNeeded}
        selectedWeek={selectedWeek}
        onScheduleCreated={() => {
          onScheduleCreated();
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default ScheduleSuggestionButton;