import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { Therapist } from '@/types';

interface TherapistAvailability {
  therapist: Therapist;
  isAvailable: boolean;
  currentLoad: number;
  maxLoad: number;
  loadPercentage: number;
  reason?: string;
}

interface AvailableTherapistsListProps {
  therapists: TherapistAvailability[];
  onSelectTherapist: (therapist: Therapist) => void;
}

const AvailableTherapistsList: React.FC<AvailableTherapistsListProps> = ({ 
  therapists, 
  onSelectTherapist 
}) => {
  const getLoadBadgeVariant = (percentage: number, isAvailable: boolean) => {
    if (!isAvailable) return 'destructive';
    if (percentage >= 90) return 'destructive';
    if (percentage >= 75) return 'secondary';
    return 'default';
  };

  const getLoadIcon = (percentage: number, isAvailable: boolean) => {
    if (!isAvailable) return <AlertTriangle className="h-3 w-3" />;
    if (percentage >= 90) return <AlertTriangle className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  if (therapists.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum terapeuta disponível para as especialidades pendentes.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          Terapeutas Disponíveis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {therapists.map((item) => (
          <div 
            key={item.therapist.id}
            className={`p-3 rounded-lg border transition-colors ${
              item.isAvailable 
                ? 'border-border hover:border-primary/50' 
                : 'border-destructive/20 bg-destructive/5'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">
                    {item.therapist.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {item.therapist.specialties[0] || 'Sem especialidade'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant={getLoadBadgeVariant(item.loadPercentage, item.isAvailable)}
                    className="text-xs flex items-center gap-1"
                  >
                    {getLoadIcon(item.loadPercentage, item.isAvailable)}
                    {item.currentLoad.toFixed(1)}h / {item.maxLoad}h
                  </Badge>
                </div>

                {!item.isAvailable && item.reason && (
                  <p className="text-xs text-destructive">{item.reason}</p>
                )}
              </div>

              <Button
                size="sm"
                disabled={!item.isAvailable}
                onClick={() => onSelectTherapist(item.therapist)}
                className="shrink-0"
              >
                {item.isAvailable ? 'Selecionar' : 'Indisponível'}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AvailableTherapistsList;