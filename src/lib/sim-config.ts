export const CFG = {
  pipeR: 0.4,
  pipeWall: 0.016,
  get pipeInnerR() {
    return this.pipeR - this.pipeWall;
  },

  lowerRimY: -0.38,
  upperRimY: 0.38,

  lowerPipeH: 0.92,
  upperPipeH: 2.05,

  chederLeg: 0.046,
  chederWeb: 0.02,
  chederRubber: 0.011,
  chederMetal: 0.0024,
  toothCount: 36,
  toothLen: 0.011,
  toothW: 0.012,
  toothH: 0.007,

  compThickness: 0.016,
  compOverlap: 0.09,
  compBulge: 0.055,

  clampH: 0.038,
  clampT: 0.012,

  vibAmpX: 0.034,
  vibAmpZ: 0.016,
  vibFreq: 9.4,

  screenW: 2.7,
  screenD: 1.55,
  screenH: 0.72,
} as const;

export const STEPS = [
  {
    id: 0,
    kicker: "01 · Ansamblu",
    title: "Sită Niagara + tubulaturi",
    body: "Jos: sita vibratoare. Sus: tubulatura statică a fabricii. Între ele: compensatorul flexibil, prins cu coliere — nu există țevi laterale în zona de racord.",
    camera: { px: 3.35, py: 1.15, pz: 3.6, tx: 0, ty: -0.35, tz: 0 },
  },
  {
    id: 1,
    kicker: "02 · Vibrație",
    title: "Sita lucrează continuu",
    body: "Mișcarea sitei se transmite stub-ului inferior. Tubulatura superioară stă pe loc. Compensatorul preia toată diferența de deplasare.",
    camera: { px: 2.55, py: 0.55, pz: 2.7, tx: 0, ty: 0.05, tz: 0 },
  },
  {
    id: 2,
    kicker: "03 · Muchia",
    title: "Buza metalică taie ca un cuțit",
    body: "La fiecare oscilație, muchia ascuțită a tubulaturii freacă și forfecă cauciucul pe interior. Fără protecție, contactul este oțel pe compensator.",
    camera: { px: 1.55, py: 0.12, pz: 1.35, tx: 0, ty: -0.38, tz: 0 },
  },
  {
    id: 3,
    kicker: "04 · Rupere",
    title: "Compensatorul se secționează",
    body: "În timp, materialul este tăiat — exact ca în teren. Urmează pierderi de praf, timpi morți și înlocuiri repetate.",
    camera: { px: 1.45, py: -0.05, pz: 1.55, tx: 0, ty: -0.28, tz: 0.15 },
  },
  {
    id: 4,
    kicker: "05 · Chederul",
    title: "Profil U pe ambele muchii",
    body: "Cheder cu pereți metalici și dinți pe interior, montat DIRECT pe buza țevii — sus și jos. Compensatorul vine peste cheder, nu pe oțel.",
    camera: { px: 1.35, py: 0.08, pz: 0.15, tx: 0.05, ty: -0.38, tz: 0 },
  },
  {
    id: 5,
    kicker: "06 · Protecție",
    title: "Vibrația rămâne, tăierea nu",
    body: "Sita continuă să vibreze. Compensatorul se deformează pe chederul îmbrăcat, nu pe muchia ascuțită. Zero forfecare pe oțel.",
    camera: { px: 2.4, py: 0.45, pz: 2.55, tx: 0, ty: 0, tz: 0 },
  },
] as const;

export const PHOTOS = [
  {
    src: "/photos/taietura-detaliu.jpg",
    caption: "Tăietură reală — compensator secționat de muchie",
    tag: "Problemă",
  },
  {
    src: "/photos/taietura-mediu.jpg",
    caption: "Poziție pe tubulatură, colier jos, gol în perete",
    tag: "Problemă",
  },
  {
    src: "/photos/taietura-context.jpg",
    caption: "Context fabrică — sită / tub vertical / schelă",
    tag: "Teren",
  },
  {
    src: "/photos/cheder-montat.jpg",
    caption: "Cheder montat pe buza circulară a tubulaturii",
    tag: "Soluție",
  },
  {
    src: "/photos/cheder-dinti.jpg",
    caption: "Dinți / profil interior — prindere pe muchie",
    tag: "Soluție",
  },
  {
    src: "/photos/cheder-material.jpg",
    caption: "Material cheder — cauciuc cu întăritură",
    tag: "Soluție",
  },
] as const;
