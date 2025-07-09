
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Child, Therapist, Schedule, ScheduleTemplate } from '@/types';
import { assignTherapistColor } from '@/lib/therapistColors';

interface DataContextType {
  children: Child[];
  therapists: Therapist[];
  schedules: Schedule[];
  scheduleTemplates: ScheduleTemplate[];
  
  addChild: (child: Omit<Child, 'id' | 'createdAt'>) => void;
  addTherapist: (therapist: Omit<Therapist, 'id' | 'createdAt' | 'color' | 'weeklyWorkloadHours'>) => void;
  updateTherapist: (id: string, updates: Partial<Therapist>) => void;
  deleteTherapist: (id: string) => void;
  addSchedule: (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>, reason?: string) => void;
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
    weeklyTherapies: [
      { specialty: 'Fonoaudiologia', hoursRequired: 4 },
      { specialty: 'Musicoterapia', hoursRequired: 6 },
      { specialty: 'Terapia Ocupacional', hoursRequired: 3 }
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
    weeklyTherapies: [
      { specialty: 'Fisioterapia', hoursRequired: 5 },
      { specialty: 'Terapia Ocupacional', hoursRequired: 2 }
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
    color: '#3B82F6', // Azul
    weeklyWorkloadHours: 35,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Laura Oliveira',
    licenseNumber: 'FISIO-67890',
    education: 'Fisioterapia - USP',
    professionalType: 'Fisioterapeuta',
    specialties: ['Fisioterapia', 'Neurologia Pediátrica'],
    color: '#F97316', // Laranja
    weeklyWorkloadHours: 40,
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'Maria Silva',
    licenseNumber: 'FONO-11111',
    education: 'Fonoaudiologia - UFRJ',
    professionalType: 'Fonoaudiólogo',
    specialties: ['Fonoaudiologia'],
    color: '#10B981', // Verde
    weeklyWorkloadHours: 30,
    createdAt: new Date()
  },
  {
    id: '5',
    name: 'Pedro Costa',
    licenseNumber: 'MUSICO-22222',
    education: 'Musicoterapia - UNESP',
    professionalType: 'Musicoterapeuta',
    specialties: ['Musicoterapia'],
    color: '#8B5CF6', // Roxo
    weeklyWorkloadHours: 25,
    createdAt: new Date()
  }
];

const generateId = () => Date.now().toString();

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [childrenData, setChildrenData] = useState<Child[]>(mockChildren);
  const [therapists, setTherapists] = useState<Therapist[]>(mockTherapists);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [scheduleTemplates, setScheduleTemplates] = useState<ScheduleTemplate[]>([]);
  

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
      weeklyWorkloadHours: 35, // Default workload hours
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

  // MELHORADA: Função addSchedule com melhor normalização de data
  const addSchedule = (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Normalizar a data para evitar problemas de timezone
    const normalizedDate = new Date(schedule.date);
    normalizedDate.setHours(0, 0, 0, 0);
    
    const newSchedule: Schedule = {
      ...schedule,
      date: normalizedDate, // Usar data normalizada
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
        
        // Normalizar data se foi atualizada
        if (updates.date) {
          const normalizedDate = new Date(updates.date);
          normalizedDate.setHours(0, 0, 0, 0);
          updatedSchedule.date = normalizedDate;
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
