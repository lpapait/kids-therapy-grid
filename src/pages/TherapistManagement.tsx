import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash2, User, FileText, MapPin, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { useCEPLookup } from '@/hooks/useCEPLookup';
import { therapistFormSchema, type TherapistFormData } from '@/lib/validationSchemas';

import { useData } from '@/contexts/DataContext';
import { Therapist, PROFESSIONAL_TYPES, SPECIALTIES, Address, WorkSchedule, TimeSlot } from '@/types';

const TherapistManagement = () => {
  const { therapists, addTherapist, updateTherapist, deleteTherapist } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const { lookupCEP } = useCEPLookup();

  const form = useForm<TherapistFormData>({
    resolver: zodResolver(therapistFormSchema),
    defaultValues: {
      name: "",
      cpf: "",
      licenseNumber: "",
      education: "",
      professionalType: PROFESSIONAL_TYPES[0],
      specialties: [],
      phone: "",
      email: "",
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        cep: ''
      },
      weeklyWorkloadHours: 40,
    },
  })

  const handleCEP = async (cep: string) => {
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

  const onSubmit = (data: TherapistFormData) => {
    // Convert form data to proper types
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

    // Convert workSchedule to proper types
    let validWorkSchedule: WorkSchedule | undefined = undefined;
    if (data.workSchedule) {
      const convertTimeSlots = (slots: { start?: string; end?: string; }[] | undefined): TimeSlot[] => {
        if (!slots) return [];
        return slots
          .filter(slot => slot.start && slot.end)
          .map(slot => ({
            start: slot.start!,
            end: slot.end!
          }));
      };

      validWorkSchedule = {
        monday: convertTimeSlots(data.workSchedule.monday),
        tuesday: convertTimeSlots(data.workSchedule.tuesday),
        wednesday: convertTimeSlots(data.workSchedule.wednesday),
        thursday: convertTimeSlots(data.workSchedule.thursday),
        friday: convertTimeSlots(data.workSchedule.friday),
        saturday: convertTimeSlots(data.workSchedule.saturday),
        sunday: convertTimeSlots(data.workSchedule.sunday)
      };
    }

    if (editingTherapist) {
      // Update existing therapist
      updateTherapist(editingTherapist.id, {
        ...data,
        address: validAddress,
        workSchedule: validWorkSchedule
      });
      toast({
        title: "Terapeuta atualizado com sucesso!",
      })
    } else {
      // Create new therapist - ensure data conforms to expected type
      const therapistData: Omit<Therapist, 'id' | 'createdAt' | 'color' | 'weeklyWorkloadHours'> = {
        name: data.name,
        cpf: data.cpf,
        licenseNumber: data.licenseNumber,
        education: data.education,
        professionalType: data.professionalType,
        specialties: data.specialties,
        phone: data.phone,
        email: data.email,
        address: validAddress,
        workSchedule: validWorkSchedule,
      };
      addTherapist(therapistData);
      toast({
        title: "Terapeuta adicionado com sucesso!",
      })
    }
    form.reset();
    setShowForm(false);
    setEditingTherapist(null);
    setCurrentStep(1);
  }

  const handleEdit = (therapist: Therapist) => {
    setEditingTherapist(therapist);
    form.setValue("name", therapist.name);
    form.setValue("cpf", therapist.cpf || "");
    form.setValue("licenseNumber", therapist.licenseNumber || "");
    form.setValue("education", therapist.education || "");
    form.setValue("professionalType", therapist.professionalType);
    form.setValue("specialties", therapist.specialties);
    form.setValue("phone", therapist.phone || "");
    form.setValue("email", therapist.email || "");
    
    // Handle address properly
    if (therapist.address) {
      form.setValue("address", therapist.address);
    } else {
      form.setValue("address", {
        street: '', number: '', complement: '', neighborhood: '', city: '', state: '', cep: ''
      });
    }
    
    form.setValue("weeklyWorkloadHours", therapist.weeklyWorkloadHours || 40);
    setShowForm(true);
  };

  const handleDelete = (therapistId: string) => {
    deleteTherapist(therapistId);
    toast({
      title: "Terapeuta removido com sucesso!",
    })
  };

  const nextStep = async () => {
    const isValid = await form.trigger(
      currentStep === 1 ? ['name', 'cpf', 'licenseNumber'] :
      currentStep === 2 ? ['education', 'professionalType', 'specialties'] : []
    );
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
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
                Dados Pessoais
              </h3>
              <p className="text-sm text-gray-600">Informações pessoais do terapeuta</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo do terapeuta" {...field} />
                    </FormControl>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
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
                name="email"
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
            </div>

            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Licença/Registro *</FormLabel>
                  <FormControl>
                    <Input placeholder="Número da licença profissional" {...field} />
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
                Informações Profissionais
              </h3>
              <p className="text-sm text-gray-600">Formação e especialidades</p>
            </div>

            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formação *</FormLabel>
                  <FormControl>
                    <Input placeholder="Formação acadêmica do terapeuta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professionalType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Profissional *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROFESSIONAL_TYPES.map((type) => (
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
              name="specialties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidades *</FormLabel>
                  <div className="grid grid-cols-2 gap-2 p-4 border rounded-md">
                    {SPECIALTIES.map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox
                          id={specialty}
                          checked={field.value.includes(specialty)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, specialty]);
                            } else {
                              field.onChange(field.value.filter(s => s !== specialty));
                            }
                          }}
                        />
                        <label htmlFor={specialty} className="text-sm">{specialty}</label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weeklyWorkloadHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carga Horária Semanal (horas) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      placeholder="40"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                <MapPin className="h-5 w-5" />
                Endereço
              </h3>
              <p className="text-sm text-gray-600">Informações de endereço (opcional)</p>
            </div>

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
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Terapeutas</h1>
        <Button onClick={() => {
          setShowForm(true);
          setEditingTherapist(null);
          setCurrentStep(1);
          form.reset();
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Terapeuta
        </Button>
      </div>

      {/* Form to Add/Edit Therapist */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingTherapist ? 'Editar Terapeuta' : 'Adicionar Terapeuta'}</CardTitle>
            <CardDescription>
              {editingTherapist ? 'Atualize' : 'Preencha'} os campos abaixo seguindo as etapas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Etapa {currentStep} de 3</span>
                <div className="text-sm text-gray-500">
                  {Math.round((currentStep / 3) * 100)}% completo
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
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
                    onClick={currentStep === 1 ? () => setShowForm(false) : prevStep}
                  >
                    {currentStep === 1 ? 'Cancelar' : 'Anterior'}
                  </Button>
                  
                  {currentStep < 3 ? (
                    <Button type="button" onClick={nextStep}>
                      Próximo
                    </Button>
                  ) : (
                    <Button type="submit">
                      {editingTherapist ? 'Atualizar' : 'Salvar'}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* List of Therapists */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Terapeutas</CardTitle>
          <CardDescription>Visualize e gerencie os terapeutas cadastrados.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Licença</TableHead>
                <TableHead>Especialidades</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {therapists.map((therapist) => (
                <TableRow key={therapist.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage style={{ backgroundColor: therapist.color }} />
                        <AvatarFallback>{therapist.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{therapist.name}</div>
                        <div className="text-sm text-gray-500">{therapist.professionalType}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{therapist.licenseNumber}</div>
                      {therapist.cpf && (
                        <div className="text-gray-500">CPF: {therapist.cpf}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {therapist.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      {therapist.phone && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Tel:</span>
                          {therapist.phone}
                        </div>
                      )}
                      {therapist.email && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Email:</span>
                          {therapist.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(therapist)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(therapist.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistManagement;
