export function CardSkeleton() {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-dark-elevated rounded-xl"></div>
        <div className="flex-1">
          <div className="h-5 w-24 bg-dark-elevated rounded mb-2"></div>
          <div className="h-3 w-16 bg-dark-elevated rounded"></div>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-dark-elevated rounded-full"></div>
        <div>
          <div className="h-8 w-16 bg-dark-elevated rounded mb-1"></div>
          <div className="h-3 w-20 bg-dark-elevated rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-3 bg-dark-elevated/50 rounded-xl">
            <div className="h-3 w-12 bg-dark-border rounded mb-2"></div>
            <div className="h-5 w-10 bg-dark-border rounded mb-1"></div>
            <div className="h-2 w-14 bg-dark-border rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden animate-pulse">
      <div className="p-5 border-b border-dark-border flex items-center gap-3">
        <div className="w-10 h-10 bg-dark-elevated rounded-xl"></div>
        <div>
          <div className="h-5 w-32 bg-dark-elevated rounded mb-2"></div>
          <div className="h-3 w-48 bg-dark-elevated rounded"></div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-4 mb-4">
          {[1, 2, 3, 4, 5, 6, 7].map(i => (
            <div key={i} className="flex-1 text-center">
              <div className="h-4 w-8 bg-dark-elevated rounded mx-auto mb-2"></div>
              <div className="h-3 w-10 bg-dark-elevated rounded mx-auto"></div>
            </div>
          ))}
        </div>
        {[1, 2].map(row => (
          <div key={row} className="flex gap-4 py-3 border-t border-dark-border/50">
            <div className="w-20 h-4 bg-dark-elevated rounded"></div>
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-5 h-5 bg-dark-elevated rounded-full"></div>
                <div className="h-3 w-10 bg-dark-elevated rounded"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SelectorSkeleton() {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-6 animate-pulse">
      <div className="h-5 w-40 bg-dark-elevated rounded mb-4"></div>
      <div className="h-12 w-full bg-dark-elevated rounded-xl"></div>
    </div>
  );
}

export function WeatherPageSkeleton() {
  return (
    <div className="space-y-6">
      <SelectorSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
