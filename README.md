# Admin Dashboard — Espacio San Lorenzo

Dashboard operativo-administrativo con autenticación por contraseña maestra, control de permisos por usuario y configuración de cuentas contables.

## Variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

## Tablas necesarias en Supabase

### user_permissions

```sql
create table user_permissions (
  id uuid primary key default gen_random_uuid(),
  password text not null,
  alias text not null,
  can_access_dashboard boolean not null default false,
  allowed_tabs text[] not null default '{}',
  allowed_actions text[] not null default '{}',
  created_at timestamptz default now()
);
```

### accounting_config

```sql
create table accounting_config (
  id uuid primary key default gen_random_uuid(),
  income_accounts text[] not null default '{}',
  expense_accounts text[] not null default '{}',
  updated_at timestamptz default now()
);
```

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run preview` — preview local del build

## Despliegue

El proyecto está configurado para desplegarse en Vercel.
