interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-dash-border bg-dash-panel text-dash-primary focus:ring-dash-primary"
      />
      <span className="text-sm text-dash-text">{label}</span>
    </label>
  )
}

interface MultiSelectProps {
  label?: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-dash-text">{label}</label>}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => onChange([...options])}
          className="text-xs text-dash-primary hover:underline"
        >
          Todas
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-xs text-dash-primary hover:underline"
        >
          Ninguna
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {options.map((option) => (
          <Checkbox
            key={option}
            label={option}
            checked={selected.includes(option)}
            onChange={() => toggle(option)}
          />
        ))}
      </div>
    </div>
  )
}
