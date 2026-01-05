import { useState, useEffect } from 'react';
import {
  Backpack,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Thermometer,
} from 'lucide-react';
import {
  packingSuggestionsAPI,
  type PackingSuggestionsResponse,
} from '../../api';

interface PackingListCardProps {
  cityId?: string;
  cityName?: string;
  latitude?: number;
  longitude?: number;
}

const getPriorityStyles = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'essential':
      return 'text-red-400';
    case 'recommended':
      return 'text-blue-400';
    default:
      return 'text-text-muted';
  }
};

export function PackingListCard({
  cityId,
  cityName,
  latitude,
  longitude,
}: PackingListCardProps) {
  const [packingData, setPackingData] = useState<PackingSuggestionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchPackingList = async () => {
      setLoading(true);
      setError(null);

      try {
        let data: PackingSuggestionsResponse;

        if (cityId) {
          data = await packingSuggestionsAPI.getByCityId(cityId, cityName);
        } else if (latitude && longitude && cityName) {
          data = await packingSuggestionsAPI.getByCoordinates(latitude, longitude, cityName);
        } else {
          throw new Error('City information required');
        }

        setPackingData(data);
      } catch {
        setError('Packing suggestions unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchPackingList();
  }, [cityId, cityName, latitude, longitude]);

  if (loading) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-text-muted animate-spin" />
          <span className="text-text-muted text-sm">Loading suggestions...</span>
        </div>
      </div>
    );
  }

  if (error || !packingData) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-lg p-4">
        <div className="flex items-center gap-2 text-text-muted">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error || 'Packing data unavailable'}</span>
        </div>
      </div>
    );
  }

  const categories = packingData.categories || [];
  const weatherSummary = packingData.weatherSummary || {
    avgTemperature: 20,
    dominantWeather: 'Clear',
  };

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-dark-elevated/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Backpack className="w-4 h-4 text-text-muted" />
          <span className="text-sm font-medium text-text-primary">Packing List</span>
          <span className="text-xs text-text-muted">({totalItems} items)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Thermometer className="w-3 h-3" />
            <span>{Math.round(weatherSummary.avgTemperature)}C</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-muted" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {categories.map((category, idx) => (
            <div key={idx}>
              <h5 className="text-xs font-medium text-text-secondary mb-2">{category.category}</h5>
              <div className="space-y-1">
                {category.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-between py-1.5 px-2 bg-dark-elevated/50 rounded text-sm"
                  >
                    <span className="text-text-primary">{item.name}</span>
                    <span className={`text-xs capitalize ${getPriorityStyles(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {packingData.generalTips && packingData.generalTips.length > 0 && (
            <div className="pt-2 border-t border-dark-border">
              <p className="text-xs text-text-muted">{packingData.generalTips[0]}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PackingListCard;
