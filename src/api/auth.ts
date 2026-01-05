// Auth API Service

const API_URL = 'http://localhost:8080/api/v1';

// Types
export interface User {
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  message: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// ==================== REGISTER ====================
export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  // Save token in localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({
    username: data.username,
    email: data.email,
    role: data.role
  }));

  return data;
};

// ==================== LOGIN ====================
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Save token in localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({
    username: data.username,
    email: data.email,
    role: data.role
  }));

  return data;
};

// ==================== LOGOUT ====================
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ==================== GET CURRENT USER ====================
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// ==================== CHECK IF LOGGED IN ====================
export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('token');
};

// ==================== GET TOKEN ====================
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// ==================== FETCH WITH AUTH ====================
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });

  return response;
};
