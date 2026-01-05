import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Plus, Check } from 'lucide-react';
import type { ApiCity, ApiCountry } from '../../api';

interface CitySelectorProps {
  countries: ApiCountry[];
  selectedCities: ApiCity[];
  onCitySelect: (city: ApiCity) => void;
  onCityRemove: (cityId: string) => void;
  maxCities?: number;
}

export default function CitySelector({
  countries,
  selectedCities,
  onCitySelect,
  onCityRemove,
  maxCities = 4,
}: CitySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get all cities from all countries
  const allCities = countries.flatMap(country =>
    (country.cities || []).map(city => ({
      ...city,
      countryName: country.name,
      countryCode: country.code,
    }))
  );

  // Filter cities based on search query
  const filteredCities = allCities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.countryName.toLowerCase().includes(searchQuery.toLowerCase());
    const notSelected = !selectedCities.some(sc => sc.id === city.id);
    return matchesSearch && notSelected;
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: typeof allCities[0]) => {
    if (selectedCities.length < maxCities) {
      onCitySelect(city);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected Cities */}
      {selectedCities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCities.map((city, index) => (
            <div
              key={city.id}
              className="group flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'fadeInUp 0.3s ease-out forwards',
              }}
            >
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-text-primary">{city.name}</span>
              <button
                onClick={() => onCityRemove(city.id)}
                className="p-0.5 hover:bg-red-500/20 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5 text-text-muted hover:text-red-400 transition-colors" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      {selectedCities.length < maxCities && (
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={`Add city to compare (${selectedCities.length}/${maxCities})`}
              className="w-full pl-12 pr-4 py-3 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Plus className="w-5 h-5 text-text-muted" />
            </div>
          </div>

          {/* Dropdown */}
          {isOpen && filteredCities.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-dark-card border border-dark-border rounded-xl shadow-2xl shadow-black/30 overflow-hidden animate-dropdown max-h-64 overflow-y-auto">
              {filteredCities.slice(0, 10).map((city, index) => (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-dark-elevated transition-colors group"
                  style={{
                    animationDelay: `${index * 30}ms`,
                    animation: 'fadeInUp 0.2s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-text-primary group-hover:text-blue-400 transition-colors">
                        {city.name}
                      </p>
                      <p className="text-xs text-text-muted">{city.countryName}</p>
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {isOpen && searchQuery && filteredCities.length === 0 && (
            <div className="absolute z-50 w-full mt-2 bg-dark-card border border-dark-border rounded-xl shadow-2xl shadow-black/30 p-4 text-center">
              <p className="text-text-muted text-sm">No cities found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}