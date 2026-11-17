import { useCasa } from '../data/casa'
import { objects, type ObjId } from '../data/objects'
import { giorniA } from '../data/tempo'
import type { Prodotto } from '../data/entita'

// Comandi vocali della cucina, con regole semplici (niente servizi esterni).
// "manca / è finito X", "X sta finendo", "aggiungi X alla lista", "manca X, aggiungilo alla lista", "ho comprato X".

type Esito = { capito: boolean; messaggio: string; oggetto?: ObjId }
type Trovato = { e: ObjId; p: Prodotto }

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9, ']/g, ' ').replace(/\s+/g, ' ').trim()
const radice = (w: string) => (w.length > 3 ? w.replace(/[aeiou]$/, '') : w)
const parole = (s: string) => norm(s).split(/[ ']/).filter(Boolean).map(radice)
const articoli = /^(il|lo|la|l|i|gli|le|un|uno|una|del|dello|della|dei|degli|delle|di|anche|po|un po di)\s+/

// Divide "il latte e le uova, il burro" in voci pulite.
function voci(s: string) {
  return s
    .replace(/,?\s*(aggiungil\w*|mettil\w*|segnal\w*)?\s*(alla|nella|in|sulla)\s+lista( della spesa)?/g, '')
    .split(/,| e | ed /)
    .map((v) => { let x = v.trim(); while (articoli.test(x)) x = x.replace(articoli, ''); return x.replace(/'/g, ' ').trim() })
    .filter(Boolean)
}

// Cerca il prodotto: tutte le parole del nome devono esserci; vince il nome più lungo.
function cerca(voce: string, conLista = false): Trovato | null {
  const ent = useCasa.getState().entita
  const ordine: ObjId[] = voce.includes('lavastoviglie') ? ['lavastoviglie', 'frigo', 'dispensa'] : ['frigo', 'dispensa', 'lavastoviglie']
  if (conLista) ordine.unshift('lista')
  const w = new Set(parole(voce))
  let meglio: (Trovato & { n: number }) | null = null
  for (const e of ordine)
    for (const p of ent[e]?.inventario ?? []) {
      const nome = parole(p.nome)
      if (nome.every((x) => w.has(x)) && (!meglio || nome.length > meglio.n)) meglio = { e, p, n: nome.length }
    }
  return meglio
}

// Cerca l'attività che somiglia di più a ciò che è stato detto (nome dell'attività + nome dell'oggetto).
function cercaAttivita(frase: string) {
  const w = parole(frase).filter((x) => x.length > 2)
  let meglio: { e: ObjId; id: string; nome: string; punti: number } | null = null
  for (const ent of Object.values(useCasa.getState().entita))
    for (const a of ent.attivita ?? []) {
      const nomi = new Set([...parole(a.nome), ...parole(objects[ent.id]?.nome ?? '')])
      const punti = w.filter((x) => nomi.has(x)).length * 2 + (giorniA(a.prossima) <= 0 ? 1 : 0)
      if (punti >= 2 && (!meglio || punti > meglio.punti)) meglio = { e: ent.id, id: a.id, nome: a.nome, punti }
    }
  return meglio
}

const maiuscola = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function eseguiComando(testo: string): Esito {
  const t = norm(testo)
  const c = useCasa.getState()
  const prima = c.entita
  const msg: string[] = []
  let oggetto: ObjId | undefined

  const allaLista = (v: string) => {
    const f = cerca(v)
    if (f) {
      if (!f.p.inLista) c.lista(f.e, f.p.id)
      msg.push(`${f.p.nome} → lista`)
    } else {
      c.aggiungiVoce(maiuscola(v))
      msg.push(`${maiuscola(v)} → lista`)
    }
    oggetto = 'lista'
  }
  const livello = (v: string, l: 'finito' | 'quasi', ancheLista: boolean) => {
    const f = cerca(v)
    if (!f) return allaLista(v) // non è in casa: va in lista
    c.livello(f.e, f.p.id, l)
    if (ancheLista && !f.p.inLista) c.lista(f.e, f.p.id)
    msg.push(`${f.p.nome} → ${l === 'finito' ? 'finito' : 'quasi finito'}${ancheLista ? ', in lista' : ''}`)
    oggetto = ancheLista ? 'lista' : f.e
  }
  const comprato = (v: string) => {
    const f = cerca(v, true)
    if (!f) return msg.push(`${maiuscola(v)}: non lo trovo`)
    c.comprato(f.e, f.p.id)
    msg.push(`Comprato: ${f.p.nome}`)
    oggetto = 'lista'
  }

  let m: RegExpMatchArray | null
  c.gruppo(() => {
    if ((m = t.match(/(?:ho|abbiamo) (?:comprato|preso) (.+)/))) voci(m[1]).forEach(comprato)
    else if ((m = t.match(/^(?:ho|abbiamo) (?:gia )?(?:fatto|pulito|lavato|cambiato|sistemato|svuotato|controllato|pagato|sostituito|steso|portato|buttato|tagliato|messo|annaffiato|innaffiato) (.+)/))) {
      const a = cercaAttivita(m[1])
      if (a) {
        c.fatto(a.e, a.id)
        msg.push(`Fatto: ${a.nome}`)
        oggetto = a.e
      } else msg.push('Non trovo questa attività. Puoi crearla con “+ Attività” sull’oggetto.')
    }
    else if ((m = t.match(/^(?:aggiungi|metti|segna)\w* (?:alla|nella|in) lista(?: della spesa)? (.+)/)) || (m = t.match(/^(?:aggiungi|metti|segna)\w* (.+)/)))
      voci(m[1]).forEach(allaLista)
    else if ((m = t.match(/(?:sta|stanno) finendo (.+)/)) || (m = t.match(/(.+?) (?:sta|stanno) finendo/)) || (m = t.match(/(.+?) (?:e|sono) quasi finit\w/)))
      voci(m[1]).forEach((v) => livello(v, 'quasi', t.includes('lista')))
    else if ((m = t.match(/(?:manca|mancano|e finit\w|sono finit\w|abbiamo finito|ho finito|finit\w) (.+)/)) || (m = t.match(/(.+?) (?:e|sono) finit\w/)) || (m = t.match(/(.+?) (?:manca|mancano)/)))
      voci(m[1]).forEach((v) => livello(v, 'finito', t.includes('lista')))
  })
  if (!msg.length) return { capito: false, messaggio: `“${testo}”: non ho capito. Prova con “manca il latte” o “ho comprato le uova”.` }
  return { capito: useCasa.getState().entita !== prima, messaggio: msg.join(' · '), oggetto }
}
;(window as unknown as { __voce: typeof eseguiComando }).__voce = eseguiComando // per i test automatici
