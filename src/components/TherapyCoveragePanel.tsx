
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Child, TherapyCoverage } from '@/types';
import { Activity, Clock } from 'lucide-react';
import TherapyFilterControls from '@/components/TherapyCoverage/TherapyFilterControls';
import TherapyListContent from '@/components/TherapyCoverage/TherapyListContent';
import TherapySummary from '@/components/TherapyCoverage/TherapySummary';
import TherapyDistributionChart from '@/components/TherapyCoverage/TherapyDistributionChart';
import { useTherapyDistribution } from '@/hooks/useTherapyDistribution';

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

  // Get distribution data for the chart
  const distributionData = useTherapyDistribution(coverageData);

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

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>Cobertura de Terapias</span>
          </CardTitle>
          <CardDescription>
            Acompanhamento das horas semanais de {child.name}
          </CardDescription>
          
          <TherapyFilterControls
            showOnlyPending={showOnlyPending}
            onFilterChange={handleCheckboxChange}
            pendingCount={pendingCount}
            totalCount={coverageData.length}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <TherapyListContent
            filteredCoverageData={filteredCoverageData}
            showOnlyPending={showOnlyPending}
            hasData={coverageData.length > 0}
            child={child}
            selectedWeek={selectedWeek}
            onScheduleCreated={onScheduleCreated}
          />
          
          <TherapySummary coverageData={coverageData} />
        </CardContent>
      </Card>
      
      {/* Gráfico de Distribuição de Terapias */}
      {distributionData.length > 0 && (
        <TherapyDistributionChart data={distributionData} />
      )}
    </div>
  );
};

export default TherapyCoveragePanel;
