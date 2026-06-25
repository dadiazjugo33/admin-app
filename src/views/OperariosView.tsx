import { Card } from '../components/Card'

export function OperariosView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-dash-text">Operarios</h1>
        <p className="text-sm text-dash-muted">Gestión de personal, turnos y productividad.</p>
      </div>

      <Card className="bg-dash-panel">
        <div className="text-center py-16 text-dash-muted">
          Módulo en construcción — se alimentará desde la base de datos
          <span className="block text-xs mt-2">Tabla destino: operarios / asistencias</span>
        </div>
      </Card>
    </div>
  )
}
