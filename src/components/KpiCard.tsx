import { Card } from './Card'

interface KpiCardProps {
  title: string
  value: string
  subtitle?: string
  variant?: 'default' | 'accent' | 'danger'
}

export function KpiCard({ title, value, subtitle, variant = 'default' }: KpiCardProps) {
  const variantClasses = {
    default: 'bg-dash-card',
    accent: 'bg-gradient-to-br from-dash-panel to-dash-card',
    danger: 'bg-red-900/20 border-red-500/30',
  }

  return (
    <Card className={variantClasses[variant]}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-dash-muted mb-2">
        {title}
      </h3>
      <div className="text-3xl font-bold text-dash-text mb-1">{value}</div>
      {subtitle && <p className="text-sm text-dash-muted">{subtitle}</p>}
    </Card>
  )
}
