
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/contexts/DataContext';
import { CheckCircle, AlertTriangle, XCircle, Eye } from 'lucide-react';

interface TherapistWorkloadItemProps {
  therapistId: string;
  hoursScheduled: number;
  maxHours: number;
  percentage: number;
  status: 'available' | 'near_limit' | 'overloaded';
  remainingHours: number;
  sessionsCount: number;
  onViewTherapist: (therapistId: string) => void;
}

const TherapistWorkloadItem: React.FC<TherapistWorkloadItemProps> = ({
  therapistId,
  hoursScheduled,
  maxHours,
  percentage,
  status,
  remainingHours,
  sessionsCount,
  onViewTherapist
}) => {
  const { therapists } = useData();
  const therapistInfo = therapists.find(t => t.id === therapistId);

  const getStatusIcon = (percentage: number) => {
    if (percentage > 100) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    } else if (percentage > 80) {
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    } else {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage > 100) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (percentage > 80) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon(percentage)}
          <div>
            <button
              onClick={() => onViewTherapist(therapistId)}
              className="text-left hover:text-blue-600 transition-colors"
            >
              <h4 className="font-medium text-gray-900 hover:underline">
                {therapistInfo?.name || 'Terapeuta não encontrado'}
              </h4>
            </button>
            <p className="text-sm text-gray-600">
              {hoursScheduled.toFixed(1)}h / {maxHours}h semanais
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className={getStatusColor(percentage)}>
            {percentage.toFixed(0)}%
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewTherapist(therapistId)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Capacidade utilizada</span>
          <span>{sessionsCount} sessões</span>
        </div>
        <div className="relative">
          <Progress 
            value={Math.min(percentage, 100)} 
            className="h-2"
          />
          {percentage > 100 && (
            <div className="absolute top-0 left-0 h-2 bg-red-500 rounded-full opacity-75"
                 style={{ width: `${Math.min((percentage - 100) / 100 * 100, 100)}%` }} />
          )}
        </div>
      </div>
      
      {status === 'overloaded' && (
        <div className="flex items-center space-x-2 text-sm text-red-700 bg-red-50 p-2 rounded">
          <XCircle className="h-4 w-4" />
          <span>Sobrecarga detectada - considere redistribuir sessões</span>
        </div>
      )}
      
      {remainingHours > 0 && (
        <p className="text-sm text-green-700">
          {remainingHours.toFixed(1)}h disponíveis para mais sessões
        </p>
      )}
    </div>
  );
};

export default TherapistWorkloadItem;
