
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TherapistForm } from '@/components/TherapistManagement/TherapistForm';
import { TherapistList } from '@/components/TherapistManagement/TherapistList';
import { Therapist } from '@/types';

const TherapistManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);

  const handleAddNew = () => {
    setEditingTherapist(null);
    setShowForm(true);
  };

  const handleEdit = (therapist: Therapist) => {
    setEditingTherapist(therapist);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTherapist(null);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Terapeutas</h1>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Terapeuta
        </Button>
      </div>

      <TherapistForm
        showForm={showForm}
        onClose={handleCloseForm}
        editingTherapist={editingTherapist}
        onEdit={handleEdit}
      />

      <TherapistList onEdit={handleEdit} />
    </div>
  );
};

export default TherapistManagement;
