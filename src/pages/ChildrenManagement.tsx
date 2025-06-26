
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Child, Guardian } from '@/types';
import { Users, Plus, Calendar, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChildrenManagement = () => {
  const { children, addChild } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '' as 'male' | 'female' | '',
    medications: '',
    diagnosis: '',
    guardians: [{ name: '', relationship: '', phone: '', email: '' }] as Guardian[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const newChild: Omit<Child, 'id' | 'createdAt'> = {
      name: formData.name,
      birthDate: new Date(formData.birthDate),
      gender: formData.gender as 'male' | 'female',
      medications: formData.medications,
      diagnosis: formData.diagnosis,
      guardians: formData.guardians.filter(g => g.name && g.relationship && g.phone),
      createdBy: user.id
    };

    addChild(newChild);
    
    toast({
      title: "Criança cadastrada com sucesso!",
      description: `${formData.name} foi adicionada ao sistema.`,
    });

    // Reset form
    setFormData({
      name: '',
      birthDate: '',
      gender: '',
      medications: '',
      diagnosis: '',
      guardians: [{ name: '', relationship: '', phone: '', email: '' }]
    });
    
    setIsDialogOpen(false);
  };

  const addGuardian = () => {
    setFormData(prev => ({
      ...prev,
      guardians: [...prev.guardians, { name: '', relationship: '', phone: '', email: '' }]
    }));
  };

  const updateGuardian = (index: number, field: keyof Guardian, value: string) => {
    setFormData(prev => ({
      ...prev,
      guardians: prev.guardians.map((guardian, i) => 
        i === index ? { ...guardian, [field]: value } : guardian
      )
    }));
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Crianças</h1>
          <p className="text-gray-600">Cadastro e acompanhamento dos pacientes</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Criança
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Criança</DialogTitle>
              <DialogDescription>
                Preencha as informações da criança e dos responsáveis
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
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sexo *</Label>
                <Select value={formData.gender} onValueChange={(value: 'male' | 'female') => 
                  setFormData(prev => ({ ...prev, gender: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnóstico/Laudo *</Label>
                <Textarea
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="Descreva o diagnóstico médico..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Medicações</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                  placeholder="Liste as medicações em uso..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Responsáveis *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addGuardian}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Responsável
                  </Button>
                </div>
                
                {formData.guardians.map((guardian, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome *</Label>
                        <Input
                          value={guardian.name}
                          onChange={(e) => updateGuardian(index, 'name', e.target.value)}
                          placeholder="Nome completo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Parentesco *</Label>
                        <Input
                          value={guardian.relationship}
                          onChange={(e) => updateGuardian(index, 'relationship', e.target.value)}
                          placeholder="Ex: Mãe, Pai, Avó..."
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefone *</Label>
                        <Input
                          value={guardian.phone}
                          onChange={(e) => updateGuardian(index, 'phone', e.target.value)}
                          placeholder="(11) 99999-9999"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={guardian.email}
                          onChange={(e) => updateGuardian(index, 'email', e.target.value)}
                          placeholder="email@exemplo.com"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Cadastrar Criança
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {children.map((child) => (
          <Card key={child.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{child.name}</CardTitle>
                <Badge variant="secondary">
                  {calculateAge(child.birthDate)} anos
                </Badge>
              </div>
              <CardDescription>
                {child.gender === 'male' ? 'Masculino' : 'Feminino'} • 
                Nascimento: {child.birthDate.toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Diagnóstico</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {child.diagnosis}
                </p>
              </div>

              {child.medications && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Medicações</h4>
                  <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                    {child.medications}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Responsáveis</h4>
                <div className="space-y-2">
                  {child.guardians.map((guardian, index) => (
                    <div key={index} className="text-sm bg-blue-50 p-2 rounded">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{guardian.name}</span>
                        <span className="text-gray-600">({guardian.relationship})</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-gray-600">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {guardian.phone}
                        </div>
                        {guardian.email && (
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {guardian.email}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {children.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma criança cadastrada
            </h3>
            <p className="text-gray-600 mb-4">
              Comece cadastrando sua primeira criança no sistema
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeira Criança
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChildrenManagement;
