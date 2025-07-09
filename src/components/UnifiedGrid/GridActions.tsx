
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Trash2, 
  RotateCcw 
} from 'lucide-react';
import { Schedule } from '@/types';

interface GridActionsProps {
  selectedCount: number;
  onBulkUpdate: (status: Schedule['status'], reason?: string) => void;
  onClearSelection: () => void;
}

const GridActions: React.FC<GridActionsProps> = ({
  selectedCount,
  onBulkUpdate,
  onClearSelection
}) => {
  const handleBulkComplete = () => {
    onBulkUpdate('completed', 'Sessões marcadas como realizadas em lote');
  };

  const handleBulkCancel = () => {
    onBulkUpdate('cancelled', 'Sessões canceladas em lote');
  };

  const handleBulkReschedule = () => {
    onBulkUpdate('rescheduled', 'Sessões remarcadas em lote');
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant="default" className="bg-primary">
              {selectedCount} sessão{selectedCount !== 1 ? 'ões' : ''} selecionada{selectedCount !== 1 ? 's' : ''}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Ctrl+Click para selecionar múltiplas sessões
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkComplete}
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Marcar como Realizadas</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkReschedule}
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Remarcar</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkCancel}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <XCircle className="h-4 w-4" />
              <span>Cancelar</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Limpar Seleção</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GridActions;
