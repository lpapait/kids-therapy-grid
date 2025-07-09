
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useTeamWorkload } from '@/hooks/useTeamWorkload';
import TherapistWorkloadItem from './TherapistWorkloadItem';
import WorkloadSummary from './WorkloadSummary';

interface TherapistWorkloadDistributionProps {
  selectedWeek: Date;
  onViewTherapist?: (therapistId: string) => void;
}

const TherapistWorkloadDistribution: React.FC<TherapistWorkloadDistributionProps> = ({
  selectedWeek,
  onViewTherapist
}) => {
  const workloadData = useTeamWorkload(selectedWeek);
  const navigate = useNavigate();

  const handleViewTherapist = (therapistId: string) => {
    if (onViewTherapist) {
      onViewTherapist(therapistId);
    } else {
      navigate('/therapist-agenda', { state: { selectedTherapist: therapistId, selectedWeek } });
    }
  };

  // Calcular totais da equipe
  const totalSessions = workloadData.reduce((sum, therapist) => 
    sum + therapist.sessionsCount, 0
  );

  const totalHours = workloadData.reduce((sum, therapist) => 
    sum + therapist.hoursScheduled, 0
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Distribuição de Carga por Terapeuta</span>
          </div>
          <WorkloadSummary totalSessions={totalSessions} totalHours={totalHours} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {workloadData.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Nenhum terapeuta com carga horária na semana</p>
          </div>
        ) : (
          workloadData.map((therapist) => (
            <TherapistWorkloadItem
              key={therapist.therapistId}
              therapistId={therapist.therapistId}
              hoursScheduled={therapist.hoursScheduled}
              maxHours={therapist.maxHours}
              percentage={therapist.percentage}
              status={therapist.status}
              remainingHours={therapist.remainingHours}
              sessionsCount={therapist.sessionsCount}
              onViewTherapist={handleViewTherapist}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistWorkloadDistribution;
