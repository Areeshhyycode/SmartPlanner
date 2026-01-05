import type { AxiosError } from 'axios';

interface BackendErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  timestamp?: string;
}

/**
 * Parse backend error and return user-friendly message
 */
export function parseErrorMessage(error: unknown): string {
  // If it's already a string, return it
  if (typeof error === 'string') {
    return error;
  }

  // If it's an Error object
  if (error instanceof Error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;

    // Check if it's an Axios error with response
    if (axiosError.response) {
      const { status, data } = axiosError.response;

      // Handle specific status codes
      switch (status) {
        case 400:
          return parseValidationError(data);
        case 401:
          return 'Incorrect email or password. Please try again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return parseConflictError(data);
        case 500:
          return 'Server error. Please try again later.';
        case 503:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          // Try to extract message from backend response
          if (data?.message) {
            return cleanBackendMessage(data.message);
          }
          if (data?.error) {
            return cleanBackendMessage(data.error);
          }
          return `Error ${status}: Something went wrong. Please try again.`;
      }
    }

    // Network errors (no response from server)
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Cannot connect to server. Please check your internet connection.';
    }

    // Timeout errors
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }

    // Generic error message
    if (axiosError.message) {
      return cleanBackendMessage(axiosError.message);
    }
  }

  // Fallback
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Parse validation errors (400 Bad Request)
 */
function parseValidationError(data: BackendErrorResponse): string {
  if (!data?.message) {
    return 'Invalid input. Please check your information and try again.';
  }

  const message = data.message.toLowerCase();

  // Email validation
  if (message.includes('email') && message.includes('invalid')) {
    return 'Please enter a valid email address.';
  }
  if (message.includes('email') && message.includes('required')) {
    return 'Email is required.';
  }

  // Password validation
  if (message.includes('password') && message.includes('short')) {
    return 'Password must be at least 8 characters long.';
  }
  if (message.includes('password') && message.includes('weak')) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
  }
  if (message.includes('password') && message.includes('required')) {
    return 'Password is required.';
  }

  // Username validation
  if (message.includes('username') && message.includes('short')) {
    return 'Username must be at least 3 characters long.';
  }
  if (message.includes('username') && message.includes('required')) {
    return 'Username is required.';
  }

  // Generic validation error
  return cleanBackendMessage(data.message);
}

/**
 * Parse conflict errors (409 Conflict)
 */
function parseConflictError(data: BackendErrorResponse): string {
  if (!data?.message) {
    return 'This operation conflicts with existing data.';
  }

  const message = data.message.toLowerCase();

  // Email already exists
  if (message.includes('email') && (message.includes('exists') || message.includes('already') || message.includes('taken'))) {
    return 'An account with this email already exists. Please use a different email or try logging in.';
  }

  // Username already exists
  if (message.includes('username') && (message.includes('exists') || message.includes('already') || message.includes('taken'))) {
    return 'This username is already taken. Please choose a different username.';
  }

  // Generic conflict
  return cleanBackendMessage(data.message);
}

/**
 * Clean up backend error messages to be more user-friendly
 */
function cleanBackendMessage(message: string): string {
  // Remove technical jargon
  let cleaned = message
    .replace(/\[.*?\]/g, '') // Remove [brackets]
    .replace(/\(.*?\)/g, '') // Remove (parentheses)
    .replace(/java\.\w+\.\w+Exception:/g, '') // Remove Java exception class names
    .replace(/at\s+\w+\.\w+\.\w+/g, '') // Remove Java stack trace info
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, '') // Remove timestamps
    .trim();

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // Ensure it ends with a period
  if (cleaned.length > 0 && !cleaned.endsWith('.') && !cleaned.endsWith('!') && !cleaned.endsWith('?')) {
    cleaned += '.';
  }

  return cleaned || 'An error occurred. Please try again.';
}

/**
 * Get success message for different operations
 */
export function getSuccessMessage(operation: string): string {
  const messages: Record<string, string> = {
    login: 'Login successful! Welcome back.',
    register: 'Registration successful! Welcome to Smart Trip Planner.',
    logout: 'Logged out successfully.',
    'update-profile': 'Profile updated successfully.',
    'upload-avatar': 'Avatar uploaded successfully.',
    'delete-avatar': 'Avatar deleted successfully.',
    'create-trip': 'Trip created successfully!',
    'update-trip': 'Trip updated successfully.',
    'cancel-trip': 'Trip cancelled successfully.',
    'delete-trip': 'Trip deleted successfully.',
  };

  return messages[operation] || 'Operation completed successfully.';
}
