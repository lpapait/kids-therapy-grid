
import React from 'react';
import TherapistAgendaViewer from '@/components/TherapistAgendaViewer';
import CapacityMonitorWidget from '@/components/CapacityMonitorWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const TherapistAgenda = () => {
  const today = new Date();

  const handleViewCapacityDetails = () => {
    window.location.href = '/schedule-management';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendas dos Terapeutas</h1>
          <p className="text-gray-600 mt-1">
            Visualize a agenda semanal de qualquer terapeuta e monitore a capacidade da equipe
          </p>
        </div>
      </div>

      {/* Capacity Monitor Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CapacityMonitorWidget 
            selectedWeek={today}
            onViewDetails={handleViewCapacityDetails}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Dica</span>
            </CardTitle>
            <CardDescription>
              Use o monitor de capacidade para identificar terapeutas disponíveis antes de agendar sessões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Verde: Terapeuta disponível</p>
              <p>• Amarelo: Próximo ao limite</p>
              <p>• Vermelho: Sobrecarregado</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <TherapistAgendaViewer />
    </div>
  );
};

export default TherapistAgenda;
