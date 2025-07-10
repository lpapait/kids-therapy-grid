
import { Child, Therapist, Schedule } from '@/types';

export const mockChildren: Child[] = [
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

export const mockTherapists: Therapist[] = [
  {
    id: '2',
    name: 'João Santos',
    licenseNumber: 'TO-12345',
    education: 'Terapia Ocupacional - UFMG',
    professionalType: 'Terapeuta Ocupacional',
    specialties: ['Terapia Ocupacional', 'Integração Sensorial'],
    color: '#3B82F6',
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
    color: '#F97316',
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
    color: '#10B981',
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
    color: '#8B5CF6',
    weeklyWorkloadHours: 25,
    createdAt: new Date()
  }
];
