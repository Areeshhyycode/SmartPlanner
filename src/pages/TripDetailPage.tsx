import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Star,
  Users,
  ArrowLeft,
  Check,
  X,
  Shield,
  Award,
  Minus,
  Plus,
  Calendar,
  Cloud,
  Sun,
  CloudRain,
  Snowflake,
  Wind,
  CheckCircle,
} from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import { ImageGallery } from '../components/booking';
import { getCategoryInfo } from '../data/providerTrips';

// Mock weather data based on location
const getWeatherForLocation = (city: string) => {
  const weatherTypes = [
    { temp: 28, condition: 'Sunny', icon: Sun, color: '#fbbf24' },
    { temp: 22, condition: 'Cloudy', icon: Cloud, color: '#94a3b8' },
    { temp: 18, condition: 'Rainy', icon: CloudRain, color: '#3b82f6' },
    { temp: -2, condition: 'Snowy', icon: Snowflake, color: '#22d3ee' },
    { temp: 25, condition: 'Windy', icon: Wind, color: '#a3e635' },
  ];
  const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return weatherTypes[hash % weatherTypes.length];
};

function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { getTrip, addBookedTrip } = useBooking();

  const trip = tripId ? getTrip(tripId) : undefined;

  // Booking state
  const [selectedDays, setSelectedDays] = useState(3);
  const [travelers, setTravelers] = useState(1);
  const [isBooked, setIsBooked] = useState(false);
  const [weather, setWeather] = useState<ReturnType<typeof getWeatherForLocation> | null>(null);

  useEffect(() => {
    if (trip) {
      setWeather(getWeatherForLocation(trip.location.city));
    }
  }, [trip]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Trip Not Found</h1>
          <p className="text-text-secondary mb-6">
            The trip you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(trip.category);
  const WeatherIcon = weather?.icon || Cloud;

  // Price calculation
  const pricePerDay = trip.price;
  const subtotal = pricePerDay * selectedDays * travelers;
  const taxes = Math.round(subtotal * 0.1);
  const totalPrice = subtotal + taxes;

  // Generate start/end dates
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 7);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + selectedDays - 1);

  const handleBookTrip = () => {
    // Generate confirmation code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let confirmationCode = 'TP-';
    for (let i = 0; i < 6; i++) {
      confirmationCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Add to booked trips
    addBookedTrip({
      id: `book-${Date.now()}`,
      tripId: trip.id,
      tripName: trip.name,
      coverImage: trip.coverImage,
      category: trip.category,
      location: trip.location,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      travelers: travelers,
      totalPrice: totalPrice,
      status: 'upcoming',
      bookingDate: new Date().toISOString().split('T')[0],
      confirmationCode: confirmationCode,
    });

    setIsBooked(true);

    // Navigate to My Trips after 2 seconds
    setTimeout(() => {
      navigate('/trips');
    }, 2000);
  };

  // Show success message
  if (isBooked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Trip Booked!</h1>
          <p className="text-text-secondary mb-4">
            Your trip to {trip.location.city} has been added to My Trips
          </p>
          <p className="text-text-muted">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery
              images={trip.images}
              coverImage={trip.coverImage}
              tripName={trip.name}
            />

            {/* Title & Location */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${categoryInfo?.color}20`,
                    color: categoryInfo?.color,
                  }}
                >
                  <span>{categoryInfo?.icon}</span>
                  <span>{categoryInfo?.label}</span>
                </div>
                {/* Weather Badge */}
                {weather && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-dark-elevated rounded-full">
                    <WeatherIcon className="w-4 h-4" style={{ color: weather.color }} />
                    <span className="text-text-primary text-sm font-medium">{weather.temp}°C</span>
                    <span className="text-text-muted text-sm">{weather.condition}</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">{trip.name}</h1>
              <div className="flex items-center gap-4 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>
                    {trip.location.city}, {trip.location.country}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-text-primary font-medium">{trip.rating}</span>
                  <span>({trip.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-lg font-semibold text-text-primary">${trip.price}</p>
                <p className="text-sm text-text-muted">Per Day</p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-lg font-semibold text-text-primary">{trip.maxTravelers}</p>
                <p className="text-sm text-text-muted">Max Travelers</p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
                <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-lg font-semibold text-text-primary capitalize">
                  {trip.difficulty || 'Moderate'}
                </p>
                <p className="text-sm text-text-muted">Difficulty</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">About This Trip</h2>
              <p className="text-text-secondary leading-relaxed">{trip.description}</p>
            </div>

            {/* Highlights */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-text-primary">Trip Highlights</h2>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3">
                {trip.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-blue-400" />
                    </div>
                    <span className="text-text-secondary">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Included */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  What's Included
                </h2>
                <ul className="space-y-2">
                  {trip.included.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-text-secondary">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <X className="w-5 h-5 text-danger" />
                  Not Included
                </h2>
                <ul className="space-y-2">
                  {trip.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-text-secondary">
                      <X className="w-4 h-4 text-danger" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Plan Your Trip */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-dark-card border border-dark-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-text-primary mb-6">Plan Your Trip</h2>

              {/* Days Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Number of Days
                </label>
                <div className="flex items-center justify-between bg-dark-elevated rounded-xl p-4">
                  <button
                    onClick={() => setSelectedDays(Math.max(1, selectedDays - 1))}
                    disabled={selectedDays <= 1}
                    className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-text-primary hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-text-primary">{selectedDays}</span>
                    <span className="text-text-muted ml-2">days</span>
                  </div>
                  <button
                    onClick={() => setSelectedDays(Math.min(30, selectedDays + 1))}
                    disabled={selectedDays >= 30}
                    className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-text-primary hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Travelers Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Number of Travelers
                </label>
                <div className="flex items-center justify-between bg-dark-elevated rounded-xl p-4">
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    disabled={travelers <= 1}
                    className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-text-primary hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-text-primary">{travelers}</span>
                    <span className="text-text-muted ml-2">
                      {travelers === 1 ? 'person' : 'people'}
                    </span>
                  </div>
                  <button
                    onClick={() => setTravelers(Math.min(trip.maxTravelers, travelers + 1))}
                    disabled={travelers >= trip.maxTravelers}
                    className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-text-primary hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Trip Dates Preview */}
              <div className="mb-6 p-4 bg-dark-elevated rounded-xl">
                <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Trip Dates</span>
                </div>
                <p className="text-text-primary font-medium">
                  {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                  {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-text-secondary">
                  <span>${pricePerDay} × {selectedDays} days × {travelers} {travelers === 1 ? 'person' : 'people'}</span>
                  <span className="text-text-primary">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Taxes (10%)</span>
                  <span className="text-text-primary">${taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-dark-border">
                  <span className="text-lg font-semibold text-text-primary">Total</span>
                  <span className="text-2xl font-bold text-blue-400">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookTrip}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 hover:-translate-y-0.5"
              >
                Add to My Trips
              </button>

              {/* Trust Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-text-muted text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Free cancellation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripDetailPage;
