
// Paleta de cores predefinidas para terapeutas
export const THERAPIST_COLORS = [
  '#3B82F6', // Azul
  '#F97316', // Laranja
  '#10B981', // Verde
  '#8B5CF6', // Roxo
  '#F59E0B', // Amarelo
  '#EF4444', // Vermelho
  '#06B6D4', // Ciano
  '#84CC16', // Lima
  '#EC4899', // Rosa
  '#6B7280', // Cinza
];

export const getTherapistColorStyles = (color: string, isOwn: boolean = false) => {
  const opacity = isOwn ? '0.2' : '0.1';
  const borderOpacity = isOwn ? '0.8' : '0.6';
  
  return {
    backgroundColor: `${color}${Math.round(255 * parseFloat(opacity)).toString(16).padStart(2, '0')}`,
    borderColor: `${color}${Math.round(255 * parseFloat(borderOpacity)).toString(16).padStart(2, '0')}`,
    borderWidth: isOwn ? '2px' : '1px',
    borderStyle: 'solid' as const
  };
};

export const getContrastColor = (backgroundColor: string) => {
  // Converte hex para RGB
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calcula luminância
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export const getTherapistColor = (therapistId: string): string => {
  const index = therapistId.charCodeAt(0) % THERAPIST_COLORS.length;
  return THERAPIST_COLORS[index];
};

export const assignTherapistColor = (therapistId: string, existingColors: string[] = []): string => {
  const availableColors = THERAPIST_COLORS.filter(color => !existingColors.includes(color));
  
  if (availableColors.length === 0) {
    // Se todas as cores estão em uso, usar uma cor baseada no ID
    const colorIndex = parseInt(therapistId) % THERAPIST_COLORS.length;
    return THERAPIST_COLORS[colorIndex];
  }
  
  // Usar a primeira cor disponível
  return availableColors[0];
};
