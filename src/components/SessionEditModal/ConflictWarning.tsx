import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, X } from 'lucide-react';
import { ScheduleConflict } from '@/hooks/useConflictValidation';

interface ConflictWarningProps {
  conflicts: ScheduleConflict[];
  onDismiss?: () => void;
}

const ConflictWarning: React.FC<ConflictWarningProps> = ({ conflicts, onDismiss }) => {
  if (conflicts.length === 0) return null;

  const errorConflicts = conflicts.filter(c => c.severity === 'error');
  const warningConflicts = conflicts.filter(c => c.severity === 'warning');

  return (
    <div className="space-y-2">
      {errorConflicts.length > 0 && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-start">
            <div>
              <div className="font-medium mb-1">Conflitos encontrados:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {errorConflicts.map((conflict, index) => (
                  <li key={index}>{conflict.message}</li>
                ))}
              </ul>
            </div>
            {onDismiss && (
              <button onClick={onDismiss} className="ml-2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {warningConflicts.length > 0 && (
        <Alert className="animate-fade-in">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-start">
            <div>
              <div className="font-medium mb-1">Atenção:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {warningConflicts.map((conflict, index) => (
                  <li key={index}>{conflict.message}</li>
                ))}
              </ul>
            </div>
            {onDismiss && (
              <button onClick={onDismiss} className="ml-2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ConflictWarning;