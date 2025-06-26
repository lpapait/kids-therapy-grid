
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import TherapistWeeklyView from './TherapistWeeklyView';

const TherapistAgendaViewer: React.FC = () => {
  const { therapists } = useData();
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>('');

  const selectedTherapist = therapists.find(t => t.id === selectedTherapistId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Visualizar Agenda do Terapeuta</span>
          </CardTitle>
          <CardDescription>
            Selecione um terapeuta para visualizar sua agenda semanal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select 
              value={selectedTherapistId} 
              onValueChange={setSelectedTherapistId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um terapeuta" />
              </SelectTrigger>
              <SelectContent>
                {therapists.map((therapist) => (
                  <SelectItem key={therapist.id} value={therapist.id}>
                    <div className="flex flex-col">
                      <span>{therapist.name}</span>
                      <span className="text-xs text-gray-500">
                        {therapist.professionalType}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedTherapist && (
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
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
        </CardContent>
      </Card>

      {selectedTherapistId && (
        <TherapistWeeklyView
          therapistId={selectedTherapistId}
          showWeekSelector={true}
        />
      )}
    </div>
  );
};

export default TherapistAgendaViewer;
