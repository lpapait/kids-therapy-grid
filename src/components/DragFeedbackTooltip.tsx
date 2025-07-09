
import React from 'react';
import { MoveImpact } from '@/hooks/useDragFeedback';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DragFeedbackTooltipProps {
  impact: MoveImpact | null;
  position: { x: number; y: number };
  visible: boolean;
}

const DragFeedbackTooltip: React.FC<DragFeedbackTooltipProps> = ({
  impact,
  position,
  visible
}) => {
  if (!visible || !impact) return null;

  const getIcon = () => {
    switch (impact.severity) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getBgColor = () => {
    switch (impact.severity) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  const getTextColor = () => {
    switch (impact.severity) {
      case 'success':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'error':
        return 'text-red-800';
    }
  };

  return (
    <div
      className={`fixed z-50 max-w-xs p-3 rounded-lg border shadow-lg pointer-events-none transition-opacity ${getBgColor()}`}
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className={`flex items-center space-x-2 text-sm font-medium ${getTextColor()}`}>
        {getIcon()}
        <span>{impact.message}</span>
      </div>
      
      {impact.conflicts.length > 0 && (
        <div className="text-xs text-red-600 mt-1">
          {impact.conflicts.length} conflito(s) detectado(s)
        </div>
      )}
    </div>
  );
};

export default DragFeedbackTooltip;
