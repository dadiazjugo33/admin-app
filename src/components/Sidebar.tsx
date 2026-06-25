import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Users,
  Wallet,
  FileText,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '../hooks/useAuth'
import type { TabId } from '../types'
import { TABS } from '../types'

const ICONS: Record<TabId, React.ReactNode> = {
  dashboard: <LayoutDashboard className="h-4 w-4" />,
  'salidas-deposito': <Package className="h-4 w-4" />,
  operarios: <Users className="h-4 w-4" />,
  budget: <Wallet className="h-4 w-4" />,
  documentacion: <FileText className="h-4 w-4" />,
  configuracion: <Settings className="h-4 w-4" />,
}

interface SidebarProps {
  activeTab: TabId
  onSelect: (tab: TabId) => void
  allowedTabs: TabId[]
}

export function Sidebar({ activeTab, onSelect, allowedTabs }: SidebarProps) {
  const { logout, currentUser } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const visibleTabs = TABS.filter((t) => allowedTabs.includes(t.id))

  return (
    <aside
      className={cn(
        'flex flex-col bg-dash-sidebar border-r border-dash-border transition-all',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-dash-border">
        {!collapsed && (
          <div>
            <div className="text-[10px] uppercase tracking-widest text-dash-muted">
              Estacionamiento
            </div>
            <div className="font-bold text-dash-text text-sm">Espacio San Lorenzo</div>
            <div className="inline-block mt-1 px-2 py-0.5 rounded bg-dash-primary/20 text-[10px] font-semibold text-dash-primary">
              CLOUD LIVE — v1.0
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-white/5 text-dash-muted"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
              activeTab === tab.id
                ? 'bg-dash-primary/10 text-dash-primary border-r-2 border-dash-primary'
                : 'text-dash-muted hover:bg-white/5 hover:text-dash-text',
              collapsed && 'justify-center px-2'
            )}
          >
            {ICONS[tab.id]}
            {!collapsed && <span>{tab.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-dash-border">
        {!collapsed && currentUser && (
          <div className="mb-2 text-xs text-dash-muted truncate">
            {currentUser.alias}
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-red-600/10 hover:bg-red-600/20 text-red-400 px-3 py-2 text-sm transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && 'Cerrar Sesión'}
        </button>
      </div>
    </aside>
  )
}
