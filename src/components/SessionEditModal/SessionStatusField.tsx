
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Schedule } from '@/types';

interface SessionStatusFieldProps {
  status: Schedule['status'];
  onChange: (value: Schedule['status']) => void;
}

const SessionStatusField: React.FC<SessionStatusFieldProps> = ({
  status,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label>Status</Label>
      <Select value={status} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="scheduled">Agendado</SelectItem>
          <SelectItem value="completed">Realizado</SelectItem>
          <SelectItem value="cancelled">Cancelado</SelectItem>
          <SelectItem value="rescheduled">Remarcado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SessionStatusField;
