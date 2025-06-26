
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { useData } from '@/contexts/DataContext';
import { Therapist, PROFESSIONAL_TYPES, SPECIALTIES } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  licenseNumber: z.string().min(5, {
    message: "Número de licença deve ter pelo menos 5 caracteres.",
  }),
  education: z.string().min(5, {
    message: "Formação deve ter pelo menos 5 caracteres.",
  }),
  professionalType: z.string(),
  specialties: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Você precisa selecionar ao menos uma especialidade.",
  }),
})

const TherapistManagement = () => {
  const { therapists, addTherapist, updateTherapist, deleteTherapist } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      licenseNumber: "",
      education: "",
      professionalType: PROFESSIONAL_TYPES[0],
      specialties: [],
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (editingTherapist) {
      // Update existing therapist
      updateTherapist(editingTherapist.id, data);
      toast({
        title: "Terapeuta atualizado com sucesso!",
      })
    } else {
      // Create new therapist - ensure data conforms to expected type
      const therapistData: Omit<Therapist, 'id' | 'createdAt' | 'color' | 'weeklyWorkloadHours'> = {
        name: data.name,
        licenseNumber: data.licenseNumber,
        education: data.education,
        professionalType: data.professionalType,
        specialties: data.specialties,
      };
      addTherapist(therapistData);
      toast({
        title: "Terapeuta adicionado com sucesso!",
      })
    }
    form.reset();
    setShowForm(false);
    setEditingTherapist(null);
  }

  const handleEdit = (therapist: Therapist) => {
    setEditingTherapist(therapist);
    form.setValue("name", therapist.name);
    form.setValue("licenseNumber", therapist.licenseNumber || "");
    form.setValue("education", therapist.education || "");
    form.setValue("professionalType", therapist.professionalType);
    form.setValue("specialties", therapist.specialties);
    setShowForm(true);
  };

  const handleDelete = (therapistId: string) => {
    deleteTherapist(therapistId);
    toast({
      title: "Terapeuta removido com sucesso!",
    })
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Terapeutas</h1>
        <Button onClick={() => {
          setShowForm(true);
          setEditingTherapist(null);
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
            <CardDescription>Preencha os campos abaixo para {editingTherapist ? 'atualizar' : 'adicionar'} um terapeuta.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do terapeuta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Licença</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de licença" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formação</FormLabel>
                      <FormControl>
                        <Input placeholder="Formação do terapeuta" {...field} />
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
                      <FormLabel>Tipo de profissional</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <FormLabel>Especialidades</FormLabel>
                      <div className="space-y-2">
                        {SPECIALTIES.map((specialty) => (
                          <label key={specialty} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={field.value.includes(specialty)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([...field.value, specialty]);
                                } else {
                                  field.onChange(field.value.filter(s => s !== specialty));
                                }
                              }}
                            />
                            <span>{specialty}</span>
                          </label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
                  <Button type="submit">{editingTherapist ? 'Atualizar' : 'Salvar'}</Button>
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
                      <span>{therapist.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{therapist.licenseNumber}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {therapist.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">{specialty}</Badge>
                      ))}
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
