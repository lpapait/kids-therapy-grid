
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Schedule, Child } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

import SessionEditForm from './SessionEditForm';
import SessionEditHeader from './SessionEditHeader';

interface SessionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule?: Schedule;
  date: Date;
  time: string;
  child: Child;
}

const SessionEditModal: React.FC<SessionEditModalProps> = ({
  isOpen,
  onClose,
  schedule,
  date,
  time,
  child
}) => {
  const { addSchedule, updateSchedule } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    activity: schedule?.activity || '',
    therapistId: schedule?.therapistId || '',
    status: schedule?.status || 'scheduled' as Schedule['status'],
    observations: schedule?.observations || '',
    reason: '',
    duration: schedule?.duration || 60
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        activity: schedule.activity,
        therapistId: schedule.therapistId,
        status: schedule.status,
        observations: schedule.observations || '',
        reason: '',
        duration: schedule.duration || 60
      });
    } else {
      setFormData({
        activity: '',
        therapistId: '',
        status: 'scheduled',
        observations: '',
        reason: '',
        duration: 60
      });
    }
  }, [schedule]);

  const handleSubmit = async (data: typeof formData) => {
    console.log('SessionEditModal handleSubmit called:', { data, schedule });
    
    try {
      if (schedule) {
        console.log('Updating existing schedule');
        await updateSchedule(schedule.id, {
          activity: data.activity,
          therapistId: data.therapistId,
          status: data.status,
          observations: data.observations,
          duration: data.duration,
          updatedBy: user?.id || ''
        }, data.reason || undefined);
        
        toast({
          title: 'Sessão atualizada',
          description: 'A sessão foi atualizada com sucesso.',
          variant: 'default'
        });
      } else {
        console.log('Creating new schedule');
        await addSchedule({
          childId: child.id,
          therapistId: data.therapistId,
          date,
          time,
          activity: data.activity,
          status: data.status,
          observations: data.observations,
          duration: data.duration,
          updatedBy: user?.id || ''
        });
        
        toast({
          title: 'Sessão criada',
          description: 'A nova sessão foi agendada com sucesso.',
          variant: 'default'
        });
      }
      
      console.log('Schedule operation completed, closing modal');
      onClose();
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar a sessão. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  const handleCancel = (reason: string) => {
    if (schedule && user?.role === 'moderator') {
      updateSchedule(schedule.id, {
        status: 'cancelled',
        updatedBy: user.id
      }, reason);
      
      toast({
        title: 'Sessão cancelada',
        description: 'A sessão foi cancelada com sucesso.',
        variant: 'default'
      });
      
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <SessionEditHeader
              schedule={schedule}
              child={child}
            />
          </DialogTitle>
        </DialogHeader>

        <SessionEditForm
          formData={formData}
          setFormData={setFormData}
          schedule={schedule}
          date={date}
          time={time}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SessionEditModal;
