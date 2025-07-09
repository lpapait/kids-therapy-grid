import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';

interface PendingSpecialty {
  name: string;
  current: number;
  target: number;
  remaining: number;
  isComplete: boolean;
}

interface PendingSpecialtiesCardProps {
  specialties: PendingSpecialty[];
}

const PendingSpecialtiesCard: React.FC<PendingSpecialtiesCardProps> = ({ specialties }) => {
  if (specialties.length === 0) {
    return (
      <Card className="border-success/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Todas as especialidades estão completas!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Especialidades Pendentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {specialties.map((specialty) => (
          <div key={specialty.name} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{specialty.name}</span>
              <span className="text-xs text-muted-foreground">
                {specialty.current.toFixed(1)}h / {specialty.target.toFixed(1)}h
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${Math.min((specialty.current / specialty.target) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Faltam {specialty.remaining.toFixed(1)}h
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PendingSpecialtiesCard;