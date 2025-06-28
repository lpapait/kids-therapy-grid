
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, CheckCircle, User, Plus, Calendar, RotateCcw } from 'lucide-react';
import { TherapistWorkload, Therapist } from '@/types';

interface TherapistWorkloadPanelProps {
  therapist: Therapist | null;
  workloadData: TherapistWorkload | null;
  onQuickAction?: (action: string) => void;
}

const TherapistWorkloadPanel: React.FC<TherapistWorkloadPanelProps> = ({ 
  therapist, 
  workloadData,
  onQuickAction = () => {}
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

  const getProgressGradient = (percentage: number) => {
    if (percentage >= 100) {
      return 'bg-gradient-to-r from-red-400 to-red-600';
    } else if (percentage >= 80) {
      return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    }
    return 'bg-gradient-to-r from-green-400 to-blue-500';
  };

  return (
    <Card className="border-l-4" style={{ borderLeftColor: therapist.color }}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-sm">
          <div 
            className="w-4 h-4 rounded-full border shadow-sm" 
            style={{ backgroundColor: therapist.color }}
          />
          <User className="h-4 w-4 text-blue-600" />
          <span>Carga Horária - {therapist.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enhanced Status Badge */}
        <div className="flex justify-center">
          <Badge className={`${getStatusColor(workloadData.status)} flex items-center space-x-1 px-3 py-1`}>
            {getStatusIcon(workloadData.status)}
            <span>{getStatusText(workloadData.status)}</span>
          </Badge>
        </div>

        {/* Enhanced Progress Bar with Gradient */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Horas Agendadas</span>
            <span className="font-medium">
              {workloadData.hoursScheduled}h / {workloadData.maxHours}h
            </span>
          </div>
          <div className="relative bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getProgressGradient(workloadData.percentage)}`}
              style={{ width: `${Math.min(workloadData.percentage, 100)}%` }}
            />
            {workloadData.percentage > 100 && (
              <div className="absolute top-0 right-0 h-3 w-2 bg-red-600 rounded-r-full animate-pulse" />
            )}
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">
              {workloadData.percentage}% da carga semanal
            </span>
            {workloadData.percentage > 100 && (
              <span className="text-red-600 font-medium animate-pulse">
                Sobrecarga!
              </span>
            )}
          </div>
        </div>

        {/* Enhanced Details with Better Visual Hierarchy */}
        <div className="space-y-3 text-sm">
          {workloadData.status === 'available' && (
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
              <span className="text-green-700 font-medium">Horas Disponíveis:</span>
              <span className="text-green-800 font-bold">{workloadData.remainingHours.toFixed(1)}h</span>
            </div>
          )}
          
          {workloadData.status === 'near_limit' && (
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-yellow-700 font-medium">Próximo do Limite:</span>
              <span className="text-yellow-800 font-bold">{workloadData.remainingHours.toFixed(1)}h restantes</span>
            </div>
          )}
          
          {workloadData.status === 'overloaded' && (
            <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-200">
              <span className="text-red-700 font-medium">Excesso:</span>
              <span className="text-red-800 font-bold">+{(workloadData.hoursScheduled - workloadData.maxHours).toFixed(1)}h</span>
            </div>
          )}
        </div>

        {/* Smart Suggestions */}
        {workloadData.suggestedActions && workloadData.suggestedActions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Sugestões Inteligentes</h4>
            <div className="space-y-1">
              {workloadData.suggestedActions.map((suggestion, index) => (
                <div key={index} className="text-xs text-gray-600 bg-blue-50 p-2 rounded border-l-2 border-blue-300">
                  💡 {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Ações Rápidas</h4>
          <div className="grid grid-cols-2 gap-2">
            {workloadData.status === 'available' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-8"
                  onClick={() => onQuickAction('add_session')}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Nova Sessão
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-8"
                  onClick={() => onQuickAction('view_schedule')}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Ver Agenda
                </Button>
              </>
            )}
            
            {workloadData.status === 'overloaded' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-8 text-orange-600 border-orange-300"
                  onClick={() => onQuickAction('redistribute')}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Redistribuir
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-8"
                  onClick={() => onQuickAction('view_schedule')}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  Ver Agenda
                </Button>
              </>
            )}
            
            {workloadData.status === 'near_limit' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-8 col-span-2"
                onClick={() => onQuickAction('view_schedule')}
              >
                <Calendar className="h-3 w-3 mr-1" />
                Revisar Planejamento
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Alert Messages with Animation */}
        {workloadData.status === 'near_limit' && (
          <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg text-xs text-yellow-700 animate-pulse">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">Atenção: Terapeuta próximo do limite semanal</span>
            </div>
          </div>
        )}
        
        {workloadData.status === 'overloaded' && (
          <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg text-xs text-red-700 animate-pulse">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-medium">Alerta: Carga horária excedida - Ação necessária</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistWorkloadPanel;
