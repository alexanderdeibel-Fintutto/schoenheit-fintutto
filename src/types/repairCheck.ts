export type UebernahmeZustand = 'renoviert' | 'unrenoviert' | 'teilweise';
export type WohnungZustand = 'gut' | 'normal' | 'stark';

export interface RepairCheckInputs {
  // Gruppe 1: Übernahme
  uebernahme_zustand: UebernahmeZustand;
  einzugsdatum: string;
  renovierung_bei_einzug: boolean;
  
  // Gruppe 2: Klauseln
  hat_fristenplan: boolean;
  fristen_starr: boolean;
  fristen_weich: boolean;
  farbvorgabe: boolean;
  quotenklausel: boolean;
  endrenovierung: boolean;
  
  // Gruppe 3: Aktueller Zustand
  wohnung_zustand_aktuell: WohnungZustand;
}

export interface UnwirksameKlausel {
  klausel: string;
  grund: string;
  bgh: string;
}

export interface RepairCheckResult {
  unwirksame_klauseln: UnwirksameKlausel[];
  muss_renovieren: boolean;
  status: 'keine_pflicht' | 'moeglich' | 'unklar';
  empfehlung: string;
}

export const BGH_URTEILE = {
  starre_fristen: 'BGH VIII ZR 360/03 vom 23.06.2004',
  unrenoviert: 'BGH VIII ZR 185/14 vom 18.03.2015',
  quotenklausel: 'BGH VIII ZR 52/06 vom 18.10.2006',
  endrenovierung: 'BGH VIII ZR 316/06 vom 12.09.2007',
  farbvorgabe: 'BGH VIII ZR 198/10 vom 18.06.2008',
} as const;

export const getDefaultInputs = (): RepairCheckInputs => ({
  uebernahme_zustand: 'renoviert',
  einzugsdatum: '',
  renovierung_bei_einzug: false,
  hat_fristenplan: false,
  fristen_starr: false,
  fristen_weich: false,
  farbvorgabe: false,
  quotenklausel: false,
  endrenovierung: false,
  wohnung_zustand_aktuell: 'normal',
});
