
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface SessionReasonFieldProps {
  reason: string;
  onChange: (value: string) => void;
}

const SessionReasonField: React.FC<SessionReasonFieldProps> = ({
  reason,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center space-x-1">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <span>Motivo da Alteração *</span>
      </Label>
      <Textarea
        value={reason}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Informe o motivo desta alteração..."
        rows={2}
        required
      />
    </div>
  );
};

export default SessionReasonField;
