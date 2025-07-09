
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

interface TherapyFilterControlsProps {
  showOnlyPending: boolean;
  onFilterChange: (checked: boolean | "indeterminate") => void;
  pendingCount: number;
  totalCount: number;
}

const TherapyFilterControls: React.FC<TherapyFilterControlsProps> = ({
  showOnlyPending,
  onFilterChange,
  pendingCount,
  totalCount
}) => {
  if (totalCount === 0) return null;

  return (
    <div className="flex items-center space-x-2 pt-2">
      <Checkbox
        id="show-pending-only"
        checked={showOnlyPending}
        onCheckedChange={onFilterChange}
      />
      <label 
        htmlFor="show-pending-only" 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center space-x-1"
      >
        <Filter className="h-3 w-3" />
        <span>Mostrar apenas terapias pendentes</span>
        {pendingCount > 0 && (
          <Badge variant="secondary" className="ml-2 text-xs">
            {pendingCount} pendentes
          </Badge>
        )}
      </label>
    </div>
  );
};

export default TherapyFilterControls;
