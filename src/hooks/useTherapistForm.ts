
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useCEPLookup } from '@/hooks/useCEPLookup';
import { therapistFormSchema, type TherapistFormData } from '@/lib/validationSchemas';
import { useData } from '@/contexts/DataContext';
import { Therapist, PROFESSIONAL_TYPES, Address, WorkSchedule, TimeSlot } from '@/types';

export const useTherapistForm = () => {
  const { addTherapist, updateTherapist } = useData();
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
  });

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
      });
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
      });
    }
    
    resetForm();
  };

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
  };

  const resetForm = () => {
    form.reset();
    setEditingTherapist(null);
    setCurrentStep(1);
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

  return {
    form,
    editingTherapist,
    currentStep,
    handleCEP,
    onSubmit,
    handleEdit,
    resetForm,
    nextStep,
    prevStep
  };
};
