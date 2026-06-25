import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { LoginView } from './components/LoginView'
import { Sidebar } from './components/Sidebar'
import { DashboardView } from './views/DashboardView'
import { SalidasDepositoView } from './views/SalidasDepositoView'
import { OperariosView } from './views/OperariosView'
import { BudgetView } from './views/BudgetView'
import { DocumentacionView } from './views/DocumentacionView'
import { ConfiguracionView } from './views/ConfiguracionView'
import type { TabId } from './types'

const VIEWS: Record<TabId, React.FC> = {
  dashboard: DashboardView,
  'salidas-deposito': SalidasDepositoView,
  operarios: OperariosView,
  budget: BudgetView,
  documentacion: DocumentacionView,
  configuracion: ConfiguracionView,
}

function App() {
  const { currentUser } = useAuth()
  const allowedTabs = (currentUser?.allowed_tabs as TabId[]) || []
  const [activeTab, setActiveTab] = useState<TabId>(
    allowedTabs[0] || 'dashboard'
  )

  if (!currentUser) {
    return <LoginView />
  }

  const ActiveView = VIEWS[activeTab] || DashboardView

  return (
    <div className="flex min-h-screen bg-dash-bg">
      <Sidebar
        activeTab={activeTab}
        onSelect={setActiveTab}
        allowedTabs={allowedTabs}
      />
      <main className="flex-1 p-6 overflow-y-auto">
        <ActiveView />
      </main>
    </div>
  )
}

export default App
