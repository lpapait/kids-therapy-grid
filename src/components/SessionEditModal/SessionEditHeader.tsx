
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, History } from 'lucide-react';
import { Schedule, Child } from '@/types';

interface SessionEditHeaderProps {
  schedule?: Schedule;
  child: Child;
  onShowHistory: () => void;
}

const SessionEditHeader: React.FC<SessionEditHeaderProps> = ({
  schedule,
  child,
  onShowHistory
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-blue-600" />
        <span>
          {schedule ? 'Editar Sessão' : 'Nova Sessão'} - {child.name}
        </span>
      </div>
      {schedule && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onShowHistory}
        >
          <History className="h-4 w-4 mr-2" />
          Histórico
        </Button>
      )}
    </div>
  );
};

export default SessionEditHeader;
