
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface CalendarDayCellProps {
  date: Date;
  dayData: {
    date: Date;
    sessions: Array<{
      id: string;
      time: string;
      childName: string;
      therapistName: string;
      activity: string;
      status: string;
      color: string;
    }>;
    hasConflicts: boolean;
    sessionCount: number;
  };
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: () => void;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  dayData,
  isCurrentMonth,
  isToday,
  onClick
}) => {
  const { sessions, hasConflicts, sessionCount } = dayData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'rescheduled':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div
      className={cn(
        "min-h-[120px] p-2 bg-background border cursor-pointer transition-colors hover:bg-muted/50",
        !isCurrentMonth && "text-muted-foreground bg-muted/20",
        isToday && "bg-primary/5 border-primary/20"
      )}
      onClick={onClick}
    >
      {/* Day Number */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            "text-sm font-medium",
            isToday && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs"
          )}
        >
          {format(date, 'd')}
        </span>
        
        {hasConflicts && (
          <AlertTriangle className="h-3 w-3 text-red-500" />
        )}
      </div>

      {/* Session Count Badge */}
      {sessionCount > 0 && (
        <Badge
          variant="secondary"
          className="text-xs mb-2 w-full justify-center"
        >
          {sessionCount} sessão{sessionCount !== 1 ? 'ões' : ''}
        </Badge>
      )}

      {/* Session Dots */}
      <div className="space-y-1">
        {sessions.slice(0, 3).map((session) => (
          <div
            key={session.id}
            className="flex items-center space-x-1"
          >
            <div
              className={cn(
                "w-2 h-2 rounded-full flex-shrink-0",
                getStatusColor(session.status)
              )}
              style={{ backgroundColor: session.color }}
            />
            <span className="text-xs truncate flex-1">
              {session.time}
            </span>
          </div>
        ))}
        
        {sessions.length > 3 && (
          <div className="text-xs text-muted-foreground text-center">
            +{sessions.length - 3} mais
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDayCell;
