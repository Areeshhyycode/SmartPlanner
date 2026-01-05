import type { TripCategory } from '../../types/booking';
import { categories } from '../../data/providerTrips';

interface CategoryFilterProps {
  selectedCategory: TripCategory | 'all';
  onCategoryChange: (category: TripCategory | 'all') => void;
}

function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* All Category */}
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
          selectedCategory === 'all'
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
            : 'bg-dark-elevated border border-dark-border text-text-secondary hover:border-blue-500/50 hover:text-text-primary'
        }`}
      >
        <span className="text-lg">🌍</span>
        <span>All Trips</span>
      </button>

      {/* Category Pills */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
            selectedCategory === category.id
              ? 'text-white shadow-lg'
              : 'bg-dark-elevated border border-dark-border text-text-secondary hover:border-blue-500/50 hover:text-text-primary'
          }`}
          style={
            selectedCategory === category.id
              ? {
                  background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`,
                  boxShadow: `0 4px 15px ${category.color}40`,
                }
              : undefined
          }
        >
          <span className="text-lg">{category.icon}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
