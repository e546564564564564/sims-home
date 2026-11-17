// house.ts — bozza della pianta ricavata dalla planimetria, SENZA misure reali.
// Scala stimata: porta interna = 80 cm. Tutte le misure in metri.
// Quando arriveranno le misure vere basta correggere SCALE o i singoli valori.
// Origine: angolo interno sala tra parete TV e parete d'ingresso (portico).
// Asse x: da parete TV verso la scala. Asse y: da portico verso giardino.

export const SCALE = 1;
export const WALL = 0.15;
export const CEILING = 2.7;

type Rect = { x: number; y: number; w: number; d: number };

export const rooms: Record<string, Rect[]> = {
  sala: [{ x: 0, y: 0, w: 6.4, d: 3.8 }],
  cucina: [
    { x: 4.6, y: 3.8, w: 3.3, d: 0.7 }, // fascia oltre la parete del corridoio
    { x: 6.4, y: 2.8, w: 1.5, d: 1.0 }, // braccio della L lungo la scala
  ],
  corridoio: [
    { x: 3.2, y: 4.0, w: 1.4, d: 1.6 },
    { x: 4.6, y: 4.5, w: 4.2, d: 1.1 },
  ],
  camera: [{ x: 0, y: 4.0, w: 3.1, d: 4.8 }],
  bagno: [{ x: 3.2, y: 5.7, w: 1.9, d: 3.1 }],
  studio: [
    { x: 5.2, y: 5.7, w: 3.6, d: 2.2 },
    { x: 5.2, y: 7.9, w: 2.9, d: 0.9 },
  ],
  ripostiglio: [{ x: 8.85, y: 4.7, w: 1.9, d: 3.1 }],
  portico: [{ x: -0.2, y: -3.0, w: 6.5, d: 3.0 }],
  giardino: [
    { x: 0, y: 8.8, w: 10.8, d: 3.5 },
    { x: 8.1, y: 7.8, w: 2.7, d: 1.0 }, // dietro ripostiglio e rientro studio
  ],
};

type Opening = { kind: 'porta' | 'ingresso' | 'finestra' | 'portafinestra'; wallAxis: 'x' | 'y'; pos: number; at: number; len: number; between: [string, string] };

// wallAxis 'x' = muro parallelo all'asse x alla quota y=pos; 'y' = muro parallelo all'asse y alla quota x=pos
export const openings: Opening[] = [
  { kind: 'ingresso', wallAxis: 'x', pos: 0, at: 4.0, len: 1.0, between: ['sala', 'portico'] },
  { kind: 'finestra', wallAxis: 'x', pos: 0, at: 0.4, len: 2.6, between: ['sala', 'portico'] },
  { kind: 'porta', wallAxis: 'x', pos: 3.8, at: 3.5, len: 0.8, between: ['sala', 'corridoio'] },
  { kind: 'porta', wallAxis: 'y', pos: 3.1, at: 4.8, len: 0.8, between: ['corridoio', 'camera'] },
  { kind: 'porta', wallAxis: 'x', pos: 5.6, at: 3.5, len: 0.8, between: ['corridoio', 'bagno'] },
  { kind: 'porta', wallAxis: 'x', pos: 5.6, at: 5.9, len: 0.8, between: ['corridoio', 'studio'] },
  { kind: 'porta', wallAxis: 'y', pos: 8.8, at: 4.8, len: 0.8, between: ['corridoio', 'ripostiglio'] },
  { kind: 'finestra', wallAxis: 'x', pos: 8.8, at: 3.5, len: 0.8, between: ['bagno', 'giardino'] },
  { kind: 'portafinestra', wallAxis: 'x', pos: 8.8, at: 0.6, len: 1.3, between: ['camera', 'giardino'] },
  { kind: 'portafinestra', wallAxis: 'x', pos: 8.8, at: 5.9, len: 1.2, between: ['studio', 'giardino'] },
  { kind: 'portafinestra', wallAxis: 'x', pos: 7.8, at: 9.0, len: 1.2, between: ['ripostiglio', 'giardino'] },
];
// Sala e cucina: apertura senza porta (la cucina è una nicchia aperta).
