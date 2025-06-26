
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Child, TherapyCoverage } from '@/types';
import { Activity, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface TherapyCoveragePanelProps {
  child: Child;
  coverageData: TherapyCoverage[];
}

const TherapyCoveragePanel: React.FC<TherapyCoveragePanelProps> = ({ child, coverageData }) => {
  const getStatusIcon = (status: TherapyCoverage['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: TherapyCoverage['status']) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'missing':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Cobertura de Terapias</span>
        </CardTitle>
        <CardDescription>
          Acompanhamento das horas semanais de {child.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {coverageData.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Nenhuma terapia configurada</p>
          </div>
        ) : (
          coverageData.map((therapy) => (
            <div key={therapy.specialty} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(therapy.status)}
                  <span className="font-medium text-gray-900">
                    {therapy.specialty}
                  </span>
                </div>
                <Badge variant="secondary" className={getStatusColor(therapy.status)}>
                  {therapy.hoursScheduled}/{therapy.hoursRequired}h
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progresso</span>
                  <span>{therapy.percentage}%</span>
                </div>
                <Progress 
                  value={therapy.percentage} 
                  className="h-2"
                />
              </div>
              
              {therapy.status === 'partial' && (
                <p className="text-xs text-yellow-700">
                  Faltam {therapy.hoursRequired - therapy.hoursScheduled}h para completar
                </p>
              )}
              {therapy.status === 'missing' && (
                <p className="text-xs text-red-700">
                  Nenhuma sessão agendada
                </p>
              )}
            </div>
          ))
        )}
        
        {coverageData.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total configurado:</span>
              <span className="font-medium">
                {coverageData.reduce((sum, t) => sum + t.hoursRequired, 0)}h semanais
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total agendado:</span>
              <span className="font-medium">
                {coverageData.reduce((sum, t) => sum + t.hoursScheduled, 0)}h semanais
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapyCoveragePanel;
