
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Copy, Plus } from 'lucide-react';
import WeekSelector from '@/components/WeekSelector';
import WeeklyGrid from '@/components/WeeklyGrid';
import SessionEditModal from '@/components/SessionEditModal';
import { useData } from '@/contexts/DataContext';
import { Child, Schedule } from '@/types';
import { isSameWeek, formatDate } from '@/lib/dateUtils';

const ScheduleManagement = () => {
  const { children } = useData();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [editingSession, setEditingSession] = useState<{
    date: Date;
    time: string;
    schedule?: Schedule;
  } | null>(null);

  const handleScheduleClick = (date: Date, time: string, schedule?: Schedule) => {
    if (!selectedChild) return;
    
    setEditingSession({
      date,
      time,
      schedule
    });
  };

  const handleCloseModal = () => {
    setEditingSession(null);
  };

  const handleDuplicateWeek = () => {
    // Implementar duplicação da semana anterior
    console.log('Duplicar semana anterior');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as sessões terapêuticas das crianças
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleDuplicateWeek} disabled={!selectedChild}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicar Semana Anterior
          </Button>
        </div>
      </div>

      {/* Seleção de criança */}
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
                setSelectedChild(child);
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

      {/* Grade de agendamentos */}
      {selectedChild && (
        <>
          <WeekSelector
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Grade de Agendamentos - {selectedChild.name}</span>
              </CardTitle>
              <CardDescription>
                Clique em qualquer horário para agendar uma nova sessão ou editar uma existente
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <WeeklyGrid
                selectedWeek={selectedWeek}
                selectedChild={selectedChild}
                onScheduleClick={handleScheduleClick}
                viewMode="schedule"
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Modal de edição */}
      {editingSession && selectedChild && (
        <SessionEditModal
          isOpen={!!editingSession}
          onClose={handleCloseModal}
          schedule={editingSession.schedule}
          date={editingSession.date}
          time={editingSession.time}
          child={selectedChild}
        />
      )}
    </div>
  );
};

export default ScheduleManagement;
