
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface SessionCancelButtonProps {
  reason: string;
  onReasonChange: (value: string) => void;
  onCancel: (reason: string) => void;
}

const SessionCancelButton: React.FC<SessionCancelButtonProps> = ({
  reason,
  onReasonChange,
  onCancel
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancel = () => {
    if (!reason.trim()) {
      alert('Por favor, informe o motivo do cancelamento.');
      return;
    }
    
    onCancel(reason);
    setShowCancelConfirm(false);
  };

  return (
    <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="sm"
        >
          Cancelar Sessão
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar Sessão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja cancelar esta sessão? Esta ação será registrada no histórico.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label htmlFor="cancel-reason">Motivo do cancelamento *</Label>
          <Textarea
            id="cancel-reason"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Informe o motivo do cancelamento..."
            rows={2}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Não cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
            Sim, cancelar sessão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionCancelButton;
