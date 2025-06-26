
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { addWeeks, subWeeks } from 'date-fns';
import { formatWeekRange } from '@/lib/dateUtils';

interface WeekSelectorProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({ selectedWeek, onWeekChange }) => {
  const handlePreviousWeek = () => {
    onWeekChange(subWeeks(selectedWeek, 1));
  };

  const handleNextWeek = () => {
    onWeekChange(addWeeks(selectedWeek, 1));
  };

  const handleCurrentWeek = () => {
    onWeekChange(new Date());
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-lg border p-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Semana: {formatWeekRange(selectedWeek)}
          </h2>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCurrentWeek}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          Semana Atual
        </Button>
        <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeekSelector;
