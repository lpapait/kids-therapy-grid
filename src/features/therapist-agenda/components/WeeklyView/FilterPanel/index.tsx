
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { AgendaFilters } from '../../../types/agenda.types';
import SpecialtyFilter from './SpecialtyFilter';

interface FilterPanelProps {
  availableSpecialties: string[];
  filters: AgendaFilters;
  onToggleSpecialty: (specialty: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  availableSpecialties,
  filters,
  onToggleSpecialty,
  onClearFilters,
  hasActiveFilters
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Filter className="h-4 w-4 text-blue-600" />
          <span>Filtros</span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="ml-auto text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar Todos
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SpecialtyFilter
          availableSpecialties={availableSpecialties}
          selectedSpecialties={filters.specialties}
          onToggleSpecialty={onToggleSpecialty}
          onClearSpecialties={() => onClearFilters()}
        />
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
