
import { useCallback } from 'react';
import { TherapistFilters } from '../types/therapist-agenda.types';
import { SPECIALTIES } from '@/types';

export const useSmartFilters = (
  filters: TherapistFilters,
  updateFilters: (filters: Partial<TherapistFilters>) => void
) => {
  const updateSearchQuery = useCallback((query: string) => {
    updateFilters({ searchQuery: query });
  }, [updateFilters]);

  const toggleSpecialty = useCallback((specialty: string) => {
    const newSpecialties = filters.specialties.includes(specialty)
      ? filters.specialties.filter(s => s !== specialty)
      : [...filters.specialties, specialty];
    updateFilters({ specialties: newSpecialties });
  }, [filters.specialties, updateFilters]);

  const toggleStatus = useCallback((status: 'available' | 'near_limit' | 'overloaded') => {
    const newStatusFilter = filters.statusFilter.includes(status)
      ? filters.statusFilter.filter(s => s !== status)
      : [...filters.statusFilter, status];
    updateFilters({ statusFilter: newStatusFilter });
  }, [filters.statusFilter, updateFilters]);

  const setAvailabilityFilter = useCallback((availability: TherapistFilters['availabilityFilter']) => {
    updateFilters({ availabilityFilter: availability });
  }, [updateFilters]);

  const clearAllFilters = useCallback(() => {
    updateFilters({
      searchQuery: '',
      specialties: [],
      statusFilter: [],
      availabilityFilter: 'all'
    });
  }, [updateFilters]);

  const hasActiveFilters = filters.searchQuery.length > 0 || 
                          filters.specialties.length > 0 || 
                          filters.statusFilter.length > 0 || 
                          filters.availabilityFilter !== 'all';

  return {
    filters,
    updateSearchQuery,
    toggleSpecialty,
    toggleStatus,
    setAvailabilityFilter,
    clearAllFilters,
    hasActiveFilters,
    availableSpecialties: SPECIALTIES
  };
};
