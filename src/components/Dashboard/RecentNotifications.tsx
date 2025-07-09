
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, AlertCircle, UserPlus, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'cancelled' | 'rescheduled' | 'new_child' | 'workload_alert';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface RecentNotificationsProps {
  notifications: Notification[];
}

const RecentNotifications: React.FC<RecentNotificationsProps> = ({ notifications }) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'rescheduled':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'new_child':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'workload_alert':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <span>Notificações Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma notificação recente</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <span>Notificações Recentes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                notification.read 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              {getNotificationIcon(notification.type)}
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(notification.timestamp)}
                </p>
              </div>
              
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentNotifications;
