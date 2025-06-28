import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { History, Search, Calendar, User, Activity, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useData } from '@/contexts/DataContext';
import { useReportExport } from '@/hooks/useReportExport';
import { ScheduleHistory } from '@/types';

const AuditPage = () => {
  const { getAllHistory, getChildById, getTherapistById, schedules } = useData();
  const { exportAuditToPDF } = useReportExport();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');

  const allHistory = getAllHistory();

  const filteredHistory = allHistory.filter(entry => {
    // Filtro por termo de busca
    if (searchTerm) {
      const schedule = schedules.find(s => s.id === entry.scheduleId);
      const child = schedule ? getChildById(schedule.childId) : null;
      const therapist = schedule ? getTherapistById(schedule.therapistId) : null;
      
      const searchString = `
        ${child?.name || ''} 
        ${therapist?.name || ''} 
        ${schedule?.activity || ''} 
        ${entry.reason || ''}
      `.toLowerCase();
      
      if (!searchString.includes(searchTerm.toLowerCase())) {
        return false;
      }
    }

    // Filtro por tipo de mudança
    if (filterType !== 'all' && entry.changeType !== filterType) {
      return false;
    }

    // Filtro por período
    if (filterPeriod !== 'all') {
      const now = new Date();
      const entryDate = entry.changedAt;
      
      switch (filterPeriod) {
        case 'today':
          if (entryDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (entryDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (entryDate < monthAgo) return false;
          break;
      }
    }

    return true;
  });

  const getChangeTypeLabel = (changeType: ScheduleHistory['changeType']) => {
    switch (changeType) {
      case 'created': return 'Criada';
      case 'updated': return 'Atualizada';
      case 'cancelled': return 'Cancelada';
      case 'rescheduled': return 'Remarcada';
      case 'completed': return 'Realizada';
      default: return 'Modificada';
    }
  };

  const getChangeTypeColor = (changeType: ScheduleHistory['changeType']) => {
    switch (changeType) {
      case 'created': return 'bg-blue-100 text-blue-800';
      case 'updated': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportAudit = async () => {
    await exportAuditToPDF(filteredHistory);
  };

  // Estatísticas
  const stats = {
    total: allHistory.length,
    cancelled: allHistory.filter(h => h.changeType === 'cancelled').length,
    rescheduled: allHistory.filter(h => h.changeType === 'rescheduled').length,
    completed: allHistory.filter(h => h.changeType === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auditoria do Sistema</h1>
          <p className="text-gray-600 mt-1">
            Histórico completo de todas as alterações nas sessões
          </p>
        </div>
        
        <Button onClick={handleExportAudit} disabled={filteredHistory.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <History className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Alterações</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">Cancelamentos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">Remarcações</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rescheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">Realizadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Nome da criança, terapeuta, atividade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Alteração</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="created">Criadas</SelectItem>
                  <SelectItem value="updated">Atualizadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                  <SelectItem value="rescheduled">Remarcadas</SelectItem>
                  <SelectItem value="completed">Realizadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de alterações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Alterações</CardTitle>
          <CardDescription>
            {filteredHistory.length} alteração{filteredHistory.length !== 1 ? 'ões' : ''} encontrada{filteredHistory.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma alteração encontrada</p>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((entry) => {
                const schedule = schedules.find(s => s.id === entry.scheduleId);
                const child = schedule ? getChildById(schedule.childId) : null;
                const therapist = schedule ? getTherapistById(schedule.therapistId) : null;
                
                return (
                  <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getChangeTypeColor(entry.changeType)}>
                            {getChangeTypeLabel(entry.changeType)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(entry.changedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Criança:</span>
                            <span>{child?.name || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Atividade:</span>
                            <span>{schedule?.activity || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Por:</span>
                            <span>{entry.changedBy}</span>
                          </div>
                        </div>
                        
                        {schedule && (
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{format(schedule.date, 'dd/MM/yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>{schedule.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>{therapist?.name}</span>
                            </div>
                          </div>
                        )}
                        
                        {entry.reason && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium text-gray-700">Motivo:</span>
                            <span className="text-gray-600 ml-1">{entry.reason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditPage;
