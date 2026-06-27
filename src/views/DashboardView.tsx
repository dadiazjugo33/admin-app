import { useAuth } from '../hooks/useAuth'
import { KpiCard } from '../components/KpiCard'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { formatCurrency, formatCompact } from '../lib/utils'
import { exportToExcel, exportToPDF, generateTitle } from '../lib/export'
import { Lightbulb, ChevronDown, ChevronUp, FileText, FileSpreadsheet } from 'lucide-react'

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const YEARS = ['2024', '2025', '2026']

const MOCK_DATA = [
  { month: 'Ene', current: 4500000, previous: 4100000, lastYear: 3900000 },
  { month: 'Feb', current: 5200000, previous: 4800000, lastYear: 4600000 },
  { month: 'Mar', current: 4900000, previous: 4700000, lastYear: 4300000 },
  { month: 'Abr', current: 6100000, previous: 5300000, lastYear: 5100000 },
  { month: 'May', current: 5800000, previous: 5500000, lastYear: 5000000 },
  { month: 'Jun', current: 6500000, previous: 5900000, lastYear: 5400000 },
]

export function DashboardView() {
  const { currentUser } = useAuth()
  const [year, setYear] = useState('2026')
  const [month, setMonth] = useState('Junio')
  const [showGuide, setShowGuide] = useState(false)
  const [compareLastYear, setCompareLastYear] = useState(false)

  const totalIncome = MOCK_DATA.reduce((a, b) => a + b.current, 0)
  const totalExpense = 18500000
  const margin = ((totalIncome - totalExpense) / totalIncome) * 100

  const periodTitle = generateTitle('Dashboard Ventas & KPIs', {
    Año: year,
    Mes: month,
  })

  const handleExportExcel = () => {
    exportToExcel(
      `Ventas_KPIs_${year}_${month}.xlsx`,
      periodTitle,
      [
        { header: 'Mes', accessor: (r) => r.month, width: 12 },
        { header: 'Facturación', accessor: (r) => r.current, width: 18, align: 'right' },
        { header: 'Mes anterior', accessor: (r) => r.previous, width: 18, align: 'right' },
        { header: 'Año anterior', accessor: (r) => r.lastYear, width: 18, align: 'right' },
      ],
      MOCK_DATA,
      [
        { label: 'TOTAL', values: ['', totalIncome, MOCK_DATA.reduce((a, b) => a + b.previous, 0), MOCK_DATA.reduce((a, b) => a + b.lastYear, 0)] },
      ]
    )
  }

  const handleExportPDF = () => {
    exportToPDF(
      periodTitle,
      'Espacio San Lorenzo — Foco de control y operaciones',
      [
        { header: 'Mes', accessor: (r) => r.month, width: 12 },
        { header: 'Facturación', accessor: (r) => r.current, width: 18, align: 'right' },
        { header: 'Mes anterior', accessor: (r) => r.previous, width: 18, align: 'right' },
        { header: 'Año anterior', accessor: (r) => r.lastYear, width: 18, align: 'right' },
      ],
      MOCK_DATA,
      [
        { label: 'TOTAL', values: ['', totalIncome, MOCK_DATA.reduce((a, b) => a + b.previous, 0), MOCK_DATA.reduce((a, b) => a + b.lastYear, 0)] },
      ]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-dash-text">Dashboard Ventas & KPIs</h1>
          <p className="text-sm text-dash-muted">Bienvenido, {currentUser?.alias}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-dash-muted uppercase">Año</span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-md border border-dash-border bg-dash-panel px-3 py-1.5 text-sm text-dash-text"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-dash-muted uppercase">Mes</span>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-md border border-dash-border bg-dash-panel px-3 py-1.5 text-sm text-dash-text"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <Button variant="secondary" size="sm">Todo el período</Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportPDF}
            className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
          >
            <FileText className="h-4 w-4" /> PDF
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportExcel}
            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
          >
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      {/* Control focus */}
      <Card className="bg-dash-panel">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-dash-primary font-semibold">
            <Lightbulb className="h-4 w-4" />
            <span>FOCO DE CONTROL Y OPERACIONES</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
          >
            {showGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showGuide ? 'Ocultar Guía' : 'Mostrar Guía'}
          </Button>
        </div>
        {showGuide && (
          <div className="mt-3 text-sm text-dash-muted">
            Guía rápida: usá los filtros de Año/Mes para segmentar la información.
            El botón de comparación activa/desactiva la visualización contra el año anterior.
          </div>
        )}
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="FACTURACIÓN TOTAL"
          value={formatCurrency(totalIncome)}
          subtitle="período seleccionado"
        />
        <KpiCard
          title="EGRESOS TOTAL"
          value={formatCurrency(totalExpense)}
          subtitle="período seleccionado"
          variant="danger"
        />
        <KpiCard
          title="BALANCE & RENTABILIDAD"
          value={formatCurrency(totalIncome - totalExpense)}
          subtitle={`MARGEN: ${margin.toFixed(1)}%`}
          variant="accent"
        />
      </div>

      {/* Chart */}
      <Card className="bg-dash-panel">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-dash-muted">
            Distribución de ingresos (facturación)
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCompareLastYear(!compareLastYear)}
          >
            {compareLastYear ? 'Ocultar comparación' : 'Comparar con año anterior'}
          </Button>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3b42" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis
                stroke="#94a3b8"
                tickFormatter={(v) => formatCompact(v)}
              />
              <Tooltip
                contentStyle={{
                  background: '#162025',
                  border: '1px solid #2a3b42',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
                itemStyle={{ color: '#e2e8f0' }}
                formatter={(value) =>
                  value != null ? formatCurrency(Number(value)) : ''
                }
              />
              <Bar dataKey="current" name="Actual" radius={[4, 4, 0, 0]}>
                {MOCK_DATA.map((_, i) => (
                  <Cell key={`cell-${i}`} fill="#2dd4bf" />
                ))}
              </Bar>
              {compareLastYear && (
                <Bar dataKey="lastYear" name="Año anterior" fill="#64748b" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
