
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface SpecialtyFiltersProps {
  availableSpecialties: string[];
  selectedSpecialties: string[];
  onToggleSpecialty: (specialty: string) => void;
  onClearFilters: () => void;
}

const SpecialtyFilters: React.FC<SpecialtyFiltersProps> = ({
  availableSpecialties,
  selectedSpecialties,
  onToggleSpecialty,
  onClearFilters
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Filter className="h-4 w-4 text-blue-600" />
          <span>Filtrar por Especialidade</span>
          {selectedSpecialties.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="ml-auto text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableSpecialties.map((specialty) => (
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox
                id={specialty}
                checked={selectedSpecialties.includes(specialty)}
                onCheckedChange={() => onToggleSpecialty(specialty)}
              />
              <label
                htmlFor={specialty}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {specialty}
              </label>
            </div>
          ))}
        </div>
        
        {selectedSpecialties.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex flex-wrap gap-1">
              {selectedSpecialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0 text-xs"
                    onClick={() => onToggleSpecialty(specialty)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpecialtyFilters;
