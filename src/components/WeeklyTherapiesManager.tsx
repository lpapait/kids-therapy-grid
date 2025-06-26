import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { WeeklyTherapy, SPECIALTIES } from '@/types';
import { Plus, Trash2, Clock } from 'lucide-react';

interface WeeklyTherapiesManagerProps {
  weeklyTherapies: WeeklyTherapy[];
  onChange: (therapies: WeeklyTherapy[]) => void;
}

const WeeklyTherapiesManager: React.FC<WeeklyTherapiesManagerProps> = ({
  weeklyTherapies,
  onChange
}) => {
  const [newTherapy, setNewTherapy] = useState({
    specialty: '',
    hoursRequired: 1
  });

  const addTherapy = () => {
    if (!newTherapy.specialty || newTherapy.hoursRequired <= 0) return;
    
    // Check if specialty already exists
    if (weeklyTherapies.some(t => t.specialty === newTherapy.specialty)) return;
    
    const updatedTherapies = [...weeklyTherapies, newTherapy];
    onChange(updatedTherapies);
    
    setNewTherapy({ specialty: '', hoursRequired: 1 });
  };

  const removeTherapy = (specialtyToRemove: string) => {
    const updatedTherapies = weeklyTherapies.filter(t => t.specialty !== specialtyToRemove);
    onChange(updatedTherapies);
  };

  const updateTherapyHours = (specialty: string, hours: number) => {
    const updatedTherapies = weeklyTherapies.map(t =>
      t.specialty === specialty ? { ...t, hoursRequired: hours } : t
    );
    onChange(updatedTherapies);
  };

  const availableSpecialties = SPECIALTIES.filter(
    specialty => !weeklyTherapies.some(t => t.specialty === specialty)
  );

  const totalHours = weeklyTherapies.reduce((sum, t) => sum + t.hoursRequired, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Terapias Semanais</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing therapies */}
        <div className="space-y-3">
          {weeklyTherapies.map((therapy) => (
            <div key={therapy.specialty} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex-1">
                <span className="font-medium text-gray-900">{therapy.specialty}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={therapy.hoursRequired}
                  onChange={(e) => updateTherapyHours(therapy.specialty, parseInt(e.target.value) || 1)}
                  className="w-16 text-center"
                />
                <span className="text-sm text-gray-600">h/semana</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTherapy(therapy.specialty)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new therapy */}
        {availableSpecialties.length > 0 && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <Label>Adicionar Terapia</Label>
                <Select 
                  value={newTherapy.specialty} 
                  onValueChange={(value) => setNewTherapy(prev => ({ ...prev, specialty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSpecialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Horas/Semana</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={newTherapy.hoursRequired}
                    onChange={(e) => setNewTherapy(prev => ({ ...prev, hoursRequired: parseInt(e.target.value) || 1 }))}
                    className="flex-1"
                  />
                  <Button 
                    onClick={addTherapy}
                    disabled={!newTherapy.specialty}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {weeklyTherapies.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-gray-600">Total semanal:</span>
            <Badge variant="secondary" className="text-sm">
              {totalHours}h por semana
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyTherapiesManager;
