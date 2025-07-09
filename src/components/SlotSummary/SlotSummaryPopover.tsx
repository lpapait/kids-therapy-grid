import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Child, Therapist } from '@/types';
import { useSlotAnalysis } from '@/hooks/useSlotAnalysis';
import PendingSpecialtiesCard from './PendingSpecialtiesCard';
import AvailableTherapistsList from './AvailableTherapistsList';

interface SlotSummaryPopoverProps {
  children: React.ReactNode;
  selectedChild: Child | null;
  selectedWeek: Date;
  slotDate: Date;
  slotTime: string;
  onSelectTherapist: (therapist: Therapist) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SlotSummaryPopover: React.FC<SlotSummaryPopoverProps> = ({
  children,
  selectedChild,
  selectedWeek,
  slotDate,
  slotTime,
  onSelectTherapist,
  open,
  onOpenChange
}) => {
  const analysis = useSlotAnalysis(selectedChild, selectedWeek, slotDate, slotTime);

  if (!selectedChild || !analysis) {
    return <>{children}</>;
  }

  const handleSelectTherapist = (therapist: Therapist) => {
    onSelectTherapist(therapist);
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0" 
        align="center"
        side="top"
        sideOffset={8}
      >
        <div className="space-y-4 p-4">
          {/* Header com data e horário */}
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Resumo do Slot
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(slotDate, "EEEE, dd/MM", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{slotTime}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Criança: <span className="font-medium">{selectedChild.name}</span>
              </div>
            </CardContent>
          </Card>

          {/* Especialidades pendentes */}
          <PendingSpecialtiesCard specialties={analysis.pendingSpecialties} />

          {/* Terapeutas disponíveis */}
          <AvailableTherapistsList 
            therapists={analysis.availableTherapists}
            onSelectTherapist={handleSelectTherapist}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SlotSummaryPopover;