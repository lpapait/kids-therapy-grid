
import { format, addDays, startOfWeek } from 'date-fns';
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
