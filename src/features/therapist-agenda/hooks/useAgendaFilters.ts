
import { useState, useMemo } from 'react';
import { AgendaFilters } from '../types/agenda.types';
import { Schedule } from '@/types';

export const useAgendaFilters = () => {
  const [filters, setFilters] = useState<AgendaFilters>({
    specialties: [],
    status: [],
    searchQuery: ''
  });

  const updateFilter = (key: keyof AgendaFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSpecialty = (specialty: string) => {
    setFilters(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const toggleStatus = (status: Schedule['status']) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const clearFilters = () => {
    setFilters({
      specialties: [],
      status: [],
      searchQuery: ''
    });
  };

  const hasActiveFilters = useMemo(() => {
    return filters.specialties.length > 0 || 
           filters.status.length > 0 || 
           filters.searchQuery.length > 0 ||
           !!filters.dateRange;
  }, [filters]);

  return {
    filters,
    updateFilter,
    toggleSpecialty,
    toggleStatus,
    clearFilters,
    hasActiveFilters
  };
};
