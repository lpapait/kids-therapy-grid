
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, Shuffle } from 'lucide-react';
import { OptimizedTherapistAlert } from '@/hooks/useOptimizedAlerts';

interface ChartData {
  name: string;
  utilization: number;
  hours: number;
  maxHours: number;
  status: string;
  color: string;
}

interface UtilizationChartProps {
  chartData: ChartData[];
  alerts: OptimizedTherapistAlert[];
  onExportReport: (type: 'utilization' | 'capacity') => void;
  onRedistribute: () => void;
}

const UtilizationChart: React.FC<UtilizationChartProps> = ({
  chartData,
  alerts,
  onExportReport,
  onRedistribute
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Utilização por Terapeuta</span>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExportReport('utilization')}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
            {alerts.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRedistribute}
                className="flex items-center space-x-2"
              >
                <Shuffle className="h-4 w-4" />
                <span>Sugerir Redistribuição</span>
              </Button>
            )}
          </div>
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
  );
};

export default UtilizationChart;
