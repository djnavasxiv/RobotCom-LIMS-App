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
}

const userService = new UserService();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  labId: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.login(username, password);
      if (user) {
        set({ user, labId: user.labId, isAuthenticated: true, isLoading: false });
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
  },
}));
