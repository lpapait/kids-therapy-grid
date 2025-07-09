
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, Table } from 'lucide-react';
import { Schedule, Child, Therapist } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgendaExportProps {
  therapist: Therapist;
  schedules: Schedule[];
  selectedWeek: Date;
  getChildById: (id: string) => Child | undefined;
  stats: {
    totalHours: number;
    totalScheduled: number;
    confirmedSessions: number;
    pendingSessions: number;
    cancelledSessions: number;
  };
}

const AgendaExport: React.FC<AgendaExportProps> = ({
  therapist,
  schedules,
  selectedWeek,
  getChildById,
  stats
}) => {
  const generateCSVData = () => {
    const header = [
      'Data',
      'Horário',
      'Criança',
      'Atividade',
      'Duração (min)',
      'Status',
      'Observações'
    ];
    
    const rows = schedules.map(schedule => {
      const child = getChildById(schedule.childId);
      return [
        format(schedule.date, 'dd/MM/yyyy', { locale: ptBR }),
        schedule.time,
        child?.name || 'N/A',
        schedule.activity,
        schedule.duration.toString(),
        schedule.status === 'scheduled' ? 'Confirmado' :
        schedule.status === 'completed' ? 'Realizado' :
        schedule.status === 'cancelled' ? 'Cancelado' : 'Pendente',
        schedule.observations || ''
      ];
    });
    
    return [header, ...rows];
  };

  const downloadCSV = () => {
    const data = generateCSVData();
    const csvContent = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `agenda_${therapist.name.replace(/\s+/g, '_')}_${format(selectedWeek, 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDFReport = () => {
    // Implementação simplificada - em produção usaria uma biblioteca como jsPDF
    const reportContent = `
RELATÓRIO SEMANAL - ${therapist.name}
Semana de ${format(selectedWeek, 'dd/MM/yyyy', { locale: ptBR })}

RESUMO:
- Total de sessões: ${stats.totalScheduled}
- Sessões confirmadas: ${stats.confirmedSessions}
- Sessões pendentes: ${stats.pendingSessions}
- Sessões canceladas: ${stats.cancelledSessions}
- Total de horas: ${stats.totalHours.toFixed(1)}h

AGENDA DETALHADA:
${schedules.map(schedule => {
  const child = getChildById(schedule.childId);
  return `${format(schedule.date, 'dd/MM', { locale: ptBR })} às ${schedule.time} - ${child?.name} - ${schedule.activity} (${schedule.duration}min)`;
}).join('\n')}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${therapist.name.replace(/\s+/g, '_')}_${format(selectedWeek, 'yyyy-MM-dd')}.txt`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar Agenda
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadCSV}>
          <Table className="h-4 w-4 mr-2" />
          Exportar CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={generatePDFReport}>
          <FileText className="h-4 w-4 mr-2" />
          Relatório Completo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AgendaExport;
