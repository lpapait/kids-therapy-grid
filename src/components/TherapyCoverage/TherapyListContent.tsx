
import React from 'react';
import { Child, TherapyCoverage } from '@/types';
import TherapyItem from './TherapyItem';
import TherapyEmptyState from './TherapyEmptyState';

interface TherapyListContentProps {
  filteredCoverageData: TherapyCoverage[];
  showOnlyPending: boolean;
  hasData: boolean;
  child: Child;
  selectedWeek: Date;
  onScheduleCreated: () => void;
}

const TherapyListContent: React.FC<TherapyListContentProps> = ({
  filteredCoverageData,
  showOnlyPending,
  hasData,
  child,
  selectedWeek,
  onScheduleCreated
}) => {
  if (filteredCoverageData.length === 0) {
    return (
      <TherapyEmptyState 
        showOnlyPending={showOnlyPending}
        hasData={hasData}
      />
    );
  }

  return (
    <div className="space-y-4">
      {filteredCoverageData.map((therapy) => (
        <TherapyItem
          key={therapy.specialty}
          therapy={therapy}
          child={child}
          selectedWeek={selectedWeek}
          onScheduleCreated={onScheduleCreated}
        />
      ))}
    </div>
  );
};

export default TherapyListContent;
