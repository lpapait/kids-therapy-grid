import React, { createContext, useContext, useState, useEffect } from 'react';
import { Child, Therapist, Schedule, ScheduleTemplate, ScheduleHistory, ScheduleChange } from '@/types';
import { assignTherapistColor } from '@/lib/therapistColors';

interface DataContextType {
  children: Child[];
  therapists: Therapist[];
  schedules: Schedule[];
  scheduleTemplates: ScheduleTemplate[];
  scheduleHistory: ScheduleHistory[];
  addChild: (child: Omit<Child, 'id' | 'createdAt'>) => void;
  addTherapist: (therapist: Omit<Therapist, 'id' | 'createdAt' | 'color' | 'weeklyWorkloadHours'>) => void;
  addSchedule: (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>, reason?: string) => void;
  addScheduleTemplate: (template: Omit<ScheduleTemplate, 'id'>) => void;
  getChildById: (id: string) => Child | undefined;
  getTherapistById: (id: string) => Therapist | undefined;
  getScheduleHistory: (scheduleId: string) => ScheduleHistory[];
  getAllHistory: () => ScheduleHistory[];
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
  }
];

const generateId = () => Date.now().toString();

const getChangedFields = (original: Schedule, updated: Partial<Schedule>): ScheduleChange[] => {
  const changes: ScheduleChange[] = [];
  
  Object.keys(updated).forEach((key) => {
    const field = key as keyof Schedule;
    if (original[field] !== updated[field]) {
      changes.push({
        field,
        oldValue: original[field],
        newValue: updated[field]
      });
    }
  });
  
  return changes;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [childrenData, setChildrenData] = useState<Child[]>(mockChildren);
  const [therapists, setTherapists] = useState<Therapist[]>(mockTherapists);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [scheduleTemplates, setScheduleTemplates] = useState<ScheduleTemplate[]>([]);
  const [scheduleHistory, setScheduleHistory] = useState<ScheduleHistory[]>([]);

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

  const addSchedule = (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSchedule: Schedule = {
      ...schedule,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSchedules(prev => [...prev, newSchedule]);
    
    // Registrar no histórico
    const historyEntry: ScheduleHistory = {
      id: generateId(),
      scheduleId: newSchedule.id,
      changeType: 'created',
      previousValues: {},
      newValues: newSchedule,
      changedFields: Object.keys(newSchedule),
      changedBy: schedule.updatedBy,
      changedAt: new Date()
    };
    
    setScheduleHistory(prev => [...prev, historyEntry]);
  };

  const updateSchedule = (id: string, updates: Partial<Schedule>, reason?: string) => {
    setSchedules(prev => prev.map(schedule => {
      if (schedule.id === id) {
        const originalSchedule = { ...schedule };
        const changes = getChangedFields(originalSchedule, updates);
        
        if (changes.length > 0) {
          // Registrar no histórico antes da atualização
          const historyEntry: ScheduleHistory = {
            id: generateId(),
            scheduleId: id,
            changeType: updates.status === 'cancelled' ? 'cancelled' : 
                       updates.status === 'rescheduled' ? 'rescheduled' :
                       updates.status === 'completed' ? 'completed' : 'updated',
            previousValues: originalSchedule,
            newValues: updates,
            changedFields: changes.map(c => c.field),
            reason,
            changedBy: updates.updatedBy || originalSchedule.updatedBy,
            changedAt: new Date()
          };
          
          setScheduleHistory(prev => [...prev, historyEntry]);
        }
        
        return { ...schedule, ...updates, updatedAt: new Date() };
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
  const getScheduleHistory = (scheduleId: string) => 
    scheduleHistory.filter(history => history.scheduleId === scheduleId).sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());
  const getAllHistory = () => 
    scheduleHistory.sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());

  return (
    <DataContext.Provider value={{
      children: childrenData,
      therapists,
      schedules,
      scheduleTemplates,
      scheduleHistory,
      addChild,
      addTherapist,
      addSchedule,
      updateSchedule,
      addScheduleTemplate,
      getChildById,
      getTherapistById,
      getScheduleHistory,
      getAllHistory
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
