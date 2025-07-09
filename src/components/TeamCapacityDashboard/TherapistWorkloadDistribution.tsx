
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useOptimizedWorkload } from '@/hooks/useOptimizedWorkload';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, AlertTriangle, XCircle, Eye } from 'lucide-react';

interface TherapistWorkloadDistributionProps {
  selectedWeek: Date;
  onViewTherapist?: (therapistId: string) => void;
}

const TherapistWorkloadDistribution: React.FC<TherapistWorkloadDistributionProps> = ({
  selectedWeek,
  onViewTherapist
}) => {
  const { therapists } = useData();
  const workloadData = useOptimizedWorkload(selectedWeek);
  const navigate = useNavigate();

  const handleViewTherapist = (therapistId: string) => {
    if (onViewTherapist) {
      onViewTherapist(therapistId);
    } else {
      // Navegar para a página de agenda do terapeuta
      navigate('/therapist-agenda', { state: { selectedTherapist: therapistId, selectedWeek } });
    }
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage > 100) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    } else if (percentage > 80) {
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    } else {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage > 100) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (percentage > 80) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage > 100) {
      return 'bg-red-500';
    } else if (percentage > 80) {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  };

  // Calcular totais da equipe
  const totalSessions = workloadData.reduce((sum, therapist) => 
    sum + (therapist.sessionsCount || 0), 0
  );

  const totalHours = workloadData.reduce((sum, therapist) => 
    sum + (therapist.hoursScheduled || 0), 0
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Distribuição de Carga por Terapeuta</span>
          </div>
          <Badge variant="secondary" className="text-sm">
            {totalSessions} sessões totais • {totalHours.toFixed(1)}h
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {workloadData.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Nenhum terapeuta com carga horária na semana</p>
          </div>
        ) : (
          workloadData.map((therapist) => {
            const therapistInfo = therapists.find(t => t.id === therapist.therapistId);
            const percentage = therapist.percentage || 0;
            
            return (
              <div key={therapist.therapistId} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(percentage)}
                    <div>
                      <button
                        onClick={() => handleViewTherapist(therapist.therapistId)}
                        className="text-left hover:text-blue-600 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 hover:underline">
                          {therapistInfo?.name || 'Terapeuta não encontrado'}
                        </h4>
                      </button>
                      <p className="text-sm text-gray-600">
                        {therapist.hoursScheduled?.toFixed(1) || 0}h / {therapist.maxHours || 0}h semanais
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={getStatusColor(percentage)}>
                      {percentage.toFixed(0)}%
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewTherapist(therapist.therapistId)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Capacidade utilizada</span>
                    <span>{therapist.sessionsCount || 0} sessões</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-2"
                    />
                    {percentage > 100 && (
                      <div className="absolute top-0 left-0 h-2 bg-red-500 rounded-full opacity-75"
                           style={{ width: `${Math.min((percentage - 100) / 100 * 100, 100)}%` }} />
                    )}
                  </div>
                </div>
                
                {therapist.status === 'overloaded' && (
                  <div className="flex items-center space-x-2 text-sm text-red-700 bg-red-50 p-2 rounded">
                    <XCircle className="h-4 w-4" />
                    <span>Sobrecarga detectada - considere redistribuir sessões</span>
                  </div>
                )}
                
                {therapist.remainingHours && therapist.remainingHours > 0 && (
                  <p className="text-sm text-green-700">
                    {therapist.remainingHours.toFixed(1)}h disponíveis para mais sessões
                  </p>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistWorkloadDistribution;
