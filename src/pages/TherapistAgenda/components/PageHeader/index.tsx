
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, BarChart3, Download, Settings, RefreshCw } from 'lucide-react';
import WeekSelector from '@/components/WeekSelector';

interface PageHeaderProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  totalTherapists: number;
  filteredCount: number;
  viewMode: 'grid' | 'list' | 'calendar' | 'capacity';
  onViewModeChange: (mode: 'grid' | 'list' | 'calendar' | 'capacity') => void;
  onExportAll: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  selectedWeek,
  onWeekChange,
  totalTherapists,
  filteredCount,
  viewMode,
  onViewModeChange,
  onExportAll,
  onRefresh,
  isLoading = false
}) => {
  const viewModeOptions = [
    { value: 'grid', label: 'Grid', icon: Users },
    { value: 'list', label: 'Lista', icon: BarChart3 },
    { value: 'calendar', label: 'Calendário', icon: Calendar },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Title and Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <span>Agendas dos Terapeutas</span>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {filteredCount} de {totalTherapists}
            </Badge>
          </h1>
          <p className="text-gray-600 mt-2">
            Visualize e monitore as agendas semanais de toda a equipe terapêutica
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportAll}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Tudo</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <WeekSelector
          selectedWeek={selectedWeek}
          onWeekChange={onWeekChange}
        />
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 mr-2">Visualização:</span>
          {viewModeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={viewMode === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange(option.value)}
                className="flex items-center space-x-1"
              >
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
