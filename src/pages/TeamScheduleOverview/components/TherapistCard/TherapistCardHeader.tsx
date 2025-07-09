
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TherapistScheduleOverview } from '../../types/therapist-overview.types';

interface TherapistCardHeaderProps {
  therapist: TherapistScheduleOverview;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'text-green-600 bg-green-50 border-green-200';
    case 'near_limit': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'overloaded': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const TherapistCardHeader: React.FC<TherapistCardHeaderProps> = ({ therapist }) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: therapist.color }}
          />
          <h3 className="font-semibold text-lg text-gray-900">
            {therapist.therapistName}
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {therapist.specialties.map(specialty => (
            <Badge key={specialty} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>
      </div>
      
      <Badge className={`${getStatusColor(therapist.status)} font-medium`}>
        {therapist.status === 'available' && 'Disponível'}
        {therapist.status === 'near_limit' && 'Próximo do Limite'}
        {therapist.status === 'overloaded' && 'Sobrecarregado'}
      </Badge>
    </div>
  );
};

export default TherapistCardHeader;
