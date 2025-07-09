
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import TherapistCardHeader from './TherapistCard/TherapistCardHeader';
import WorkloadDisplay from './TherapistCard/WorkloadDisplay';
import WeeklyGrid from './TherapistCard/WeeklyGrid';
import { TherapistOverviewCardProps } from '../types/therapist-overview.types';

const TherapistOverviewCard: React.FC<TherapistOverviewCardProps> = ({
  therapist,
  onSessionClick,
  onSlotClick
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <TherapistCardHeader therapist={therapist} />
        <WorkloadDisplay therapist={therapist} />
      </CardHeader>

      <CardContent className="pt-0">
        <WeeklyGrid 
          therapist={therapist}
          onSessionClick={onSessionClick}
          onSlotClick={onSlotClick}
        />
      </CardContent>
    </Card>
  );
};

export default TherapistOverviewCard;
