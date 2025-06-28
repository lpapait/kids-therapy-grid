
import React from 'react';
import { Child, Therapist, TherapistWorkload, TherapyCoverage } from '@/types';
import TherapyCoveragePanel from '@/components/TherapyCoveragePanel';
import TherapistWorkloadPanel from '@/components/TherapistWorkloadPanel';
import WorkloadAlertsPanel from '@/components/WorkloadAlertsPanel';
import UtilizationReportPanel from '@/components/UtilizationReportPanel';

interface ScheduleSidebarProps {
  child: Child;
  coverageData: TherapyCoverage[];
  selectedTherapist: Therapist | null;
  therapistWorkload: TherapistWorkload | null;
  selectedWeek: Date;
  hasEditingSession: boolean;
  onQuickAction: (action: string) => void;
  onAlertClick: (therapistId: string) => void;
}

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
  return (
    <div className="lg:col-span-1 space-y-4">
      <TherapyCoveragePanel
        child={child}
        coverageData={coverageData}
      />
      
      {hasEditingSession && (
        <TherapistWorkloadPanel
          therapist={selectedTherapist}
          workloadData={therapistWorkload}
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
