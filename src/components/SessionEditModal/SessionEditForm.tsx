
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Schedule } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
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
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    activity: string;
    therapistId: string;
    status: Schedule['status'];
    observations: string;
    reason: string;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.activity || !formData.therapistId) {
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
    formData.activity !== schedule.activity
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SessionBasicFields
        formData={formData}
        setFormData={setFormData}
        date={date}
        time={time}
      />

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
          <Button type="submit">
            {schedule ? 'Atualizar' : 'Criar'} Sessão
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
};

export default SessionEditForm;
