
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedReportExport } from '@/hooks/useEnhancedReportExport';
import { useTherapistOverview } from './hooks/useTherapistOverview';
import { useSmartFilters } from './hooks/useSmartFilters';
import { useCapacityInsights } from './hooks/useCapacityInsights';
import PageHeader from './components/PageHeader';
import SmartFilters from './components/SmartFilters';
import TherapistOverviewGrid from './components/TherapistOverviewGrid';
import ConsolidatedCapacity from './components/ConsolidatedCapacity';
import AgendaViewer from '@/features/therapist-agenda/components/AgendaViewer';

const TherapistAgenda: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar' | 'capacity'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { exportCapacityReport } = useEnhancedReportExport();
  
  // Custom hooks
  const {
    filters,
    updateSearchQuery,
    toggleSpecialty,
    toggleStatus,
    setAvailabilityFilter,
    clearAllFilters,
    hasActiveFilters,
    availableSpecialties
  } = useSmartFilters();
  
  const {
    therapistCards,
    totalTherapists,
    filteredCount
  } = useTherapistOverview(selectedWeek, filters);
  
  const {
    insights,
    capacityMetrics,
    hasAlerts
  } = useCapacityInsights(selectedWeek);

  const handleRefresh = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleExportAll = async () => {
    try {
      const success = await exportCapacityReport(selectedWeek);
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
      const success = await exportCapacityReport(selectedWeek);
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
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        totalTherapists={totalTherapists}
        filteredCount={filteredCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExportAll={handleExportAll}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <SmartFilters
            filters={filters}
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
          {viewMode === 'grid' && (
            <TherapistOverviewGrid
              cards={therapistCards}
              isLoading={isLoading}
            />
          )}
          
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Vista em Lista</h3>
              <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          
          {viewMode === 'calendar' && (
            <div className="bg-white rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Vista de Calendário</h3>
              <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          
          {viewMode === 'capacity' && (
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
    </div>
  );
};

export default TherapistAgenda;
