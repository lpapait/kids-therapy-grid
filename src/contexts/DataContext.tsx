
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Child, Therapist, Schedule, ScheduleTemplate } from '@/types';

interface DataContextType {
  children: Child[];
  therapists: Therapist[];
  schedules: Schedule[];
  scheduleTemplates: ScheduleTemplate[];
  addChild: (child: Omit<Child, 'id' | 'createdAt'>) => void;
  addTherapist: (therapist: Omit<Therapist, 'id' | 'createdAt'>) => void;
  addSchedule: (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  addScheduleTemplate: (template: Omit<ScheduleTemplate, 'id'>) => void;
  getChildById: (id: string) => Child | undefined;
  getTherapistById: (id: string) => Therapist | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data for demonstration
const mockChildren: Child[] = [
  {
    id: '1',
    name: 'Ana Beatriz Costa',
    birthDate: new Date('2018-03-15'),
    gender: 'female',
    medications: 'Ritalina 10mg - manhã',
    diagnosis: 'TEA - Transtorno do Espectro Autista',
    guardians: [
      {
        name: 'Carlos Costa',
        relationship: 'Pai',
        phone: '(11) 99999-1111',
        email: 'carlos@email.com'
      },
      {
        name: 'Beatriz Costa',
        relationship: 'Mãe',
        phone: '(11) 99999-2222',
        email: 'beatriz@email.com'
      }
    ],
    createdAt: new Date(),
    createdBy: '1'
  },
  {
    id: '2',
    name: 'Pedro Henrique Silva',
    birthDate: new Date('2019-07-20'),
    gender: 'male',
    diagnosis: 'Atraso no desenvolvimento neuropsicomotor',
    guardians: [
      {
        name: 'Mariana Silva',
        relationship: 'Mãe',
        phone: '(11) 88888-3333',
        email: 'mariana@email.com'
      }
    ],
    createdAt: new Date(),
    createdBy: '1'
  }
];

const mockTherapists: Therapist[] = [
  {
    id: '2',
    name: 'João Santos',
    licenseNumber: 'TO-12345',
    education: 'Terapia Ocupacional - UFMG',
    professionalType: 'Terapeuta Ocupacional',
    specialties: ['Terapia Ocupacional', 'Integração Sensorial'],
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Laura Oliveira',
    licenseNumber: 'FISIO-67890',
    education: 'Fisioterapia - USP',
    professionalType: 'Fisioterapeuta',
    specialties: ['Fisioterapia', 'Neurologia Pediátrica'],
    createdAt: new Date()
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [childrenData, setChildrenData] = useState<Child[]>(mockChildren);
  const [therapists, setTherapists] = useState<Therapist[]>(mockTherapists);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [scheduleTemplates, setScheduleTemplates] = useState<ScheduleTemplate[]>([]);

  const addChild = (child: Omit<Child, 'id' | 'createdAt'>) => {
    const newChild: Child = {
      ...child,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setChildrenData(prev => [...prev, newChild]);
  };

  const addTherapist = (therapist: Omit<Therapist, 'id' | 'createdAt'>) => {
    const newTherapist: Therapist = {
      ...therapist,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTherapists(prev => [...prev, newTherapist]);
  };

  const addSchedule = (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSchedule: Schedule = {
      ...schedule,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSchedules(prev => [...prev, newSchedule]);
  };

  const updateSchedule = (id: string, updates: Partial<Schedule>) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id 
        ? { ...schedule, ...updates, updatedAt: new Date() }
        : schedule
    ));
  };

  const addScheduleTemplate = (template: Omit<ScheduleTemplate, 'id'>) => {
    const newTemplate: ScheduleTemplate = {
      ...template,
      id: Date.now().toString()
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
      addSchedule,
      updateSchedule,
      addScheduleTemplate,
      getChildById,
      getTherapistById
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
