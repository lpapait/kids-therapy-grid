import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Schedule, SESSION_DURATIONS, DURATION_LABELS } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useConflictValidation } from '@/hooks/useConflictValidation';
import SessionBasicFields from './SessionBasicFields';
import SessionStatusField from './SessionStatusField';
import SessionObservationsField from './SessionObservationsField';
import SessionReasonField from './SessionReasonField';
import SessionCancelButton from './SessionCancelButton';
import ConflictWarning from './ConflictWarning';
import LoadingSpinner from '@/components/ui/loading-spinner';

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
  const { getTherapistById, children } = useData();
  const { validateScheduleConflict } = useConflictValidation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflicts, setConflicts] = useState<any[]>([]);
  
  const therapist = formData.therapistId ? getTherapistById(formData.therapistId) : null;
  
  // Real-time conflict validation
  useEffect(() => {
    if (formData.therapistId && formData.duration) {
      const child = schedule?.childId ? children.find(c => c.id === schedule.childId) : children[0];
      if (child) {
        const newConflicts = validateScheduleConflict({
          date,
          time,
          therapistId: formData.therapistId,
          childId: child.id,
          duration: formData.duration
        }, schedule?.id);
        setConflicts(newConflicts);
      }
    }
  }, [formData.therapistId, formData.duration, date, time, schedule?.id, validateScheduleConflict, children, schedule?.childId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.activity || !formData.therapistId || !formData.duration) {
      return;
    }

    // Check for critical conflicts
    const hasErrors = conflicts.some(c => c.severity === 'error');
    if (hasErrors) {
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

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasSignificantChanges = schedule && (
    formData.status !== schedule.status ||
    formData.therapistId !== schedule.therapistId ||
    formData.activity !== schedule.activity ||
    formData.duration !== (schedule.duration || 60)
  );

  const isFormValid = formData.activity && formData.therapistId && formData.duration && 
                     !conflicts.some(c => c.severity === 'error');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          disabled={isSubmitting}
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

      {/* Conflict Warning */}
      {conflicts.length > 0 && (
        <ConflictWarning conflicts={conflicts} />
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

      <DialogFooter className="flex justify-between pt-6">
        <div>
          {schedule && user?.role === 'moderator' && (
            <SessionCancelButton
              reason={formData.reason}
              onReasonChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
              onCancel={onCancel}
            />
          )}
        </div>
        <div className="flex space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={!isFormValid || isSubmitting}
            className="min-w-[120px] hover-scale"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Salvando...</span>
              </div>
            ) : (
              `${schedule ? 'Atualizar' : 'Criar'} Sessão`
            )}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
};

export default SessionEditForm;