export interface UserPermission {
  id: string
  password: string
  alias: string
  can_access_dashboard: boolean
  allowed_tabs: string[]
  allowed_actions: string[]
  created_at?: string
}

export interface AccountingConfig {
  id?: string
  income_accounts: string[]
  expense_accounts: string[]
  updated_at?: string
}

export interface DashboardFilters {
  year: string
  month: string
}

export type TabId =
  | 'dashboard'
  | 'salidas-deposito'
  | 'operarios'
  | 'budget'
  | 'documentacion'
  | 'configuracion'

export const TABS: { id: TabId; label: string; icon?: string }[] = [
  { id: 'dashboard', label: 'Ventas & KPIs' },
  { id: 'salidas-deposito', label: 'Salidas de depósito' },
  { id: 'operarios', label: 'Operarios' },
  { id: 'budget', label: 'Budget' },
  { id: 'documentacion', label: 'Documentación' },
  { id: 'configuracion', label: 'Configuración' },
]

export const ACTIONS = [
  'Cargar EXPORT.csv (Turno)',
  'Exportación a PDF',
  'Exportación a Excel',
  'Botón Control Rápido',
  'Botón Info Recepción',
  'Sincronizar BD Recepción',
  'Sube KIS',
]

export const MASTER_PASSWORD = '2500'
