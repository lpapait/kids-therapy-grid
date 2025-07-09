
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Activity, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface TodaySession {
  id: string;
  time: string;
  childName: string;
  specialty: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  activity: string;
}

interface TodaySessionsListProps {
  sessions: TodaySession[];
}

const TodaySessionsList: React.FC<TodaySessionsListProps> = ({ sessions }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Concluída</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">Pendente</Badge>;
    }
  };

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Sessões de Hoje</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma sessão agendada para hoje</p>
            <p className="text-sm mt-1">Aproveite para planejar a semana!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Sessões de Hoje</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(session.status)}
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{session.time}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-700">{session.childName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <Activity className="h-3 w-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{session.specialty}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusBadge(session.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaySessionsList;
