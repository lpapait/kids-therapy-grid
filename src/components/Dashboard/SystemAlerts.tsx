
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useOptimizedAlerts } from '@/hooks/useOptimizedAlerts';
import { usePlanningPendencies } from '@/hooks/usePlanningPendencies';
import { useNavigate } from 'react-router-dom';

interface SystemAlertsProps {
  selectedWeek: Date;
}

const SystemAlerts: React.FC<SystemAlertsProps> = ({ selectedWeek }) => {
  const therapistAlerts = useOptimizedAlerts(selectedWeek);
  const planningPendencies = usePlanningPendencies(selectedWeek);
  const navigate = useNavigate();

  const allAlerts = [
    ...therapistAlerts.map(alert => ({
      id: `therapist-${alert.therapistId}`,
      type: alert.status === 'critical' ? 'error' as const : 'warning' as const,
      title: `${alert.therapistName} - Sobrecarregado`,
      description: `${alert.percentage}% da carga semanal (${alert.hoursScheduled}h/${alert.maxHours}h)`,
      icon: alert.status === 'critical' ? AlertTriangle : AlertCircle,
      color: alert.color,
      action: () => navigate('/therapist-agenda')
    })),
    ...planningPendencies.slice(0, 3).map(pendency => ({
      id: pendency.id,
      type: pendency.priority === 'high' ? 'error' as const : 'warning' as const,
      title: pendency.title,
      description: pendency.description,
      icon: pendency.priority === 'high' ? AlertTriangle : AlertCircle,
      color: pendency.priority === 'high' ? '#ef4444' : '#f97316',
      action: () => navigate('/schedule')
    }))
  ];

  const criticalAlerts = allAlerts.filter(alert => alert.type === 'error');
  const warningAlerts = allAlerts.filter(alert => alert.type === 'warning');

  return (
    <Card className={criticalAlerts.length > 0 ? 'border-red-200 bg-red-50' : warningAlerts.length > 0 ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {criticalAlerts.length > 0 ? (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          ) : warningAlerts.length > 0 ? (
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
          <span>Alertas do Sistema</span>
        </CardTitle>
        <CardDescription>
          {criticalAlerts.length > 0 ? 
            `${criticalAlerts.length} alerta${criticalAlerts.length !== 1 ? 's' : ''} crítico${criticalAlerts.length !== 1 ? 's' : ''}` :
            warningAlerts.length > 0 ?
            `${warningAlerts.length} alerta${warningAlerts.length !== 1 ? 's' : ''} de atenção` :
            'Todos os sistemas operando normalmente'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allAlerts.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" />
            <p className="text-green-700 font-medium">Tudo funcionando bem!</p>
            <p className="text-sm text-green-600">Nenhum alerta crítico no momento</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allAlerts.slice(0, 4).map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                  <Icon 
                    className="h-5 w-5 mt-0.5 flex-shrink-0" 
                    style={{ color: alert.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={alert.action}
                    className="flex-shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            
            {allAlerts.length > 4 && (
              <div className="text-center pt-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/schedule')}>
                  Ver todos os {allAlerts.length} alertas
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemAlerts;
