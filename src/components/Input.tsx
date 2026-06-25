import { cn } from '../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-dash-muted mb-1">{label}</label>
      )}
      <input
        className={cn(
          'w-full rounded-md border border-dash-border bg-dash-panel px-3 py-2 text-sm text-dash-text placeholder:text-dash-muted focus:border-dash-primary focus:outline-none focus:ring-1 focus:ring-dash-primary',
          className
        )}
        {...props}
      />
    </div>
  )
}
