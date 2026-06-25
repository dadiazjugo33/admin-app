import { Card } from '../components/Card'

export function DocumentacionView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-dash-text">Documentación del Sistema</h1>
        <p className="text-sm text-dash-muted">Manuales, instructivos y recursos de soporte.</p>
      </div>

      <Card className="bg-dash-panel">
        <div className="text-center py-16 text-dash-muted">
          Módulo en construcción — aquí se listarán documentos e instructivos vinculados.
        </div>
      </Card>
    </div>
  )
}
