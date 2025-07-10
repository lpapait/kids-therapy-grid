
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, TrendingUp, Users, AlertTriangle } from 'lucide-react';

interface AdministrativeStats {
  totalAdminHours: number;
  requiredAdminHours: number;
  completionPercentage: number;
  therapistsWithDeficit: number;
  averageAdminTime: number;
  mostCommonActivity: string;
  upcomingDeadlines: number;
}

interface AdministrativeStatsPanelProps {
  stats: AdministrativeStats;
  onViewDetails?: () => void;
}

const AdministrativeStatsPanel: React.FC<AdministrativeStatsPanelProps> = ({
  stats,
  onViewDetails
}) => {
  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="border-purple-200 bg-purple-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <FileText className="h-5 w-5" />
          Estatísticas Administrativas
        </CardTitle>
        <CardDescription>
          Acompanhamento das atividades administrativas da equipe
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progresso geral */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Cumprimento de Carga Administrativa</span>
            <span className={`text-sm font-bold ${getCompletionColor(stats.completionPercentage)}`}>
              {stats.completionPercentage}%
            </span>
          </div>
          <div className="relative">
            <Progress value={stats.completionPercentage} className="h-2" />
            <div 
              className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(stats.completionPercentage)}`}
              style={{ width: `${Math.min(stats.completionPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{stats.totalAdminHours}h realizadas</span>
            <span>{stats.requiredAdminHours}h necessárias</span>
          </div>
        </div>

        {/* Estatísticas em grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="h-3 w-3" />
              <span>Terapeutas em déficit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{stats.therapistsWithDeficit}</span>
              {stats.therapistsWithDeficit > 0 && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Atenção
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-3 w-3" />
              <span>Média semanal</span>
            </div>
            <div className="text-lg font-bold">
              {stats.averageAdminTime.toFixed(1)}h
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <TrendingUp className="h-3 w-3" />
              <span>Atividade mais comum</span>
            </div>
            <div className="text-sm font-medium truncate">
              {stats.mostCommonActivity}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <AlertTriangle className="h-3 w-3" />
              <span>Próximos prazos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{stats.upcomingDeadlines}</span>
              {stats.upcomingDeadlines > 0 && (
                <Badge variant="outline" className="text-xs">
                  Esta semana
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Ação */}
        {onViewDetails && (
          <div className="pt-2 border-t">
            <button
              onClick={onViewDetails}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Ver relatório detalhado →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdministrativeStatsPanel;
