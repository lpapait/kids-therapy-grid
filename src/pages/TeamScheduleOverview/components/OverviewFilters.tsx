
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Grid, List } from 'lucide-react';
import WeekSelector from '@/components/WeekSelector';

interface OverviewFiltersProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  specialtyFilter: string;
  onSpecialtyChange: (specialty: string) => void;
  therapistSearch: string;
  onTherapistSearchChange: (search: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onExportReport: () => void;
}

const OverviewFilters: React.FC<OverviewFiltersProps> = ({
  selectedWeek,
  onWeekChange,
  specialtyFilter,
  onSpecialtyChange,
  therapistSearch,
  onTherapistSearchChange,
  viewMode,
  onViewModeChange,
  onExportReport
}) => {
  const specialties = [
    'Todas',
    'Terapia Ocupacional',
    'Fonoaudiologia', 
    'Fisioterapia',
    'Musicoterapia',
    'Psicologia'
  ];

  return (
    <div className="space-y-4">
      <WeekSelector 
        selectedWeek={selectedWeek}
        onWeekChange={onWeekChange}
      />
      
      <div className="flex flex-col lg:flex-row gap-4 bg-white rounded-lg border p-4">
        <div className="flex-1 space-y-4 lg:space-y-0 lg:flex lg:gap-4">
          <div className="lg:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Especialidade
            </label>
            <Select value={specialtyFilter || 'Todas'} onValueChange={onSpecialtyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a especialidade" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Terapeuta
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Digite o nome do terapeuta..."
                value={therapistSearch}
                onChange={(e) => onTherapistSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onExportReport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OverviewFilters;
