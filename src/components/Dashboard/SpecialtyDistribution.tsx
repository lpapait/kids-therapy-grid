
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { useTherapyDistribution } from '@/hooks/useTherapyDistribution';
import { useTherapyCoverage } from '@/hooks/useTherapyCoverage';

interface SpecialtyDistributionProps {
  selectedWeek: Date;
}

const SpecialtyDistribution: React.FC<SpecialtyDistributionProps> = ({ selectedWeek }) => {
  const coverageData = useTherapyCoverage(selectedWeek);
  const distributionData = useTherapyDistribution(coverageData, selectedWeek);

  const maxSessions = Math.max(...distributionData.map(d => d.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          <span>Distribuição por Especialidade</span>
        </CardTitle>
        <CardDescription>Sessões agendadas por especialidade nesta semana</CardDescription>
      </CardHeader>
      <CardContent>
        {distributionData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma sessão agendada para esta semana</p>
          </div>
        ) : (
          <div className="space-y-4">
            {distributionData.map((specialty) => (
              <div key={specialty.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {specialty.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {specialty.value} sessão{specialty.value !== 1 ? 'ões' : ''}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({specialty.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(specialty.value / maxSessions) * 100}%`,
                      backgroundColor: specialty.color
                    }}
                  />
                </div>
              </div>
            ))}
            
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900">Total</span>
                <span className="text-gray-600">
                  {distributionData.reduce((sum, d) => sum + d.value, 0)} sessões
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpecialtyDistribution;
