
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, Users, TrendingUp } from 'lucide-react';
import { useWorkloadAlerts } from '@/hooks/useWorkloadAlerts';

interface WorkloadAlertsPanelProps {
  selectedWeek: Date;
  onAlertClick?: (therapistId: string) => void;
}

const WorkloadAlertsPanel: React.FC<WorkloadAlertsPanelProps> = ({ 
  selectedWeek, 
  onAlertClick 
}) => {
  const { alerts, criticalAlerts, warningAlerts, hasAlerts } = useWorkloadAlerts(selectedWeek);

  if (!hasAlerts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Bell className="h-4 w-4 text-green-600" />
            <span>Sistema de Alertas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-green-600 mb-2">
              <Users className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-sm text-green-700 font-medium">
              Todos os terapeutas dentro dos limites
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Nenhum alerta ativo para esta semana
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-orange-600" />
            <span>Alertas de Carga Horária</span>
          </div>
          <Badge variant="outline" className="text-orange-700 border-orange-300">
            {alerts.length} alertas
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                Alertas Críticos ({criticalAlerts.length})
              </span>
            </div>
            {criticalAlerts.map((alert) => (
              <div 
                key={alert.id}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-medium">
                      {alert.message}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {alert.workloadData.hoursScheduled}h / {alert.workloadData.maxHours}h
                      ({alert.workloadData.percentage}%)
                    </p>
                  </div>
                  {onAlertClick && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-6 ml-2 border-red-300 text-red-700"
                      onClick={() => onAlertClick(alert.therapistId)}
                    >
                      Ver Detalhes
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Warning Alerts */}
        {warningAlerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                Avisos ({warningAlerts.length})
              </span>
            </div>
            {warningAlerts.map((alert) => (
              <div 
                key={alert.id}
                className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800 font-medium">
                      {alert.message}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      {alert.workloadData.hoursScheduled}h / {alert.workloadData.maxHours}h
                      ({alert.workloadData.percentage}%)
                    </p>
                  </div>
                  {onAlertClick && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-6 ml-2 border-yellow-300 text-yellow-700"
                      onClick={() => onAlertClick(alert.therapistId)}
                    >
                      Ver Detalhes
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center p-2 bg-red-50 rounded border border-red-200">
              <div className="font-bold text-red-700">{criticalAlerts.length}</div>
              <div className="text-red-600">Críticos</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-200">
              <div className="font-bold text-yellow-700">{warningAlerts.length}</div>
              <div className="text-yellow-600">Avisos</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkloadAlertsPanel;
