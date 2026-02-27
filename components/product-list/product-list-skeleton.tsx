export default function ProductListSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 mb-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded-md w-32" />
        <div className="h-8 bg-gray-200 rounded-lg w-24" />
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 px-3 sm:px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

// ── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl p-2.5 sm:p-4 animate-pulse">
      <div className="w-full aspect-square rounded-xl bg-gray-200 mb-2 sm:mb-3" />
      <div className="h-3 sm:h-4 bg-gray-200 rounded-md mb-1.5 w-3/4" />
      <div className="h-3 bg-gray-200 rounded-md mb-2 w-1/2" />
      <div className="h-4 sm:h-5 bg-gray-200 rounded-md w-1/3" />
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 mb-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded-md w-32" />
        <div className="h-8 bg-gray-200 rounded-lg w-24" />
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 px-3 sm:px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
