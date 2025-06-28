
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, X, Info } from 'lucide-react';
import { ValidationResult } from '@/lib/validationRules';

interface ValidationDisplayProps {
  validation: ValidationResult;
  showWarnings?: boolean;
}

const ValidationDisplay: React.FC<ValidationDisplayProps> = ({ 
  validation, 
  showWarnings = true 
}) => {
  const { errors, warnings } = validation;
  const criticalErrors = errors.filter(error => error.severity === 'error');
  const warningErrors = errors.filter(error => error.severity === 'warning');

  if (criticalErrors.length === 0 && warningErrors.length === 0 && warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Critical Errors */}
      {criticalErrors.map((error, index) => (
        <Alert key={`error-${index}`} variant="destructive">
          <X className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error.message}</span>
            <Badge variant="destructive">Erro</Badge>
          </AlertDescription>
        </Alert>
      ))}

      {/* Warning Errors */}
      {warningErrors.map((error, index) => (
        <Alert key={`warning-error-${index}`} className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-yellow-800">{error.message}</span>
            <Badge variant="outline" className="border-yellow-300 text-yellow-700">
              Atenção
            </Badge>
          </AlertDescription>
        </Alert>
      ))}

      {/* Warnings */}
      {showWarnings && warnings.map((warning, index) => (
        <Alert key={`warning-${index}`} className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-blue-800">{warning.message}</span>
              <Badge variant="outline" className="border-blue-300 text-blue-700">
                Dica
              </Badge>
            </div>
            {warning.suggestion && (
              <div className="text-sm text-blue-600 mt-1">
                💡 {warning.suggestion}
              </div>
            )}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default ValidationDisplay;
