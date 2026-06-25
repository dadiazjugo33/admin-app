import { cn } from '../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-dash-border p-4 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}
