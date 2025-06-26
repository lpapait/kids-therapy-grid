
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

interface SessionObservationsFieldProps {
  observations: string;
  onChange: (value: string) => void;
}

const SessionObservationsField: React.FC<SessionObservationsFieldProps> = ({
  observations,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center space-x-1">
        <FileText className="h-4 w-4" />
        <span>Observações</span>
      </Label>
      <Textarea
        value={observations}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Observações sobre a sessão..."
        rows={3}
      />
    </div>
  );
};

export default SessionObservationsField;
