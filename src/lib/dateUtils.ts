
import { format, addDays, startOfWeek, addWeeks, isSameWeek as dateFnsIsSameWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const getWeekDays = (selectedWeek: Date) => {
  const startDay = startOfWeek(selectedWeek, { weekStartsOn: 1 }); // Segunda-feira
  return Array.from({ length: 7 }, (_, i) => addDays(startDay, i));
};

export const getTimeSlots = () => {
  // Gerar horários simples de 08:00 a 17:00
  const slots = [];
  for (let hour = 8; hour <= 17; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

export const getDayName = (date: Date) => {
  return format(date, 'EEE', { locale: ptBR });
};

export const formatDateForComparison = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

// Export the missing utility functions
export const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

export const calculateAge = (birthDate: Date) => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  
  return age;
};

export const isSameWeek = (date1: Date, date2: Date) => {
  return dateFnsIsSameWeek(date1, date2, { weekStartsOn: 1 });
};

export const formatWeekRange = (selectedWeek: Date) => {
  const weekDays = getWeekDays(selectedWeek);
  const startDay = weekDays[0];
  const endDay = weekDays[6];
  
  return `${format(startDay, 'dd/MM', { locale: ptBR })} - ${format(endDay, 'dd/MM', { locale: ptBR })}`;
};

// Export addDays and addWeeks from date-fns
export { addDays, addWeeks };
