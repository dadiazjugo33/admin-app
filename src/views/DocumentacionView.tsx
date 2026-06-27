import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { exportToExcel, exportToPDF, generateTitle } from '../lib/export'
import { FileText, FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'

const TIPOS = ['Todos', 'Manual', 'Instructivo', 'Procedimiento', 'Legal']

const MOCK_DOCS = [
  { id: 1, nombre: 'Manual de usuario - Dashboard', tipo: 'Manual', version: '1.0', fecha: '2026-05-01', responsable: 'Administración' },
  { id: 2, nombre: 'Instructivo de carga de salidas', tipo: 'Instructivo', version: '1.2', fecha: '2026-05-15', responsable: 'Depósito' },
  { id: 3, nombre: 'Procedimiento de cierre mensual', tipo: 'Procedimiento', version: '2.0', fecha: '2026-06-01', responsable: 'Contabilidad' },
  { id: 4, nombre: 'Política de permisos de acceso', tipo: 'Legal', version: '1.0', fecha: '2026-06-10', responsable: 'RRHH' },
  { id: 5, nombre: 'Guía de exportación PDF/Excel', tipo: 'Instructivo', version: '1.0', fecha: '2026-06-20', responsable: 'Sistemas' },
]

export function DocumentacionView() {
  const [tipo, setTipo] = useState('Todos')

  const filtered = tipo === 'Todos' ? MOCK_DOCS : MOCK_DOCS.filter((d) => d.tipo === tipo)
  const title = generateTitle('Documentación del Sistema', { Tipo: tipo })

  const columns = [
    { header: 'Nombre', accessor: (r: typeof MOCK_DOCS[0]) => r.nombre, width: 36 },
    { header: 'Tipo', accessor: (r: typeof MOCK_DOCS[0]) => r.tipo, width: 16 },
    { header: 'Versión', accessor: (r: typeof MOCK_DOCS[0]) => r.version, width: 10, align: 'center' as const },
    { header: 'Fecha', accessor: (r: typeof MOCK_DOCS[0]) => r.fecha, width: 14 },
    { header: 'Responsable', accessor: (r: typeof MOCK_DOCS[0]) => r.responsable, width: 18 },
  ]

  const handleExcel = () =>
    exportToExcel(
      `Documentacion_${tipo}.xlsx`,
      title,
      columns,
      filtered,
      [{ label: 'TOTAL DOCUMENTOS', values: [filtered.length, '', '', '', ''] }]
    )

  const handlePDF = () =>
    exportToPDF(
      title,
      'Espacio San Lorenzo — Documentación del sistema',
      columns,
      filtered,
      [{ label: 'TOTAL DOCUMENTOS', values: [filtered.length, '', '', '', ''] }]
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dash-text">Documentación del Sistema</h1>
          <p className="text-sm text-dash-muted">Manuales, instructivos y recursos de soporte.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-dash-muted uppercase">Tipo</span>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="rounded-md border border-dash-border bg-dash-panel px-3 py-1.5 text-sm text-dash-text">
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Button variant="secondary" size="sm" onClick={handlePDF} className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">
            <FileText className="h-4 w-4" /> PDF
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExcel} className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      <Card className="bg-dash-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dash-border text-left text-xs uppercase text-dash-muted">
                <th className="py-2 px-3">Nombre</th>
                <th className="py-2 px-3">Tipo</th>
                <th className="py-2 px-3 text-center">Versión</th>
                <th className="py-2 px-3">Fecha</th>
                <th className="py-2 px-3">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-dash-border/50">
                  <td className="py-2 px-3 text-dash-text">{r.nombre}</td>
                  <td className="py-2 px-3 text-dash-text">{r.tipo}</td>
                  <td className="py-2 px-3 text-center text-dash-text">{r.version}</td>
                  <td className="py-2 px-3 text-dash-text">{r.fecha}</td>
                  <td className="py-2 px-3 text-dash-text">{r.responsable}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-dash-border bg-dash-panel font-bold">
                <td className="py-2 px-3 text-dash-text">TOTAL DOCUMENTOS</td>
                <td colSpan={4} className="py-2 px-3 text-right text-dash-primary">{filtered.length}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}
