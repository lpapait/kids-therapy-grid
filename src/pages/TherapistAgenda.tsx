
import React from 'react';
import TherapistAgendaViewer from '@/components/TherapistAgendaViewer';

const TherapistAgenda = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendas dos Terapeutas</h1>
          <p className="text-gray-600 mt-1">
            Visualize a agenda semanal de qualquer terapeuta
          </p>
        </div>
      </div>

      <TherapistAgendaViewer />
    </div>
  );
};

export default TherapistAgenda;
