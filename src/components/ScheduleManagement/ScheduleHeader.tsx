
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface ScheduleHeaderProps {
  selectedChild: any;
  onDuplicateWeek: () => void;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  selectedChild,
  onDuplicateWeek
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
        <p className="text-gray-600 mt-1">
          Gerencie as sessões terapêuticas das crianças
        </p>
      </div>
      
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onDuplicateWeek} disabled={!selectedChild}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicar Semana Anterior
        </Button>
      </div>
    </div>
  );
};

export default ScheduleHeader;
