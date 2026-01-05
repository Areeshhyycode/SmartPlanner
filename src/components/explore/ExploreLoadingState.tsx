function ExploreLoadingState() {
  return (
    <div className="py-8 sm:py-12 md:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden animate-pulse">
            <div className="h-36 sm:h-40 md:h-44 bg-dark-border" />
            <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
              <div className="h-3.5 sm:h-4 bg-dark-border rounded w-3/4" />
              <div className="h-2.5 sm:h-3 bg-dark-border rounded w-full" />
              <div className="h-2.5 sm:h-3 bg-dark-border rounded w-2/3" />
              <div className="pt-2.5 sm:pt-3 border-t border-dark-border">
                <div className="h-2.5 sm:h-3 bg-dark-border rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreLoadingState;
