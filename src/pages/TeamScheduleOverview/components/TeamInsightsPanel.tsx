
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  Clock,
  Target,
  Calendar,
  Activity
} from 'lucide-react';

interface TeamInsightsPanelProps {
  insights: {
    overloadedTherapists: string[];
    availableTherapists: { id: string; name: string; availableHours: number }[];
    topSpecialties: { specialty: string; count: number; percentage: number }[];
    pendingGoals: number;
    totalSessions: number;
    totalAvailableSlots: number;
  };
  onRedistributeLoad?: () => void;
  onFindAvailableSlots?: () => void;
}

const TeamInsightsPanel: React.FC<TeamInsightsPanelProps> = ({
  insights,
  onRedistributeLoad,
  onFindAvailableSlots
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Estatísticas Gerais */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            Visão Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total de Sessões</span>
              <span className="font-semibold text-lg">{insights.totalSessions}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Slots Disponíveis</span>
              <span className="font-semibold text-lg text-green-600">
                {insights.totalAvailableSlots}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Metas Pendentes</span>
              <span className="font-semibold text-lg text-orange-600">
                {insights.pendingGoals}h
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terapeutas Sobrecarregados */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            Sobrecarregados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.overloadedTherapists.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-2">
                Nenhum terapeuta sobrecarregado
              </div>
            ) : (
              <>
                {insights.overloadedTherapists.slice(0, 3).map(name => (
                  <Badge key={name} variant="destructive" className="w-full justify-center">
                    {name}
                  </Badge>
                ))}
                
                {insights.overloadedTherapists.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{insights.overloadedTherapists.length - 3} outros
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={onRedistributeLoad}
                >
                  Redistribuir Carga
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Terapeutas Disponíveis */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Mais Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.availableTherapists.slice(0, 3).map(therapist => (
              <div key={therapist.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm font-medium text-green-900">
                  {therapist.name.split(' ')[0]}
                </span>
                <span className="text-xs text-green-700 font-medium">
                  {therapist.availableHours}h livres
                </span>
              </div>
            ))}
            
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-2"
              onClick={onFindAvailableSlots}
            >
              Ver Todos os Slots
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Top Especialidades */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            Top Especialidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.topSpecialties.slice(0, 3).map(specialty => (
              <div key={specialty.specialty} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {specialty.specialty}
                  </span>
                  <span className="text-xs text-gray-500">
                    {specialty.count} ({specialty.percentage}%)
                  </span>
                </div>
                <Progress value={specialty.percentage} className="h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamInsightsPanel;
