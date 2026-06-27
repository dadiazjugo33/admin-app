import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { exportToExcel, exportToPDF, generateTitle } from '../lib/export'
import { FileText, FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'

const YEARS = ['2024', '2025', '2026']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const MOCK_SALIDAS = [
  { id: 1, fecha: '2026-06-01', producto: 'Repuestos A', cantidad: 12, destino: 'Taller Central', monto: 45000 },
  { id: 2, fecha: '2026-06-03', producto: 'Lubricantes', cantidad: 20, destino: 'Sucursal Norte', monto: 28000 },
  { id: 3, fecha: '2026-06-05', producto: 'Neumáticos', cantidad: 8, destino: 'Flota Propio', monto: 120000 },
  { id: 4, fecha: '2026-06-08', producto: 'Filtros', cantidad: 30, destino: 'Taller Central', monto: 15000 },
  { id: 5, fecha: '2026-06-10', producto: 'Baterías', cantidad: 6, destino: 'Sucursal Sur', monto: 96000 },
]

export function SalidasDepositoView() {
  const [year, setYear] = useState('2026')
  const [month, setMonth] = useState('Junio')

  const totalMonto = MOCK_SALIDAS.reduce((a, b) => a + b.monto, 0)
  const totalCantidad = MOCK_SALIDAS.reduce((a, b) => a + b.cantidad, 0)
  const title = generateTitle('Salidas de depósito', { Año: year, Mes: month })

  const columns = [
    { header: 'Fecha', accessor: (r: typeof MOCK_SALIDAS[0]) => r.fecha, width: 14 },
    { header: 'Producto', accessor: (r: typeof MOCK_SALIDAS[0]) => r.producto, width: 22 },
    { header: 'Cantidad', accessor: (r: typeof MOCK_SALIDAS[0]) => r.cantidad, width: 12, align: 'right' as const },
    { header: 'Destino', accessor: (r: typeof MOCK_SALIDAS[0]) => r.destino, width: 22 },
    { header: 'Monto', accessor: (r: typeof MOCK_SALIDAS[0]) => r.monto, width: 16, align: 'right' as const },
  ]

  const handleExcel = () =>
    exportToExcel(
      `Salidas_Deposito_${year}_${month}.xlsx`,
      title,
      columns,
      MOCK_SALIDAS,
      [{ label: 'TOTAL', values: ['', '', totalCantidad, '', totalMonto] }]
    )

  const handlePDF = () =>
    exportToPDF(
      title,
      'Espacio San Lorenzo — Control de salidas de depósito',
      columns,
      MOCK_SALIDAS,
      [{ label: 'TOTAL', values: ['', '', totalCantidad, '', totalMonto] }]
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dash-text">Salidas de depósito</h1>
          <p className="text-sm text-dash-muted">Registro y control de salidas de mercadería.</p>
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
                <th className="py-2 px-3">Fecha</th>
                <th className="py-2 px-3">Producto</th>
                <th className="py-2 px-3 text-right">Cantidad</th>
                <th className="py-2 px-3">Destino</th>
                <th className="py-2 px-3 text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SALIDAS.map((r) => (
                <tr key={r.id} className="border-b border-dash-border/50">
                  <td className="py-2 px-3 text-dash-text">{r.fecha}</td>
                  <td className="py-2 px-3 text-dash-text">{r.producto}</td>
                  <td className="py-2 px-3 text-right text-dash-text">{r.cantidad}</td>
                  <td className="py-2 px-3 text-dash-text">{r.destino}</td>
                  <td className="py-2 px-3 text-right text-dash-text">{r.monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-dash-border bg-dash-panel font-bold">
                <td colSpan={2} className="py-2 px-3 text-dash-text">TOTAL</td>
                <td className="py-2 px-3 text-right text-dash-text">{totalCantidad}</td>
                <td className="py-2 px-3"></td>
                <td className="py-2 px-3 text-right text-dash-primary">{totalMonto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}
