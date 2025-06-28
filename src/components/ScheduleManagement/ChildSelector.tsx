
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Child } from '@/types';
import { formatDate } from '@/lib/dateUtils';

interface ChildSelectorProps {
  children: Child[];
  selectedChild: Child | null;
  onChildSelect: (child: Child | null) => void;
}

const ChildSelector: React.FC<ChildSelectorProps> = ({
  children,
  selectedChild,
  onChildSelect
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span>Selecionar Criança</span>
        </CardTitle>
        <CardDescription>
          Escolha a criança para visualizar e gerenciar seus agendamentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select 
            value={selectedChild?.id || ''} 
            onValueChange={(value) => {
              const child = children.find(c => c.id === value) || null;
              onChildSelect(child);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma criança" />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  <div className="flex flex-col">
                    <span>{child.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(child.birthDate)} • {child.diagnosis}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedChild && (
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{selectedChild.name}</h3>
                <p className="text-sm text-gray-600">{selectedChild.diagnosis}</p>
              </div>
              <Badge variant="secondary">
                {new Date().getFullYear() - selectedChild.birthDate.getFullYear()} anos
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildSelector;
