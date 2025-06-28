
import { useCallback } from 'react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { ScheduleHistory } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const useReportExport = () => {
  const { getAllHistory, getChildById, getTherapistById, schedules } = useData();
  const { toast } = useToast();

  const exportAuditToPDF = useCallback(async (filteredHistory: ScheduleHistory[]) => {
    try {
      // Create CSV content (simplified export format)
      const headers = [
        'Data/Hora',
        'Tipo de Alteração',
        'Criança',
        'Terapeuta',
        'Atividade',
        'Data da Sessão',
        'Horário',
        'Alterado Por',
        'Motivo'
      ].join(',');

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
          entry.reason || ''
        ].map(field => `"${field}"`).join(',');
      });

      const csvContent = [headers, ...rows].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `auditoria_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Relatório exportado',
        description: `Relatório de auditoria com ${filteredHistory.length} registros foi baixado.`,
        variant: 'default'
      });

      return true;
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível exportar o relatório. Tente novamente.',
        variant: 'destructive'
      });
      return false;
    }
  }, [schedules, getChildById, getTherapistById, toast]);

  const exportUtilizationReport = useCallback(async (selectedWeek: Date) => {
    try {
      const { therapists } = useData();
      
      // Generate utilization data
      const utilizationData = therapists.map(therapist => {
        const therapistSchedules = schedules.filter(s => 
          s.therapistId === therapist.id &&
          s.date >= selectedWeek &&
          s.date < new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000) &&
          s.status !== 'cancelled'
        );

        const totalMinutes = therapistSchedules.reduce((total, s) => 
          total + (s.duration || 60), 0
        );
        const hoursScheduled = totalMinutes / 60;
        const utilization = (hoursScheduled / therapist.weeklyWorkloadHours) * 100;

        return {
          therapist: therapist.name,
          horasAgendadas: hoursScheduled.toFixed(1),
          horasMaximas: therapist.weeklyWorkloadHours,
          utilizacao: `${utilization.toFixed(1)}%`,
          totalSessoes: therapistSchedules.length
        };
      });

      const headers = [
        'Terapeuta',
        'Horas Agendadas',
        'Horas Máximas',
        'Utilização',
        'Total de Sessões'
      ].join(',');

      const rows = utilizationData.map(data => 
        Object.values(data).map(field => `"${field}"`).join(',')
      );

      const csvContent = [headers, ...rows].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `utilizacao_${format(selectedWeek, 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Relatório de utilização exportado',
        description: 'Relatório semanal de utilização foi baixado.',
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
  }, [schedules, toast]);

  return {
    exportAuditToPDF,
    exportUtilizationReport
  };
};
