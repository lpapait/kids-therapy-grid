
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, History, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActionsTherapist: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'weekly-agenda',
      title: 'Ver Minha Agenda Semanal',
      description: 'Visualizar sessões da semana',
      icon: Calendar,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => navigate('/therapist-agenda')
    },
    {
      id: 'session-history',
      title: 'Histórico de Sessões',
      description: 'Sessões anteriores e relatórios',
      icon: History,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => navigate('/therapist-agenda') // Could be a specific history page
    },
    {
      id: 'my-patients',
      title: 'Meus Pacientes',
      description: 'Crianças sob meus cuidados',
      icon: Users,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => navigate('/children') // Could filter by therapist
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-blue-600" />
          <span>Ações Rápidas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                onClick={action.action}
                className={`${action.color} text-white h-auto p-4 flex items-center space-x-3 hover:scale-105 transition-all duration-200 justify-start`}
                variant="default"
              >
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsTherapist;
