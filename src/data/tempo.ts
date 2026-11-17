// Date come testo AAAA-MM-GG (ora locale): semplici da salvare e confrontare.
export type Ogni = { n: number; u: 'g' | 's' | 'm' } // giorni, settimane, mesi

export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const oggi = () => iso(new Date())
const data = (s: string) => new Date(s + 'T00:00')

export function aggiungi(s: string, o: Ogni): string {
  const d = data(s)
  if (o.u === 'm') d.setMonth(d.getMonth() + o.n)
  else d.setDate(d.getDate() + o.n * (o.u === 's' ? 7 : 1))
  return iso(d)
}

// giorni da oggi alla data (negativo = passata)
export const giorniA = (s: string) => Math.round((data(s).getTime() - data(oggi()).getTime()) / 864e5)

export const testoOgni = (o: Ogni) =>
  o.n === 1 ? { g: 'ogni giorno', s: 'ogni settimana', m: 'ogni mese' }[o.u] : `ogni ${o.n} ${{ g: 'giorni', s: 'settimane', m: 'mesi' }[o.u]}`

// Testo gentile per una scadenza: niente conteggi di ritardo.
export function quando(s: string) {
  const g = giorniA(s)
  return g < 0 ? 'da fare' : g === 0 ? 'oggi' : g === 1 ? 'domani' : g <= 14 ? `fra ${g} giorni` : `il ${s.split('-').reverse().slice(0, 2).join('/')}`
}
