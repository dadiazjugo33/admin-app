import { Card } from '../components/Card'

export function BudgetView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-dash-text">Budget</h1>
        <p className="text-sm text-dash-muted">Comparativo de budget presentado, realizado y diferencias.</p>
      </div>

      <Card className="bg-dash-panel">
        <div className="text-center py-16 text-dash-muted">
          Módulo en construcción — se alimentará desde la base de datos
          <span className="block text-xs mt-2">Tablas destino: budget_presentado, budget_realizado</span>
        </div>
      </Card>
    </div>
  )
}
