
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Child, TherapyCoverage } from '@/types';
import { Activity, Clock, CheckCircle, AlertTriangle, XCircle, Filter } from 'lucide-react';
import { ScheduleSuggestionButton } from '@/components/ScheduleSuggestion';

interface TherapyCoveragePanelProps {
  child: Child | null;
  coverageData: TherapyCoverage[];
  selectedWeek?: Date;
  onScheduleCreated?: () => void;
}

const TherapyCoveragePanel: React.FC<TherapyCoveragePanelProps> = ({ 
  child, 
  coverageData, 
  selectedWeek = new Date(),
  onScheduleCreated = () => {}
}) => {
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  // Filter therapies based on checkbox state
  const filteredCoverageData = useMemo(() => {
    const safeCoverageData = Array.isArray(coverageData) ? coverageData : [];
    if (!showOnlyPending) return safeCoverageData;
    
    return safeCoverageData.filter(therapy => 
      therapy.status === 'partial' || therapy.status === 'missing'
    );
  }, [coverageData, showOnlyPending]);

  // Count pending therapies
  const pendingCount = useMemo(() => {
    const safeCoverageData = Array.isArray(coverageData) ? coverageData : [];
    return safeCoverageData.filter(therapy => 
      therapy.status === 'partial' || therapy.status === 'missing'
    ).length;
  }, [coverageData]);

  // Handle checkbox change with proper type conversion
  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setShowOnlyPending(checked === true);
  };

  // Validação de segurança para child
  if (!child) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>Cobertura de Terapias</span>
          </CardTitle>
          <CardDescription>
            Selecione uma criança para visualizar a cobertura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Nenhuma criança selecionada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: TherapyCoverage['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
        
        {/* Filtro de terapias pendentes */}
        {coverageData.length > 0 && (
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="show-pending-only"
              checked={showOnlyPending}
              onCheckedChange={handleCheckboxChange}
            />
            <label 
              htmlFor="show-pending-only" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center space-x-1"
            >
              <Filter className="h-3 w-3" />
              <span>Mostrar apenas terapias pendentes</span>
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {pendingCount} pendentes
                </Badge>
              )}
            </label>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredCoverageData.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>
              {showOnlyPending && coverageData.length > 0 
                ? 'Todas as terapias estão completas' 
                : 'Nenhuma terapia configurada'
              }
            </p>
          </div>
        ) : (
          filteredCoverageData.map((therapy) => (
            <div key={therapy.specialty} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(therapy.status)}
                  <span className="font-medium text-gray-900">
                    {therapy.specialty || 'Especialidade não definida'}
                  </span>
                </div>
                <Badge variant="secondary" className={getStatusColor(therapy.status)}>
                  {therapy.hoursScheduled || 0}/{therapy.hoursRequired || 0}h
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progresso</span>
                  <span>{therapy.percentage || 0}%</span>
                </div>
                <Progress 
                  value={therapy.percentage || 0} 
                  className="h-2"
                />
              </div>
              
              {therapy.status === 'partial' && (
                <p className="text-xs text-yellow-700">
                  Faltam {(therapy.hoursRequired || 0) - (therapy.hoursScheduled || 0)}h para completar
                </p>
              )}
              {therapy.status === 'missing' && (
                <p className="text-xs text-red-700">
                  Nenhuma sessão agendada
                </p>
              )}
              
              <ScheduleSuggestionButton
                child={child}
                therapy={therapy}
                selectedWeek={selectedWeek}
                onScheduleCreated={onScheduleCreated}
              />
            </div>
          ))
        )}
        
        {coverageData.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total configurado:</span>
              <span className="font-medium">
                {coverageData.reduce((sum, t) => sum + (t.hoursRequired || 0), 0)}h semanais
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total agendado:</span>
              <span className="font-medium">
                {coverageData.reduce((sum, t) => sum + (t.hoursScheduled || 0), 0)}h semanais
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapyCoveragePanel;
