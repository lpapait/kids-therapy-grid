
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { GridFilters as GridFiltersType } from '@/hooks/useUnifiedGrid';
import { SPECIALTIES } from '@/types';

interface GridFiltersProps {
  filters: GridFiltersType;
  onFiltersChange: (filters: GridFiltersType) => void;
  mode: 'child' | 'therapist' | 'overview';
}

const GridFilters: React.FC<GridFiltersProps> = ({
  filters,
  onFiltersChange,
  mode
}) => {
  const { therapists } = useData();

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: value || undefined
    });
  };

  const handleStatusFilter = (status: string) => {
    const currentStatus = filters.status || [];
    const newStatus = currentStatus.includes(status as any)
      ? currentStatus.filter(s => s !== status)
      : [...currentStatus, status as any];
    
    onFiltersChange({
      ...filters,
      status: newStatus.length > 0 ? newStatus : undefined
    });
  };

  const handleTherapistFilter = (therapistId: string) => {
    const currentTherapists = filters.therapists || [];
    const newTherapists = currentTherapists.includes(therapistId)
      ? currentTherapists.filter(t => t !== therapistId)
      : [...currentTherapists, therapistId];
    
    onFiltersChange({
      ...filters,
      therapists: newTherapists.length > 0 ? newTherapists : undefined
    });
  };

  const handleSpecialtyFilter = (specialty: string) => {
    const currentSpecialties = filters.specialties || [];
    const newSpecialties = currentSpecialties.includes(specialty)
      ? currentSpecialties.filter(s => s !== specialty)
      : [...currentSpecialties, specialty];
    
    onFiltersChange({
      ...filters,
      specialties: newSpecialties.length > 0 ? newSpecialties : undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Busca */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por atividade, terapeuta ou observações..."
              value={filters.searchQuery || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro por Status */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            {['scheduled', 'completed', 'cancelled', 'rescheduled'].map((status) => (
              <Badge
                key={status}
                variant={filters.status?.includes(status as any) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleStatusFilter(status)}
              >
                {status === 'scheduled' ? 'Agendado' :
                 status === 'completed' ? 'Realizado' :
                 status === 'cancelled' ? 'Cancelado' : 'Remarcado'}
              </Badge>
            ))}
          </div>

          {/* Filtro por Terapeuta (apenas se não for modo therapist) */}
          {mode !== 'therapist' && (
            <Select onValueChange={handleTherapistFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por terapeuta" />
              </SelectTrigger>
              <SelectContent>
                {therapists.map((therapist) => (
                  <SelectItem key={therapist.id} value={therapist.id}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: therapist.color }}
                      />
                      <span>{therapist.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Filtro por Especialidade */}
          <Select onValueChange={handleSpecialtyFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por especialidade" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Limpar filtros */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Limpar</span>
            </Button>
          )}
        </div>

        {/* Filtros ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            
            {filters.therapists?.map((therapistId) => {
              const therapist = therapists.find(t => t.id === therapistId);
              return therapist ? (
                <Badge key={therapistId} variant="secondary" className="flex items-center space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: therapist.color }}
                  />
                  <span>{therapist.name}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleTherapistFilter(therapistId)}
                  />
                </Badge>
              ) : null;
            })}

            {filters.specialties?.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="flex items-center space-x-1">
                <span>{specialty}</span>
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleSpecialtyFilter(specialty)}
                />
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GridFilters;
