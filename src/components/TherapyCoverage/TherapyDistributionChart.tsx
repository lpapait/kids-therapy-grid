
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { TherapyDistributionData } from '@/hooks/useTherapyDistribution';

interface TherapyDistributionChartProps {
  data: TherapyDistributionData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
        <p className="font-medium text-gray-900">
          {data.name} – {data.hours}h agendadas ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const TherapyDistributionChart: React.FC<TherapyDistributionChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Distribuição de Terapias</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color }}>
                    {value} ({entry.payload.percentage}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Resumo textual */}
        <div className="mt-4 grid grid-cols-1 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">{item.name}</span>
              </div>
              <span className="font-medium text-gray-900">
                {item.hours}h ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TherapyDistributionChart;
