
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, Download } from 'lucide-react';
import { OptimizedTherapistAlert } from '@/hooks/useOptimizedAlerts';
import { Therapist } from '@/types';

interface ChartData {
  name: string;
  utilization: number;
  hours: number;
  maxHours: number;
  status: string;
  color: string;
}

interface TherapistDetailsListProps {
  chartData: ChartData[];
  alerts: OptimizedTherapistAlert[];
  therapists: Therapist[];
  onViewTherapist?: (therapistId: string) => void;
  onExportReport: (type: 'utilization' | 'capacity') => void;
}

const TherapistDetailsList: React.FC<TherapistDetailsListProps> = ({
  chartData,
  alerts,
  therapists,
  onViewTherapist,
  onExportReport
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Detalhamento por Terapeuta</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onExportReport('capacity')}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Capacidade</span>
          </Button>
        </CardTitle>
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
                    {alert && (
                      <Badge variant="outline" className="text-xs">
                        {alert.recommendation}
                      </Badge>
                    )}
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
  );
};

export default TherapistDetailsList;
