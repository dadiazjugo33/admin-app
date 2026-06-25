import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Input } from './Input'
import { Button } from './Button'
import { Lock } from 'lucide-react'

export function LoginView() {
  const { login } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = login(password)
    if (!ok) {
      setError('Contraseña incorrecta')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dash-bg p-4">
      <div className="w-full max-w-md rounded-xl border border-dash-border bg-dash-panel p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-dash-primary/10 p-4">
            <Lock className="h-8 w-8 text-dash-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-dash-text mb-2">
          Administración
        </h1>
        <p className="text-center text-dash-muted mb-6">
          Ingresá la contraseña maestra para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            placeholder="••••"
          />
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <Button type="submit" className="w-full">Ingresar</Button>
        </form>
      </div>
    </div>
  )
}
