import { useMemo } from 'react';
import { Trophy, Star, Calendar, Sun, CloudRain, ThumbsUp, Sparkles } from 'lucide-react';
import type { ApiCity } from '../../api';

interface BestDayScoringProps {
  cities: ApiCity[];
}

interface DayScore {
  date: Date;
  dayName: string;
  scores: { city: ApiCity; score: number; reason: string }[];
  overallBest: ApiCity | null;
}

function calculateScore(city: ApiCity, dayOffset: number): { score: number; reason: string } {
  const weather = city.weather;
  if (!weather) return { score: 0, reason: 'No data' };

  const seed = city.name.length + dayOffset;
  const tempVariation = Math.sin(seed * 0.5) * 5;
  const temp = weather.temperature + tempVariation;
  const humidity = weather.humidity + Math.cos(seed * 0.3) * 10;
  const wind = weather.windSpeed + Math.sin(seed * 0.7) * 3;

  let score = 50;
  let reasons: string[] = [];

  if (temp >= 18 && temp <= 28) { score += 25; reasons.push('Ideal temperature'); }
  else if (temp >= 12 && temp <= 32) { score += 15; reasons.push('Good temperature'); }
  else { score -= 10; reasons.push('Extreme temperature'); }

  if (humidity >= 30 && humidity <= 60) { score += 15; reasons.push('Comfortable humidity'); }
  else if (humidity > 80) { score -= 15; reasons.push('High humidity'); }

  if (wind < 20) { score += 10; reasons.push('Light breeze'); }
  else if (wind > 35) { score -= 10; reasons.push('Strong winds'); }

  const conditionLower = weather.description.toLowerCase();
  if (conditionLower.includes('sun') || conditionLower.includes('clear')) { score += 15; reasons.push('Sunny skies'); }
  else if (conditionLower.includes('rain')) { score -= 20; reasons.push('Rainy conditions'); }

  return { score: Math.min(100, Math.max(0, Math.round(score))), reason: reasons[0] || 'Average conditions' };
}

export default function BestDayScoring({ cities }: BestDayScoringProps) {
  const weekScores = useMemo((): DayScore[] => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      const scores = cities.map(city => {
        const { score, reason } = calculateScore(city, i);
        return { city, score, reason };
      }).sort((a, b) => b.score - a.score);

      return {
        date,
        dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[date.getDay()],
        scores,
        overallBest: scores.length > 0 ? scores[0].city : null,
      };
    });
  }, [cities]);

  const bestOverall = useMemo(() => {
    if (cities.length === 0) return null;
    const cityScores = cities.map(city => {
      const totalScore = weekScores.reduce((sum, day) => {
        const cityScore = day.scores.find(s => s.city.id === city.id);
        return sum + (cityScore?.score || 0);
      }, 0);
      return { city, avgScore: Math.round(totalScore / 7) };
    });
    return cityScores.sort((a, b) => b.avgScore - a.avgScore)[0];
  }, [cities, weekScores]);

  if (cities.length === 0) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 text-center">
        <Trophy className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-50" />
        <p className="text-text-muted">Select cities to see best day scoring</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-dark-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Best Day Scoring</h3>
              <p className="text-sm text-text-muted">Find the perfect day for your trip</p>
            </div>
          </div>
          {bestOverall && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-amber-400">{bestOverall.city.name} wins!</span>
            </div>
          )}
        </div>
      </div>

      {bestOverall && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-b border-dark-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-text-muted mb-1">Best Overall This Week</p>
              <p className="text-2xl font-bold text-text-primary">{bestOverall.city.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(bestOverall.avgScore / 20) ? 'text-amber-400 fill-amber-400' : 'text-dark-border'}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-amber-400">{bestOverall.avgScore}/100 avg</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="space-y-3">
          {weekScores.map((day, index) => (
            <div key={index} className="bg-dark-elevated/50 border border-dark-border/50 rounded-xl p-4" style={{ animationDelay: `${index * 50}ms`, animation: 'fadeInUp 0.4s ease-out forwards', opacity: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-text-primary">{day.dayName}</span>
                  <span className="text-sm text-text-muted">{day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                {day.overallBest && index === 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">Today's Pick</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {day.scores.map(({ city, score, reason }, cityIndex) => (
                  <div key={city.id} className={`flex items-center justify-between p-2 rounded-lg transition-colors ${cityIndex === 0 ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20' : 'bg-dark-card/50'}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      {cityIndex === 0 && <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                      {cityIndex !== 0 && <ThumbsUp className="w-4 h-4 text-text-muted flex-shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{city.name}</p>
                        <p className="text-xs text-text-muted truncate">{reason}</p>
                      </div>
                    </div>
                    <div className={`ml-2 px-2 py-1 rounded text-xs font-bold ${score >= 75 ? 'bg-emerald-500/20 text-emerald-400' : score >= 50 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                      {score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-dark-border/50 bg-dark-elevated/30">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="text-text-muted">Sunny = +15 pts</span>
          </div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-400" />
            <span className="text-text-muted">Rain = -20 pts</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-text-muted">18-28°C = +25 pts</span>
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}