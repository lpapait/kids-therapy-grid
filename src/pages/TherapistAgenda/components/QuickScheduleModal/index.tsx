
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { useTherapistAgendaContext } from '../../context/TherapistAgendaContext';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const QuickScheduleModal: React.FC = () => {
  const { state, dispatch } = useTherapistAgendaContext();
  const { children, therapists } = useData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    childId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    duration: 60,
    activity: '',
    notes: ''
  });

  const therapist = therapists.find(t => t.id === state.quickScheduleModal.therapistId);
  const availableTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement actual scheduling logic
    toast({
      title: "Sessão agendada com sucesso",
      description: `Sessão marcada para ${therapist?.name} em ${format(new Date(formData.date), 'dd/MM/yyyy')} às ${formData.time}`,
    });

    dispatch({ type: 'CLOSE_QUICK_SCHEDULE' });
    setFormData({
      childId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      duration: 60,
      activity: '',
      notes: ''
    });
  };

  const handleClose = () => {
    dispatch({ type: 'CLOSE_QUICK_SCHEDULE' });
  };

  if (!therapist) return null;

  return (
    <Dialog open={state.quickScheduleModal.isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Agendamento Rápido</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Agendar sessão para <strong>{therapist.name}</strong>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="child" className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>Criança</span>
            </Label>
            <Select 
              value={formData.childId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, childId: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma criança" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Select 
                value={formData.date} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {nextSevenDays.map((date) => (
                    <SelectItem key={date.toISOString()} value={format(date, 'yyyy-MM-dd')}>
                      {format(date, 'dd/MM (eee)', { locale: ptBR })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Horário</span>
              </Label>
              <Select 
                value={formData.time} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity">Atividade/Especialidade</Label>
            <Select 
              value={formData.activity} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, activity: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma especialidade" />
              </SelectTrigger>
              <SelectContent>
                {therapist.specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Select 
              value={formData.duration.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">60 minutos</SelectItem>
                <SelectItem value="90">90 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Observações</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Observações adicionais (opcional)"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Agendar Sessão
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickScheduleModal;
