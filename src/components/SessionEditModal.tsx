
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, Clock, User, Activity, FileText, History, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Schedule, Therapist, Child, SPECIALTIES } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import SessionHistoryModal from './SessionHistoryModal';

interface SessionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule?: Schedule;
  date: Date;
  time: string;
  child: Child;
}

const SessionEditModal: React.FC<SessionEditModalProps> = ({
  isOpen,
  onClose,
  schedule,
  date,
  time,
  child
}) => {
  const { therapists, addSchedule, updateSchedule } = useData();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    activity: schedule?.activity || '',
    therapistId: schedule?.therapistId || '',
    status: schedule?.status || 'scheduled' as Schedule['status'],
    observations: schedule?.observations || '',
    reason: ''
  });

  const [showHistory, setShowHistory] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (schedule) {
      setFormData({
        activity: schedule.activity,
        therapistId: schedule.therapistId,
        status: schedule.status,
        observations: schedule.observations || '',
        reason: ''
      });
    } else {
      setFormData({
        activity: '',
        therapistId: '',
        status: 'scheduled',
        observations: '',
        reason: ''
      });
    }
  }, [schedule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.activity || !formData.therapistId) {
      return;
    }

    // Verificar se precisa de motivo para mudanças críticas
    const isCriticalChange = schedule && (
      formData.status === 'cancelled' || 
      formData.status === 'rescheduled' ||
      (schedule.status === 'scheduled' && formData.status === 'completed')
    );

    if (isCriticalChange && !formData.reason.trim()) {
      alert('Por favor, informe o motivo da alteração.');
      return;
    }

    if (schedule) {
      // Atualizar sessão existente
      updateSchedule(schedule.id, {
        activity: formData.activity,
        therapistId: formData.therapistId,
        status: formData.status,
        observations: formData.observations,
        updatedBy: user?.id || ''
      }, formData.reason || undefined);
    } else {
      // Criar nova sessão
      addSchedule({
        childId: child.id,
        therapistId: formData.therapistId,
        date,
        time,
        activity: formData.activity,
        status: formData.status,
        observations: formData.observations,
        updatedBy: user?.id || ''
      });
    }
    
    onClose();
  };

  const handleCancel = () => {
    if (schedule && user?.role === 'moderator') {
      if (!formData.reason.trim()) {
        alert('Por favor, informe o motivo do cancelamento.');
        return;
      }
      
      updateSchedule(schedule.id, {
        status: 'cancelled',
        updatedBy: user.id
      }, formData.reason);
      
      setShowCancelConfirm(false);
      onClose();
    }
  };

  const selectedTherapist = therapists.find(t => t.id === formData.therapistId);

  // Verificar se houve mudanças significativas
  const hasSignificantChanges = schedule && (
    formData.status !== schedule.status ||
    formData.therapistId !== schedule.therapistId ||
    formData.activity !== schedule.activity
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>
                  {schedule ? 'Editar Sessão' : 'Nova Sessão'} - {child.name}
                </span>
              </div>
              {schedule && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(true)}
                >
                  <History className="h-4 w-4 mr-2" />
                  Histórico
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Data e Horário */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Data</span>
                </Label>
                <Input
                  value={format(date, 'dd/MM/yyyy', { locale: ptBR })}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Horário</span>
                </Label>
                <Input
                  value={time}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Atividade */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <Activity className="h-4 w-4" />
                <span>Atividade</span>
              </Label>
              <Select value={formData.activity} onValueChange={(value) => setFormData(prev => ({ ...prev, activity: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a atividade" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Terapeuta */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Terapeuta</span>
              </Label>
              <Select value={formData.therapistId} onValueChange={(value) => setFormData(prev => ({ ...prev, therapistId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o terapeuta" />
                </SelectTrigger>
                <SelectContent>
                  {therapists
                    .filter(t => t.specialties.includes(formData.activity))
                    .map((therapist) => (
                      <SelectItem key={therapist.id} value={therapist.id}>
                        {therapist.name} - {therapist.professionalType}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {selectedTherapist && (
                <p className="text-xs text-gray-600">
                  {selectedTherapist.education} | {selectedTherapist.licenseNumber}
                </p>
              )}
            </div>

            {/* Status */}
            {schedule && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value: Schedule['status']) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="completed">Realizado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="rescheduled">Remarcado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Observações */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>Observações</span>
              </Label>
              <Textarea
                value={formData.observations}
                onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                placeholder="Observações sobre a sessão..."
                rows={3}
              />
            </div>

            {/* Campo de motivo para mudanças críticas */}
            {hasSignificantChanges && (
              <div className="space-y-2">
                <Label className="flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>Motivo da Alteração *</span>
                </Label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Informe o motivo desta alteração..."
                  rows={2}
                  required
                />
              </div>
            )}

            <DialogFooter className="flex justify-between">
              <div>
                {schedule && user?.role === 'moderator' && (
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
                          value={formData.reason}
                          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
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
                )}
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {schedule ? 'Atualizar' : 'Criar'} Sessão
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de histórico */}
      {schedule && showHistory && (
        <SessionHistoryModal
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          schedule={schedule}
        />
      )}
    </>
  );
};

export default SessionEditModal;
