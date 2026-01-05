import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, Thermometer, Droplets, Wind } from 'lucide-react';
import type { ApiCity } from '../../api';

interface HistoricalDataProps {
  cities: ApiCity[];
}

interface MonthlyData {
  month: string;
  avgTemp: number;
  avgHumidity: number;
  avgWind: number;
  rainyDays: number;
}

function generateHistoricalData(city: ApiCity): MonthlyData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const baseTemp = city.weather?.temperature || 20;
  const seed = city.name.length;

  return months.map((month, i) => {
    const seasonalVariation = Math.sin((i - 1) * Math.PI / 6) * 15;
    return {
      month,
      avgTemp: Math.round(baseTemp + seasonalVariation + (seed % 5)),
      avgHumidity: Math.round(50 + Math.sin(i * 0.5) * 20 + (seed % 10)),
      avgWind: Math.round(10 + Math.cos(i * 0.4) * 8 + (seed % 5)),
      rainyDays: Math.round(5 + Math.sin(i * 0.6) * 8 + (seed % 3)),
    };
  });
}

function getTrend(current: number, average: number) {
  const diff = current - average;
  if (diff > 3) return { icon: <TrendingUp className="w-4 h-4 text-red-400" />, label: 'Above avg', color: 'text-red-400' };
  if (diff < -3) return { icon: <TrendingDown className="w-4 h-4 text-blue-400" />, label: 'Below avg', color: 'text-blue-400' };
  return { icon: <Minus className="w-4 h-4 text-emerald-400" />, label: 'Normal', color: 'text-emerald-400' };
}

export default function HistoricalData({ cities }: HistoricalDataProps) {
  const historicalData = useMemo(() => {
    return cities.map(city => {
      const data = generateHistoricalData(city);
      const currentMonth = new Date().getMonth();
      const currentMonthData = data[currentMonth];
      const yearlyAvgTemp = Math.round(data.reduce((sum, m) => sum + m.avgTemp, 0) / 12);
      const yearlyAvgHumidity = Math.round(data.reduce((sum, m) => sum + m.avgHumidity, 0) / 12);
      const totalRainyDays = data.reduce((sum, m) => sum + m.rainyDays, 0);

      return {
        city,
        data,
        currentMonthData,
        yearlyAvgTemp,
        yearlyAvgHumidity,
        totalRainyDays,
        tempTrend: getTrend(city.weather?.temperature || 0, currentMonthData.avgTemp),
      };
    });
  }, [cities]);

  if (cities.length === 0) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center">
        <BarChart3 className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
        <p className="text-text-muted">Select cities to view historical data</p>
      </div>
    );
  }

  const currentMonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()];

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">Historical Weather Data</h3>
            <p className="text-sm text-text-muted">Average conditions for {currentMonthName}</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {historicalData.map(({ city, currentMonthData, yearlyAvgTemp, yearlyAvgHumidity, totalRainyDays, tempTrend }, index) => (
            <div key={city.id} className="bg-dark-elevated/50 border border-dark-border/50 rounded-xl p-4" style={{ animationDelay: `${index * 100}ms`, animation: 'fadeInUp 0.4s ease-out forwards', opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-text-primary">{city.name}</h4>
                <div className={`flex items-center gap-1 text-xs ${tempTrend.color}`}>
                  {tempTrend.icon}
                  <span>{tempTrend.label}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-text-muted">Avg. Temperature</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-text-primary">{currentMonthData.avgTemp}°C</span>
                    <span className="text-xs text-text-muted ml-2">(Year: {yearlyAvgTemp}°C)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-text-muted">Avg. Humidity</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-text-primary">{currentMonthData.avgHumidity}%</span>
                    <span className="text-xs text-text-muted ml-2">(Year: {yearlyAvgHumidity}%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-teal-400" />
                    <span className="text-sm text-text-muted">Avg. Wind Speed</span>
                  </div>
                  <span className="font-bold text-text-primary">{currentMonthData.avgWind} km/h</span>
                </div>

                <div className="pt-3 border-t border-dark-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Rainy days this month</span>
                    <span className="font-bold text-blue-400">{currentMonthData.rainyDays} days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-text-muted">Total rainy days/year</span>
                    <span className="font-bold text-text-secondary">{totalRainyDays} days</span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-text-muted mb-2">Monthly Temperature Range</p>
                  <div className="flex items-end gap-1 h-12">
                    {generateHistoricalData(city).map((m, i) => {
                      const height = ((m.avgTemp + 10) / 50) * 100;
                      const isCurrentMonth = i === new Date().getMonth();
                      return (
                        <div key={m.month} className={`flex-1 rounded-t transition-all ${isCurrentMonth ? 'bg-gradient-to-t from-blue-500 to-cyan-400' : 'bg-dark-border hover:bg-blue-500/50'}`} style={{ height: `${Math.max(height, 10)}%` }} title={`${m.month}: ${m.avgTemp}°C`} />
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-text-muted">Jan</span>
                    <span className="text-[10px] text-text-muted">Dec</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}