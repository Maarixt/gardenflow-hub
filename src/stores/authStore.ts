import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Organization } from '@/types';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  setOrganization: (organization: Organization) => void;
}

// Mock authentication - replace with real auth service
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@saphari.com',
    role: 'ADMIN',
    organizationId: '1',
    createdAt: new Date(),
    lastLogin: new Date(),
  },
  {
    id: '2',
    username: 'user',
    email: 'user@saphari.com',
    role: 'USER',
    organizationId: '1',
    createdAt: new Date(),
    lastLogin: new Date(),
  },
];

const mockOrganization: Organization = {
  id: '1',
  name: 'Saphari Smart Gardens',
  createdAt: new Date(),
  themeColors: {
    primary: 'hsl(142, 76%, 36%)',
    secondary: 'hsl(210, 40%, 96%)',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      organization: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock authentication logic
        const user = mockUsers.find(u => u.username === username);
        const validPasswords = {
          'admin': 'admin123',
          'user': 'user123'
        };
        
        if (user && validPasswords[username as keyof typeof validPasswords] === password) {
          set({ 
            user, 
            organization: mockOrganization,
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        } else {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          organization: null,
          isAuthenticated: false 
        });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setOrganization: (organization: Organization) => {
        set({ organization });
      },
    }),
    {
      name: 'saphari-auth',
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);