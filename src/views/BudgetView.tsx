import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { exportToExcel, exportToPDF, generateTitle } from '../lib/export'
import { FileText, FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'

const YEARS = ['2024', '2025', '2026']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const MOCK_BUDGET = [
  { id: 1, concepto: 'Mantenimiento', presentado: 120000, realizado: 115000, diferencia: 5000 },
  { id: 2, concepto: 'Servicios públicos', presentado: 85000, realizado: 92000, diferencia: -7000 },
  { id: 3, concepto: 'Personal operativo', presentado: 300000, realizado: 295000, diferencia: 5000 },
  { id: 4, concepto: 'Materiales', presentado: 150000, realizado: 165000, diferencia: -15000 },
  { id: 5, concepto: 'Marketing', presentado: 45000, realizado: 42000, diferencia: 3000 },
]

export function BudgetView() {
  const [year, setYear] = useState('2026')
  const [month, setMonth] = useState('Junio')

  const totalPresentado = MOCK_BUDGET.reduce((a, b) => a + b.presentado, 0)
  const totalRealizado = MOCK_BUDGET.reduce((a, b) => a + b.realizado, 0)
  const totalDiferencia = MOCK_BUDGET.reduce((a, b) => a + b.diferencia, 0)
  const title = generateTitle('Budget', { Año: year, Mes: month })

  const columns = [
    { header: 'Concepto', accessor: (r: typeof MOCK_BUDGET[0]) => r.concepto, width: 28 },
    { header: 'Presentado', accessor: (r: typeof MOCK_BUDGET[0]) => r.presentado, width: 16, align: 'right' as const },
    { header: 'Realizado', accessor: (r: typeof MOCK_BUDGET[0]) => r.realizado, width: 16, align: 'right' as const },
    { header: 'Diferencia', accessor: (r: typeof MOCK_BUDGET[0]) => r.diferencia, width: 16, align: 'right' as const },
  ]

  const handleExcel = () =>
    exportToExcel(
      `Budget_${year}_${month}.xlsx`,
      title,
      columns,
      MOCK_BUDGET,
      [{ label: 'TOTAL', values: ['', totalPresentado, totalRealizado, totalDiferencia] }]
    )

  const handlePDF = () =>
    exportToPDF(
      title,
      'Espacio San Lorenzo — Comparativo de budget',
      columns,
      MOCK_BUDGET,
      [{ label: 'TOTAL', values: ['', totalPresentado, totalRealizado, totalDiferencia] }]
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dash-text">Budget</h1>
          <p className="text-sm text-dash-muted">Comparativo de budget presentado, realizado y diferencias.</p>
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
                <th className="py-2 px-3">Concepto</th>
                <th className="py-2 px-3 text-right">Presentado</th>
                <th className="py-2 px-3 text-right">Realizado</th>
                <th className="py-2 px-3 text-right">Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_BUDGET.map((r) => (
                <tr key={r.id} className="border-b border-dash-border/50">
                  <td className="py-2 px-3 text-dash-text">{r.concepto}</td>
                  <td className="py-2 px-3 text-right text-dash-text">{r.presentado.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
                  <td className="py-2 px-3 text-right text-dash-text">{r.realizado.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
                  <td className={`py-2 px-3 text-right font-medium ${r.diferencia >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {r.diferencia.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-dash-border bg-dash-panel font-bold">
                <td className="py-2 px-3 text-dash-text">TOTAL</td>
                <td className="py-2 px-3 text-right text-dash-text">{totalPresentado.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
                <td className="py-2 px-3 text-right text-dash-text">{totalRealizado.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
                <td className={`py-2 px-3 text-right ${totalDiferencia >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalDiferencia.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}
