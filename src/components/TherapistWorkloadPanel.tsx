
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { TherapistWorkload, Therapist } from '@/types';

interface TherapistWorkloadPanelProps {
  therapist: Therapist | null;
  workloadData: TherapistWorkload | null;
}

const TherapistWorkloadPanel: React.FC<TherapistWorkloadPanelProps> = ({ 
  therapist, 
  workloadData 
}) => {
  if (!therapist || !workloadData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Carga Horária</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center">
            Selecione um terapeuta para ver a carga horária
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: TherapistWorkload['status']) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'near_limit':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'overloaded':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: TherapistWorkload['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'near_limit':
        return <AlertTriangle className="h-4 w-4" />;
      case 'overloaded':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: TherapistWorkload['status']) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'near_limit':
        return 'Próximo do Limite';
      case 'overloaded':
        return 'Sobrecarregado';
      default:
        return 'Normal';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-sm">
          <div 
            className="w-4 h-4 rounded-full border" 
            style={{ backgroundColor: therapist.color }}
          />
          <User className="h-4 w-4 text-blue-600" />
          <span>Carga Horária - {therapist.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge className={`${getStatusColor(workloadData.status)} flex items-center space-x-1`}>
            {getStatusIcon(workloadData.status)}
            <span>{getStatusText(workloadData.status)}</span>
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Horas Agendadas</span>
            <span className="font-medium">
              {workloadData.hoursScheduled}h / {workloadData.maxHours}h
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={Math.min(workloadData.percentage, 100)} 
              className="h-2"
            />
            <div 
              className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(workloadData.percentage)}`}
              style={{ width: `${Math.min(workloadData.percentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-center text-gray-600">
            {workloadData.percentage}% da carga semanal
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          {workloadData.status === 'available' && (
            <div className="flex items-center justify-between text-green-600">
              <span>Horas Disponíveis:</span>
              <span className="font-medium">{workloadData.remainingHours}h</span>
            </div>
          )}
          
          {workloadData.status === 'near_limit' && (
            <div className="flex items-center justify-between text-yellow-600">
              <span>Próximo do Limite:</span>
              <span className="font-medium">{workloadData.remainingHours}h restantes</span>
            </div>
          )}
          
          {workloadData.status === 'overloaded' && (
            <div className="flex items-center justify-between text-red-600">
              <span>Excesso:</span>
              <span className="font-medium">+{workloadData.hoursScheduled - workloadData.maxHours}h</span>
            </div>
          )}
        </div>

        {/* Alert Messages */}
        {workloadData.status === 'near_limit' && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
            ⚠️ Terapeuta próximo do limite semanal
          </div>
        )}
        
        {workloadData.status === 'overloaded' && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            🚨 Terapeuta com carga horária excedida
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistWorkloadPanel;
