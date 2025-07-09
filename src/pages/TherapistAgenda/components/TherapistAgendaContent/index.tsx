import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedReportExport } from '@/hooks/useEnhancedReportExport';
import { useTherapistOverview } from '../../hooks/useTherapistOverview';
import { useSmartFilters } from '../../hooks/useSmartFilters';
import { useCapacityInsights } from '../../hooks/useCapacityInsights';
import { useTherapistAgendaContext } from '../../context/TherapistAgendaContext';
import PageHeader from '../PageHeader';
import SmartFilters from '../SmartFilters';
import TherapistOverviewGrid from '../TherapistOverviewGrid';
import TherapistListView from '../TherapistListView';
import ConsolidatedCapacity from '../ConsolidatedCapacity';
import CalendarView from '../CalendarView';
import QuickScheduleModal from '../QuickScheduleModal';
import AgendaPreviewModal from '../AgendaPreviewModal';
import AgendaViewer from '@/features/therapist-agenda/components/AgendaViewer';

const TherapistAgendaContent: React.FC = () => {
  const { state, dispatch } = useTherapistAgendaContext();
  const { toast } = useToast();
  const { exportCapacityReport } = useEnhancedReportExport();
  
  // Custom hooks usando o context
  const {
    filters,
    updateSearchQuery,
    toggleSpecialty,
    toggleStatus,
    setAvailabilityFilter,
    clearAllFilters,
    hasActiveFilters,
    availableSpecialties
  } = useSmartFilters(state.filters, (filters) => 
    dispatch({ type: 'UPDATE_FILTERS', payload: filters })
  );
  
  const {
    therapistCards,
    totalTherapists,
    filteredCount
  } = useTherapistOverview(state.selectedWeek, state.filters);
  
  const {
    insights,
    capacityMetrics,
    hasAlerts
  } = useCapacityInsights(state.selectedWeek);

  const handleRefresh = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Dados atualizados",
        description: "As informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleExportAll = async () => {
    try {
      const success = await exportCapacityReport(state.selectedWeek);
      if (success) {
        toast({
          title: "Relatório exportado",
          description: "Relatório completo da equipe foi baixado com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleViewCapacityDetails = () => {
    window.location.href = '/schedule-management';
  };

  const handleExportCapacityReport = async () => {
    try {
      const success = await exportCapacityReport(state.selectedWeek);
      if (success) {
        toast({
          title: "Relatório de capacidade exportado",
          description: "Relatório foi baixado com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <PageHeader
        selectedWeek={state.selectedWeek}
        onWeekChange={(date) => dispatch({ type: 'SET_SELECTED_WEEK', payload: date })}
        totalTherapists={totalTherapists}
        filteredCount={filteredCount}
        viewMode={state.viewMode}
        onViewModeChange={(mode) => dispatch({ type: 'SET_VIEW_MODE', payload: mode })}
        onExportAll={handleExportAll}
        onRefresh={handleRefresh}
        isLoading={state.isLoading}
      />

      {/* Calendar View */}
      {state.viewMode === 'calendar' && (
        <CalendarView />
      )}

      {/* Other Views */}
      {state.viewMode !== 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <SmartFilters
              filters={state.filters}
              availableSpecialties={availableSpecialties}
              onUpdateSearchQuery={updateSearchQuery}
              onToggleSpecialty={toggleSpecialty}
              onToggleStatus={toggleStatus}
              onSetAvailabilityFilter={setAvailabilityFilter}
              onClearAllFilters={clearAllFilters}
              hasActiveFilters={hasActiveFilters}
              totalCount={totalTherapists}
              filteredCount={filteredCount}
            />
            
            {/* Capacity Panel */}
            <ConsolidatedCapacity
              insights={insights}
              capacityMetrics={capacityMetrics}
              hasAlerts={hasAlerts}
              onViewDetails={handleViewCapacityDetails}
              onExportReport={handleExportCapacityReport}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {state.viewMode === 'grid' && (
              <TherapistOverviewGrid
                cards={therapistCards}
                isLoading={state.isLoading}
              />
            )}
            
            {state.viewMode === 'list' && (
              <TherapistListView
                cards={therapistCards}
                isLoading={state.isLoading}
              />
            )}
            
            {state.viewMode === 'capacity' && (
              <div className="space-y-6">
                <ConsolidatedCapacity
                  insights={insights}
                  capacityMetrics={capacityMetrics}
                  hasAlerts={hasAlerts}
                  onViewDetails={handleViewCapacityDetails}
                  onExportReport={handleExportCapacityReport}
                />
                <AgendaViewer />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <QuickScheduleModal />
      <AgendaPreviewModal />
    </div>
  );
};

export default TherapistAgendaContent;
