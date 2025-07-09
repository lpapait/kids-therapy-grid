import React from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  loadingMessage?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  children,
  isLoading = false,
  error = null,
  onRetry,
  loadingMessage = 'Carregando...'
}) => {
  if (error) {
    return (
      <Alert variant="destructive" className="animate-fade-in">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex justify-between items-start">
          <div>
            <p className="font-medium">Erro</p>
            <p className="text-sm">{error}</p>
          </div>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Tentar novamente
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 animate-fade-in">
        <div className="flex items-center space-x-3">
          <LoadingSpinner />
          <span className="text-muted-foreground">{loadingMessage}</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingState;