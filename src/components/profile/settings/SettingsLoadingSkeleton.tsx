import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SettingsLoadingSkeleton() {
  return (
    <div className="h-screen max-w-7xl flex flex-col">
      {/* Header skeleton - empty like the real page when no history */}
      <div className="px-6 py-4 flex-shrink-0">
        {/* Empty - back button only shows when there's history */}
      </div>

      {/* Layout principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar skeleton - matches SettingsSidebar exactly */}
        <div className="w-64 border-r flex flex-col bg-background">
          <div className="flex-1 overflow-y-auto">
            <nav className="flex flex-col gap-1 p-4">
              {/* Settings title */}
              <h2 className="mb-4 px-3 text-lg font-semibold">
                <Skeleton className="h-6 w-20 inline-block" />
              </h2>
              {/* Menu items as fake buttons */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-md">
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              ))}
            </nav>
          </div>
          {/* Save button at bottom */}
          <div className="border-t p-4">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-8">
            {/* Page title and description */}
            <div className="space-y-2 mb-8">
              <Skeleton className="h-9 w-32" /> {/* Title like "Profil" */}
              <Skeleton className="h-5 w-80" /> {/* Description text */}
            </div>

            {/* Content based on profile section */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Photo card */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Skeleton className="h-32 w-32 rounded-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>

              {/* Personal info card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-1" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                  <Skeleton className="h-4 w-72" /> {/* Info text */}
                </CardContent>
              </Card>

              {/* Password card */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-1" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-48" /> {/* Update button */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}