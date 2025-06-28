
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useTherapistAlerts } from '@/hooks/useTherapistAlerts';

interface SchedulePreValidationProps {
  therapistId: string;
  selectedWeek: Date;
  sessionDuration: number;
  onSuggestAlternatives?: () => void;
}

const SchedulePreValidation: React.FC<SchedulePreValidationProps> = ({
  therapistId,
  selectedWeek,
  sessionDuration,
  onSuggestAlternatives
}) => {
  const { getTherapistById, therapists } = useData();
  const alerts = useTherapistAlerts(selectedWeek);
  
  const therapist = getTherapistById(therapistId);
  const currentAlert = alerts.find(alert => alert.therapistId === therapistId);
  
  if (!therapist || !currentAlert) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Capacidade Adequada</AlertTitle>
        <AlertDescription className="text-green-700">
          Este terapeuta tem capacidade suficiente para mais sessões.
        </AlertDescription>
      </Alert>
    );
  }

  const sessionHours = sessionDuration / 60;
  const projectedUtilization = Math.round(
    ((currentAlert.hoursScheduled + sessionHours) / currentAlert.maxHours) * 100
  );
  const wouldExceedLimit = projectedUtilization > 100;

  // Find alternative therapists
  const availableAlternatives = therapists.filter(t => {
    const alert = alerts.find(a => a.therapistId === t.id);
    return t.id !== therapistId && (!alert || alert.percentage < 80);
  }).slice(0, 3);

  const getAlertLevel = () => {
    if (wouldExceedLimit) return 'critical';
    if (projectedUtilization >= 90) return 'warning';
    return 'info';
  };

  const getAlertConfig = () => {
    const level = getAlertLevel();
    switch (level) {
      case 'critical':
        return {
          className: 'border-red-200 bg-red-50',
          icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
          titleColor: 'text-red-800',
          descColor: 'text-red-700',
          title: '⚠️ ATENÇÃO: Limite Seria Excedido'
        };
      case 'warning':
        return {
          className: 'border-orange-200 bg-orange-50',
          icon: <TrendingUp className="h-4 w-4 text-orange-600" />,
          titleColor: 'text-orange-800',
          descColor: 'text-orange-700',
          title: '⚠️ CUIDADO: Próximo ao Limite'
        };
      default:
        return {
          className: 'border-yellow-200 bg-yellow-50',
          icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
          titleColor: 'text-yellow-800',
          descColor: 'text-yellow-700',
          title: 'Monitorar Capacidade'
        };
    }
  };

  const config = getAlertConfig();

  return (
    <div className="space-y-4">
      <Alert className={config.className}>
        {config.icon}
        <AlertTitle className={config.titleColor}>
          {config.title}
        </AlertTitle>
        <AlertDescription className={config.descColor}>
          <div className="space-y-2">
            <p>
              <strong>{therapist.name}</strong> está com {currentAlert.percentage}% da capacidade utilizada.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span>Atual: {currentAlert.hoursScheduled}h / {currentAlert.maxHours}h</span>
              </div>
              <div>
                <span>Após esta sessão: ~{projectedUtilization}%</span>
              </div>
            </div>
            {wouldExceedLimit && (
              <p className="font-semibold">
                Esta sessão faria o terapeuta exceder sua capacidade semanal!
              </p>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {availableAlternatives.length > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Users className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">
            Terapeutas Alternativos Disponíveis
          </AlertTitle>
          <AlertDescription className="text-blue-700">
            <div className="space-y-2">
              <p>Considere agendar com um destes terapeutas:</p>
              <div className="space-y-2">
                {availableAlternatives.map(alt => {
                  const altAlert = alerts.find(a => a.therapistId === alt.id);
                  const utilization = altAlert?.percentage || 0;
                  return (
                    <div key={alt.id} className="flex items-center justify-between p-2 bg-blue-100 rounded">
                      <span className="font-medium">{alt.name}</span>
                      <Badge variant="outline" className="text-blue-700 border-blue-300">
                        {utilization}% utilização
                      </Badge>
                    </div>
                  );
                })}
              </div>
              {onSuggestAlternatives && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={onSuggestAlternatives}
                >
                  Ver Alternativas Detalhadas
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SchedulePreValidation;
