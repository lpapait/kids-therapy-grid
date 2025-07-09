
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Therapist } from '@/types';

interface TherapistSelectorProps {
  therapists: Therapist[];
  selectedTherapistId: string;
  onTherapistChange: (therapistId: string) => void;
}

const TherapistSelector: React.FC<TherapistSelectorProps> = ({
  therapists,
  selectedTherapistId,
  onTherapistChange
}) => {
  const selectedTherapist = therapists.find(t => t.id === selectedTherapistId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select value={selectedTherapistId} onValueChange={onTherapistChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um terapeuta" />
        </SelectTrigger>
        <SelectContent>
          {therapists.map((therapist) => (
            <SelectItem key={therapist.id} value={therapist.id}>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full border" 
                  style={{ backgroundColor: therapist.color }}
                />
                <div className="flex flex-col">
                  <span>{therapist.name}</span>
                  <span className="text-xs text-gray-500">
                    {therapist.professionalType}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedTherapist && (
        <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
          <div 
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
            style={{ backgroundColor: selectedTherapist.color }}
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{selectedTherapist.name}</h3>
            <p className="text-sm text-gray-600">{selectedTherapist.professionalType}</p>
          </div>
          <Badge variant="secondary">
            {selectedTherapist.specialties.length} especialidade{selectedTherapist.specialties.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default TherapistSelector;
