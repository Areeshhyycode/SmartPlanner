// Trip Categories
export type TripCategory = 'adventure' | 'beach' | 'mountain' | 'cultural' | 'city-tours';

// Category metadata for UI
export interface CategoryInfo {
  id: TripCategory;
  label: string;
  icon: string;
  description: string;
  color: string;
}

// Available date for a trip
export interface AvailableDate {
  id: string;
  startDate: string;
  endDate: string;
  spotsLeft: number;
  priceModifier: number; // 1.0 = normal, 1.2 = peak season
}

// Provider Trip (from the single provider)
export interface ProviderTrip {
  id: string;
  name: string;
  category: TripCategory;
  description: string;
  shortDescription: string;
  coverImage: string;
  images: string[];
  duration: number; // days
  price: number; // base price per person
  rating: number;
  reviewCount: number;
  location: {
    country: string;
    city: string;
  };
  highlights: string[];
  included: string[];
  notIncluded: string[];
  maxTravelers: number;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  availableDates: AvailableDate[];
}

// Traveler Info for booking
export interface TravelerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Price Breakdown
export interface PriceBreakdown {
  basePrice: number;
  travelers: number;
  subtotal: number;
  taxes: number;
  serviceFee: number;
  total: number;
}

// Booked Trip (after booking is confirmed)
export interface BookedTrip {
  id: string;
  tripId: string;
  tripName: string;
  coverImage: string;
  category: TripCategory;
  location: {
    country: string;
    city: string;
  };
  startDate: string;
  endDate: string;
  travelers: number;
  totalPrice: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  bookingDate: string;
  confirmationCode: string;
}

// User's self-planned trip (existing feature)
export interface PlannedTrip {
  id: number | string;
  name: string;
  startDate: string;
  endDate: string;
  cities: string[];
  status: 'planned' | 'ongoing' | 'completed';
  weather?: string | { temp: number; condition: string };
  travelers?: number;
  // New fields for destination-based trips
  destinationId?: string;
  coverImage?: string;
  attractions?: {
    id: string;
    name: string;
    image: string;
  }[];
  totalPrice?: number;
  country?: string;
}

// Current booking in progress
export interface BookingInProgress {
  tripId: string;
  selectedDateId: string;
  travelers: number;
  travelerInfo: TravelerInfo;
  priceBreakdown: PriceBreakdown;
}

// Filter options for explore page
export interface TripFilters {
  category: TripCategory | 'all';
  searchQuery: string;
}
