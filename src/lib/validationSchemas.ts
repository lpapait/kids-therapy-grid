
import * as z from "zod";
import { validateCPF, validatePhone, validateCEP } from "./inputMasks";
import { SPECIALTIES, PROFESSIONAL_TYPES, RELATIONSHIP_TYPES } from "@/types";

const addressSchema = z.object({
  street: z.string().min(5, "Logradouro deve ter pelo menos 5 caracteres"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  cep: z.string().refine(validateCEP, "CEP inválido")
});

const guardianSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  relationship: z.enum(RELATIONSHIP_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: "Selecione um tipo de parentesco válido" })
  }),
  phone: z.string().refine(validatePhone, "Telefone inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  cpf: z.string().refine((cpf) => !cpf || validateCPF(cpf), "CPF inválido").optional()
});

const weeklyTherapySchema = z.object({
  specialty: z.enum(SPECIALTIES as [string, ...string[]], {
    errorMap: () => ({ message: "Selecione uma especialidade válida" })
  }),
  hoursRequired: z.number().min(1, "Horas deve ser pelo menos 1").max(20, "Máximo 20 horas por semana")
});

export const childFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: "Selecione o sexo" })
  }),
  cpf: z.string().refine((cpf) => !cpf || validateCPF(cpf), "CPF inválido").optional(),
  susCard: z.string().optional(),
  diagnosis: z.string().min(10, "Diagnóstico deve ter pelo menos 10 caracteres"),
  medications: z.string().optional(),
  address: addressSchema.optional(),
  guardians: z.array(guardianSchema).min(1, "Pelo menos um responsável é obrigatório"),
  weeklyTherapies: z.array(weeklyTherapySchema)
});

const timeSlotSchema = z.object({
  start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido"),
  end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido")
});

const workScheduleSchema = z.object({
  monday: z.array(timeSlotSchema).optional(),
  tuesday: z.array(timeSlotSchema).optional(),
  wednesday: z.array(timeSlotSchema).optional(),
  thursday: z.array(timeSlotSchema).optional(),
  friday: z.array(timeSlotSchema).optional(),
  saturday: z.array(timeSlotSchema).optional(),
  sunday: z.array(timeSlotSchema).optional()
});

export const therapistFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpf: z.string().refine((cpf) => !cpf || validateCPF(cpf), "CPF inválido").optional(),
  licenseNumber: z.string().min(5, "Número de licença deve ter pelo menos 5 caracteres"),
  education: z.string().min(5, "Formação deve ter pelo menos 5 caracteres"),
  professionalType: z.enum(PROFESSIONAL_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: "Selecione um tipo de profissional válido" })
  }),
  specialties: z.array(z.string()).min(1, "Selecione pelo menos uma especialidade"),
  phone: z.string().refine((phone) => !phone || validatePhone(phone), "Telefone inválido").optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  address: addressSchema.optional(),
  workSchedule: workScheduleSchema.optional(),
  weeklyWorkloadHours: z.number().min(1, "Carga horária deve ser pelo menos 1 hora").max(60, "Máximo 60 horas por semana")
});

export type ChildFormData = z.infer<typeof childFormSchema>;
export type TherapistFormData = z.infer<typeof therapistFormSchema>;
