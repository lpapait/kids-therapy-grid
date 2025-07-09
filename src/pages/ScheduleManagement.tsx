import React from 'react';
import ScheduleErrorBoundary from '@/components/ScheduleManagement/ScheduleErrorBoundary';
import ScheduleManagementLayout from '@/components/ScheduleManagement/ScheduleManagementLayout';

const ScheduleManagement = () => {
  return (
    <ScheduleErrorBoundary>
      <ScheduleManagementLayout />
    </ScheduleErrorBoundary>
  );
};

export default ScheduleManagement;
