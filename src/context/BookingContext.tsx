import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  ProviderTrip,
  BookedTrip,
  PlannedTrip,
  BookingInProgress,
  PriceBreakdown,
  TripCategory,
} from '../types/booking';
import { providerTrips, getTripById } from '../data/providerTrips';

interface BookingContextType {
  // Trips data
  trips: ProviderTrip[];
  getTrip: (id: string) => ProviderTrip | undefined;
  getTripsByCategory: (category: TripCategory | 'all') => ProviderTrip[];

  // Booked trips
  bookedTrips: BookedTrip[];
  addBookedTrip: (trip: BookedTrip) => void;
  cancelBookedTrip: (id: string) => void;

  // Planned trips (user's self-planned)
  plannedTrips: PlannedTrip[];
  addPlannedTrip: (trip: Omit<PlannedTrip, 'id'> & { id?: string | number }) => void;
  updatePlannedTrip: (id: number | string, trip: Partial<PlannedTrip>) => void;
  deletePlannedTrip: (id: number | string) => void;

  // Current booking in progress
  currentBooking: BookingInProgress | null;
  startBooking: (tripId: string) => void;
  updateBooking: (data: Partial<BookingInProgress>) => void;
  clearBooking: () => void;
  completeBooking: () => BookedTrip | null;

  // Price calculation
  calculatePrice: (tripId: string, dateId: string, travelers: number) => PriceBreakdown | null;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Initial planned trips (demo data)
const initialPlannedTrips: PlannedTrip[] = [
  {
    id: 1,
    name: 'Europe Backpacking',
    startDate: '2025-03-15',
    endDate: '2025-04-15',
    cities: ['Paris', 'Amsterdam', 'Berlin', 'Prague'],
    status: 'planned',
    travelers: 2,
  },
  {
    id: 2,
    name: 'Japan Cherry Blossom',
    startDate: '2025-04-01',
    endDate: '2025-04-14',
    cities: ['Tokyo', 'Kyoto', 'Osaka'],
    status: 'planned',
    travelers: 1,
  },
];

// Generate confirmation code
function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'TP-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate unique ID
function generateId(): string {
  return `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookedTrips, setBookedTrips] = useState<BookedTrip[]>([]);
  const [plannedTrips, setPlannedTrips] = useState<PlannedTrip[]>(initialPlannedTrips);
  const [currentBooking, setCurrentBooking] = useState<BookingInProgress | null>(null);

  // Get trip by ID
  const getTrip = (id: string): ProviderTrip | undefined => {
    return getTripById(id);
  };

  // Get trips by category
  const getTripsByCategory = (category: TripCategory | 'all'): ProviderTrip[] => {
    if (category === 'all') {
      return providerTrips;
    }
    return providerTrips.filter((trip) => trip.category === category);
  };

  // Calculate price breakdown
  const calculatePrice = (
    tripId: string,
    dateId: string,
    travelers: number
  ): PriceBreakdown | null => {
    const trip = getTrip(tripId);
    if (!trip) return null;

    const selectedDate = trip.availableDates.find((d) => d.id === dateId);
    const priceModifier = selectedDate?.priceModifier || 1;

    const basePrice = trip.price;
    const adjustedPrice = basePrice * priceModifier;
    const subtotal = adjustedPrice * travelers;
    const taxes = Math.round(subtotal * 0.1); // 10% tax
    const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
    const total = subtotal + taxes + serviceFee;

    return {
      basePrice: adjustedPrice,
      travelers,
      subtotal,
      taxes,
      serviceFee,
      total,
    };
  };

  // Start a new booking
  const startBooking = (tripId: string) => {
    const trip = getTrip(tripId);
    if (!trip || trip.availableDates.length === 0) return;

    const firstDate = trip.availableDates[0];
    const priceBreakdown = calculatePrice(tripId, firstDate.id, 1);

    if (!priceBreakdown) return;

    setCurrentBooking({
      tripId,
      selectedDateId: firstDate.id,
      travelers: 1,
      travelerInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      },
      priceBreakdown,
    });
  };

  // Update current booking
  const updateBooking = (data: Partial<BookingInProgress>) => {
    if (!currentBooking) return;

    const updated = { ...currentBooking, ...data };

    // Recalculate price if travelers or date changed
    if (data.travelers !== undefined || data.selectedDateId !== undefined) {
      const newPrice = calculatePrice(
        updated.tripId,
        updated.selectedDateId,
        updated.travelers
      );
      if (newPrice) {
        updated.priceBreakdown = newPrice;
      }
    }

    setCurrentBooking(updated);
  };

  // Clear current booking
  const clearBooking = () => {
    setCurrentBooking(null);
  };

  // Complete booking and add to booked trips
  const completeBooking = (): BookedTrip | null => {
    if (!currentBooking) return null;

    const trip = getTrip(currentBooking.tripId);
    if (!trip) return null;

    const selectedDate = trip.availableDates.find(
      (d) => d.id === currentBooking.selectedDateId
    );
    if (!selectedDate) return null;

    const bookedTrip: BookedTrip = {
      id: generateId(),
      tripId: currentBooking.tripId,
      tripName: trip.name,
      coverImage: trip.coverImage,
      category: trip.category,
      location: trip.location,
      startDate: selectedDate.startDate,
      endDate: selectedDate.endDate,
      travelers: currentBooking.travelers,
      totalPrice: currentBooking.priceBreakdown.total,
      status: 'upcoming',
      bookingDate: new Date().toISOString().split('T')[0],
      confirmationCode: generateConfirmationCode(),
    };

    setBookedTrips((prev) => [bookedTrip, ...prev]);
    setCurrentBooking(null);

    return bookedTrip;
  };

  // Add booked trip
  const addBookedTrip = (trip: BookedTrip) => {
    setBookedTrips((prev) => [trip, ...prev]);
  };

  // Cancel booked trip
  const cancelBookedTrip = (id: string) => {
    setBookedTrips((prev) =>
      prev.map((trip) =>
        trip.id === id ? { ...trip, status: 'cancelled' as const } : trip
      )
    );
  };

  // Add planned trip
  const addPlannedTrip = (trip: Omit<PlannedTrip, 'id'> & { id?: string | number }) => {
    const newTrip: PlannedTrip = {
      ...trip,
      id: trip.id || Date.now(),
    };
    setPlannedTrips((prev) => [newTrip, ...prev]);
  };

  // Update planned trip
  const updatePlannedTrip = (id: number | string, data: Partial<PlannedTrip>) => {
    setPlannedTrips((prev) =>
      prev.map((trip) => (trip.id === id ? { ...trip, ...data } : trip))
    );
  };

  // Delete planned trip
  const deletePlannedTrip = (id: number | string) => {
    setPlannedTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  const value: BookingContextType = {
    trips: providerTrips,
    getTrip,
    getTripsByCategory,
    bookedTrips,
    addBookedTrip,
    cancelBookedTrip,
    plannedTrips,
    addPlannedTrip,
    updatePlannedTrip,
    deletePlannedTrip,
    currentBooking,
    startBooking,
    updateBooking,
    clearBooking,
    completeBooking,
    calculatePrice,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBookingContext() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
}

export { BookingContext };
