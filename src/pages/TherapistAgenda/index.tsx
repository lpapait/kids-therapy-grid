
import React from 'react';
import { TherapistAgendaProvider } from './context/TherapistAgendaContext';
import TherapistAgendaContent from './components/TherapistAgendaContent';

const TherapistAgenda: React.FC = () => {
  return (
    <TherapistAgendaProvider>
      <TherapistAgendaContent />
    </TherapistAgendaProvider>
  );
};

export default TherapistAgenda;
