
import { useState, useCallback } from 'react';
import { TherapistFilters } from '../types/therapist-agenda.types';
import { SPECIALTIES } from '@/types';

const initialFilters: TherapistFilters = {
  searchQuery: '',
  specialties: [],
  statusFilter: [],
  availabilityFilter: 'all'
};

export const useSmartFilters = () => {
  const [filters, setFilters] = useState<TherapistFilters>(initialFilters);

  const updateSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const toggleSpecialty = useCallback((specialty: string) => {
    setFilters(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  }, []);

  const toggleStatus = useCallback((status: 'available' | 'near_limit' | 'overloaded') => {
    setFilters(prev => ({
      ...prev,
      statusFilter: prev.statusFilter.includes(status)
        ? prev.statusFilter.filter(s => s !== status)
        : [...prev.statusFilter, status]
    }));
  }, []);

  const setAvailabilityFilter = useCallback((availability: TherapistFilters['availabilityFilter']) => {
    setFilters(prev => ({ ...prev, availabilityFilter: availability }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

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
