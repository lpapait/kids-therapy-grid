
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
        priority: 1,
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
        priority: 2,
        action: {
          label: 'Ver Detalhes',
          onClick: () => console.log('View capacity details')
        }
      });
    }

    // Individual therapist alerts
    therapistAlerts.slice(0, 3).forEach((alert, index) => {
      results.push({
        type: alert.status === 'critical' ? 'critical' : 'warning',
        title: `${alert.therapistName}`,
        description: `${alert.percentage}% da capacidade utilizada (${alert.hoursScheduled}h/${alert.maxHours}h)`,
        priority: alert.status === 'critical' ? 1 : 2,
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
        priority: 3
      });
    }

    return results.sort((a, b) => a.priority - b.priority);
  }, [capacityMetrics, therapistAlerts]);

  return {
    insights,
    capacityMetrics,
    hasAlerts: insights.some(i => i.type === 'critical' || i.type === 'warning')
  };
};
