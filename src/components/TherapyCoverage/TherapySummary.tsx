
import React from 'react';
import { TherapyCoverage } from '@/types';

interface TherapySummaryProps {
  coverageData: TherapyCoverage[];
}

const TherapySummary: React.FC<TherapySummaryProps> = ({ coverageData }) => {
  if (coverageData.length === 0) return null;

  const totalRequired = coverageData.reduce((sum, t) => sum + (t.hoursRequired || 0), 0);
  const totalScheduled = coverageData.reduce((sum, t) => sum + (t.hoursScheduled || 0), 0);

  return (
    <div className="pt-4 border-t">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Total configurado:</span>
        <span className="font-medium">{totalRequired}h semanais</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Total agendado:</span>
        <span className="font-medium">{totalScheduled}h semanais</span>
      </div>
    </div>
  );
};

export default TherapySummary;
