
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Users, Clock, AlertTriangle } from 'lucide-react';
import { TherapistFilters } from '../../types/therapist-agenda.types';

interface SmartFiltersProps {
  filters: TherapistFilters;
  availableSpecialties: string[];
  onUpdateSearchQuery: (query: string) => void;
  onToggleSpecialty: (specialty: string) => void;
  onToggleStatus: (status: 'available' | 'near_limit' | 'overloaded') => void;
  onSetAvailabilityFilter: (filter: TherapistFilters['availabilityFilter']) => void;
  onClearAllFilters: () => void;
  hasActiveFilters: boolean;
  totalCount: number;
  filteredCount: number;
}

const SmartFilters: React.FC<SmartFiltersProps> = ({
  filters,
  availableSpecialties,
  onUpdateSearchQuery,
  onToggleSpecialty,
  onToggleStatus,
  onSetAvailabilityFilter,
  onClearAllFilters,
  hasActiveFilters,
  totalCount,
  filteredCount
}) => {
  const statusOptions = [
    { value: 'available', label: 'Disponível', icon: Users, color: 'text-green-600' },
    { value: 'near_limit', label: 'Próx. Limite', icon: Clock, color: 'text-yellow-600' },
    { value: 'overloaded', label: 'Sobrecarregado', icon: AlertTriangle, color: 'text-red-600' }
  ] as const;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <span>Filtros</span>
            <Badge variant="secondary" className="ml-2">
              {filteredCount} de {totalCount}
            </Badge>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar Todos
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, profissão ou especialidade..."
            value={filters.searchQuery}
            onChange={(e) => onUpdateSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Availability Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Disponibilidade</label>
          <Select 
            value={filters.availabilityFilter} 
            onValueChange={onSetAvailabilityFilter}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os terapeutas</SelectItem>
              <SelectItem value="available_today">Com sessões hoje</SelectItem>
              <SelectItem value="has_capacity">Com capacidade disponível</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Status de Carga</label>
          <div className="grid grid-cols-1 gap-2">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.value}`}
                    checked={filters.statusFilter.includes(option.value)}
                    onCheckedChange={() => onToggleStatus(option.value)}
                  />
                  <label
                    htmlFor={`status-${option.value}`}
                    className="flex items-center space-x-2 text-sm font-medium cursor-pointer"
                  >
                    <Icon className={`h-4 w-4 ${option.color}`} />
                    <span>{option.label}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Specialties Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Especialidades</label>
            {filters.specialties.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => filters.specialties.forEach(onToggleSpecialty)}
                className="text-xs h-auto p-1"
              >
                Limpar
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {availableSpecialties.map((specialty) => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox
                  id={`specialty-${specialty}`}
                  checked={filters.specialties.includes(specialty)}
                  onCheckedChange={() => onToggleSpecialty(specialty)}
                />
                <label
                  htmlFor={`specialty-${specialty}`}
                  className="text-sm font-medium cursor-pointer flex-1"
                >
                  {specialty}
                </label>
              </div>
            ))}
          </div>
          
          {filters.specialties.length > 0 && (
            <div className="pt-2 border-t">
              <div className="flex flex-wrap gap-1">
                {filters.specialties.map((specialty) => (
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
      </CardContent>
    </Card>
  );
};

export default SmartFilters;
