
import React from 'react';
import { Clock } from 'lucide-react';

interface TherapyEmptyStateProps {
  showOnlyPending: boolean;
  hasData: boolean;
}

const TherapyEmptyState: React.FC<TherapyEmptyStateProps> = ({
  showOnlyPending,
  hasData
}) => {
  return (
    <div className="text-center py-6 text-gray-500">
      <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
      <p>
        {showOnlyPending && hasData 
          ? 'Todas as terapias estão completas' 
          : 'Nenhuma terapia configurada'
        }
      </p>
    </div>
  );
};

export default TherapyEmptyState;
