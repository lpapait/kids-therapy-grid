
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { TherapyCoverage, Child } from '@/types';
import { ScheduleSuggestionButton } from '@/components/ScheduleSuggestion';

interface TherapyItemProps {
  therapy: TherapyCoverage;
  child: Child;
  selectedWeek: Date;
  onScheduleCreated: () => void;
}

const TherapyItem: React.FC<TherapyItemProps> = ({
  therapy,
  child,
  selectedWeek,
  onScheduleCreated
}) => {
  const getStatusIcon = (status: TherapyCoverage['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TherapyCoverage['status']) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'missing':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon(therapy.status)}
          <span className="font-medium text-gray-900">
            {therapy.specialty || 'Especialidade não definida'}
          </span>
        </div>
        <Badge variant="secondary" className={getStatusColor(therapy.status)}>
          {therapy.hoursScheduled || 0}/{therapy.hoursRequired || 0}h
        </Badge>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progresso</span>
          <span>{therapy.percentage || 0}%</span>
        </div>
        <Progress 
          value={therapy.percentage || 0} 
          className="h-2"
        />
      </div>
      
      {therapy.status === 'partial' && (
        <p className="text-xs text-yellow-700">
          Faltam {(therapy.hoursRequired || 0) - (therapy.hoursScheduled || 0)}h para completar
        </p>
      )}
      {therapy.status === 'missing' && (
        <p className="text-xs text-red-700">
          Nenhuma sessão agendada
        </p>
      )}
      
      <ScheduleSuggestionButton
        child={child}
        therapy={therapy}
        selectedWeek={selectedWeek}
        onScheduleCreated={onScheduleCreated}
      />
    </div>
  );
};

export default TherapyItem;
