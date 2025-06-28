
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, Users, TrendingUp, Eye } from 'lucide-react';
import { useTherapistAlerts } from '@/hooks/useTherapistAlerts';
import { useToast } from '@/hooks/use-toast';

interface TherapistAlertsPanelProps {
  selectedWeek: Date;
  onViewTherapist?: (therapistId: string) => void;
}

const TherapistAlertsPanel: React.FC<TherapistAlertsPanelProps> = ({
  selectedWeek,
  onViewTherapist
}) => {
  const alerts = useTherapistAlerts(selectedWeek);
  const { toast } = useToast();

  const getAlertConfig = (status: string) => {
    switch (status) {
      case 'critical':
        return {
          color: 'text-red-700 bg-red-50 border-red-200',
          badgeVariant: 'destructive' as const,
          icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
          progressClass: '[&>div]:bg-red-500',
          label: 'CRÍTICO'
        };
      case 'near_limit':
        return {
          color: 'text-orange-700 bg-orange-50 border-orange-200',
          badgeVariant: 'outline' as const,
          icon: <TrendingUp className="h-4 w-4 text-orange-600" />,
          progressClass: '[&>div]:bg-orange-500',
          label: 'ATENÇÃO'
        };
      case 'approaching_limit':
        return {
          color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
          badgeVariant: 'outline' as const,
          icon: <Clock className="h-4 w-4 text-yellow-600" />,
          progressClass: '[&>div]:bg-yellow-500',
          label: 'MONITORAR'
        };
      default:
        return {
          color: 'text-gray-700 bg-gray-50 border-gray-200',
          badgeVariant: 'outline' as const,
          icon: <Users className="h-4 w-4 text-gray-600" />,
          progressClass: '[&>div]:bg-gray-500',
          label: 'OK'
        };
    }
  };

  const handleViewTherapist = (therapistId: string, therapistName: string) => {
    if (onViewTherapist) {
      onViewTherapist(therapistId);
    }
    toast({
      title: 'Visualizando agenda',
      description: `Abrindo agenda detalhada de ${therapistName}`,
      variant: 'default'
    });
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Users className="h-4 w-4 text-green-600" />
            <span>Alertas de Capacidade</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-green-600 mb-2">
              <Users className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-sm text-green-700 font-medium">
              Todos os terapeutas com carga adequada
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Nenhum alerta de capacidade ativo
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
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span>⚠️ Atenção - Terapeutas Próximos ao Limite</span>
          </div>
          <Badge variant="outline" className="text-orange-700 border-orange-300">
            {alerts.length} alertas
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => {
          const config = getAlertConfig(alert.status);
          return (
            <div 
              key={alert.therapistId}
              className={`p-4 rounded-lg border ${config.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {config.icon}
                  <h4 className="font-semibold">{alert.therapistName}</h4>
                  <Badge variant={config.badgeVariant} className="text-xs">
                    {config.label}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => handleViewTherapist(alert.therapistId, alert.therapistName)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver Agenda
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Utilização da Semana</span>
                  <span className="font-bold text-lg">
                    {alert.percentage}%
                  </span>
                </div>
                
                <Progress 
                  value={alert.percentage} 
                  className={`h-2 ${config.progressClass}`}
                />
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-600">Horas Agendadas:</span>
                    <div className="font-bold">{alert.hoursScheduled}h / {alert.maxHours}h</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Capacidade Restante:</span>
                    <div className="font-bold text-blue-600">
                      {alert.remainingHours.toFixed(1)}h
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-2 rounded border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>Capacidade restante:</strong> Pode receber aproximadamente {alert.remainingSessions} sessões adicionais
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-3 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-red-50 rounded border border-red-200">
              <div className="font-bold text-red-700">
                {alerts.filter(a => a.status === 'critical').length}
              </div>
              <div className="text-red-600">Críticos</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded border border-orange-200">
              <div className="font-bold text-orange-700">
                {alerts.filter(a => a.status === 'near_limit').length}
              </div>
              <div className="text-orange-600">Atenção</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded border border-yellow-200">
              <div className="font-bold text-yellow-700">
                {alerts.filter(a => a.status === 'approaching_limit').length}
              </div>
              <div className="text-yellow-600">Monitorar</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistAlertsPanel;
