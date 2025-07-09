import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Clock, Download } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

import { isSameWeek } from '@/lib/dateUtils';

interface UtilizationReportPanelProps {
  selectedWeek: Date;
}

const UtilizationReportPanel: React.FC<UtilizationReportPanelProps> = ({ selectedWeek }) => {
  const { therapists, schedules } = useData();
  

  const utilizationData = therapists.map(therapist => {
    const weekSchedules = schedules.filter(schedule => 
      schedule.therapistId === therapist.id &&
      isSameWeek(schedule.date, selectedWeek) &&
      schedule.status !== 'cancelled'
    );

    const totalMinutes = weekSchedules.reduce((total, schedule) => 
      total + (schedule.duration || 60), 0
    );
    
    const hoursScheduled = Math.round((totalMinutes / 60) * 10) / 10;
    const maxHours = therapist.weeklyWorkloadHours;
    const percentage = Math.round((hoursScheduled / maxHours) * 100);

    return {
      therapist,
      hoursScheduled,
      maxHours,
      percentage,
      sessionsCount: weekSchedules.length,
      status: percentage >= 100 ? 'overloaded' : percentage >= 80 ? 'near_limit' : 'available'
    };
  });

  const avgUtilization = Math.round(
    utilizationData.reduce((sum, data) => sum + data.percentage, 0) / utilizationData.length
  );

  const totalSessions = utilizationData.reduce((sum, data) => sum + data.sessionsCount, 0);
  const overloadedCount = utilizationData.filter(data => data.status === 'overloaded').length;

  const handleExportReport = async () => {
    // Funcionalidade de export removida
    console.log('Export functionality removed');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span>Relatório de Utilização</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7"
            onClick={handleExportReport}
          >
            <Download className="h-3 w-3 mr-1" />
            Exportar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
            <div className="font-bold text-blue-700">{avgUtilization}%</div>
            <div className="text-blue-600">Utilização Média</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded border border-green-200">
            <div className="font-bold text-green-700">{totalSessions}</div>
            <div className="text-green-600">Sessões Total</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded border border-red-200">
            <div className="font-bold text-red-700">{overloadedCount}</div>
            <div className="text-red-600">Sobrecarregados</div>
          </div>
        </div>

        {/* Therapist utilization breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
            Utilização por Terapeuta
          </h4>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {utilizationData.map((data) => (
              <div key={data.therapist.id} className="flex items-center space-x-2 text-xs">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: data.therapist.color }}
                />
                <span className="flex-1 truncate">{data.therapist.name}</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs px-1 py-0 ${
                    data.status === 'overloaded' ? 'text-red-700 border-red-300' :
                    data.status === 'near_limit' ? 'text-yellow-700 border-yellow-300' :
                    'text-green-700 border-green-300'
                  }`}
                >
                  {data.percentage}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>Semana atual</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{therapists.length} terapeutas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UtilizationReportPanel;
