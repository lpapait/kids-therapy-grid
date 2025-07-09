
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Schedule, Child } from '@/types';

interface SessionEditHeaderProps {
  schedule?: Schedule;
  child: Child;
}

const SessionEditHeader: React.FC<SessionEditHeaderProps> = ({
  schedule,
  child
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-5 w-5 text-blue-600" />
      <span>
        {schedule ? 'Editar Sessão' : 'Nova Sessão'} - {child.name}
      </span>
    </div>
  );
};

export default SessionEditHeader;
