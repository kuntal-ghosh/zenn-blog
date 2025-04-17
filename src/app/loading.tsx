import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading component
 * Displayed while the page is loading
 */
export default function Loading() {
  return (
    <div className="container py-6">
      {/* Content Type Tabs Skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-full max-w-md rounded-md" />
      </div>

      {/* Recent Section Skeleton */}
      <div className="mt-8 max-w-5xl mx-auto">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>

        {/* Tech Section Skeleton */}
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
