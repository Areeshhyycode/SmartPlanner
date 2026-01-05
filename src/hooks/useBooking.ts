import { useBookingContext } from '../context/BookingContext';

// Re-export the hook with a simpler name
export const useBooking = useBookingContext;

// Export default as well for convenience
export default useBooking;
