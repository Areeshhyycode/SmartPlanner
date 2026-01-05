interface ExploreResultsCountProps {
  count: number;
  searchQuery: string;
}

function ExploreResultsCount({ count, searchQuery }: ExploreResultsCountProps) {
  return (
    <div className="mb-4 sm:mb-5 md:mb-6">
      <p className="text-xs sm:text-sm text-text-muted">
        {count} {count === 1 ? 'country' : 'countries'}
        {searchQuery && <span> matching "{searchQuery}"</span>}
      </p>
    </div>
  );
}

export default ExploreResultsCount;
