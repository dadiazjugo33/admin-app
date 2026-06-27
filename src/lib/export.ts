export interface ExportColumn<T> {
  header: string
  accessor: (row: T) => string | number
  width?: number
  align?: 'left' | 'right' | 'center'
}

export function generateTitle(baseTitle: string, filters: Record<string, string>): string {
  const parts = Object.entries(filters)
    .filter(([, v]) => v && v !== 'Todos' && v !== 'Todo el período')
    .map(([k, v]) => `${k}: ${v}`)
  return parts.length > 0 ? `${baseTitle} — ${parts.join(' | ')}` : baseTitle
}

export async function exportToExcel<T>(
  filename: string,
  title: string,
  columns: ExportColumn<T>[],
  rows: T[],
  totals?: { label: string; values: (string | number)[] }[]
) {
  const XLSX = await import('xlsx')

  const data: (string | number)[][] = [
    [title],
    [],
    columns.map((c) => c.header),
    ...rows.map((row) =>
      columns.map((col) => {
        const value = col.accessor(row)
        return typeof value === 'number' ? value : String(value)
      })
    ),
  ]

  if (totals && totals.length > 0) {
    data.push([])
    for (const total of totals) {
      const row: (string | number)[] = [total.label]
      for (let i = 1; i < columns.length; i++) {
        row.push(total.values[i - 1] ?? '')
      }
      data.push(row)
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(data)
  ws['!cols'] = columns.map((c) => ({ wch: c.width || 18 }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Datos')
  XLSX.writeFile(wb, filename)
}

export function exportToPDF<T>(
  title: string,
  subtitle: string,
  columns: ExportColumn<T>[],
  rows: T[],
  totals?: { label: string; values: (string | number)[] }[]
) {
  const fmt = (n: number) =>
    n.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    })

  const headerCells = columns
    .map((c) => `    <th class="${c.align || 'left'}">${c.header}</th>`)
    .join('\n')

  const bodyRows = rows
    .map((row) => {
      const cells = columns
        .map((col) => {
          const raw = col.accessor(row)
          const value =
            typeof raw === 'number'
              ? fmt(raw)
              : String(raw)
          return `      <td class="${col.align || 'left'}">${value}</td>`
        })
        .join('\n')
      return `  <tr>\n${cells}\n  </tr>`
    })
    .join('\n')

  let totalRows = ''
  if (totals && totals.length > 0) {
    totalRows = totals
      .map((total) => {
        const cells = total.values
          .map((v, i) => {
            const value =
              typeof v === 'number'
                ? fmt(v)
                : String(v)
            const colAlign = columns[i + 1]?.align || 'left'
            return `      <td class="${colAlign}">${value}</td>`
          })
          .join('\n')
        return `  <tr class="total-row">\n      <td>${total.label}</td>\n${cells}\n  </tr>`
      })
      .join('\n')
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page { size: A4 landscape; margin: 14mm 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9pt; color: #1a1a2e; background: white; }
    .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #2dd4bf; padding-bottom: 10px; margin-bottom: 16px; }
    .header-logo { font-size: 20pt; font-weight: 900; color: #2dd4bf; letter-spacing: -1px; }
    .header-logo span { color: #1a1a2e; }
    .header-right { text-align: right; }
    .header-right .title { font-size: 12pt; font-weight: 800; color: #1a1a2e; }
    .header-right .sub { font-size: 8pt; color: #6b7280; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-top: 12px; }
    thead tr { background: #2dd4bf; color: white; }
    thead th { padding: 6px 8px; text-align: left; font-weight: 800; font-size: 7.5pt; text-transform: uppercase; letter-spacing: .05em; }
    thead th.right, td.right { text-align: right; }
    thead th.center, td.center { text-align: center; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    tbody td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; }
    tbody td.total-cell { font-weight: 800; color: #2dd4bf; }
    tfoot tr.total-row { background: #0f1419; color: white; }
    tfoot td { padding: 7px 8px; font-weight: 900; font-size: 9pt; }
    tfoot td.right { text-align: right; }
    .footer { margin-top: 14px; border-top: 1px solid #e5e7eb; padding-top: 6px; display: flex; justify-content: space-between; font-size: 7pt; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-logo">Admin <span>Dashboard</span></div>
    <div class="header-right">
      <div class="title">${title}</div>
      <div class="sub">${subtitle}</div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
${headerCells}
      </tr>
    </thead>
    <tbody>
${bodyRows}
    </tbody>
    ${totalRows ? `<tfoot>\n${totalRows}\n</tfoot>` : ''}
  </table>
  <div class="footer">
    <span>Espacio San Lorenzo</span>
    <span>Generado el ${new Date().toLocaleString('es-AR')}</span>
  </div>
  <script>window.onload = () => { setTimeout(() => window.print(), 300); };</script>
</body>
</html>`

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Permití las ventanas emergentes para exportar PDF.')
    return
  }
  printWindow.document.write(html)
  printWindow.document.close()
}
