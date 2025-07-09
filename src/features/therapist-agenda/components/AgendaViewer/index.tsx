
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import TherapistSelector from './TherapistSelector';
import WeeklyView from '../WeeklyView';

const AgendaViewer: React.FC = () => {
  const { therapists } = useData();
  const [selectedTherapistId, setSelectedTherapistId] = useState<string>('');

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
          <TherapistSelector
            therapists={therapists}
            selectedTherapistId={selectedTherapistId}
            onTherapistChange={setSelectedTherapistId}
          />
        </CardContent>
      </Card>

      {selectedTherapistId && (
        <WeeklyView therapistId={selectedTherapistId} />
      )}
    </div>
  );
};

export default AgendaViewer;
