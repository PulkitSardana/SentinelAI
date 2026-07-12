import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Role = 'L1_ANALYST' | 'L2_INVESTIGATOR' | 'COMPLIANCE' | 'ADMIN'

interface User {
  id: string
  name: string
  email: string
  role: Role
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  activeViewers: any[] // Store active sessions from the backend
  login: (token: string, user: User) => void
  logout: () => void
  setRole: (role: Role) => void
  setActiveViewers: (viewers: any[]) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      activeViewers: [],
      
      login: (token: string, user: User) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setRole: (role) => 
        set((state) => ({ 
          user: state.user ? { ...state.user, role } : null 
        })),
      setActiveViewers: (viewers) => set({ activeViewers: viewers }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
