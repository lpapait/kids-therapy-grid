
import { useMemo } from 'react';
import { useCapacityMetrics } from '@/hooks/useCapacityMetrics';
import { useTherapistAlerts } from '@/hooks/useTherapistAlerts';
import { CapacityInsight } from '../types/therapist-agenda.types';

export const useCapacityInsights = (selectedWeek: Date) => {
  const capacityMetrics = useCapacityMetrics(selectedWeek);
  const therapistAlerts = useTherapistAlerts(selectedWeek);

  const insights = useMemo((): CapacityInsight[] => {
    const results: CapacityInsight[] = [];

    // Critical capacity alerts
    if (capacityMetrics.status === 'critical') {
      results.push({
        type: 'critical',
        title: 'Capacidade Crítica',
        description: `${capacityMetrics.overloadedTherapists} terapeutas sobrecarregados. Redistribuição urgente necessária.`,
        action: {
          label: 'Redistribuir Sessões',
          onClick: () => console.log('Redistribute sessions')
        }
      });
    }

    // Warning alerts
    if (capacityMetrics.status === 'warning') {
      results.push({
        type: 'warning',
        title: 'Monitoramento Necessário',
        description: `${capacityMetrics.nearLimitTherapists} terapeutas próximos ao limite de capacidade.`,
        action: {
          label: 'Ver Detalhes',
          onClick: () => console.log('View capacity details')
        }
      });
    }

    // Individual therapist alerts
    therapistAlerts.slice(0, 3).forEach(alert => {
      results.push({
        type: alert.status === 'critical' ? 'critical' : 'warning',
        title: `${alert.therapistName}`,
        description: `${alert.percentage}% da capacidade utilizada (${alert.hoursScheduled}h/${alert.maxHours}h)`,
        action: {
          label: 'Ver Agenda',
          onClick: () => console.log(`View agenda for ${alert.therapistId}`)
        }
      });
    });

    // Positive insights
    if (capacityMetrics.status === 'optimal' && results.length === 0) {
      results.push({
        type: 'success',
        title: 'Capacidade Otimizada',
        description: `Equipe operando em níveis ideais. ${capacityMetrics.availableHours}h disponíveis para novos agendamentos.`,
      });
    }

    return results;
  }, [capacityMetrics, therapistAlerts]);

  return {
    insights,
    capacityMetrics,
    hasAlerts: insights.some(i => i.type === 'critical' || i.type === 'warning')
  };
};
