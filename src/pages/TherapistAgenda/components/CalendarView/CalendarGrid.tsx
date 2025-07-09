
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import CalendarDayCell from './CalendarDayCell';

interface CalendarGridProps {
  selectedDate: Date;
  calendarData: {
    days: Array<{
      date: Date;
      sessions: any[];
      hasConflicts: boolean;
      sessionCount: number;
    }>;
  };
  onDayClick: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  selectedDate,
  calendarData,
  onDayClick
}) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDayData = (date: Date) => {
    return calendarData.days.find(day => isSameDay(day.date, date)) || {
      date,
      sessions: [],
      hasConflicts: false,
      sessionCount: 0
    };
  };

  return (
    <div className="w-full">
      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-px mb-2">
        {weekDays.map(day => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground bg-muted/30"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-border">
        {calendarDays.map(date => {
          const dayData = getDayData(date);
          const isCurrentMonth = isSameMonth(date, selectedDate);
          const isCurrentDay = isToday(date);

          return (
            <CalendarDayCell
              key={date.toISOString()}
              date={date}
              dayData={dayData}
              isCurrentMonth={isCurrentMonth}
              isToday={isCurrentDay}
              onClick={() => onDayClick(date)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
