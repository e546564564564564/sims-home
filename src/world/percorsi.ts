// Percorsi degli abitanti: punti di passaggio (centri stanza e porte, coordinate di pianta) e collegamenti.
// Se cambia la pianta in house.ts, vanno aggiornati qui.
type P = [number, number]

export const nodi: Record<string, P> = {
  divano: [2.1, 1.9], sala: [3.6, 2.4], cucina: [6.9, 3.4], ingresso: [4.5, -0.2], portico: [4.5, -1.4],
  portaCorr: [3.95, 3.9], corr1: [3.9, 4.8], corr2: [6.0, 5.1],
  portaCamera: [3.0, 5.15], camera: [1.6, 5.2], portaBagno: [4.0, 5.8], bagno: [4.0, 7.2],
  portaStudio: [6.3, 5.8], studio: [6.9, 6.3], portaRip: [9.0, 5.15], rip: [9.7, 6.2],
  uscitaCamera: [1.25, 9.1], uscitaStudio: [6.5, 9.1], uscitaRip: [9.8, 8.1], giardino: [5.0, 10.4],
}

const archi: [string, string][] = [
  ['divano', 'sala'], ['sala', 'cucina'], ['sala', 'ingresso'], ['ingresso', 'portico'], ['sala', 'portaCorr'],
  ['portaCorr', 'corr1'], ['corr1', 'portaCamera'], ['portaCamera', 'camera'], ['corr1', 'portaBagno'], ['portaBagno', 'bagno'],
  ['corr1', 'corr2'], ['corr2', 'portaStudio'], ['portaStudio', 'studio'], ['corr2', 'portaRip'], ['portaRip', 'rip'],
  ['camera', 'uscitaCamera'], ['uscitaCamera', 'giardino'], ['studio', 'uscitaStudio'], ['uscitaStudio', 'giardino'],
  ['rip', 'uscitaRip'], ['uscitaRip', 'giardino'],
]

const vicini: Record<string, string[]> = {}
for (const [a, b] of archi) {
  ;(vicini[a] ??= []).push(b)
  ;(vicini[b] ??= []).push(a)
}

const dist = (a: P, b: P) => Math.hypot(a[0] - b[0], a[1] - b[1])
const piuVicino = (p: P) => Object.keys(nodi).reduce((m, k) => (dist(nodi[k], p) < dist(nodi[m], p) ? k : m))

// Percorso più breve (Dijkstra su pochi nodi) dal punto "da" al punto "a".
export function percorso(da: P, a: P): P[] {
  const s = piuVicino(da), t = piuVicino(a)
  const d: Record<string, number> = { [s]: 0 }
  const prima: Record<string, string> = {}
  const aperti = new Set([s])
  while (aperti.size) {
    const u = [...aperti].reduce((m, k) => (d[k] < d[m] ? k : m))
    aperti.delete(u)
    if (u === t) break
    for (const v of vicini[u] ?? []) {
      const nd = d[u] + dist(nodi[u], nodi[v])
      if (d[v] === undefined || nd < d[v]) { d[v] = nd; prima[v] = u; aperti.add(v) }
    }
  }
  const strada: P[] = []
  for (let k: string | undefined = t; k; k = prima[k]) strada.unshift(nodi[k])
  return [...strada, a]
}
