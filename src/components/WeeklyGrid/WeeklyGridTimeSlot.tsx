
import React from 'react';
import { Clock } from 'lucide-react';

interface WeeklyGridTimeSlotProps {
  time: string;
}

const WeeklyGridTimeSlot: React.FC<WeeklyGridTimeSlotProps> = ({ time }) => {
  return (
    <div className="bg-gray-50 border-b border-r p-3 text-sm font-medium text-gray-900 flex items-center">
      <Clock className="h-4 w-4 mr-2 text-gray-500" />
      <div className="text-center">
        {time}
      </div>
    </div>
  );
};

export default WeeklyGridTimeSlot;
