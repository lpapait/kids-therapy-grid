
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Child, Therapist, Schedule, ScheduleTemplate } from '@/types';
import { assignTherapistColor } from '@/lib/therapistColors';
import { mockChildren, mockTherapists } from './mockData';
import { createMockSchedules } from './mockSchedules';
import { DataContextType } from './dataContextTypes';
import { generateId, normalizeDate } from './dataContextUtils';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [childrenData, setChildrenData] = useState<Child[]>(mockChildren);
  const [therapists, setTherapists] = useState<Therapist[]>(mockTherapists);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [scheduleTemplates, setScheduleTemplates] = useState<ScheduleTemplate[]>([]);
  
  // Initialize mock schedules on mount
  useEffect(() => {
    const mockSchedules = createMockSchedules();
    setSchedules(mockSchedules);
    console.log('Mock schedules initialized:', mockSchedules.length);
  }, []);

  const addChild = (child: Omit<Child, 'id' | 'createdAt'>) => {
    const newChild: Child = {
      ...child,
      id: generateId(),
      createdAt: new Date()
    };
    setChildrenData(prev => [...prev, newChild]);
  };

  const addTherapist = (therapist: Omit<Therapist, 'id' | 'createdAt' | 'color' | 'weeklyWorkloadHours'>) => {
    const existingColors = therapists.map(t => t.color);
    const newTherapist: Therapist = {
      ...therapist,
      id: generateId(),
      color: assignTherapistColor(generateId(), existingColors),
      weeklyWorkloadHours: 35,
      createdAt: new Date()
    };
    setTherapists(prev => [...prev, newTherapist]);
  };

  const updateTherapist = (id: string, updates: Partial<Therapist>) => {
    setTherapists(prev => prev.map(therapist => 
      therapist.id === id ? { ...therapist, ...updates } : therapist
    ));
  };

  const deleteTherapist = (id: string) => {
    setTherapists(prev => prev.filter(therapist => therapist.id !== id));
  };

  const addSchedule = (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const normalizedDate = normalizeDate(schedule.date);
    
    const newSchedule: Schedule = {
      ...schedule,
      date: normalizedDate,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('=== ADDING SCHEDULE DEBUG ===');
    console.log('Original schedule data:', schedule);
    console.log('Normalized schedule:', newSchedule);
    console.log('Date normalized to:', normalizedDate.toISOString());
    
    setSchedules(prev => {
      const updated = [...prev, newSchedule];
      console.log('Updated schedules array:', updated.length);
      console.log('All schedules:', updated.map(s => ({
        id: s.id,
        childId: s.childId,
        date: s.date.toISOString(),
        time: s.time,
        activity: s.activity
      })));
      console.log('=== END ADDING SCHEDULE DEBUG ===');
      return updated;
    });
  };

  const updateSchedule = (id: string, updates: Partial<Schedule>, reason?: string) => {
    setSchedules(prev => prev.map(schedule => {
      if (schedule.id === id) {
        const updatedSchedule = { ...schedule, ...updates, updatedAt: new Date() };
        
        if (updates.date) {
          updatedSchedule.date = normalizeDate(updates.date);
        }
        
        return updatedSchedule;
      }
      return schedule;
    }));
  };

  const addScheduleTemplate = (template: Omit<ScheduleTemplate, 'id'>) => {
    const newTemplate: ScheduleTemplate = {
      ...template,
      id: generateId()
    };
    setScheduleTemplates(prev => [...prev, newTemplate]);
  };

  const getChildById = (id: string) => childrenData.find(child => child.id === id);
  const getTherapistById = (id: string) => therapists.find(therapist => therapist.id === id);

  return (
    <DataContext.Provider value={{
      children: childrenData,
      therapists,
      schedules,
      scheduleTemplates,
      
      addChild,
      addTherapist,
      updateTherapist,
      deleteTherapist,
      addSchedule,
      updateSchedule,
      addScheduleTemplate,
      getChildById,
      getTherapistById,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
