
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdministrativeScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapistId: string;
  date: Date;
  time: string;
}

const ADMINISTRATIVE_ACTIVITIES = [
  { id: 'reports', label: 'Relatórios Clínicos', duration: 60, icon: FileText },
  { id: 'records', label: 'Registros e Evolução', duration: 45, icon: User },
  { id: 'planning', label: 'Planejamento Semanal', duration: 90, icon: Calendar },
  { id: 'documentation', label: 'Documentação', duration: 60, icon: FileText },
  { id: 'meetings', label: 'Reuniões Administrativas', duration: 120, icon: Clock }
];

const AdministrativeScheduleModal: React.FC<AdministrativeScheduleModalProps> = ({
  isOpen,
  onClose,
  therapistId,
  date,
  time
}) => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [duration, setDuration] = useState(60);
  const [observations, setObservations] = useState('');
  const { toast } = useToast();
  const { addSchedule, getTherapistById } = useData();

  const therapist = getTherapistById(therapistId);

  const handleSubmit = () => {
    const activityName = selectedActivity === 'custom' 
      ? customActivity 
      : ADMINISTRATIVE_ACTIVITIES.find(a => a.id === selectedActivity)?.label || '';

    if (!activityName.trim()) {
      toast({
        title: 'Erro',
        description: 'Selecione ou digite uma atividade administrativa.',
        variant: 'destructive'
      });
      return;
    }

    addSchedule({
      therapistId,
      date,
      time,
      activity: activityName,
      duration,
      type: 'administrative',
      status: 'scheduled',
      observations,
      updatedBy: 'current-user'
    });

    toast({
      title: 'Sucesso!',
      description: `Tempo administrativo agendado para ${therapist?.name}`,
    });

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedActivity('');
    setCustomActivity('');
    setDuration(60);
    setObservations('');
  };

  const selectedActivityData = ADMINISTRATIVE_ACTIVITIES.find(a => a.id === selectedActivity);

  React.useEffect(() => {
    if (selectedActivityData) {
      setDuration(selectedActivityData.duration);
    }
  }, [selectedActivityData]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Agendar Tempo Administrativo
          </DialogTitle>
          <DialogDescription>
            Configure uma sessão administrativa para {therapist?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do agendamento */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{format(date, 'EEEE, dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <span>{therapist?.name}</span>
            </div>
          </div>

          {/* Seleção de atividade */}
          <div className="space-y-2">
            <Label htmlFor="activity">Tipo de Atividade</Label>
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma atividade administrativa" />
              </SelectTrigger>
              <SelectContent>
                {ADMINISTRATIVE_ACTIVITIES.map(activity => (
                  <SelectItem key={activity.id} value={activity.id}>
                    <div className="flex items-center gap-2">
                      <activity.icon className="h-4 w-4" />
                      <span>{activity.label}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {activity.duration}min
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
                <SelectItem value="custom">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Outra atividade...</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campo customizado */}
          {selectedActivity === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customActivity">Descrição da Atividade</Label>
              <Input
                id="customActivity"
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
                placeholder="Digite a atividade administrativa..."
              />
            </div>
          )}

          {/* Duração */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="90">1h 30min</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observações (opcional)</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Adicione detalhes sobre a atividade..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Agendar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdministrativeScheduleModal;
