
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface WorkloadSummaryProps {
  totalSessions: number;
  totalHours: number;
}

const WorkloadSummary: React.FC<WorkloadSummaryProps> = ({
  totalSessions,
  totalHours
}) => {
  return (
    <Badge variant="secondary" className="text-sm">
      {totalSessions} sessões totais • {totalHours.toFixed(1)}h
    </Badge>
  );
};

export default WorkloadSummary;
