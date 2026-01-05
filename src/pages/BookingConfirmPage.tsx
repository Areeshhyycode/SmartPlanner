import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Users, Hash, Download, Share2, Home } from 'lucide-react';
import type { BookedTrip } from '../types/booking';
import { getCategoryInfo } from '../data/providerTrips';

function BookingConfirmPage() {
  const location = useLocation();
  const booking = location.state?.booking as BookedTrip | undefined;

  // If no booking data, redirect to explore
  if (!booking) {
    return <Navigate to="/explore" replace />;
  }

  const categoryInfo = getCategoryInfo(booking.category);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-green-500/20 rounded-full animate-ping"></div>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mt-6 mb-2">Booking Confirmed!</h1>
          <p className="text-text-secondary text-lg">
            Your adventure awaits. Get ready for an amazing experience!
          </p>
        </div>

        {/* Booking Card */}
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-48">
            <img
              src={booking.coverImage}
              alt={booking.tripName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent"></div>
            {/* Category Badge */}
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5"
              style={{
                backgroundColor: `${categoryInfo?.color}20`,
                color: categoryInfo?.color,
              }}
            >
              <span>{categoryInfo?.icon}</span>
              <span>{categoryInfo?.label}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Confirmation Code */}
            <div className="bg-dark-elevated border border-dark-border rounded-xl p-4 mb-6 text-center">
              <p className="text-text-muted text-sm mb-1">Confirmation Code</p>
              <p className="text-2xl font-bold text-blue-400 font-mono tracking-wider">
                {booking.confirmationCode}
              </p>
            </div>

            {/* Trip Name */}
            <h2 className="text-2xl font-bold text-text-primary mb-4">{booking.tripName}</h2>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-text-muted text-sm">Destination</p>
                  <p className="text-text-primary font-medium">
                    {booking.location.city}, {booking.location.country}
                  </p>
                </div>
              </div>

              {/* Travelers */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-text-muted text-sm">Travelers</p>
                  <p className="text-text-primary font-medium">
                    {booking.travelers} {booking.travelers === 1 ? 'Person' : 'People'}
                  </p>
                </div>
              </div>

              {/* Start Date */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-text-muted text-sm">Start Date</p>
                  <p className="text-text-primary font-medium">{formatDate(booking.startDate)}</p>
                </div>
              </div>

              {/* End Date */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-text-muted text-sm">End Date</p>
                  <p className="text-text-primary font-medium">{formatDate(booking.endDate)}</p>
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between py-4 border-t border-dark-border">
              <span className="text-lg font-semibold text-text-primary">Total Paid</span>
              <span className="text-2xl font-bold text-blue-400">
                ${booking.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-dark-card border border-dark-border hover:border-blue-500/50 rounded-xl text-text-primary font-medium transition-all">
            <Download className="w-5 h-5" />
            Download Itinerary
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-dark-card border border-dark-border hover:border-blue-500/50 rounded-xl text-text-primary font-medium transition-all">
            <Share2 className="w-5 h-5" />
            Share Trip
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/trips"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 transition-all"
          >
            <Hash className="w-5 h-5 text-white" />
            View My Trips
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-dark-elevated border border-dark-border hover:border-blue-500/50 rounded-xl text-text-primary font-medium transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-10 text-center">
          <p className="text-text-muted text-sm">
            A confirmation email has been sent to your registered email address.
            <br />
            Please check your inbox for more details about your trip.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmPage;
