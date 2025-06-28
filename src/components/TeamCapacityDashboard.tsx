
import React from 'react';
import { useData } from '@/contexts/DataContext';
import { useOptimizedAlerts } from '@/hooks/useOptimizedAlerts';
import { useCapacityMetrics } from '@/hooks/useCapacityMetrics';
import { useEnhancedReportExport } from '@/hooks/useEnhancedReportExport';
import { useToast } from '@/hooks/use-toast';
import CapacitySummaryCards from './TeamCapacityDashboard/CapacitySummaryCards';
import UtilizationChart from './TeamCapacityDashboard/UtilizationChart';
import TherapistDetailsList from './TeamCapacityDashboard/TherapistDetailsList';

interface TeamCapacityDashboardProps {
  selectedWeek: Date;
  onViewTherapist?: (therapistId: string) => void;
  onRedistributeLoad?: () => void;
}

const TeamCapacityDashboard: React.FC<TeamCapacityDashboardProps> = ({
  selectedWeek,
  onViewTherapist,
  onRedistributeLoad
}) => {
  const { therapists } = useData();
  const alerts = useOptimizedAlerts(selectedWeek);
  const metrics = useCapacityMetrics(selectedWeek);
  const { exportUtilizationReport, exportCapacityReport } = useEnhancedReportExport();
  const { toast } = useToast();

  // Prepare chart data
  const chartData = therapists.map(therapist => {
    const alert = alerts.find(a => a.therapistId === therapist.id);
    const status = alert?.status || 'ok';
    let color: string;
    
    switch (status) {
      case 'critical': 
        color = '#ef4444';
        break;
      case 'near_limit': 
        color = '#f97316';
        break;
      case 'approaching_limit': 
        color = '#eab308';
        break;
      default: 
        color = '#22c55e';
        break;
    }
    
    return {
      name: therapist.name.split(' ')[0], // First name only for chart
      utilization: alert?.percentage || 0,
      hours: alert?.hoursScheduled || 0,
      maxHours: therapist.weeklyWorkloadHours,
      status,
      color
    };
  }).sort((a, b) => b.utilization - a.utilization);

  const handleRedistribute = () => {
    if (onRedistributeLoad) {
      onRedistributeLoad();
    }
    toast({
      title: 'Redistribuição Iniciada',
      description: 'Analisando possibilidades de redistribuição da carga horária...',
      variant: 'default'
    });
  };

  const handleExportReport = async (type: 'utilization' | 'capacity') => {
    const success = type === 'utilization' 
      ? await exportUtilizationReport(selectedWeek)
      : await exportCapacityReport(selectedWeek);
    
    if (success) {
      toast({
        title: 'Exportação concluída',
        description: `Relatório de ${type === 'utilization' ? 'utilização' : 'capacidade'} exportado com sucesso`,
        variant: 'default'
      });
    }
  };

  return (
    <div className="space-y-6">
      <CapacitySummaryCards metrics={metrics} alerts={alerts} />
      
      <UtilizationChart 
        chartData={chartData}
        alerts={alerts}
        onExportReport={handleExportReport}
        onRedistribute={handleRedistribute}
      />
      
      <TherapistDetailsList 
        chartData={chartData}
        alerts={alerts}
        therapists={therapists}
        onViewTherapist={onViewTherapist}
        onExportReport={handleExportReport}
      />
    </div>
  );
};

export default TeamCapacityDashboard;
