
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TherapistScheduleOverview } from '../../types/therapist-overview.types';

interface WorkloadDisplayProps {
  therapist: TherapistScheduleOverview;
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 100) return 'bg-red-500';
  if (percentage >= 80) return 'bg-yellow-500';
  return 'bg-green-500';
};

const WorkloadDisplay: React.FC<WorkloadDisplayProps> = ({ therapist }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Carga Horária</span>
        <span className="font-medium">
          {therapist.hoursScheduled}h / {therapist.maxHours}h
        </span>
      </div>
      
      {/* Detalhamento da carga horária */}
      {therapist.administrativeHours && therapist.administrativeHours > 0 && (
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>• Sessões:</span>
            <span>{(therapist.hoursScheduled - therapist.administrativeHours).toFixed(1)}h</span>
          </div>
          <div className="flex justify-between">
            <span>• Administrativo:</span>
            <span>{therapist.administrativeHours}h</span>
          </div>
        </div>
      )}
      
      <div className="relative">
        <Progress value={therapist.percentage} className="h-2" />
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(therapist.percentage)}`}
          style={{ width: `${Math.min(therapist.percentage, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{therapist.percentage}% utilização</span>
        <span>{therapist.availableSlots} slots livres</span>
      </div>
    </div>
  );
};

export default WorkloadDisplay;
