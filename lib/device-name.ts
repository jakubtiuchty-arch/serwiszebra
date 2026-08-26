/**
 * Pełna nazwa urządzenia do komunikacji z klientem.
 *
 * W bazie model bywa gołym oznaczeniem („L10", „ZD421"), które klientowi nic
 * nie mówi — składamy więc typ + markę + model: „tablet Zebra L10",
 * „drukarkę Zebra ZD421". Marki nie zgadujemy na ślepo: dopisujemy ją tylko
 * wtedy, gdy oznaczenie pasuje do znanych serii, bo naprawiamy też CipherLaby,
 * Brothery czy Godexy i „Zebra RS51" byłoby wpadką.
 */

/** Typ urządzenia w bierniku — „odesłaliśmy Państwu drukarkę/terminal/tablet" */
const TYP_BIERNIK: Record<string, string> = {
  drukarka: 'drukarkę',
  terminal: 'terminal',
  tablet: 'tablet',
  skaner: 'skaner',
}

/** Serie rozpoznawalne po prefiksie — dopisujemy markę, gdy jej brak */
const MARKI: [RegExp, string][] = [
  // Zebra: drukarki ZD/ZT/ZQ/ZC/ZE/ZM/GK/GX/GC/GT/TLP/LP, terminale TC/MC/WT,
  // tablety ET/L10/XSLATE/XPAD, skanery DS/LI/CS
  [/^(ZD|ZT|ZQ|ZC|ZE|ZM|GK|GX|GC|GT|TLP|LP\d|TC|MC|WT|ET|L10|XSLATE|XPAD|DS\d|LI\d|CS\d|EC\d)/i, 'Zebra'],
  [/^(RS\d|RK\d)/i, 'CipherLab'],
  [/^(QL-|PT-|TD-|RJ-|PA)/i, 'Brother'],
  [/^(LK-)/i, 'Sewoo'],
  [/^(EZ\d|G\d{3}|RT\d{3}|DT\d)/i, 'Godex'],
  [/^(PC4|PM4|CT\d|EDA)/i, 'Honeywell'],
  [/^(CL-)/i, 'Citizen'],
  [/^(TTP|ML2|MB2|MH2|TE2|TA2|DA2)/i, 'TSC'],
]

const ZNANE_MARKI =
  /\b(zebra|cipherlab|brother|honeywell|sewoo|godex|citizen|tsc|datalogic|newland|sato|epson|bixolon)\b/i

/** Oczyszczony model: bez zdublowanego typu i marki na początku, bez nadmiaru spacji */
function oczyscModel(surowy: string): { model: string; markaZNazwy: string | null } {
  let m = (surowy || '').replace(/\s+/g, ' ').trim()

  // Zdejmij powtórzony typ z początku („tablet zebra L10Xslate" → „zebra L10Xslate")
  m = m.replace(/^(drukarka|terminal|tablet|skaner|urządzenie)\s+/i, '')

  // Markę z początku zdejmujemy i zapamiętujemy — wróci w spójnej pisowni
  const marka = ZNANE_MARKI.exec(m)
  if (marka && m.toLowerCase().startsWith(marka[1].toLowerCase())) {
    m = m.slice(marka[1].length).replace(/^[\s-]+/, '')
  }

  return { model: m, markaZNazwy: marka ? poprawnaPisownia(marka[1]) : null }
}

function poprawnaPisownia(marka: string): string {
  const wg: Record<string, string> = {
    zebra: 'Zebra', cipherlab: 'CipherLab', brother: 'Brother', honeywell: 'Honeywell',
    sewoo: 'Sewoo', godex: 'Godex', citizen: 'Citizen', tsc: 'TSC', datalogic: 'Datalogic',
    newland: 'Newland', sato: 'SATO', epson: 'Epson', bixolon: 'Bixolon',
  }
  return wg[marka.toLowerCase()] || marka
}

export interface NazwaUrzadzenia {
  /** „drukarkę Zebra ZD421" — do zdania „odesłaliśmy Państwu …" */
  biernik: string
  /** „Zebra ZD421" — do tematu maila (bez typu, żeby zmieścić się na telefonie) */
  krotka: string
}

export function nazwaUrzadzenia(
  deviceType?: string | null,
  deviceModel?: string | null
): NazwaUrzadzenia {
  // Akcesoria (baterie, zasilacze) nie mają sensownej „nazwy urządzenia" —
  // „Czy Bateria Li-on pracuje bez zarzutu?" brzmi absurdalnie. Pusta `krotka`
  // przełącza temat na formę ogólną.
  if ((deviceType || '').toLowerCase().trim() === 'akcesoria') {
    return { biernik: 'sprzęt', krotka: '' }
  }

  const { model, markaZNazwy } = oczyscModel(deviceModel || '')
  if (!model) return { biernik: 'urządzenie', krotka: '' }

  const marka =
    markaZNazwy || MARKI.find(([wzorzec]) => wzorzec.test(model))?.[1] || null

  const markaModel = marka ? `${marka} ${model}` : model
  const typ = TYP_BIERNIK[(deviceType || '').toLowerCase().trim()]

  return {
    // „urządzenie" przed samym oznaczeniem, żeby zdanie nie brzmiało
    // „odesłaliśmy Państwu ZC300"; przy znanym typie — konkretny rzeczownik
    biernik: typ ? `${typ} ${markaModel}` : `urządzenie ${markaModel}`,
    krotka: markaModel,
  }
}
