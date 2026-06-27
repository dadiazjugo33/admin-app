import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { exportToExcel, exportToPDF, generateTitle } from '../lib/export'
import { FileText, FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'

const YEARS = ['2024', '2025', '2026']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const MOCK_OPERARIOS = [
  { id: 1, nombre: 'García, Juan', legajo: 'OP-001', turno: 'Mañana', hsTrabajadas: 160, hsExtras: 12, produccion: 94 },
  { id: 2, nombre: 'López, María', legajo: 'OP-002', turno: 'Tarde', hsTrabajadas: 155, hsExtras: 8, produccion: 91 },
  { id: 3, nombre: 'Martínez, Carlos', legajo: 'OP-003', turno: 'Mañana', hsTrabajadas: 162, hsExtras: 15, produccion: 88 },
  { id: 4, nombre: 'Rodríguez, Ana', legajo: 'OP-004', turno: 'Noche', hsTrabajadas: 148, hsExtras: 20, produccion: 96 },
  { id: 5, nombre: 'Fernández, Pedro', legajo: 'OP-005', turno: 'Tarde', hsTrabajadas: 150, hsExtras: 5, produccion: 85 },
]

export function OperariosView() {
  const [year, setYear] = useState('2026')
  const [month, setMonth] = useState('Junio')

  const totalHs = MOCK_OPERARIOS.reduce((a, b) => a + b.hsTrabajadas, 0)
  const totalExtras = MOCK_OPERARIOS.reduce((a, b) => a + b.hsExtras, 0)
  const avgProd = MOCK_OPERARIOS.reduce((a, b) => a + b.produccion, 0) / MOCK_OPERARIOS.length
  const title = generateTitle('Operarios', { Año: year, Mes: month })

  const columns = [
    { header: 'Nombre', accessor: (r: typeof MOCK_OPERARIOS[0]) => r.nombre, width: 26 },
    { header: 'Legajo', accessor: (r: typeof MOCK_OPERARIOS[0]) => r.legajo, width: 12 },
    { header: 'Turno', accessor: (r: typeof MOCK_OPERARIOS[0]) => r.turno, width: 12 },
    { header: 'Hs. Trabajadas', accessor: (r: typeof MOCK_OPERARIOS[0]) => r.hsTrabajadas, width: 14, align: 'right' as const },
    { header: 'Hs. Extras', accessor: (r: typeof MOCK_OPERARIOS[0]) => r.hsExtras, width: 12, align: 'right' as const },
    { header: 'Prod. %', accessor: (r: typeof MOCK_OPERARIOS[0]) => `${r.produccion}%`, width: 12, align: 'right' as const },
  ]

  const handleExcel = () =>
    exportToExcel(
      `Operarios_${year}_${month}.xlsx`,
      title,
      columns,
      MOCK_OPERARIOS,
      [{ label: 'TOTAL / PROMEDIO', values: ['', '', '', totalHs, totalExtras, `${avgProd.toFixed(1)}%`] }]
    )

  const handlePDF = () =>
    exportToPDF(
      title,
      'Espacio San Lorenzo — Gestión de operarios',
      columns,
      MOCK_OPERARIOS,
      [{ label: 'TOTAL / PROMEDIO', values: ['', '', '', totalHs, totalExtras, `${avgProd.toFixed(1)}%`] }]
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dash-text">Operarios</h1>
          <p className="text-sm text-dash-muted">Gestión de personal, turnos y productividad.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-dash-muted uppercase">Año</span>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-md border border-dash-border bg-dash-panel px-3 py-1.5 text-sm text-dash-text">
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-dash-muted uppercase">Mes</span>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-md border border-dash-border bg-dash-panel px-3 py-1.5 text-sm text-dash-text">
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
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
                <th className="py-2 px-3">Legajo</th>
                <th className="py-2 px-3">Turno</th>
                <th className="py-2 px-3 text-right">Hs. Trabajadas</th>
                <th className="py-2 px-3 text-right">Hs. Extras</th>
                <th className="py-2 px-3 text-right">Prod. %</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_OPERARIOS.map((r) => (
                <tr key={r.id} className="border-b border-dash-border/50">
                  <td className="py-2 px-3 text-dash-text">{r.nombre}</td>
                  <td className="py-2 px-3 text-dash-text">{r.legajo}</td>
                  <td className="py-2 px-3 text-dash-text">{r.turno}</td>
                  <td className="py-2 px-3 text-right text-dash-text">{r.hsTrabajadas}</td>
                  <td className="py-2 px-3 text-right text-dash-text">{r.hsExtras}</td>
                  <td className="py-2 px-3 text-right text-dash-text">{r.produccion}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-dash-border bg-dash-panel font-bold">
                <td colSpan={3} className="py-2 px-3 text-dash-text">TOTAL / PROMEDIO</td>
                <td className="py-2 px-3 text-right text-dash-text">{totalHs}</td>
                <td className="py-2 px-3 text-right text-dash-text">{totalExtras}</td>
                <td className="py-2 px-3 text-right text-dash-primary">{avgProd.toFixed(1)}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}
