
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SpecialtyFilterProps {
  availableSpecialties: string[];
  selectedSpecialties: string[];
  onToggleSpecialty: (specialty: string) => void;
  onClearSpecialties: () => void;
}

const SpecialtyFilter: React.FC<SpecialtyFilterProps> = ({
  availableSpecialties,
  selectedSpecialties,
  onToggleSpecialty,
  onClearSpecialties
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Especialidades</h4>
        {selectedSpecialties.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSpecialties}
            className="text-xs h-auto p-1"
          >
            Limpar
          </Button>
        )}
      </div>
      
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
    </div>
  );
};

export default SpecialtyFilter;
