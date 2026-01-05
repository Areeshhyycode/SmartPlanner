import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Calendar,
  MapPin,
  ArrowRight,
  Edit3,
  Trash2,
  MoreVertical,
  Cloud,
  Plane,
  Clock,
} from 'lucide-react';

interface Trip {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  cities: string[];
  status: 'planned' | 'ongoing' | 'completed';
  coverImage?: string;
  weather?: string;
  travelers?: number;
}

function TripsPage() {
  const [trips] = useState<Trip[]>([
    {
      id: 1,
      name: 'Summer Europe Trip',
      startDate: '2024-06-15',
      endDate: '2024-06-30',
      cities: ['Paris', 'London', 'Rome'],
      status: 'planned',
      weather: 'Sunny',
      travelers: 2,
    },
    {
      id: 2,
      name: 'Beach Vacation',
      startDate: '2024-07-10',
      endDate: '2024-07-20',
      cities: ['Miami', 'Cancun'],
      status: 'planned',
      weather: 'Hot',
      travelers: 4,
    },
    {
      id: 3,
      name: 'Japan Adventure',
      startDate: '2024-08-01',
      endDate: '2024-08-15',
      cities: ['Tokyo', 'Kyoto', 'Osaka'],
      status: 'planned',
      weather: 'Humid',
      travelers: 2,
    },
  ]);

  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ongoing':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-text-muted/20 text-text-muted border-text-muted/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getDaysUntil = (date: string) => {
    const tripDate = new Date(date);
    const today = new Date();
    const diffTime = tripDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              My <span className="gradient-text">Trips</span>
            </h1>
            <p className="text-lg text-text-secondary">Manage and organize your travel plans</p>
          </div>
          <Link
            to="/trips/new"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Trip
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Trips', value: trips.length, icon: Plane, color: 'blue' },
            { label: 'Planned', value: trips.filter((t) => t.status === 'planned').length, icon: Calendar, color: 'cyan' },
            { label: 'Cities', value: [...new Set(trips.flatMap((t) => t.cities))].length, icon: MapPin, color: 'purple' },
            { label: 'Next Trip', value: `${getDaysUntil(trips[0]?.startDate || '')} days`, icon: Clock, color: 'green' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-dark-card border border-dark-border rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                  <div className="text-text-muted text-sm">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trips Grid */}
        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="group bg-dark-card border border-dark-border hover:border-blue-500/30 rounded-2xl overflow-hidden transition-all duration-300 card-hover"
              >
                {/* Card Header / Image */}
                <div className="relative h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                  <div className="absolute inset-0 bg-grid opacity-30"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(trip.status)}`}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === trip.id ? null : trip.id)}
                        className="p-2 bg-dark-bg/50 hover:bg-dark-bg rounded-lg text-text-secondary hover:text-text-primary transition-all duration-300"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {activeMenu === trip.id && (
                        <div className="absolute right-0 mt-2 w-36 bg-dark-elevated border border-dark-border rounded-xl shadow-xl z-10 overflow-hidden">
                          <button className="w-full px-4 py-2.5 text-left text-sm text-text-primary hover:bg-dark-hover flex items-center gap-2 transition-colors">
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-danger hover:bg-danger/10 flex items-center gap-2 transition-colors">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(trip.travelers || 1, 3))].map((_, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full border-2 border-dark-card flex items-center justify-center text-white text-xs font-semibold"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    {(trip.travelers || 1) > 3 && (
                      <span className="text-text-secondary text-sm">+{(trip.travelers || 1) - 3}</span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-text-primary mb-3 group-hover:text-cyan-400 transition-colors">
                    {trip.name}
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-text-secondary text-sm">
                      <MapPin className="w-4 h-4 text-cyan-400 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {trip.cities.map((city) => (
                          <span
                            key={city}
                            className="px-2 py-0.5 bg-dark-elevated rounded-md text-text-primary text-xs"
                          >
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>

                    {trip.weather && (
                      <div className="flex items-center gap-2 text-text-secondary text-sm">
                        <Cloud className="w-4 h-4 text-yellow-400" />
                        <span>{trip.weather}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/trips/${trip.id}`}
                    className="w-full px-4 py-2.5 bg-dark-elevated hover:bg-blue-500/20 border border-dark-border hover:border-blue-500/50 text-text-primary hover:text-cyan-400 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-dark-card border border-dark-border rounded-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-text-primary mb-2">No Trips Yet</h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Start planning your next adventure! Create your first trip and get personalized weather recommendations.
            </p>
            <Link
              to="/trips/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 transition-all duration-300"
            >
              <Plus className="w-5 h-5 text-white" />
              Create Your First Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripsPage;

