'use client';

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-2xl border border-[#E8DFD1] bg-white p-5"
        >
          <div className="h-4 w-24 rounded bg-stone-200" />
          <div className="mt-4 h-7 w-32 rounded bg-stone-200" />
          <div className="mt-3 h-3 w-20 rounded bg-stone-100" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2.5 rounded-2xl border border-[#E8DFD1] bg-white p-5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-xl bg-stone-100" />
      ))}
    </div>
  );
}
