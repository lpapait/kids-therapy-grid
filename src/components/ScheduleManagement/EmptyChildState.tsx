
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const EmptyChildState: React.FC = () => {
  return (
    <div className="lg:col-span-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Grade de Agendamentos</span>
          </CardTitle>
          <CardDescription>
            Selecione uma criança para visualizar os agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Nenhuma criança selecionada</p>
            <p className="text-sm mt-2">Escolha uma criança para começar a gerenciar os agendamentos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyChildState;
