
import { Schedule } from '@/types';

const getWeekDates = () => {
  const today = new Date();
  const currentWeek = [];
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    date.setHours(0, 0, 0, 0);
    currentWeek.push(date);
  }
  return currentWeek;
};

export const createMockSchedules = (): Schedule[] => {
  const weekDates = getWeekDates();
  const schedules: Schedule[] = [];
  let scheduleId = 1;

  // Sessões regulares para João Santos (Terapeuta Ocupacional)
  schedules.push(
    {
      id: `${scheduleId++}`,
      childId: '1',
      therapistId: '2',
      date: weekDates[1],
      time: '09:00',
      activity: 'Terapia Ocupacional',
      duration: 60,
      status: 'scheduled',
      type: 'session',
      observations: 'Trabalhar coordenação motora fina',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: '1'
    },
    {
      id: `${scheduleId++}`,
      childId: '2',
      therapistId: '2',
      date: weekDates[1],
      time: '14:00',
      activity: 'Integração Sensorial',
      duration: 60,
      status: 'completed',
      type: 'session',
      observations: 'Sessão finalizada com sucesso',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: '1'
    },
    {
      id: `${scheduleId++}`,
      childId: '1',
      therapistId: '2',
      date: weekDates[3],
      time: '10:00',
      activity: 'Terapia Ocupacional',
      duration: 60,
      status: 'scheduled',
      type: 'session',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: '1'
    },
    {
      id: `${scheduleId++}`,
      therapistId: '2',
      date: weekDates[2],
      time: '12:00',
      activity: 'Elaboração de relatórios',
      duration: 60,
      status: 'scheduled',
      type: 'administrative',
      observations: 'Relatórios mensais de progresso',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: '1'
    }
  );

  // Sessões para Laura Oliveira (Fisioterapeuta)
  schedules.push(
    {
      id: `${scheduleId++}`,
      childId: '2',
      therapistId: '3',
      date: weekDates[1],
      time: '08:00',
      activity: 'Fisioterapia',
      duration: 60,
      status: 'scheduled',
      type: 'session',
      observations: 'Exercícios de fortalecimento',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: '1'
    },
    {
      id: `${scheduleId++}`,
      childId: '2',
      therapistId: '3',
      date: weekDates[4],
      time: '09:00',
      activity: 'Neurologia Pediátrica',
      duration: 60,
      status: 'scheduled',
      type: 'session',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: '1'
    }
  );

  // Sessões para Maria Silva (Fonoaudiólogo)
  schedules.push(
    {
      id: `${scheduleId++}`,
      childId: '1',
      therapistId: '4',
      date: weekDates[2],
      time: '09:00',
      activity: 'Fonoaudiologia',
      duration: 60,
      status: 'scheduled',
      type: 'session',
      observations: 'Trabalhar articulação de fonemas',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: '1'
    },
    {
      id: `${scheduleId++}`,
      childId: '1',
      therapistId: '4',
      date: weekDates[5],
      time: '10:00',
      activity: 'Fonoaudiologia',
      duration: 60,
      status: 'cancelled',
      type: 'session',
      observations: 'Cancelado - paciente com febre',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: '1'
    }
  );

  // Sessões para Pedro Costa (Musicoterapeuta)
  schedules.push(
    {
      id: `${scheduleId++}`,
      childId: '1',
      therapistId: '5',
      date: weekDates[2],
      time: '15:00',
      activity: 'Musicoterapia',
      duration: 60,
      status: 'scheduled',
      type: 'session',
      observations: 'Trabalhar expressão através da música',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: '1'
    },
    {
      id: `${scheduleId++}`,
      childId: '1',
      therapistId: '5',
      date: weekDates[4],
      time: '16:00',
      activity: 'Musicoterapia',
      duration: 60,
      status: 'rescheduled',
      type: 'session',
      observations: 'Remarcado para próxima semana',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: '1'
    }
  );

  return schedules;
};
