
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, User, CheckCircle, FileText } from 'lucide-react';
import { Schedule, Child } from '@/types';

interface SessionActionsProps {
  schedule: Schedule;
  child: Child;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
  onViewChild: (child: Child) => void;
  onMarkCompleted: (schedule: Schedule) => void;
}

const SessionActions: React.FC<SessionActionsProps> = ({
  schedule,
  child,
  onEdit,
  onDelete,
  onViewChild,
  onMarkCompleted
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1"
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onEdit(schedule)}>
          <Edit className="h-4 w-4 mr-2" />
          Editar sessão
        </DropdownMenuItem>
        
        {schedule.status !== 'completed' && (
          <DropdownMenuItem onClick={() => onMarkCompleted(schedule)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar como realizada
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onViewChild(child)}>
          <User className="h-4 w-4 mr-2" />
          Ver ficha da criança
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onViewChild(child)}>
          <FileText className="h-4 w-4 mr-2" />
          Ver histórico
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(schedule)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remover sessão
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SessionActions;
