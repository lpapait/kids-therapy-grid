
import React from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface CalendarFiltersProps {
  filters: {
    therapistIds: string[];
    activityTypes: string[];
    statusFilter: string[];
  };
  onChange: (filters: any) => void;
  monthStats: {
    byTherapist: Record<string, number>;
    byStatus: Record<string, number>;
  };
}

const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  onChange,
  monthStats
}) => {
  const { therapists } = useData();

  const statusOptions = [
    { value: 'scheduled', label: 'Agendadas', color: 'bg-blue-500' },
    { value: 'completed', label: 'Concluídas', color: 'bg-green-500' },
    { value: 'cancelled', label: 'Canceladas', color: 'bg-red-500' },
    { value: 'rescheduled', label: 'Remarcadas', color: 'bg-yellow-500' }
  ];

  const handleTherapistToggle = (therapistId: string) => {
    const newIds = filters.therapistIds.includes(therapistId)
      ? filters.therapistIds.filter(id => id !== therapistId)
      : [...filters.therapistIds, therapistId];
    
    onChange({ therapistIds: newIds });
  };

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.statusFilter.includes(status)
      ? filters.statusFilter.filter(s => s !== status)
      : [...filters.statusFilter, status];
    
    onChange({ statusFilter: newStatus });
  };

  const clearAllFilters = () => {
    onChange({
      therapistIds: [],
      activityTypes: [],
      statusFilter: []
    });
  };

  const hasActiveFilters = 
    filters.therapistIds.length > 0 || 
    filters.activityTypes.length > 0 || 
    filters.statusFilter.length > 0;

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Filtros Ativos</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1">
              {filters.therapistIds.map(id => {
                const therapist = therapists.find(t => t.id === id);
                return therapist ? (
                  <Badge key={id} variant="secondary" className="text-xs">
                    {therapist.name}
                  </Badge>
                ) : null;
              })}
              {filters.statusFilter.map(status => {
                const option = statusOptions.find(opt => opt.value === status);
                return option ? (
                  <Badge key={status} variant="secondary" className="text-xs">
                    {option.label}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Therapist Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Terapeutas</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {therapists.map(therapist => (
            <div key={therapist.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`therapist-${therapist.id}`}
                  checked={filters.therapistIds.includes(therapist.id)}
                  onCheckedChange={() => handleTherapistToggle(therapist.id)}
                />
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: therapist.color }}
                  />
                  <label
                    htmlFor={`therapist-${therapist.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {therapist.name}
                  </label>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {monthStats.byTherapist[therapist.name] || 0}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Status Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Status das Sessões</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {statusOptions.map(option => (
            <div key={option.value} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${option.value}`}
                  checked={filters.statusFilter.includes(option.value)}
                  onCheckedChange={() => handleStatusToggle(option.value)}
                />
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${option.color}`} />
                  <label
                    htmlFor={`status-${option.value}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {monthStats.byStatus[option.value] || 0}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarFilters;
