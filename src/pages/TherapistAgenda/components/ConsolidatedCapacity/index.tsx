
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gauge, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Activity,
  Download,
  Eye
} from 'lucide-react';
import { CapacityInsight } from '../../types/therapist-agenda.types';

interface ConsolidatedCapacityProps {
  insights: CapacityInsight[];
  capacityMetrics: {
    overallUtilization: number;
    totalCapacity: number;
    totalScheduled: number;
    availableHours: number;
    overloadedTherapists: number;
    nearLimitTherapists: number;
    availableTherapists: number;
    status: 'optimal' | 'warning' | 'critical';
    recommendation: string;
  };
  hasAlerts: boolean;
  onViewDetails: () => void;
  onExportReport: () => void;
}

const ConsolidatedCapacity: React.FC<ConsolidatedCapacityProps> = ({
  insights,
  capacityMetrics,
  hasAlerts,
  onViewDetails,
  onExportReport
}) => {
  const getStatusColor = () => {
    switch (capacityMetrics.status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getStatusIcon = () => {
    switch (capacityMetrics.status) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <TrendingUp className="h-5 w-5 text-yellow-600" />;
      default: return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  const getProgressBarClass = () => {
    switch (capacityMetrics.status) {
      case 'critical': return '[&>div]:bg-red-500';
      case 'warning': return '[&>div]:bg-yellow-500';
      default: return '[&>div]:bg-green-500';
    }
  };

  const getStatusLabel = () => {
    switch (capacityMetrics.status) {
      case 'critical': return 'Crítico';
      case 'warning': return 'Atenção';
      default: return 'Ótimo';
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Capacity Card */}
      <Card className={`border-l-4 ${getStatusColor()}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center space-x-2">
              <Gauge className="h-5 w-5" />
              <span>Capacidade da Equipe</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <Badge 
                variant="outline" 
                className={`${getStatusColor()} border-current`}
              >
                {getStatusLabel()}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Utilization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Utilização Geral</span>
              <span className="text-2xl font-bold">
                {capacityMetrics.overallUtilization}%
              </span>
            </div>
            <Progress 
              value={capacityMetrics.overallUtilization} 
              className={`h-3 ${getProgressBarClass()}`}
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>{capacityMetrics.totalScheduled}h agendadas</span>
              <span>{capacityMetrics.totalCapacity}h capacidade total</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-gray-600">Disponível</span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {capacityMetrics.availableHours}h
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-600">Disponíveis</span>
              </div>
              <div className="text-lg font-bold text-purple-600">
                {capacityMetrics.availableTherapists}
              </div>
            </div>
          </div>

          {/* Team Status */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Status dos Terapeutas</span>
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                <div className="font-bold text-green-700">{capacityMetrics.availableTherapists}</div>
                <div className="text-green-600">Disponíveis</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-200">
                <div className="font-bold text-yellow-700">{capacityMetrics.nearLimitTherapists}</div>
                <div className="text-yellow-600">Próx. Limite</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded border border-red-200">
                <div className="font-bold text-red-700">{capacityMetrics.overloadedTherapists}</div>
                <div className="text-red-600">Sobrecarreg.</div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`p-3 rounded-lg border ${getStatusColor()}`}>
            <p className="text-sm font-medium mb-2">Recomendação:</p>
            <p className="text-sm">{capacityMetrics.recommendation}</p>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={onExportReport}
            >
              <Download className="h-3 w-3 mr-1" />
              Exportar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={onViewDetails}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver Detalhes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Insights Panel */}
      {insights.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Insights e Alertas</span>
              {hasAlerts && (
                <Badge variant="destructive" className="text-xs">
                  {insights.filter(i => i.type === 'critical' || i.type === 'warning').length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.slice(0, 4).map((insight, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border-l-4 ${
                    insight.type === 'critical' ? 'border-red-500 bg-red-50' :
                    insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    insight.type === 'info' ? 'border-blue-500 bg-blue-50' :
                    'border-green-500 bg-green-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                    {insight.action && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={insight.action.onClick}
                        className="text-xs ml-2"
                      >
                        {insight.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsolidatedCapacity;
