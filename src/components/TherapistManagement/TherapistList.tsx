
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useData } from '@/contexts/DataContext';
import { Therapist } from '@/types';

interface TherapistListProps {
  onEdit: (therapist: Therapist) => void;
}

export const TherapistList: React.FC<TherapistListProps> = ({ onEdit }) => {
  const { therapists, deleteTherapist } = useData();
  const { toast } = useToast();

  const handleDelete = (therapistId: string) => {
    deleteTherapist(therapistId);
    toast({
      title: "Terapeuta removido com sucesso!",
    });
  };

  return (
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
                    <Button variant="outline" size="icon" onClick={() => onEdit(therapist)}>
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
  );
};
