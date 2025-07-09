
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { TherapistOverviewCard } from '../../types/therapist-agenda.types';
import TherapistCard from './TherapistCard';

interface TherapistOverviewGridProps {
  cards: TherapistOverviewCard[];
  isLoading?: boolean;
}

const TherapistOverviewGrid: React.FC<TherapistOverviewGridProps> = ({
  cards,
  isLoading = false
}) => {
  const { toast } = useToast();

  const handleViewAgenda = (therapistId: string) => {
    // TODO: Implement navigation to therapist's detailed agenda
    const therapist = cards.find(c => c.therapist.id === therapistId)?.therapist;
    toast({
      title: "Visualizar Agenda",
      description: `Abrindo agenda de ${therapist?.name || 'terapeuta'}`,
    });
  };

  const handleQuickSchedule = (therapistId: string) => {
    // TODO: Implement quick scheduling modal
    const therapist = cards.find(c => c.therapist.id === therapistId)?.therapist;
    toast({
      title: "Agendamento Rápido",
      description: `Iniciando agendamento para ${therapist?.name || 'terapeuta'}`,
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg border p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-300 rounded w-full" />
                <div className="h-8 bg-gray-300 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum terapeuta encontrado
          </h3>
          <p className="text-gray-500">
            Ajuste os filtros para encontrar os terapeutas desejados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cards.map((card) => (
        <TherapistCard
          key={card.therapist.id}
          card={card}
          onViewAgenda={handleViewAgenda}
          onQuickSchedule={handleQuickSchedule}
        />
      ))}
    </div>
  );
};

export default TherapistOverviewGrid;
