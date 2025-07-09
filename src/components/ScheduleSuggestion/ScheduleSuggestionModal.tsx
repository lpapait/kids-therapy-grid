import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Child } from '@/types';
import { useScheduleSuggestion } from '@/hooks/useScheduleSuggestion';
import SuggestionList from './SuggestionList';

interface ScheduleSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
  specialty: string;
  hoursNeeded: number;
  selectedWeek: Date;
  onScheduleCreated: () => void;
}

const ScheduleSuggestionModal: React.FC<ScheduleSuggestionModalProps> = ({
  isOpen,
  onClose,
  child,
  specialty,
  hoursNeeded,
  selectedWeek,
  onScheduleCreated
}) => {
  const suggestions = useScheduleSuggestion({
    child,
    specialty,
    selectedWeek,
    hoursNeeded
  });

  if (!child) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            Sugestões de Agendamento
          </SheetTitle>
          <SheetDescription className="text-left">
            <div className="space-y-1">
              <div className="font-medium text-foreground">{child.name}</div>
              <div className="text-sm">
                <span className="font-medium">{specialty}</span>
                <span className="text-muted-foreground ml-2">
                  • Faltam {hoursNeeded}h nesta semana
                </span>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <SuggestionList
            suggestions={suggestions}
            child={child}
            specialty={specialty}
            onScheduleCreated={onScheduleCreated}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ScheduleSuggestionModal;