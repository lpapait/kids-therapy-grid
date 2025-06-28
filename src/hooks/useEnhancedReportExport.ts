
import { useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { useCapacityMetrics } from '@/hooks/useCapacityMetrics';
import { useOptimizedAlerts } from '@/hooks/useOptimizedAlerts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const useEnhancedReportExport = () => {
  const { therapists, schedules, children } = useData();

  const exportUtilizationReport = useCallback(async (selectedWeek: Date): Promise<boolean> => {
    try {
      const alerts = [];
      const weekSchedules = schedules.filter(schedule => 
        schedule.date >= selectedWeek &&
        schedule.date <= new Date(selectedWeek.getTime() + 6 * 24 * 60 * 60 * 1000) &&
        schedule.status !== 'cancelled'
      );

      therapists.forEach(therapist => {
        const therapistSchedules = weekSchedules.filter(s => s.therapistId === therapist.id);
        const hoursScheduled = therapistSchedules.reduce((total, s) => 
          total + (s.duration || 60) / 60, 0
        );
        
        const utilization = (hoursScheduled / therapist.weeklyWorkloadHours) * 100;
        
        alerts.push({
          Terapeuta: therapist.name,
          'Horas Agendadas': hoursScheduled.toFixed(1),
          'Capacidade Máxima': therapist.weeklyWorkloadHours,
          'Utilização (%)': utilization.toFixed(1),
          'Horas Disponíveis': Math.max(0, therapist.weeklyWorkloadHours - hoursScheduled).toFixed(1),
          Status: utilization >= 95 ? 'Crítico' : utilization >= 80 ? 'Próximo ao Limite' : 'Normal'
        });
      });

      const csvContent = [
        Object.keys(alerts[0] || {}).join(','),
        ...alerts.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `utilizacao-terapeutas-${format(selectedWeek, 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      return false;
    }
  }, [therapists, schedules]);

  const exportCapacityReport = useCallback(async (selectedWeek: Date): Promise<boolean> => {
    try {
      const weekSchedules = schedules.filter(schedule => 
        schedule.date >= selectedWeek &&
        schedule.date <= new Date(selectedWeek.getTime() + 6 * 24 * 60 * 60 * 1000) &&
        schedule.status !== 'cancelled'
      );

      const reportData = therapists.map(therapist => {
        const therapistSchedules = weekSchedules.filter(s => s.therapistId === therapist.id);
        const hoursScheduled = therapistSchedules.reduce((total, s) => 
          total + (s.duration || 60) / 60, 0
        );
        
        return {
          Terapeuta: therapist.name,
          'Sessões Agendadas': therapistSchedules.length,
          'Horas Totais': hoursScheduled.toFixed(1),
          'Capacidade Semanal': therapist.weeklyWorkloadHours,
          'Percentual de Uso': ((hoursScheduled / therapist.weeklyWorkloadHours) * 100).toFixed(1) + '%',
          'Horas Livres': Math.max(0, therapist.weeklyWorkloadHours - hoursScheduled).toFixed(1)
        };
      });

      const csvContent = [
        Object.keys(reportData[0] || {}).join(','),
        ...reportData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `capacidade-equipe-${format(selectedWeek, 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error('Erro ao exportar relatório de capacidade:', error);
      return false;
    }
  }, [therapists, schedules]);

  return {
    exportUtilizationReport,
    exportCapacityReport
  };
};
