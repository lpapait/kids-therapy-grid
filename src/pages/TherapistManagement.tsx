import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useData } from '@/contexts/DataContext';
import { Therapist, SPECIALTIES, PROFESSIONAL_TYPES } from '@/types';
import { UserPlus, Plus, GraduationCap, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TherapistManagement = () => {
  const { therapists, addTherapist } = useData();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    education: '',
    professionalType: '',
    specialties: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTherapist: Omit<Therapist, 'id' | 'createdAt' | 'color'> = {
      name: formData.name,
      licenseNumber: formData.licenseNumber,
      education: formData.education,
      professionalType: formData.professionalType,
      specialties: formData.specialties
    };

    addTherapist(newTherapist);
    
    toast({
      title: "Terapeuta cadastrado com sucesso!",
      description: `${formData.name} foi adicionado ao sistema.`,
    });

    // Reset form
    setFormData({
      name: '',
      licenseNumber: '',
      education: '',
      professionalType: '',
      specialties: []
    });
    
    setIsDialogOpen(false);
  };

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialties: checked 
        ? [...prev.specialties, specialty]
        : prev.specialties.filter(s => s !== specialty)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Terapeutas</h1>
          <p className="text-gray-600">Cadastro e acompanhamento dos profissionais</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Terapeuta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Terapeuta</DialogTitle>
              <DialogDescription>
                Preencha as informações profissionais do terapeuta
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Número da Licença/Registro *</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    placeholder="Ex: TO-12345, CREFITO-123456"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo Profissional *</Label>
                <Select 
                  value={formData.professionalType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, professionalType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFESSIONAL_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Formação Acadêmica *</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  placeholder="Ex: Terapia Ocupacional - UFMG, Especialização em Neurologia Pediátrica"
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Especialidades *</Label>
                <div className="grid grid-cols-2 gap-4">
                  {SPECIALTIES.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialty}
                        checked={formData.specialties.includes(specialty)}
                        onCheckedChange={(checked) => 
                          handleSpecialtyChange(specialty, checked as boolean)
                        }
                      />
                      <Label htmlFor={specialty} className="text-sm font-normal">
                        {specialty}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.specialties.length === 0 && (
                  <p className="text-sm text-red-600">Selecione pelo menos uma especialidade</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={formData.specialties.length === 0}
                >
                  Cadastrar Terapeuta
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {therapists.map((therapist) => (
          <Card key={therapist.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                    style={{ backgroundColor: therapist.color }}
                  />
                  <span>{therapist.name}</span>
                </div>
              </CardTitle>
              <CardDescription>{therapist.professionalType}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-2" />
                  <span className="font-medium">Registro:</span>
                  <span className="ml-1">{therapist.licenseNumber}</span>
                </div>
                
                <div className="flex items-start text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Formação:</span>
                    <p className="text-gray-600">{therapist.education}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Especialidades</h4>
                <div className="flex flex-wrap gap-2">
                  {therapist.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t">
                Cadastrado em: {therapist.createdAt.toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {therapists.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum terapeuta cadastrado
            </h3>
            <p className="text-gray-600 mb-4">
              Comece cadastrando seu primeiro terapeuta no sistema
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeiro Terapeuta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TherapistManagement;
