
import { useMemo } from 'react';
import { TherapyCoverage } from '@/types';
import { getSpecialtyColor } from '@/lib/therapistColors';

export interface TherapyDistributionData {
  name: string;
  value: number;
  percentage: number;
  color: string;
  hours: number;
}

export const useTherapyDistribution = (coverageData: TherapyCoverage[]): TherapyDistributionData[] => {
  return useMemo(() => {
    if (!Array.isArray(coverageData) || coverageData.length === 0) {
      return [];
    }

    // Filtrar apenas terapias com horas agendadas
    const therapiesWithHours = coverageData.filter(therapy => 
      therapy.hoursScheduled && therapy.hoursScheduled > 0
    );

    if (therapiesWithHours.length === 0) {
      return [];
    }

    // Calcular total de horas agendadas
    const totalHours = therapiesWithHours.reduce((sum, therapy) => 
      sum + (therapy.hoursScheduled || 0), 0
    );

    // Criar dados para o gráfico
    return therapiesWithHours.map(therapy => {
      const hours = therapy.hoursScheduled || 0;
      const percentage = Math.round((hours / totalHours) * 100);
      
      return {
        name: therapy.specialty || 'Especialidade não definida',
        value: hours,
        percentage,
        color: getSpecialtyColor(therapy.specialty || ''),
        hours
      };
    }).sort((a, b) => b.value - a.value); // Ordenar por horas (maior primeiro)
  }, [coverageData]);
};
