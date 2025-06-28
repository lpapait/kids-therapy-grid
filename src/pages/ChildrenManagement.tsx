import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Child, Guardian, WeeklyTherapy, Address, RELATIONSHIP_TYPES } from '@/types';
import { Users, Plus, Calendar, Phone, Mail, Clock, MapPin, FileText, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WeeklyTherapiesManager from '@/components/WeeklyTherapiesManager';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { childFormSchema, type ChildFormData } from '@/lib/validationSchemas';
import { useCEPLookup } from '@/hooks/useCEPLookup';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ChildrenManagement = () => {
  const { children, addChild } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const { lookupCEP, loading: cepLoading } = useCEPLookup();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<ChildFormData>({
    resolver: zodResolver(childFormSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      gender: undefined,
      cpf: '',
      susCard: '',
      medications: '',
      diagnosis: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        cep: ''
      },
      guardians: [{ name: '', relationship: RELATIONSHIP_TYPES[0], phone: '', email: '', cpf: '' }],
      weeklyTherapies: []
    }
  });

  const handleCEP = async (cep: string, index?: number) => {
    if (cep.replace(/\D/g, '').length === 8) {
      const address = await lookupCEP(cep);
      if (address) {
        form.setValue('address.street', address.street);
        form.setValue('address.neighborhood', address.neighborhood);
        form.setValue('address.city', address.city);
        form.setValue('address.state', address.state);
      }
    }
  };

  const onSubmit = (data: ChildFormData) => {
    if (!user) return;

    // Convert form data to proper types
    const validGuardians: Guardian[] = data.guardians
      .filter(g => g.name && g.relationship && g.phone)
      .map(g => ({
        name: g.name!,
        relationship: g.relationship!,
        phone: g.phone!,
        email: g.email || undefined,
        cpf: g.cpf || undefined
      }));

    const validWeeklyTherapies: WeeklyTherapy[] = data.weeklyTherapies
      .filter(t => t.specialty && t.hoursRequired)
      .map(t => ({
        specialty: t.specialty!,
        hoursRequired: t.hoursRequired!
      }));

    let validAddress: Address | undefined = undefined;
    if (data.address && data.address.street && data.address.number && data.address.neighborhood && data.address.city && data.address.state && data.address.cep) {
      validAddress = {
        street: data.address.street,
        number: data.address.number,
        complement: data.address.complement,
        neighborhood: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
        cep: data.address.cep
      };
    }

    const newChild: Omit<Child, 'id' | 'createdAt'> = {
      name: data.name,
      birthDate: new Date(data.birthDate),
      gender: data.gender,
      cpf: data.cpf,
      susCard: data.susCard,
      medications: data.medications,
      diagnosis: data.diagnosis,
      address: validAddress,
      guardians: validGuardians,
      weeklyTherapies: validWeeklyTherapies,
      createdBy: user.id
    };

    addChild(newChild);
    
    toast({
      title: "Criança cadastrada com sucesso!",
      description: `${data.name} foi adicionada ao sistema.`,
    });

    form.reset();
    setIsDialogOpen(false);
    setCurrentStep(1);
  };

  const addGuardian = () => {
    const currentGuardians = form.getValues('guardians');
    form.setValue('guardians', [
      ...currentGuardians,
      { name: '', relationship: RELATIONSHIP_TYPES[0], phone: '', email: '', cpf: '' }
    ]);
  };

  const removeGuardian = (index: number) => {
    const currentGuardians = form.getValues('guardians');
    if (currentGuardians.length > 1) {
      form.setValue('guardians', currentGuardians.filter((_, i) => i !== index));
    }
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

  const nextStep = async () => {
    const isValid = await form.trigger(
      currentStep === 1 ? ['name', 'birthDate', 'gender', 'cpf'] :
      currentStep === 2 ? ['diagnosis', 'medications'] :
      currentStep === 3 ? ['guardians'] : []
    );
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </h3>
              <p className="text-sm text-gray-600">Dados básicos da criança</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo da criança" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexo *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o sexo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <MaskedInput
                        mask="cpf"
                        placeholder="000.000.000-00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="susCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cartão SUS</FormLabel>
                  <FormControl>
                    <Input placeholder="Número do cartão SUS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Médicas
              </h3>
              <p className="text-sm text-gray-600">Diagnóstico e medicações</p>
            </div>

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnóstico/Laudo *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o diagnóstico médico e laudos relevantes..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Liste as medicações em uso, dosagens e horários..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                Responsáveis
              </h3>
              <p className="text-sm text-gray-600">Informações dos responsáveis</p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <Label>Responsáveis *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addGuardian}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Responsável
              </Button>
            </div>
            
            {form.watch('guardians').map((guardian, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Responsável {index + 1}</h4>
                  {form.watch('guardians').length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeGuardian(index)}
                    >
                      Remover
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`guardians.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`guardians.${index}.relationship`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parentesco *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RELATIONSHIP_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`guardians.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone *</FormLabel>
                        <FormControl>
                          <MaskedInput
                            mask="phone"
                            placeholder="(11) 99999-9999"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`guardians.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@exemplo.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`guardians.${index}.cpf`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <MaskedInput
                            mask="cpf"
                            placeholder="000.000.000-00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço e Terapias
              </h3>
              <p className="text-sm text-gray-600">Informações complementares</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Endereço (Opcional)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="address.cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <MaskedInput
                          mask="cep"
                          placeholder="00000-000"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleCEP(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Logradouro</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, Avenida, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="address.number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address.complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Apto, Bloco, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address.neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <WeeklyTherapiesManager
              weeklyTherapies={form.watch('weeklyTherapies').filter(t => t.specialty && t.hoursRequired) as WeeklyTherapy[]}
              onChange={(therapies) => form.setValue('weeklyTherapies', therapies)}
            />
          </div>
        );

      default:
        return null;
    }
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Criança</DialogTitle>
              <DialogDescription>
                Preencha as informações da criança seguindo as etapas
              </DialogDescription>
            </DialogHeader>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Etapa {currentStep} de 4</span>
                <div className="text-sm text-gray-500">
                  {Math.round((currentStep / 4) * 100)}% completo
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStep()}
                
                <div className="flex justify-between pt-6 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={currentStep === 1 ? () => setIsDialogOpen(false) : prevStep}
                  >
                    {currentStep === 1 ? 'Cancelar' : 'Anterior'}
                  </Button>
                  
                  {currentStep < 4 ? (
                    <Button type="button" onClick={nextStep}>
                      Próximo
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Cadastrar Criança
                    </Button>
                  )}
                </div>
              </form>
            </Form>
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

              {child.weeklyTherapies && child.weeklyTherapies.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Terapias Semanais
                  </h4>
                  <div className="space-y-1">
                    {child.weeklyTherapies.map((therapy, index) => (
                      <div key={index} className="text-sm bg-purple-50 p-2 rounded flex justify-between">
                        <span>{therapy.specialty}</span>
                        <Badge variant="outline" className="text-xs">
                          {therapy.hoursRequired}h/semana
                        </Badge>
                      </div>
                    ))}
                    <div className="text-xs text-gray-600 mt-1">
                      Total: {child.weeklyTherapies.reduce((sum, t) => sum + t.hoursRequired, 0)}h por semana
                    </div>
                  </div>
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

              {child.address && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Endereço
                  </h4>
                  <div className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                    <div>{child.address.street}, {child.address.number}</div>
                    {child.address.complement && <div>{child.address.complement}</div>}
                    <div>{child.address.neighborhood} - {child.address.city}/{child.address.state}</div>
                    <div>CEP: {child.address.cep}</div>
                  </div>
                </div>
              )}
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
