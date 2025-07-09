
import React from 'react';
import { Calendar } from 'lucide-react';

interface WeeklyGridValidationProps {
  selectedWeek: Date | null;
}

const WeeklyGridValidation: React.FC<WeeklyGridValidationProps> = ({ selectedWeek }) => {
  if (!selectedWeek) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="text-center text-gray-500">
          <Calendar className="h-8 w-8 mx-auto mb-2" />
          <p>Semana não selecionada</p>
        </div>
      </div>
    );
  }

  return null;
};

export default WeeklyGridValidation;
