import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { UserPermission } from '../types'
import { MASTER_PASSWORD } from '../types'

interface AuthContextValue {
  currentUser: UserPermission | null
  isMaster: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'admin_dashboard_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserPermission | null>(null)
  const [isMaster, setIsMaster] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setCurrentUser(parsed.user || null)
        setIsMaster(parsed.isMaster || false)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const login = (password: string) => {
    if (password === MASTER_PASSWORD) {
      const master: UserPermission = {
        id: 'master',
        password: MASTER_PASSWORD,
        alias: 'Director General / CTO',
        can_access_dashboard: true,
        allowed_tabs: [
          'dashboard',
          'salidas-deposito',
          'operarios',
          'budget',
          'documentacion',
          'configuracion',
        ],
        allowed_actions: [
          'Cargar EXPORT.csv (Turno)',
          'Exportación a PDF',
          'Exportación a Excel',
          'Botón Control Rápido',
          'Botón Info Recepción',
          'Sincronizar BD Recepción',
          'Sube KIS',
        ],
      }
      setCurrentUser(master)
      setIsMaster(true)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: master, isMaster: true }))
      return true
    }
    return false
  }

  const logout = () => {
    setCurrentUser(null)
    setIsMaster(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ currentUser, isMaster, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
