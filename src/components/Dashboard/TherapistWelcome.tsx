
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/types';

interface TherapistWelcomeProps {
  user: User;
  todaySessionsCount: number;
}

const TherapistWelcome: React.FC<TherapistWelcomeProps> = ({ user, todaySessionsCount }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getProfessionFromSpecialties = (specialties?: string[]) => {
    if (!specialties?.length) return 'Terapeuta';
    
    const specialty = specialties[0];
    const professionMap: Record<string, string> = {
      'Terapia Ocupacional': 'Terapeuta Ocupacional',
      'Fisioterapia': 'Fisioterapeuta',
      'Fonoaudiologia': 'Fonoaudiólogo(a)',
      'Psicologia': 'Psicólogo(a)',
      'Psicopedagogia': 'Psicopedagogo(a)',
      'Musicoterapia': 'Musicoterapeuta'
    };
    
    return professionMap[specialty] || specialty;
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 bg-blue-600">
            <AvatarFallback className="bg-blue-600 text-white text-lg font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              {getProfessionFromSpecialties(user.specialties)}
            </p>
            <p className="text-blue-700 font-medium mt-2">
              {todaySessionsCount === 0 
                ? 'Nenhuma sessão agendada para hoje'
                : `Hoje você tem ${todaySessionsCount} ${todaySessionsCount === 1 ? 'sessão' : 'sessões'}`
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapistWelcome;
