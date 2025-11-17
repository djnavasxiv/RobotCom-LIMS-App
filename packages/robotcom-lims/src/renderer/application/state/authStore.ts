import create from 'zustand';
import { User } from '../../domain/entities/User';
import { UserService } from '../services/UserService';

interface AuthState {
  user: User | null;
  labId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setAuthenticated: (authenticated: boolean, user?: User | null, labId?: string) => void;
}

const userService = new UserService();

// Persist auth state to localStorage
const loadPersistedState = () => {
  try {
    const persisted = localStorage.getItem('authState');
    if (persisted) {
      return JSON.parse(persisted);
    }
  } catch (err) {
    console.warn('Failed to load persisted auth state:', err);
  }
  return null;
};

const persistedState = loadPersistedState();

export const useAuthStore = create<AuthState>((set) => ({
  user: persistedState?.user || null,
  labId: persistedState?.labId || null,
  isAuthenticated: persistedState?.isAuthenticated || false,
  isLoading: false,
  error: null,
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.login(username, password);
      if (user) {
        const newState = { user, labId: user.labId, isAuthenticated: true, isLoading: false };
        set(newState);
        // Persist to localStorage
        localStorage.setItem('authState', JSON.stringify(newState));
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      const message = (error as Error).message;
      set({ error: message, isAuthenticated: false, isLoading: false });
    }
  },
  logout: () => {
    set({ user: null, labId: null, isAuthenticated: false });
    localStorage.removeItem('authState');
  },
  setAuthenticated: (authenticated, user = null, labId = '') => {
    const newState = { isAuthenticated: authenticated, user, labId };
    set(newState);
    if (authenticated) {
      localStorage.setItem('authState', JSON.stringify(newState));
    } else {
      localStorage.removeItem('authState');
    }
  },
}));
