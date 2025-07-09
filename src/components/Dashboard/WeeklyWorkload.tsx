
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface WeeklyWorkloadProps {
  hoursScheduled: number;
  maxHours: number;
}

const WeeklyWorkload: React.FC<WeeklyWorkloadProps> = ({ hoursScheduled, maxHours }) => {
  const percentage = Math.round((hoursScheduled / maxHours) * 100);
  const remainingHours = Math.max(0, maxHours - hoursScheduled);

  const getStatusColor = () => {
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    if (percentage >= 100) return <AlertTriangle className="h-5 w-5 text-red-600" />;
    if (percentage >= 80) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <TrendingUp className="h-5 w-5 text-green-600" />;
  };

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusMessage = () => {
    if (percentage >= 100) return 'Carga horária excedida';
    if (percentage >= 80) return 'Próximo ao limite semanal';
    return 'Carga horária saudável';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Minha Carga Semanal</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {hoursScheduled.toFixed(1)}h / {maxHours}h
              </div>
              <div className={`text-sm font-medium ${getStatusColor()}`}>
                {percentage}% da capacidade
              </div>
            </div>
            {getStatusIcon()}
          </div>

          <div className="space-y-2">
            <Progress 
              value={Math.min(percentage, 100)} 
              className="h-3"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{getStatusMessage()}</span>
              <span>{remainingHours.toFixed(1)}h restantes</span>
            </div>
          </div>

          {percentage >= 90 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800 font-medium">
                  Atenção: Você está próximo do limite semanal
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyWorkload;
