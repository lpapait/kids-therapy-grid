
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Users, Calendar } from 'lucide-react';
import { usePlanningPendencies } from '@/hooks/usePlanningPendencies';
import { useNavigate } from 'react-router-dom';

interface PlanningPendenciesProps {
  selectedWeek: Date;
}

const PlanningPendencies: React.FC<PlanningPendenciesProps> = ({ selectedWeek }) => {
  const pendencies = usePlanningPendencies(selectedWeek);
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'incomplete_child':
        return Users;
      case 'unassigned_session':
        return Clock;
      case 'empty_slot':
        return Calendar;
      default:
        return AlertTriangle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <span>Pendências de Planejamento</span>
        </CardTitle>
        <CardDescription>
          {pendencies.length} pendência{pendencies.length !== 1 ? 's' : ''} identificada{pendencies.length !== 1 ? 's' : ''} para esta semana
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendencies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium text-green-700">Planejamento completo!</p>
            <p className="text-sm text-green-600">Nenhuma pendência identificada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendencies.slice(0, 5).map((pendency) => {
              const Icon = getIcon(pendency.type);
              return (
                <div 
                  key={pendency.id} 
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${getPriorityColor(pendency.priority)}`}
                >
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{pendency.title}</p>
                    <p className="text-sm opacity-80">{pendency.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pendency.priority === 'high' ? 'bg-red-100 text-red-800' :
                      pendency.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {pendency.priority === 'high' ? 'Alta' :
                       pendency.priority === 'medium' ? 'Média' : 'Baixa'}
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                {pendencies.length > 5 && (
                  <span>+{pendencies.length - 5} pendência{pendencies.length - 5 !== 1 ? 's' : ''} adicional{pendencies.length - 5 !== 1 ? 'is' : ''}</span>
                )}
              </div>
              <Button 
                onClick={() => navigate('/schedule')} 
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
              >
                Ir para Planejamento
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanningPendencies;
