
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp } from 'lucide-react';
import { useTeamWorkload } from '@/hooks/useTeamWorkload';
import { useData } from '@/contexts/DataContext';

interface TherapistRankingProps {
  selectedWeek: Date;
}

const TherapistRanking: React.FC<TherapistRankingProps> = ({ selectedWeek }) => {
  const workloadData = useTeamWorkload(selectedWeek);
  const { therapists } = useData();

  const rankedTherapists = workloadData
    .map(workload => {
      const therapist = therapists.find(t => t.id === workload.therapistId);
      return {
        ...workload,
        name: therapist?.name || 'Nome não encontrado'
      };
    })
    .sort((a, b) => b.hoursScheduled - a.hoursScheduled)
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-green-600" />
          <span>Terapeutas Mais Ativos</span>
        </CardTitle>
        <CardDescription>Ranking por horas agendadas nesta semana</CardDescription>
      </CardHeader>
      <CardContent>
        {rankedTherapists.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma atividade registrada para esta semana</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide pb-2 border-b">
              <div>Terapeuta</div>
              <div className="text-center">Sessões</div>
              <div className="text-center">Carga Usada</div>
              <div>Utilização</div>
            </div>
            
            {rankedTherapists.map((therapist, index) => (
              <div key={therapist.therapistId} className="grid grid-cols-4 gap-4 items-center py-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900 truncate">
                    {therapist.name}
                  </span>
                </div>
                
                <div className="text-center">
                  <span className="font-medium">{therapist.sessionsCount}</span>
                </div>
                
                <div className="text-center">
                  <span className="text-sm">
                    {therapist.hoursScheduled.toFixed(1)}h/{therapist.maxHours}h
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      therapist.percentage >= 90 ? 'text-red-600' :
                      therapist.percentage >= 80 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {therapist.percentage}%
                    </span>
                    {therapist.percentage >= 80 && (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        therapist.percentage >= 90 ? 'bg-red-500' :
                        therapist.percentage >= 80 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(therapist.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistRanking;
