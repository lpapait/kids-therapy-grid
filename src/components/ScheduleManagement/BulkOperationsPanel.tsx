
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Trash2, MoveRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BulkOperationsPanelProps {
  selectedCount: number;
  onBulkCancel: (reason: string) => void;
  onBulkReschedule: (newDate: Date, reason: string) => void;
  onClearSelection: () => void;
}

const BulkOperationsPanel: React.FC<BulkOperationsPanelProps> = ({
  selectedCount,
  onBulkCancel,
  onBulkReschedule,
  onClearSelection
}) => {
  const [reason, setReason] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);

  const handleBulkCancel = () => {
    if (!reason.trim()) {
      alert('Por favor, informe o motivo do cancelamento.');
      return;
    }
    onBulkCancel(reason);
    setReason('');
  };

  const handleBulkReschedule = () => {
    if (!rescheduleDate) {
      alert('Por favor, selecione uma nova data.');
      return;
    }
    if (!reason.trim()) {
      alert('Por favor, informe o motivo da remarcação.');
      return;
    }
    onBulkReschedule(rescheduleDate, reason);
    setReason('');
    setRescheduleDate(undefined);
    setShowCalendar(false);
  };

  if (selectedCount === 0) return null;

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-blue-900">
          <div className="flex items-center space-x-2">
            <span>Operações em Lote</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedCount} sessão{selectedCount !== 1 ? 'ões' : ''} selecionada{selectedCount !== 1 ? 's' : ''}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-blue-700 hover:text-blue-900"
          >
            Limpar seleção
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Motivo da operação</Label>
          <Textarea
            id="reason"
            placeholder="Informe o motivo para esta operação em lote..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[60px]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkCancel}
            className="flex items-center space-x-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Cancelar Todas</span>
          </Button>

          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <MoveRight className="h-4 w-4" />
                <span>Remarcar para</span>
                {rescheduleDate && (
                  <span className="ml-1 font-medium">
                    {format(rescheduleDate, 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={rescheduleDate}
                onSelect={setRescheduleDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
              <div className="p-3 border-t">
                <Button
                  onClick={handleBulkReschedule}
                  disabled={!rescheduleDate}
                  className="w-full"
                  size="sm"
                >
                  Confirmar Remarcação
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkOperationsPanel;
