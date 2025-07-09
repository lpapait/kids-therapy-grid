
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, FileDown, Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'schedule',
      title: 'Planejar Semana',
      description: 'Gerenciar agendamentos',
      icon: Calendar,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => navigate('/schedule')
    },
    {
      id: 'therapist-agenda',
      title: 'Ver Agendas',
      description: 'Agenda dos terapeutas',
      icon: Eye,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => navigate('/therapist-agenda')
    },
    {
      id: 'children',
      title: 'Gerenciar Crianças',
      description: 'Cadastros e informações',
      icon: Users,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => navigate('/children')
    },
    {
      id: 'therapists',
      title: 'Gerenciar Terapeutas',
      description: 'Equipe e especialidades',
      icon: Plus,
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => navigate('/therapists')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <span>Ações Rápidas</span>
        </CardTitle>
        <CardDescription>Acesso direto às principais funcionalidades</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                onClick={action.action}
                className={`${action.color} text-white h-auto p-4 flex flex-col items-center space-y-2 hover:scale-105 transition-all duration-200`}
                variant="default"
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Placeholder for export functionality
              console.log('Export report functionality to be implemented');
            }}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exportar Relatório Semanal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
