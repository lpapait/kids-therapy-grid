
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, BarChart3, Users, Clock } from 'lucide-react';
import { useUtilizationReports } from '@/hooks/useUtilizationReports';

interface UtilizationReportPanelProps {
  selectedWeek: Date;
}

const UtilizationReportPanel: React.FC<UtilizationReportPanelProps> = ({ 
  selectedWeek 
}) => {
  const { therapistUtilization, summary } = useUtilizationReports(selectedWeek);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 100) return 'text-red-600 bg-red-50 border-red-200';
    if (utilization >= 80) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (utilization >= 60) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getProgressColor = (utilization: number) => {
    if (utilization >= 100) return 'bg-gradient-to-r from-red-400 to-red-600';
    if (utilization >= 80) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    return 'bg-gradient-to-r from-green-400 to-blue-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-sm">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <span>Relatório de Utilização</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-blue-50 rounded border">
            <div className="font-bold text-blue-700">{summary.averageUtilization}%</div>
            <div className="text-blue-600">Média</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded border border-green-200">
            <div className="font-bold text-green-700">{summary.optimalCount}</div>
            <div className="text-green-600">Ideal</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded border border-red-200">
            <div className="font-bold text-red-700">{summary.overloadedCount}</div>
            <div className="text-red-600">Sobrecarga</div>
          </div>
        </div>

        {/* Capacity Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Capacidade Total</span>
            <span className="font-medium">
              {summary.totalHoursScheduled}h / {summary.totalCapacity}h
            </span>
          </div>
          <Progress 
            value={summary.capacityUtilization} 
            className="h-2"
          />
          <div className="text-xs text-gray-600 text-center">
            {summary.capacityUtilization}% da capacidade total utilizada
          </div>
        </div>

        {/* Individual Therapist Utilization */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
            Utilização por Terapeuta
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {therapistUtilization.map((therapist) => (
              <div 
                key={therapist.therapistId}
                className="p-2 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full border shadow-sm" 
                      style={{ backgroundColor: therapist.color }}
                    />
                    <span className="text-xs font-medium text-gray-900">
                      {therapist.therapistName}
                    </span>
                    {getTrendIcon(therapist.trend)}
                  </div>
                  <Badge 
                    className={`text-xs px-2 py-0 ${getUtilizationColor(therapist.utilization)}`}
                  >
                    {therapist.utilization}%
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="relative bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(therapist.utilization)}`}
                      style={{ width: `${Math.min(therapist.utilization, 100)}%` }}
                    />
                    {therapist.utilization > 100 && (
                      <div className="absolute top-0 right-0 h-2 w-1 bg-red-600 rounded-r-full animate-pulse" />
                    )}
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{therapist.currentWeekHours}h / {therapist.maxWeeklyHours}h</span>
                    <span>{therapist.totalSessions} sessões</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{therapist.averageSessionDuration}min méd.</span>
                    </div>
                    {therapist.trend !== 'stable' && (
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(therapist.trend)}
                        <span>
                          vs. sem. anterior: {therapist.previousWeekHours}h
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="pt-3 border-t border-gray-200">
          <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-2">
            Insights Rápidos
          </h4>
          <div className="space-y-1 text-xs text-gray-600">
            {summary.underutilizedCount > 0 && (
              <div className="flex items-center space-x-2">
                <Users className="h-3 w-3 text-blue-500" />
                <span>{summary.underutilizedCount} terapeutas com capacidade disponível</span>
              </div>
            )}
            {summary.overloadedCount > 0 && (
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-3 w-3 text-red-500" />
                <span>{summary.overloadedCount} terapeutas sobrecarregados</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-3 w-3 text-green-500" />
              <span>
                {(summary.totalCapacity - summary.totalHoursScheduled).toFixed(1)}h 
                de capacidade disponível
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UtilizationReportPanel;
