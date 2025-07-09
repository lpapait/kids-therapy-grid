import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';

const ScheduleGridSkeleton: React.FC = () => {
  const timeSlots = Array.from({ length: 10 }, (_, i) => i);
  const weekDays = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="lg:col-span-3 space-y-4">
      {/* Config Panel Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Bulk Operations Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <div className="grid gap-0 min-w-[800px]" style={{ gridTemplateColumns: `120px repeat(${weekDays.length}, 1fr)` }}>
                {/* Header Skeletons */}
                <div className="bg-gray-50 border-b border-r p-3">
                  <Skeleton className="h-4 w-12" />
                </div>
                {weekDays.map((day) => (
                  <div key={day} className="bg-gray-50 border-b border-r p-3 text-center min-w-[160px]">
                    <Skeleton className="h-4 w-16 mx-auto mb-1" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                ))}

                {/* Time Slot Skeletons */}
                {timeSlots.map((time) => (
                  <div key={time} className="contents">
                    <div className="bg-gray-50 border-b border-r p-3 flex items-center">
                      <Skeleton className="h-4 w-10 mx-auto" />
                    </div>
                    {weekDays.map((day) => (
                      <div
                        key={`${day}-${time}`}
                        className="border-b border-r p-2 min-h-[60px] flex items-center justify-center"
                      >
                        {Math.random() > 0.7 ? (
                          <div className="w-full space-y-1">
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-3 w-3 rounded-full" />
                              <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        ) : (
                          <Skeleton className="h-6 w-6 rounded" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleGridSkeleton;