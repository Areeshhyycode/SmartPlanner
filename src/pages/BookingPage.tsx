import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Clock, Star } from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import {
  BookingSteps,
  DateSelector,
  TravelerForm,
  PaymentForm,
  PriceBreakdown,
} from '../components/booking';

const STEPS = ['Select Date', 'Traveler Info', 'Payment'];

function BookingPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { getTrip, currentBooking, startBooking, updateBooking, completeBooking } = useBooking();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const trip = tripId ? getTrip(tripId) : undefined;

  // Initialize booking if not already started
  useEffect(() => {
    if (tripId && (!currentBooking || currentBooking.tripId !== tripId)) {
      startBooking(tripId);
    }
  }, [tripId, currentBooking, startBooking]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">Trip Not Found</h1>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white text-sm sm:text-base rounded-lg sm:rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  if (!currentBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentComplete = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const bookedTrip = completeBooking();
    if (bookedTrip) {
      navigate('/booking/confirm', { state: { booking: bookedTrip } });
    }
    setIsProcessing(false);
  };

  const isStep1Valid = currentBooking.selectedDateId !== '';
  const isStep2Valid =
    currentBooking.travelerInfo.firstName.trim() !== '' &&
    currentBooking.travelerInfo.lastName.trim() !== '' &&
    currentBooking.travelerInfo.email.trim() !== '' &&
    currentBooking.travelerInfo.phone.trim() !== '';

  return (
    <div className="min-h-screen py-6 sm:py-8 px-3 sm:px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      <div className="absolute top-40 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/trip/${tripId}`)}
          className="flex items-center gap-1.5 sm:gap-2 text-text-secondary hover:text-text-primary mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back to Trip</span>
        </button>

        {/* Trip Summary Header */}
        <div className="bg-dark-card border border-dark-border rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <img
              src={trip.coverImage}
              alt={trip.name}
              className="w-16 h-12 sm:w-24 sm:h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-text-primary truncate">{trip.name}</h2>
              <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs sm:text-sm text-text-secondary mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                  <span className="truncate">{trip.location.city}, {trip.location.country}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {trip.duration} days
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                  {trip.rating}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Steps */}
        <div className="mb-6 sm:mb-10">
          <BookingSteps currentStep={currentStep} steps={STEPS} />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left - Form */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-dark-card border border-dark-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              {/* Step 1: Date Selection */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4 sm:mb-6">
                    Select Your Travel Date
                  </h2>
                  <DateSelector
                    dates={trip.availableDates}
                    selectedDateId={currentBooking.selectedDateId}
                    onDateSelect={(dateId) => updateBooking({ selectedDateId: dateId })}
                    basePrice={trip.price}
                  />
                </div>
              )}

              {/* Step 2: Traveler Info */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4 sm:mb-6">
                    Traveler Information
                  </h2>
                  <TravelerForm
                    travelerInfo={currentBooking.travelerInfo}
                    travelers={currentBooking.travelers}
                    maxTravelers={trip.maxTravelers}
                    onTravelerInfoChange={(info) => updateBooking({ travelerInfo: info })}
                    onTravelersChange={(count) => updateBooking({ travelers: count })}
                  />
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4 sm:mb-6">
                    Payment Details
                  </h2>
                  <PaymentForm
                    onPaymentComplete={handlePaymentComplete}
                    isProcessing={isProcessing}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 3 && (
                <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-dark-border">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-dark-elevated border border-dark-border rounded-lg sm:rounded-xl text-text-primary text-sm sm:text-base hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={(currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)}
                    className="flex items-center gap-1.5 sm:gap-2 px-5 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/25 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right - Price Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <PriceBreakdown
                breakdown={currentBooking.priceBreakdown}
                tripName={trip.name}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
