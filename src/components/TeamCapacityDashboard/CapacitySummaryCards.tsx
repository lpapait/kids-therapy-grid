
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { CapacityMetrics } from '@/hooks/useCapacityMetrics';
import { OptimizedTherapistAlert } from '@/hooks/useOptimizedAlerts';

interface CapacitySummaryCardsProps {
  metrics: CapacityMetrics;
  alerts: OptimizedTherapistAlert[];
}

const CapacitySummaryCards: React.FC<CapacitySummaryCardsProps> = ({
  metrics,
  alerts
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span>Utilização Geral</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{metrics.overallUtilization}%</div>
          <p className="text-xs text-gray-600">{metrics.totalScheduled}h / {metrics.totalCapacity}h</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span>Alertas Críticos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {alerts.filter(a => a.status === 'critical').length}
          </div>
          <p className="text-xs text-gray-600">Terapeutas sobrecarregados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <span>Próximos ao Limite</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {alerts.filter(a => a.status === 'near_limit').length}
          </div>
          <p className="text-xs text-gray-600">Requerem atenção</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Users className="h-4 w-4 text-green-600" />
            <span>Disponíveis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {metrics.availableTherapists}
          </div>
          <p className="text-xs text-gray-600">Com capacidade livre</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CapacitySummaryCards;
