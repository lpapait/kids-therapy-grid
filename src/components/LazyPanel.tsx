
import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LazyPanelProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

const DefaultSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-2 bg-gray-200 rounded w-full"></div>
      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
    </CardContent>
  </Card>
);

const LazyPanel: React.FC<LazyPanelProps> = ({ 
  children, 
  fallback = <DefaultSkeleton />,
  className = ''
}) => {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  );
};

export default LazyPanel;
