
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { getDayName } from '@/lib/dateUtils';

interface WeeklyGridHeaderProps {
  weekDays: Date[];
}

const WeeklyGridHeader: React.FC<WeeklyGridHeaderProps> = ({ weekDays }) => {
  return (
    <>
      <div className="bg-gray-50 border-b border-r p-3 font-medium text-gray-900">
        Horário
      </div>
      {weekDays.map((day) => (
        <div key={day.toISOString()} className="bg-gray-50 border-b border-r p-3 text-center">
          <div className="font-medium text-gray-900">
            {getDayName(day)}
          </div>
          <div className="text-sm text-gray-600">
            {format(day, 'dd/MM', { locale: ptBR })}
          </div>
        </div>
      ))}
    </>
  );
};

export default WeeklyGridHeader;
