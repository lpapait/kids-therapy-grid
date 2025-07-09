
import { Child, Schedule, Therapist } from '@/types';

export const useScheduleGridHandlers = (
  selectedChild: Child,
  onScheduleClick: (date: Date, time: string, schedule?: Schedule) => void
) => {
  const handleSelectTherapist = (therapist: Therapist) => {
    // Criar agendamento temporário com o terapeuta selecionado
    const tempSchedule: Schedule = {
      id: '',
      childId: selectedChild.id,
      therapistId: therapist.id,
      date: new Date(),
      time: '08:00',
      duration: 60,
      activity: `Sessão de ${therapist.specialties[0] || 'Terapia'}`,
      status: 'scheduled' as const,
      observations: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: 'user'
    };
    onScheduleClick(new Date(), '08:00', tempSchedule);
  };

  return {
    handleSelectTherapist
  };
};
