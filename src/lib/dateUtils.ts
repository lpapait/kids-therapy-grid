
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Segunda-feira
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const formatWeekRange = (date: Date) => {
  const days = getWeekDays(date);
  const start = format(days[0], 'dd/MM', { locale: ptBR });
  const end = format(days[6], 'dd/MM/yyyy', { locale: ptBR });
  return `${start} - ${end}`;
};

export const getTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 17; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:30`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:30`;
    slots.push(`${startTime}-${endTime}`);
  }
  return slots;
};

export const getDayName = (date: Date) => {
  return format(date, 'EEEE', { locale: ptBR });
};

export const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const isSameWeek = (date1: Date, date2: Date) => {
  const week1 = getWeekDays(date1);
  const week2 = getWeekDays(date2);
  return isSameDay(week1[0], week2[0]);
};

// Export addDays from date-fns for external use
export { addDays } from 'date-fns';
