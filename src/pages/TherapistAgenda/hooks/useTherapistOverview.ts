
import { useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { isSameWeek, isToday, format } from 'date-fns';
import { TherapistOverviewCard, TherapistFilters } from '../types/therapist-agenda.types';
import { BREAK_TIME_MINUTES } from '@/lib/validationRules';

export const useTherapistOverview = (selectedWeek: Date, filters: TherapistFilters) => {
  const { therapists, schedules, getChildById } = useData();

  const therapistCards = useMemo(() => {
    return therapists.map(therapist => {
      // Calculate weekly hours
      const weekSchedules = schedules.filter(schedule => 
        schedule.therapistId === therapist.id &&
        isSameWeek(schedule.date, selectedWeek) &&
        schedule.status !== 'cancelled'
      );

      const totalMinutes = weekSchedules.reduce((total, schedule) => 
        total + (schedule.duration || 60) + BREAK_TIME_MINUTES, 0
      );
      
      const adjustedMinutes = Math.max(0, totalMinutes - BREAK_TIME_MINUTES);
      const currentWeekHours = Math.round((adjustedMinutes / 60) * 10) / 10;
      const maxWeeklyHours = therapist.weeklyWorkloadHours;
      const utilizationPercentage = Math.round((currentWeekHours / maxWeeklyHours) * 100);

      // Determine status
      let status: 'available' | 'near_limit' | 'overloaded';
      if (utilizationPercentage >= 100) {
        status = 'overloaded';
      } else if (utilizationPercentage >= 80) {
        status = 'near_limit';
      } else {
        status = 'available';
      }

      // Today's sessions
      const todaySchedules = weekSchedules.filter(schedule => 
        isToday(schedule.date)
      );

      // Next session info
      const upcomingSchedules = weekSchedules
        .filter(schedule => schedule.date >= new Date())
        .sort((a, b) => a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time));
      
      const nextSession = upcomingSchedules[0] ? {
        time: upcomingSchedules[0].time,
        childName: getChildById(upcomingSchedules[0].childId)?.name || 'Desconhecido',
        activity: upcomingSchedules[0].activity
      } : undefined;

      return {
        therapist,
        currentWeekHours,
        maxWeeklyHours,
        utilizationPercentage,
        status,
        todaySessionsCount: todaySchedules.length,
        weekSessionsCount: weekSchedules.length,
        nextSession
      } as TherapistOverviewCard;
    });
  }, [therapists, schedules, selectedWeek, getChildById]);

  // Apply filters
  const filteredCards = useMemo(() => {
    return therapistCards.filter(card => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = card.therapist.name.toLowerCase().includes(query);
        const matchesType = card.therapist.professionalType.toLowerCase().includes(query);
        const matchesSpecialty = card.therapist.specialties.some(spec => 
          spec.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesType && !matchesSpecialty) return false;
      }

      // Specialties filter
      if (filters.specialties.length > 0) {
        const hasMatchingSpecialty = filters.specialties.some(filterSpecialty =>
          card.therapist.specialties.includes(filterSpecialty)
        );
        if (!hasMatchingSpecialty) return false;
      }

      // Status filter
      if (filters.statusFilter.length > 0) {
        if (!filters.statusFilter.includes(card.status)) return false;
      }

      // Availability filter
      if (filters.availabilityFilter === 'available_today') {
        if (card.todaySessionsCount === 0) return false;
      } else if (filters.availabilityFilter === 'has_capacity') {
        if (card.status === 'overloaded') return false;
      }

      return true;
    });
  }, [therapistCards, filters]);

  return {
    therapistCards: filteredCards,
    totalTherapists: therapists.length,
    filteredCount: filteredCards.length
  };
};
