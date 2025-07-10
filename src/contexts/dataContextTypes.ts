
import { Child, Therapist, Schedule, ScheduleTemplate } from '@/types';

export interface DataContextType {
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
