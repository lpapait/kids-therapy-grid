
import React from 'react';
import { Child, Therapist, TherapistWorkload, TherapyCoverage } from '@/types';
import TherapyCoveragePanel from '@/components/TherapyCoveragePanel';
import EnhancedTherapistWorkloadPanel from '@/components/EnhancedTherapistWorkloadPanel';
import WorkloadAlertsPanel from '@/components/WorkloadAlertsPanel';
import UtilizationReportPanel from '@/components/UtilizationReportPanel';

interface ScheduleSidebarProps {
  child: Child | null;
  coverageData: TherapyCoverage[];
  selectedTherapist: Therapist | null;
  therapistWorkload: TherapistWorkload | null;
  selectedWeek: Date;
  hasEditingSession: boolean;
  onQuickAction: (action: string) => void;
  onAlertClick: (therapistId: string) => void;
}

// Mock data for weekly trend - in a real app this would come from historical data
const generateMockWeeklyTrend = (therapistId: string): number[] => {
  // Generate 4 weeks of mock data based on therapist ID for consistency
  const seed = therapistId?.length || 1;
  return Array.from({ length: 4 }, (_, i) => {
    return Math.round((Math.sin(seed + i) * 10 + 70 + Math.random() * 20));
  });
};

const ScheduleSidebar: React.FC<ScheduleSidebarProps> = ({
  child,
  coverageData,
  selectedTherapist,
  therapistWorkload,
  selectedWeek,
  hasEditingSession,
  onQuickAction,
  onAlertClick
}) => {
  // Validação de dados
  const safeCoverageData = Array.isArray(coverageData) ? coverageData : [];
  const weeklyTrend = selectedTherapist?.id ? generateMockWeeklyTrend(selectedTherapist.id) : [];

  return (
    <div className="lg:col-span-1 space-y-4">
      <TherapyCoveragePanel
        child={child}
        coverageData={safeCoverageData}
      />
      
      {hasEditingSession && selectedTherapist && (
        <EnhancedTherapistWorkloadPanel
          therapist={selectedTherapist}
          workloadData={therapistWorkload}
          weeklyTrend={weeklyTrend}
          onQuickAction={onQuickAction}
        />
      )}

      <WorkloadAlertsPanel
        selectedWeek={selectedWeek}
        onAlertClick={onAlertClick}
      />

      <UtilizationReportPanel
        selectedWeek={selectedWeek}
      />
    </div>
  );
};

export default ScheduleSidebar;
