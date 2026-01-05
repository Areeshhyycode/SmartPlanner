import { useState } from 'react';
import { Plus, X, TrendingUp, MapPin, Thermometer, Droplets, Wind, Search } from 'lucide-react';

function ComparePage() {
  const [cities, setCities] = useState<string[]>([]);
  const [newCity, setNewCity] = useState('');

  const addCity = () => {
    if (newCity.trim() && !cities.includes(newCity.trim()) && cities.length < 5) {
      setCities([...cities, newCity.trim()]);
      setNewCity('');
    }
  };

  const removeCity = (city: string) => {
    setCities(cities.filter((c) => c !== city));
  };

  // Mock comparison data
  const comparisonData = cities.map((city) => ({
    city,
    temperature: Math.floor(Math.random() * 30) + 10,
    humidity: Math.floor(Math.random() * 40) + 40,
    windSpeed: Math.floor(Math.random() * 20) + 5,
    score: Math.floor(Math.random() * 40) + 60,
    condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Clear'][Math.floor(Math.random() * 4)],
  }));

  const bestCity =
    comparisonData.length > 0
      ? comparisonData.reduce((best, current) => (current.score > best.score ? current : best))
      : null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-text-primary mb-3">
            Compare <span className="gradient-text">Cities</span>
          </h1>
          <p className="text-lg text-text-secondary">
            Compare weather conditions across multiple destinations
          </p>
        </div>

        {/* Add Cities */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCity()}
                placeholder="Add city to compare (max 5)"
                className="w-full pl-12 pr-4 py-4 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
              />
            </div>
            <button
              onClick={addCity}
              disabled={cities.length >= 5}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-5 h-5 text-white" />
              Add City
            </button>
          </div>

          {/* Selected Cities Tags */}
          {cities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {cities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {city}
                  <button
                    onClick={() => removeCity(city)}
                    className="hover:text-blue-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Cards */}
        {cities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {comparisonData.map((data) => (
              <div
                key={data.city}
                className={`relative bg-dark-card border rounded-2xl p-6 transition-all duration-300 ${
                  bestCity?.city === data.city
                    ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'border-dark-border hover:border-blue-500/30'
                }`}
              >
                {bestCity?.city === data.city && (
                  <div className="absolute -top-3 left-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Best Choice
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-semibold text-text-primary">{data.city}</h3>
                  </div>
                  <button
                    onClick={() => removeCity(data.city)}
                    className="p-2 text-text-muted hover:text-text-primary hover:bg-dark-elevated rounded-lg transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-text-secondary text-sm mb-4">{data.condition}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      Temperature
                    </div>
                    <span className="text-text-primary font-semibold">{data.temperature}°C</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      Humidity
                    </div>
                    <span className="text-text-primary font-semibold">{data.humidity}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                      <Wind className="w-4 h-4 text-cyan-400" />
                      Wind Speed
                    </div>
                    <span className="text-text-primary font-semibold">{data.windSpeed} km/h</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dark-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary text-sm">Weather Score</span>
                    <span className="text-cyan-400 font-bold">{data.score}/100</span>
                  </div>
                  <div className="w-full bg-dark-elevated rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${data.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {cities.length === 0 && (
          <div className="text-center py-20 bg-dark-card border border-dark-border rounded-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-text-primary mb-2">No Cities Added</h3>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Add cities above to start comparing weather conditions and find the best destination
              for your trip.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparePage;

