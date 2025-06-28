
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Gauge, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { useCapacityMetrics } from '@/hooks/useCapacityMetrics';
import { useToast } from '@/hooks/use-toast';

interface CapacityMonitorWidgetProps {
  selectedWeek: Date;
  onViewDetails?: () => void;
}

const CapacityMonitorWidget: React.FC<CapacityMonitorWidgetProps> = ({ 
  selectedWeek, 
  onViewDetails 
}) => {
  const metrics = useCapacityMetrics(selectedWeek);
  const { toast } = useToast();

  const getStatusColor = () => {
    switch (metrics.status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getStatusIcon = () => {
    switch (metrics.status) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <TrendingUp className="h-5 w-5 text-yellow-600" />;
      default: return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  const getProgressBarClass = () => {
    switch (metrics.status) {
      case 'critical': return '[&>div]:bg-red-500';
      case 'warning': return '[&>div]:bg-yellow-500';
      default: return '[&>div]:bg-green-500';
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'redistribute':
        toast({
          title: 'Redistribuição iniciada',
          description: 'Analisando possibilidades de redistribuição...',
          variant: 'default'
        });
        break;
      case 'view_alerts':
        toast({
          title: 'Visualizando alertas',
          description: 'Redirecionando para painel de alertas...',
          variant: 'default'
        });
        if (onViewDetails) onViewDetails();
        break;
    }
  };

  return (
    <Card className={`border-l-4 ${getStatusColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <Gauge className="h-5 w-5" />
            <span>Monitoramento de Capacidade</span>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <Badge 
              variant="outline" 
              className={`${getStatusColor()} border-current`}
            >
              {metrics.status === 'critical' ? 'Crítico' :
               metrics.status === 'warning' ? 'Atenção' : 'Ótimo'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Utilização Geral */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Utilização Geral</span>
            <span className="text-2xl font-bold">
              {metrics.overallUtilization}%
            </span>
          </div>
          <Progress 
            value={metrics.overallUtilization} 
            className={`h-3 ${getProgressBarClass()}`}
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>{metrics.totalScheduled}h agendadas</span>
            <span>{metrics.totalCapacity}h capacidade total</span>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-gray-600">Disponível</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {metrics.availableHours}h
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-gray-600">Terapeutas</span>
            </div>
            <div className="text-lg font-bold text-purple-600">
              {metrics.availableTherapists}
            </div>
          </div>
        </div>

        {/* Status dos Terapeutas */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Status dos Terapeutas</span>
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-green-50 rounded border border-green-200">
              <div className="font-bold text-green-700">{metrics.availableTherapists}</div>
              <div className="text-green-600">Disponíveis</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-200">
              <div className="font-bold text-yellow-700">{metrics.nearLimitTherapists}</div>
              <div className="text-yellow-600">Próx. Limite</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded border border-red-200">
              <div className="font-bold text-red-700">{metrics.overloadedTherapists}</div>
              <div className="text-red-600">Sobrecarreg.</div>
            </div>
          </div>
        </div>

        {/* Recomendação */}
        <div className={`p-3 rounded-lg border ${getStatusColor()}`}>
          <p className="text-sm font-medium mb-2">Recomendação:</p>
          <p className="text-sm">{metrics.recommendation}</p>
        </div>

        {/* Ações Rápidas */}
        {(metrics.status === 'critical' || metrics.status === 'warning') && (
          <div className="flex space-x-2">
            {metrics.criticalAlerts > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => handleQuickAction('redistribute')}
              >
                Redistribuir
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => handleQuickAction('view_alerts')}
            >
              Ver Alertas ({metrics.criticalAlerts})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CapacityMonitorWidget;
