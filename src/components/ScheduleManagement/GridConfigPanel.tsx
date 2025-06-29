
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GridConfig } from '@/hooks/useScheduleGrid';
import { Settings } from 'lucide-react';

interface GridConfigPanelProps {
  config: GridConfig;
  onConfigChange: (config: GridConfig) => void;
}

const GridConfigPanel: React.FC<GridConfigPanelProps> = ({
  config,
  onConfigChange
}) => {
  const timeOptions = [
    { value: '07:00', label: '07:00' },
    { value: '08:00', label: '08:00' },
    { value: '09:00', label: '09:00' },
  ];

  const endTimeOptions = [
    { value: '17:00', label: '17:00' },
    { value: '18:00', label: '18:00' },
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' },
  ];

  const durationOptions = [
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '1 hora' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Configurações da Grade</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Início</Label>
            <Select
              value={config.startTime}
              onValueChange={(value) => onConfigChange({ ...config, startTime: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time">Fim</Label>
            <Select
              value={config.endTime}
              onValueChange={(value) => onConfigChange({ ...config, endTime: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {endTimeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duração dos Slots</Label>
          <Select
            value={config.timeSlotDuration.toString()}
            onValueChange={(value) => onConfigChange({ 
              ...config, 
              timeSlotDuration: parseInt(value) 
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map(option => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="show-weekends"
            checked={config.showWeekends}
            onCheckedChange={(checked) => onConfigChange({ 
              ...config, 
              showWeekends: checked 
            })}
          />
          <Label htmlFor="show-weekends">Mostrar fins de semana</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default GridConfigPanel;
