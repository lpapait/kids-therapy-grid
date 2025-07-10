
import React, { useState } from 'react';
import { useTeamScheduleOverview } from '@/hooks/useTeamScheduleOverview';
import { useToast } from '@/hooks/use-toast';
import OverviewFilters from './TeamScheduleOverview/components/OverviewFilters';
import TherapistOverviewCard from './TeamScheduleOverview/components/TherapistOverviewCard';
import TeamInsightsPanel from './TeamScheduleOverview/components/TeamInsightsPanel';
import AdministrativeScheduleModal from './TeamScheduleOverview/components/AdministrativeScheduleModal';
import AdministrativeStatsPanel from './TeamScheduleOverview/components/AdministrativeStatsPanel';
import { CalendarDays, FileText } from 'lucide-react';

const TeamScheduleOverview: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [therapistSearch, setTherapistSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedTherapistId, setSelectedTherapistId] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const { toast } = useToast();

  const { therapistOverviews, teamInsights, isLoading } = useTeamScheduleOverview(
    selectedWeek,
    specialtyFilter === 'Todas' ? '' : specialtyFilter,
    therapistSearch
  );

  const handleSpecialtyChange = (specialty: string) => {
    setSpecialtyFilter(specialty === 'Todas' ? '' : specialty);
  };

  const handleExportReport = async () => {
    toast({
      title: 'Exportando relatório...',
      description: 'O relatório semanal da equipe está sendo gerado.'
    });
    
    // Mock export functionality
    setTimeout(() => {
      toast({
        title: 'Relatório exportado!',
        description: 'O arquivo foi salvo com sucesso.'
      });
    }, 2000);
  };

  const handleSessionClick = (sessionId: string) => {
    toast({
      title: 'Abrindo sessão',
      description: `Carregando detalhes da sessão ${sessionId}`
    });
  };

  const handleSlotClick = (therapistId: string, date: Date, time: string) => {
    setSelectedTherapistId(therapistId);
    setSelectedDate(date);
    setSelectedTime(time);
    setAdminModalOpen(true);
  };

  const calculateAdminStats = () => {
    const totalAdminHours = therapistOverviews.reduce((sum, t) => sum + (t.administrativeHours || 0), 0);
    const requiredAdminHours = therapistOverviews.length * 4; // 4h por terapeuta
    const therapistsWithDeficit = therapistOverviews.filter(t => (t.administrativeHours || 0) < 4).length;
    
    return {
      totalAdminHours,
      requiredAdminHours,
      completionPercentage: Math.round((totalAdminHours / requiredAdminHours) * 100),
      therapistsWithDeficit,
      averageAdminTime: totalAdminHours / therapistOverviews.length,
      mostCommonActivity: 'Relatórios Clínicos',
      upcomingDeadlines: 3
    };
  };

  const handleRedistributeLoad = () => {
    toast({
      title: 'Redistribuindo carga',
      description: 'Analisando possibilidades de redistribuição...'
    });
  };

  const handleFindAvailableSlots = () => {
    toast({
      title: 'Buscando slots',
      description: 'Exibindo todos os horários disponíveis da equipe.'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Visão Geral de Agendas dos Terapeutas
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie e acompanhe as agendas semanais de toda a equipe terapêutica
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {therapistOverviews.length} terapeutas • {teamInsights.totalSessions} sessões
          </span>
        </div>
      </div>

      {/* Filtros */}
      <OverviewFilters
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        specialtyFilter={specialtyFilter}
        onSpecialtyChange={(specialty) => setSpecialtyFilter(specialty === 'Todas' ? '' : specialty)}
        therapistSearch={therapistSearch}
        onTherapistSearchChange={setTherapistSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExportReport={() => {
          toast({
            title: 'Exportando relatório...',
            description: 'O relatório semanal da equipe está sendo gerado.'
          });
        }}
      />

      {/* Painéis de Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamInsightsPanel
          insights={teamInsights}
          onRedistributeLoad={() => {
            toast({
              title: 'Redistribuindo carga',
              description: 'Analisando possibilidades de redistribuição...'
            });
          }}
          onFindAvailableSlots={() => {
            toast({
              title: 'Buscando slots',
              description: 'Exibindo todos os horários disponíveis da equipe.'
            });
          }}
        />
        
        <AdministrativeStatsPanel
          stats={calculateAdminStats()}
          onViewDetails={() => {
            toast({
              title: 'Relatório administrativo',
              description: 'Carregando relatório detalhado das atividades administrativas.'
            });
          }}
        />
      </div>

      {/* Lista/Grid de Terapeutas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Agendas dos Terapeutas
          </h2>
          
          {therapistOverviews.length === 0 && (
            <div className="text-sm text-gray-500">
              Nenhum terapeuta encontrado com os filtros aplicados
            </div>
          )}
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {therapistOverviews.map(therapist => (
              <TherapistOverviewCard
                key={therapist.therapistId}
                therapist={therapist}
                onSessionClick={(sessionId) => {
                  toast({
                    title: 'Abrindo sessão',
                    description: `Carregando detalhes da sessão ${sessionId}`
                  });
                }}
                onSlotClick={handleSlotClick}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {therapistOverviews.map(therapist => (
              <TherapistOverviewCard
                key={therapist.therapistId}
                therapist={therapist}
                onSessionClick={(sessionId) => {
                  toast({
                    title: 'Abrindo sessão',
                    description: `Carregando detalhes da sessão ${sessionId}`
                  });
                }}
                onSlotClick={handleSlotClick}
              />
            ))}
          </div>
        )}

        {therapistOverviews.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum terapeuta encontrado
            </h3>
            <p className="text-gray-500">
              Ajuste os filtros para visualizar os terapeutas e suas agendas.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Agendamento Administrativo */}
      <AdministrativeScheduleModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        therapistId={selectedTherapistId}
        date={selectedDate}
        time={selectedTime}
      />
    </div>
  );
};

export default TeamScheduleOverview;
