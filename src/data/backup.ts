import type { Entita } from './entita'

// Backup manuale: un file JSON con tutte le entità.
export function esporta(entita: Entita[]) {
  const dati = JSON.stringify({ app: 'sims-home', versione: 1, data: new Date().toISOString(), entita }, null, 1)
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([dati], { type: 'application/json' }))
  a.download = `casa-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export async function leggiBackup(file: File): Promise<Entita[]> {
  const j = JSON.parse(await file.text())
  if (j?.app !== 'sims-home' || !Array.isArray(j.entita)) throw new Error('File non valido')
  return j.entita.filter((e: Entita) => e && typeof e.id === 'string' && Array.isArray(e.storico))
}
