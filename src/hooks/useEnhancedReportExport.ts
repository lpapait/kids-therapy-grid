
import { useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { useTherapistAlerts } from '@/hooks/useTherapistAlerts';
import { useCapacityMetrics } from '@/hooks/useCapacityMetrics';
import { ScheduleHistory } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { isSameWeek } from '@/lib/dateUtils';

export const useEnhancedReportExport = () => {
  const { schedules, children, therapists, getAllHistory, getChildById, getTherapistById } = useData();
  const { toast } = useToast();

  const createCSVContent = useCallback((headers: string[], rows: string[][]) => {
    const csvHeaders = headers.join(',');
    const csvRows = rows.map(row => 
      row.map(field => `"${field?.toString().replace(/"/g, '""') || ''}"`).join(',')
    );
    return [csvHeaders, ...csvRows].join('\n');
  }, []);

  const downloadFile = useCallback((content: string, filename: string, type = 'text/csv') => {
    const blob = new Blob([content], { type: `${type};charset=utf-8;` });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const exportUtilizationReport = useCallback(async (selectedWeek: Date) => {
    try {
      const weekSchedules = schedules.filter(s => 
        isSameWeek(s.date, selectedWeek) && s.status !== 'cancelled'
      );

      const headers = [
        'Terapeuta',
        'Especialidade',
        'Horas Agendadas',
        'Horas Máximas',
        'Utilização (%)',
        'Horas Restantes',
        'Total de Sessões',
        'Sessões Concluídas',
        'Sessões Canceladas',
        'Status'
      ];

      const rows = therapists.map(therapist => {
        const therapistSchedules = weekSchedules.filter(s => s.therapistId === therapist.id);
        const totalMinutes = therapistSchedules.reduce((total, s) => total + (s.duration || 60), 0);
        const hoursScheduled = totalMinutes / 60;
        const utilization = (hoursScheduled / therapist.weeklyWorkloadHours) * 100;
        const remainingHours = Math.max(0, therapist.weeklyWorkloadHours - hoursScheduled);
        
        const completedSessions = therapistSchedules.filter(s => s.status === 'completed').length;
        const cancelledSessions = therapistSchedules.filter(s => s.status === 'cancelled').length;

        let status = 'Disponível';
        if (utilization >= 100) status = 'Sobrecarregado';
        else if (utilization >= 80) status = 'Próximo ao Limite';
        else if (utilization >= 75) status = 'Atenção';

        return [
          therapist.name,
          therapist.professionalType,
          hoursScheduled.toFixed(1),
          therapist.weeklyWorkloadHours.toString(),
          utilization.toFixed(1),
          remainingHours.toFixed(1),
          therapistSchedules.length.toString(),
          completedSessions.toString(),
          cancelledSessions.toString(),
          status
        ];
      });

      const csvContent = createCSVContent(headers, rows);
      const filename = `relatorio_utilizacao_${format(selectedWeek, 'yyyy-MM-dd')}.csv`;
      
      downloadFile(csvContent, filename);

      toast({
        title: 'Relatório exportado com sucesso',
        description: `Relatório de utilização semanal foi baixado como ${filename}`,
        variant: 'default'
      });

      return true;
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível exportar o relatório de utilização.',
        variant: 'destructive'
      });
      return false;
    }
  }, [schedules, therapists, createCSVContent, downloadFile, toast]);

  const exportCapacityReport = useCallback(async (selectedWeek: Date) => {
    try {
      const headers = [
        'Data do Relatório',
        'Utilização Geral (%)',
        'Capacidade Total (h)',
        'Horas Agendadas (h)',
        'Horas Disponíveis (h)',
        'Terapeutas Disponíveis',
        'Terapeutas Próximos ao Limite',
        'Terapeutas Sobrecarregados',
        'Status Geral',
        'Recomendação'
      ];

      // Esta seria uma implementação simulada - o hook real seria usado aqui
      const mockCapacityData = {
        overallUtilization: 75,
        totalCapacity: 160,
        totalScheduled: 120,
        availableHours: 40,
        availableTherapists: 3,
        nearLimitTherapists: 2,
        overloadedTherapists: 0,
        status: 'warning' as const,
        recommendation: 'Monitorar de perto - planeje com cuidado'
      };

      const rows = [[
        format(selectedWeek, 'dd/MM/yyyy', { locale: ptBR }),
        mockCapacityData.overallUtilization.toString(),
        mockCapacityData.totalCapacity.toString(),
        mockCapacityData.totalScheduled.toString(),
        mockCapacityData.availableHours.toString(),
        mockCapacityData.availableTherapists.toString(),
        mockCapacityData.nearLimitTherapists.toString(),
        mockCapacityData.overloadedTherapists.toString(),
        mockCapacityData.status === 'critical' ? 'Crítico' : 
        mockCapacityData.status === 'warning' ? 'Atenção' : 'Ótimo',
        mockCapacityData.recommendation
      ]];

      const csvContent = createCSVContent(headers, rows);
      const filename = `relatorio_capacidade_${format(selectedWeek, 'yyyy-MM-dd')}.csv`;
      
      downloadFile(csvContent, filename);

      toast({
        title: 'Relatório de capacidade exportado',
        description: `Relatório foi baixado como ${filename}`,
        variant: 'default'
      });

      return true;
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível exportar o relatório de capacidade.',
        variant: 'destructive'
      });
      return false;
    }
  }, [createCSVContent, downloadFile, toast]);

  const exportAuditReport = useCallback(async (filteredHistory: ScheduleHistory[]) => {
    try {
      const headers = [
        'Data/Hora',
        'Tipo de Alteração',
        'Criança',
        'Terapeuta',
        'Atividade',
        'Data da Sessão',
        'Horário',
        'Alterado Por',
        'Motivo',
        'Status Anterior',
        'Status Atual'
      ];

      const rows = filteredHistory.map(entry => {
        const schedule = schedules.find(s => s.id === entry.scheduleId);
        const child = schedule ? getChildById(schedule.childId) : null;
        const therapist = schedule ? getTherapistById(schedule.therapistId) : null;

        return [
          format(entry.changedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR }),
          entry.changeType,
          child?.name || 'N/A',
          therapist?.name || 'N/A',
          schedule?.activity || 'N/A',
          schedule ? format(schedule.date, 'dd/MM/yyyy', { locale: ptBR }) : 'N/A',
          schedule?.time || 'N/A',
          entry.changedBy,
          entry.reason || '',
          entry.previousData || '',
          entry.newData || ''
        ];
      });

      const csvContent = createCSVContent(headers, rows);
      const filename = `auditoria_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
      
      downloadFile(csvContent, filename);

      toast({
        title: 'Relatório de auditoria exportado',
        description: `${filteredHistory.length} registros exportados como ${filename}`,
        variant: 'default'
      });

      return true;
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível exportar o relatório de auditoria.',
        variant: 'destructive'
      });
      return false;
    }
  }, [schedules, getChildById, getTherapistById, createCSVContent, downloadFile, toast]);

  return {
    exportUtilizationReport,
    exportCapacityReport,
    exportAuditReport
  };
};
