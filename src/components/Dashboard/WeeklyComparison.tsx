
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useWeeklyComparison } from '@/hooks/useWeeklyComparison';

interface WeeklyComparisonProps {
  selectedWeek: Date;
}

const WeeklyComparison: React.FC<WeeklyComparisonProps> = ({ selectedWeek }) => {
  const comparison = useWeeklyComparison(selectedWeek);

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (value: number, isPositiveGood: boolean = true) => {
    if (value === 0) return 'text-gray-600';
    const isGood = isPositiveGood ? value > 0 : value < 0;
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  const formatTrend = (trend: { value: number; percentage: number }) => {
    if (trend.value === 0) return 'sem mudança';
    const sign = trend.value > 0 ? '+' : '';
    return `${sign}${trend.value} (${sign}${trend.percentage}%)`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span>Comparativo Semanal</span>
        </CardTitle>
        <CardDescription>Semana atual vs semana anterior</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Sessões Concluídas */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Sessões Concluídas</p>
                <p className="text-sm text-gray-600">
                  {comparison.current.completed} esta semana
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(comparison.trends.completed.value)}
              <span className={`text-sm font-medium ${getTrendColor(comparison.trends.completed.value, true)}`}>
                {formatTrend(comparison.trends.completed)}
              </span>
            </div>
          </div>

          {/* Sessões Canceladas */}
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Sessões Canceladas</p>
                <p className="text-sm text-gray-600">
                  {comparison.current.cancelled} esta semana
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(comparison.trends.cancelled.value)}
              <span className={`text-sm font-medium ${getTrendColor(comparison.trends.cancelled.value, false)}`}>
                {formatTrend(comparison.trends.cancelled)}
              </span>
            </div>
          </div>

          {/* Total de Sessões */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Total de Sessões</p>
                <p className="text-sm text-gray-600">
                  {comparison.current.total} esta semana
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(comparison.trends.total.value)}
              <span className={`text-sm font-medium ${getTrendColor(comparison.trends.total.value, true)}`}>
                {formatTrend(comparison.trends.total)}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="pt-2 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Semana anterior:</span>
                <span className="ml-2 font-medium">{comparison.previous.total} sessões</span>
              </div>
              <div>
                <span className="text-gray-600">Taxa de conclusão:</span>
                <span className="ml-2 font-medium">
                  {comparison.current.total > 0 
                    ? Math.round((comparison.current.completed / comparison.current.total) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyComparison;
