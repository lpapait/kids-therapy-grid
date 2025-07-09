
import React from 'react';
import { Button } from '@/components/ui/button';
import SessionPopover from './SessionPopover';
import { TherapistScheduleOverview } from '../../types/therapist-overview.types';

interface WeeklyGridProps {
  therapist: TherapistScheduleOverview;
  onSessionClick?: (sessionId: string) => void;
  onSlotClick?: (therapistId: string, date: Date, time: string) => void;
}

const WeeklyGrid: React.FC<WeeklyGridProps> = ({ 
  therapist, 
  onSessionClick, 
  onSlotClick 
}) => {
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Grade Semanal</h4>
      
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header with days */}
          <div className="grid grid-cols-6 gap-1 mb-1">
            <div className="text-xs font-medium text-gray-500 p-1"></div>
            {weekDays.map(day => (
              <div key={day} className="text-xs font-medium text-gray-500 text-center p-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Time slots and sessions */}
          {timeSlots.map((time, timeIndex) => (
            <div key={time} className="grid grid-cols-6 gap-1 mb-1">
              <div className="text-xs text-gray-500 p-1 text-right">
                {time}
              </div>
              
              {therapist.weeklyGrid.map((daySlots, dayIndex) => {
                const slot = daySlots[timeIndex];
                
                if (slot.isEmpty) {
                  return (
                    <Button
                      key={`${dayIndex}-${timeIndex}`}
                      variant="ghost"
                      className="h-8 p-1 border border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      onClick={() => onSlotClick?.(therapist.therapistId, slot.date, slot.time)}
                    >
                      <div className="text-xs text-gray-400">+</div>
                    </Button>
                  );
                }

                return (
                  <SessionPopover
                    key={`${dayIndex}-${timeIndex}`}
                    session={slot.session!}
                    time={slot.time}
                    therapistColor={therapist.color}
                    onSessionClick={onSessionClick}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyGrid;
