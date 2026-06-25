import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Checkbox, MultiSelect } from '../components/Form'
import type { UserPermission, AccountingConfig, TabId } from '../types'
import { TABS, ACTIONS } from '../types'
import {
  fetchUsers,
  upsertUser,
  deleteUser,
  fetchAccountingConfig,
  upsertAccountingConfig,
} from '../lib/supabase'
import { accountsToString, parseAccounts } from '../lib/utils'
import { Key, Save, Trash2, Settings, BookOpen, UserCog } from 'lucide-react'

const TAB_OPTIONS = TABS.map((t) => t.label)
const TAB_ID_BY_LABEL: Record<string, TabId> = Object.fromEntries(
  TABS.map((t) => [t.label, t.id])
)

const emptyUser: UserPermission = {
  id: '',
  password: '',
  alias: '',
  can_access_dashboard: false,
  allowed_tabs: [],
  allowed_actions: [],
}

export function ConfiguracionView() {
  const [users, setUsers] = useState<UserPermission[]>([])
  const [editing, setEditing] = useState<UserPermission | null>(null)
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState<AccountingConfig>({
    income_accounts: [],
    expense_accounts: [],
  })
  const [incomeText, setIncomeText] = useState('')
  const [expenseText, setExpenseText] = useState('')
  const [activeTab, setActiveTab] = useState<'passwords' | 'accounts'>('passwords')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersData, configData] = await Promise.all([
        fetchUsers(),
        fetchAccountingConfig(),
      ])
      setUsers(usersData)
      if (configData) {
        setConfig(configData)
        setIncomeText(accountsToString(configData.income_accounts))
        setExpenseText(accountsToString(configData.expense_accounts))
      }
    } catch (err) {
      alert('Error cargando configuración. Verificá credenciales de Supabase.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveUser = async () => {
    if (!editing) return
    if (!editing.password || !editing.alias) {
      alert('La contraseña y el rol/alias son obligatorios.')
      return
    }
    try {
      const userToSave = {
        ...editing,
        id: editing.id || crypto.randomUUID(),
      }
      await upsertUser(userToSave)
      setEditing(null)
      await loadData()
    } catch (err) {
      alert('Error guardando usuario.')
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este usuario?')) return
    try {
      await deleteUser(id)
      await loadData()
    } catch (err) {
      alert('Error eliminando usuario.')
      console.error(err)
    }
  }

  const handleSaveAccounts = async () => {
    try {
      const updated: AccountingConfig = {
        ...config,
        id: config.id || crypto.randomUUID(),
        income_accounts: parseAccounts(incomeText),
        expense_accounts: parseAccounts(expenseText),
        updated_at: new Date().toISOString(),
      }
      await upsertAccountingConfig(updated)
      await loadData()
      alert('Configuración de cuentas guardada.')
    } catch (err) {
      alert('Error guardando cuentas contables.')
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-dash-text">Configuración</h1>
        <p className="text-sm text-dash-muted">Panel de configuración y control del sistema.</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={activeTab === 'passwords' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('passwords')}
        >
          <Key className="h-4 w-4" /> Contraseñas y Permisos
        </Button>
        <Button
          variant={activeTab === 'accounts' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('accounts')}
        >
          <BookOpen className="h-4 w-4" /> Cuentas Contables
        </Button>
      </div>

      {activeTab === 'passwords' && (
        <div className="space-y-6">
          <Card className="bg-dash-panel">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-dash-primary font-semibold">
                <UserCog className="h-4 w-4" />
                <span>CONTROL DE CONTRASEÑAS Y PERMISOS DE ACCESO</span>
              </div>
              <Button
                size="sm"
                onClick={() => setEditing({ ...emptyUser })}
              >
                + Agregar Contraseña
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dash-border text-left text-xs uppercase text-dash-muted">
                    <th className="py-2 px-3">Contraseña</th>
                    <th className="py-2 px-3">Rol / Alias</th>
                    <th className="py-2 px-3">Acceso Dash</th>
                    <th className="py-2 px-3">Solapas permitidas</th>
                    <th className="py-2 px-3">Botones permitidos</th>
                    <th className="py-2 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-dash-border/50">
                      <td className="py-2 px-3 font-mono text-dash-text">{u.password}</td>
                      <td className="py-2 px-3 text-dash-text">{u.alias}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            u.can_access_dashboard
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {u.can_access_dashboard ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-dash-muted">{u.allowed_tabs.join(', ') || 'Ninguna'}</td>
                      <td className="py-2 px-3 text-dash-muted">{u.allowed_actions.join(', ') || 'Ninguno'}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setEditing(u)}
                          >
                            Configurar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(u.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {editing && (
            <Card className="bg-dash-panel border-dash-primary/30">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-dash-primary mb-4">
                Configurar Contraseña y Permisos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Contraseña(s) de Acceso (separadas por comas para varias)"
                  value={editing.password}
                  onChange={(e) =>
                    setEditing({ ...editing, password: e.target.value })
                  }
                />
                <Input
                  label="Rol / Alias"
                  value={editing.alias}
                  onChange={(e) =>
                    setEditing({ ...editing, alias: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <Checkbox
                  label="¿Tiene acceso al Dashboard de Ventas & KPIs?"
                  checked={editing.can_access_dashboard}
                  onChange={(checked) =>
                    setEditing({ ...editing, can_access_dashboard: checked })
                  }
                />
              </div>

              <div className="mb-4">
                <MultiSelect
                  label="Solapas Permitidas (Multiselección):"
                  options={TAB_OPTIONS}
                  selected={editing.allowed_tabs.map(
                    (id) => TABS.find((t) => t.id === id)?.label || id
                  )}
                  onChange={(selected) =>
                    setEditing({
                      ...editing,
                      allowed_tabs: selected.map((s) => TAB_ID_BY_LABEL[s] || s),
                    })
                  }
                />
              </div>

              <div className="mb-4">
                <MultiSelect
                  label="Acciones / Botones Autorizados (Multiselección):"
                  options={ACTIONS}
                  selected={editing.allowed_actions}
                  onChange={(selected) =>
                    setEditing({ ...editing, allowed_actions: selected })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveUser}>
                  <Save className="h-4 w-4" /> Guardar Configuración
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'accounts' && (
        <Card className="bg-dash-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-dash-primary font-semibold">
              <Settings className="h-4 w-4" />
              <span>CONFIGURACIÓN DE CUENTAS CONTABLES (SUMA Y SALDOS)</span>
            </div>
            <span className="text-xs text-dash-muted">TABLA: ADM_VIST_BBSS_UNIFICADOS</span>
          </div>

          <p className="text-sm text-dash-muted mb-4">
            Ingresá los códigos de cuenta contable (separados por comas) para filtrar
            dinámicamente los Ingresos y Egresos en el Dashboard Principal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-dash-text mb-1">
                Cuentas de Ingresos (Facturación):
              </label>
              <textarea
                value={incomeText}
                onChange={(e) => setIncomeText(e.target.value)}
                placeholder="Ej: 4.15.01.09, 4.15.01.10, 4.16.01.04"
                rows={4}
                className="w-full rounded-md border border-dash-border bg-dash-panel px-3 py-2 text-sm text-dash-text placeholder:text-dash-muted focus:border-dash-primary focus:outline-none focus:ring-1 focus:ring-dash-primary"
              />
              <p className="text-xs text-dash-muted mt-1">Ej: 4.15.01.09, 4.15.01.10, 4.16.01.04</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dash-text mb-1">
                Cuentas de Egresos (Gastos / Costos):
              </label>
              <textarea
                value={expenseText}
                onChange={(e) => setExpenseText(e.target.value)}
                placeholder="Ej: 5.15.01.12, 5.15.01.13"
                rows={4}
                className="w-full rounded-md border border-dash-border bg-dash-panel px-3 py-2 text-sm text-dash-text placeholder:text-dash-muted focus:border-dash-primary focus:outline-none focus:ring-1 focus:ring-dash-primary"
              />
              <p className="text-xs text-dash-muted mt-1">Ej: 5.15.01.12, 5.15.01.13</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveAccounts}>
              <Save className="h-4 w-4" /> Guardar Ajustes Generales
            </Button>
          </div>
        </Card>
      )}

      {loading && (
        <div className="text-sm text-dash-muted">Cargando...</div>
      )}
    </div>
  )
}
