export interface Scena {
  od: number
  do: number
  plansza: string
  tekst: string
  kod?: boolean
  ujecie?: string
  // koniec lektora, gdy plansza stoi dłużej (ekran końcowy YouTube)
  tekstDo?: number
}

export interface DaneFilmu {
  tytul: string
  koniec: number
  sceny: Scena[]
}
