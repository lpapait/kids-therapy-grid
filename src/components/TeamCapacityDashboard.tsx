
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Eye, Shuffle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useTherapistAlerts } from '@/hooks/useTherapistAlerts';
import { useToast } from '@/hooks/use-toast';

interface TeamCapacityDashboardProps {
  selectedWeek: Date;
  onViewTherapist?: (therapistId: string) => void;
  onRedistributeLoad?: () => void;
}

const TeamCapacityDashboard: React.FC<TeamCapacityDashboardProps> = ({
  selectedWeek,
  onViewTherapist,
  onRedistributeLoad
}) => {
  const { therapists } = useData();
  const alerts = useTherapistAlerts(selectedWeek);
  const { toast } = useToast();

  // Prepare chart data
  const chartData = therapists.map(therapist => {
    const alert = alerts.find(a => a.therapistId === therapist.id);
    const status = alert?.status || 'ok';
    let color: string;
    
    switch (status) {
      case 'critical': 
        color = '#ef4444';
        break;
      case 'near_limit': 
        color = '#f97316';
        break;
      case 'approaching_limit': 
        color = '#eab308';
        break;
      default: 
        color = '#22c55e';
        break;
    }
    
    return {
      name: therapist.name.split(' ')[0], // First name only for chart
      utilization: alert?.percentage || 0,
      hours: alert?.hoursScheduled || 0,
      maxHours: therapist.weeklyWorkloadHours,
      status,
      color
    };
  }).sort((a, b) => b.utilization - a.utilization);

  const handleRedistribute = () => {
    if (onRedistributeLoad) {
      onRedistributeLoad();
    }
    toast({
      title: 'Redistribuição Iniciada',
      description: 'Analisando possibilidades de redistribuição da carga horária...',
      variant: 'default'
    });
  };

  const totalCapacity = therapists.reduce((sum, t) => sum + t.weeklyWorkloadHours, 0);
  const totalUtilized = alerts.reduce((sum, a) => sum + a.hoursScheduled, 0);
  const overallUtilization = Math.round((totalUtilized / totalCapacity) * 100);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span>Utilização Geral</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overallUtilization}%</div>
            <p className="text-xs text-gray-600">{totalUtilized.toFixed(1)}h / {totalCapacity}h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Alertas Críticos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.status === 'critical').length}
            </div>
            <p className="text-xs text-gray-600">Terapeutas sobrecarregados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span>Próximos ao Limite</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.status === 'near_limit').length}
            </div>
            <p className="text-xs text-gray-600">Requerem atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <span>Disponíveis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {therapists.length - alerts.length}
            </div>
            <p className="text-xs text-gray-600">Com capacidade livre</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Utilização por Terapeuta</span>
            {alerts.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRedistribute}
                className="flex items-center space-x-2"
              >
                <Shuffle className="h-4 w-4" />
                <span>Sugerir Redistribuição</span>
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: number, name: string, entry: any) => [
                    `${value}% (${entry.payload.hours}h / ${entry.payload.maxHours}h)`,
                    'Utilização'
                  ]}
                />
                <Bar dataKey="utilization" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed List */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Terapeuta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.map((data) => {
              const alert = alerts.find(a => a.therapistName.includes(data.name));
              const therapist = therapists.find(t => t.name.includes(data.name));
              
              return (
                <div key={data.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold">{therapist?.name}</h4>
                      <Badge 
                        variant={
                          data.utilization >= 95 ? 'destructive' :
                          data.utilization >= 80 ? 'outline' : 'secondary'
                        }
                      >
                        {data.utilization}%
                      </Badge>
                    </div>
                    
                    <Progress 
                      value={data.utilization} 
                      className={`h-2 mb-2 ${
                        data.utilization >= 95 ? '[&>div]:bg-red-500' :
                        data.utilization >= 80 ? '[&>div]:bg-orange-500' :
                        '[&>div]:bg-green-500'
                      }`}
                    />
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{data.hours}h / {data.maxHours}h</span>
                      {alert && (
                        <span>Restam: {alert.remainingHours.toFixed(1)}h</span>
                      )}
                      {alert && (
                        <span>~{alert.remainingSessions} sessões possíveis</span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewTherapist && therapist && onViewTherapist(therapist.id)}
                    className="ml-4"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Agenda
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamCapacityDashboard;
