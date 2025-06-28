
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Schedule, SESSION_DURATIONS, DURATION_LABELS } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useScheduleValidation } from '@/hooks/useScheduleValidation';
import ValidationDisplay from '@/components/ValidationDisplay';
import SessionBasicFields from './SessionBasicFields';
import SessionStatusField from './SessionStatusField';
import SessionObservationsField from './SessionObservationsField';
import SessionReasonField from './SessionReasonField';
import SessionCancelButton from './SessionCancelButton';

interface SessionEditFormProps {
  formData: {
    activity: string;
    therapistId: string;
    status: Schedule['status'];
    observations: string;
    reason: string;
    duration: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    activity: string;
    therapistId: string;
    status: Schedule['status'];
    observations: string;
    reason: string;
    duration: number;
  }>>;
  schedule?: Schedule;
  date: Date;
  time: string;
  onSubmit: (data: any) => void;
  onCancel: (reason: string) => void;
  onClose: () => void;
}

const SessionEditForm: React.FC<SessionEditFormProps> = ({
  formData,
  setFormData,
  schedule,
  date,
  time,
  onSubmit,
  onCancel,
  onClose
}) => {
  const { user } = useAuth();
  const { getTherapistById } = useData();
  
  const therapist = formData.therapistId ? getTherapistById(formData.therapistId) : null;
  
  // Validate the current form data
  const validation = useScheduleValidation(
    {
      ...formData,
      id: schedule?.id,
      childId: schedule?.childId,
      date,
      time
    },
    therapist,
    date,
    time,
    formData.duration
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.activity || !formData.therapistId || !formData.duration) {
      return;
    }

    // Check validation before submitting
    if (!validation.isValid) {
      return;
    }

    const isCriticalChange = schedule && (
      formData.status === 'cancelled' || 
      formData.status === 'rescheduled' ||
      (schedule.status === 'scheduled' && formData.status === 'completed')
    );

    if (isCriticalChange && !formData.reason.trim()) {
      alert('Por favor, informe o motivo da alteração.');
      return;
    }

    onSubmit(formData);
  };

  const hasSignificantChanges = schedule && (
    formData.status !== schedule.status ||
    formData.therapistId !== schedule.therapistId ||
    formData.activity !== schedule.activity ||
    formData.duration !== (schedule.duration || 60)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SessionBasicFields
        formData={formData}
        setFormData={setFormData}
        date={date}
        time={time}
      />

      {/* Duration Field */}
      <div className="space-y-2">
        <Label htmlFor="duration">Duração da Sessão</Label>
        <Select
          value={formData.duration.toString()}
          onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a duração" />
          </SelectTrigger>
          <SelectContent>
            {SESSION_DURATIONS.map((duration) => (
              <SelectItem key={duration} value={duration.toString()}>
                {DURATION_LABELS[duration]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Validation Display */}
      {formData.therapistId && (
        <ValidationDisplay validation={validation} />
      )}

      {schedule && (
        <SessionStatusField
          status={formData.status}
          onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
        />
      )}

      <SessionObservationsField
        observations={formData.observations}
        onChange={(value) => setFormData(prev => ({ ...prev, observations: value }))}
      />

      {hasSignificantChanges && (
        <SessionReasonField
          reason={formData.reason}
          onChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
        />
      )}

      <DialogFooter className="flex justify-between">
        <div>
          {schedule && user?.role === 'moderator' && (
            <SessionCancelButton
              reason={formData.reason}
              onReasonChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
              onCancel={onCancel}
            />
          )}
        </div>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={!validation.isValid}
            className={!validation.isValid ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {schedule ? 'Atualizar' : 'Criar'} Sessão
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
};

export default SessionEditForm;
