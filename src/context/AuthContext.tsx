import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI, profileAPI, type User, type UpdateProfileRequest } from '../api';

interface AuthContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;

  // Profile actions
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  deleteAvatar: () => Promise<void>;
  refreshProfile: () => Promise<void>;

  // Role checks
  isAdmin: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const currentUser = authAPI.getCurrentUser();
      if (currentUser && authAPI.isLoggedIn()) {
        setUser(currentUser);
        // Fetch fresh profile data to ensure avatarUrl is current
        try {
          const profile = await profileAPI.getProfile();
          setUser((prev) => (prev ? { ...prev, ...profile } : null));
        } catch {
          // Profile fetch failed, continue with cached data
          console.warn('Could not fetch fresh profile on mount');
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  // Login
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      // Set basic user info first
      setUser({
        username: response.username,
        email: response.email,
        role: response.role,
      });
      // Fetch full profile to get avatarUrl, phoneNumber, etc.
      try {
        const profile = await profileAPI.getProfile();
        setUser((prev) => (prev ? { ...prev, ...profile } : null));
      } catch {
        // Profile fetch failed, continue with basic info
        console.warn('Could not fetch full profile after login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (username: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({ username, email, password });
      setUser({
        username: response.username,
        email: response.email,
        role: response.role,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = (): void => {
    authAPI.logout();
    setUser(null);
  };

  // Update Profile
  const updateProfile = async (data: UpdateProfileRequest): Promise<void> => {
    const updatedProfile = await profileAPI.updateProfile(data);
    setUser((prev) => (prev ? { ...prev, ...updatedProfile } : null));
  };

  // Upload Avatar
  const uploadAvatar = async (file: File): Promise<string> => {
    const updatedProfile = await profileAPI.uploadAvatar(file);
    setUser((prev) => (prev ? { ...prev, ...updatedProfile } : null));
    return updatedProfile.avatarUrl || '';
  };

  // Delete Avatar
  const deleteAvatar = async (): Promise<void> => {
    const updatedProfile = await profileAPI.deleteAvatar();
    setUser((prev) => (prev ? { ...prev, ...updatedProfile, avatarUrl: undefined } : null));
  };

  // Refresh Profile from API
  const refreshProfile = async (): Promise<void> => {
    try {
      const profile = await profileAPI.getProfile();
      setUser((prev) => (prev ? { ...prev, ...profile } : null));
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  // Computed values
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isUser = user?.role === 'USER';

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    refreshProfile,
    isAdmin,
    isUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };
