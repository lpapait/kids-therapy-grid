
import React from 'react';
import { useTherapistAgendaContext } from '../../context/TherapistAgendaContext';
import { useCalendarData } from '../../hooks/useCalendarData';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarDayView from './CalendarDayView';
import CalendarFilters from './CalendarFilters';
import { Card } from '@/components/ui/card';

const CalendarView: React.FC = () => {
  const { state, dispatch } = useTherapistAgendaContext();
  const { calendar } = state;

  const calendarData = useCalendarData(
    calendar.selectedDate,
    calendar.calendarFilters.therapistIds,
    calendar.calendarFilters.activityTypes,
    calendar.calendarFilters.statusFilter
  );

  const handleDateSelect = (date: Date) => {
    dispatch({ type: 'SET_CALENDAR_DATE', payload: date });
  };

  const handleDayClick = (date: Date) => {
    dispatch({ type: 'SET_SELECTED_DAY', payload: date });
  };

  const handleCloseDayView = () => {
    dispatch({ type: 'SET_SELECTED_DAY', payload: undefined });
  };

  const handleFilterChange = (filters: any) => {
    dispatch({ type: 'UPDATE_CALENDAR_FILTERS', payload: filters });
  };

  if (calendar.showDayView && calendar.selectedDay) {
    return (
      <CalendarDayView
        selectedDay={calendar.selectedDay}
        onClose={handleCloseDayView}
        calendarData={calendarData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header with Navigation */}
      <CalendarHeader
        selectedDate={calendar.selectedDate}
        onDateChange={handleDateSelect}
        monthStats={calendarData.monthStats}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <CalendarFilters
            filters={calendar.calendarFilters}
            onChange={handleFilterChange}
            monthStats={calendarData.monthStats}
          />
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <CalendarGrid
              selectedDate={calendar.selectedDate}
              calendarData={calendarData}
              onDayClick={handleDayClick}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
