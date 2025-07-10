
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Calendar, User } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useTherapistAgendaContext } from '../../context/TherapistAgendaContext';
import WeekSelector from '@/components/WeekSelector';
import WeeklyView from '@/features/therapist-agenda/components/WeeklyView';

const TherapistAgendaModal: React.FC = () => {
  const { state, dispatch } = useTherapistAgendaContext();
  const { getTherapistById } = useData();
  
  const { therapistAgendaModal } = state;
  const therapist = therapistAgendaModal.therapistId 
    ? getTherapistById(therapistAgendaModal.therapistId) 
    : null;

  const handleClose = () => {
    dispatch({ type: 'CLOSE_THERAPIST_AGENDA' });
  };

  const handleWeekChange = (date: Date) => {
    dispatch({ type: 'SET_THERAPIST_AGENDA_WEEK', payload: date });
  };

  if (!therapist || !therapistAgendaModal.isOpen) {
    return null;
  }

  return (
    <Dialog open={therapistAgendaModal.isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center"
              style={{ backgroundColor: therapist.color }}
            >
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Agenda - {therapist.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {therapist.professionalType} • {therapist.specialties.join(', ')}
              </p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <WeekSelector
              selectedWeek={therapistAgendaModal.selectedWeek}
              onWeekChange={handleWeekChange}
            />
          </div>

          <div className="border rounded-lg bg-background">
            <WeeklyView
              therapistId={therapist.id}
              showWeekSelector={false}
              selectedWeek={therapistAgendaModal.selectedWeek}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TherapistAgendaModal;
