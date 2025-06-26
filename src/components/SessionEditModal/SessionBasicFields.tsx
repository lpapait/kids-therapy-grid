
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SPECIALTIES } from '@/types';
import { useData } from '@/contexts/DataContext';

interface SessionBasicFieldsProps {
  formData: {
    activity: string;
    therapistId: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  date: Date;
  time: string;
}

const SessionBasicFields: React.FC<SessionBasicFieldsProps> = ({
  formData,
  setFormData,
  date,
  time
}) => {
  const { therapists } = useData();
  const selectedTherapist = therapists.find(t => t.id === formData.therapistId);

  return (
    <>
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
        <Select 
          value={formData.activity} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, activity: value }))}
        >
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
        <Select 
          value={formData.therapistId} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, therapistId: value }))}
        >
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
    </>
  );
};

export default SessionBasicFields;
