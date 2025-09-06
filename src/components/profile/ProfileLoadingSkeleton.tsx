import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoadingSkeleton() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card Skeleton */}
        <div className="p-8 bg-white rounded-lg">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Avatar */}
            <Skeleton className="w-32 h-32 rounded-full" />

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-80" />

              {/* Stats */}
              <div className="flex gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>

              {/* Badges */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>

              {/* Bio */}
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Instruments Section */}
          <div className="xl:col-span-2">
            <div className="p-6 bg-white rounded-lg">
              <Skeleton className="h-7 w-32 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Groups Section */}
          <div>
            <div className="p-6 bg-white rounded-lg">
              <Skeleton className="h-7 w-28 mb-6" />
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
