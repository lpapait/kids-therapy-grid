
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from "@/components/ui/form";
import { useTherapistForm } from '@/hooks/useTherapistForm';
import { TherapistFormSteps } from './TherapistFormSteps';
import { Therapist } from '@/types';

interface TherapistFormProps {
  showForm: boolean;
  onClose: () => void;
  editingTherapist: Therapist | null;
  onEdit: (therapist: Therapist) => void;
}

export const TherapistForm: React.FC<TherapistFormProps> = ({
  showForm,
  onClose,
  editingTherapist,
  onEdit
}) => {
  const {
    form,
    currentStep,
    handleCEP,
    onSubmit,
    handleEdit,
    resetForm,
    nextStep,
    prevStep
  } = useTherapistForm();

  React.useEffect(() => {
    if (editingTherapist) {
      handleEdit(editingTherapist);
    }
  }, [editingTherapist, handleEdit]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (data: any) => {
    onSubmit(data);
    onClose();
  };

  if (!showForm) return null;

  return (
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <TherapistFormSteps
              form={form}
              currentStep={currentStep}
              handleCEP={handleCEP}
            />
            
            <div className="flex justify-between pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={currentStep === 1 ? handleClose : prevStep}
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
  );
};
