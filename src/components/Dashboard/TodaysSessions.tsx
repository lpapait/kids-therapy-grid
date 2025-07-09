
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Stethoscope } from 'lucide-react';

interface TodaysSession {
  id: string;
  time: string;
  childName: string;
  specialty: string;
  therapistName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  activity: string;
}

interface TodaysSessionsProps {
  sessions: TodaysSession[];
}

const TodaysSessions: React.FC<TodaysSessionsProps> = ({ sessions }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Concluída</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">Agendada</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Sessões de Hoje</span>
        </CardTitle>
        <CardDescription>
          {sessions.length} sessão{sessions.length !== 1 ? 'ões' : ''} programada{sessions.length !== 1 ? 's' : ''} para hoje
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma sessão agendada para hoje</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.slice(0, 6).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="font-medium text-blue-600">{session.time}</span>
                    <span className="font-medium">{session.childName}</span>
                    {getStatusBadge(session.status)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Stethoscope className="h-4 w-4" />
                      <span>{session.specialty}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{session.therapistName}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {session.activity}
                  </div>
                </div>
              </div>
            ))}
            
            {sessions.length > 6 && (
              <div className="text-center pt-2">
                <p className="text-sm text-gray-500">
                  +{sessions.length - 6} sessão{sessions.length - 6 !== 1 ? 'ões' : ''} adicional{sessions.length - 6 !== 1 ? 'is' : ''}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysSessions;
