
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { getDayName } from '@/lib/dateUtils';

interface GridHeaderProps {
  weekDays: Date[];
}

const GridHeader: React.FC<GridHeaderProps> = ({ weekDays }) => {
  return (
    <>
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-r p-3 font-medium text-gray-900 sticky left-0 z-20">
        <div className="flex items-center justify-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          Horário
        </div>
      </div>
      
      {weekDays.map((day) => (
        <div 
          key={day.toISOString()} 
          className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-r p-3 text-center min-w-[160px]"
        >
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

export default GridHeader;
