
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Schedule, Child } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import SessionHistoryModal from '../SessionHistoryModal';
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
  
  const [formData, setFormData] = useState({
    activity: schedule?.activity || '',
    therapistId: schedule?.therapistId || '',
    status: schedule?.status || 'scheduled' as Schedule['status'],
    observations: schedule?.observations || '',
    reason: '',
    duration: schedule?.duration || 60
  });

  const [showHistory, setShowHistory] = useState(false);

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

  const handleSubmit = (data: typeof formData) => {
    if (schedule) {
      updateSchedule(schedule.id, {
        activity: data.activity,
        therapistId: data.therapistId,
        status: data.status,
        observations: data.observations,
        duration: data.duration,
        updatedBy: user?.id || ''
      }, data.reason || undefined);
    } else {
      addSchedule({
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
    }
    
    onClose();
  };

  const handleCancel = (reason: string) => {
    if (schedule && user?.role === 'moderator') {
      updateSchedule(schedule.id, {
        status: 'cancelled',
        updatedBy: user.id
      }, reason);
      
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <SessionEditHeader
                schedule={schedule}
                child={child}
                onShowHistory={() => setShowHistory(true)}
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

      {schedule && showHistory && (
        <SessionHistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          schedule={schedule}
        />
      )}
    </>
  );
};

export default SessionEditModal;
