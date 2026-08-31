"use client";

import { useId, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import KafelekProduktu from "./KafelekProduktu";

/**
 * Katalog drukarek z filtrowaniem po WARIANTACH, nie po modelach. Modeli jest
 * kilka, ale numerów katalogowych kilkadziesiąt — i to na ich poziomie klient
 * się gubi (ZD421t sam ma sześć wersji). Filtr zawęża więc pulę wariantów,
 * a kafelek modelu pokazuje, ile jego wersji przeszło przez sito.
 */

export interface WariantDoFiltra {
  pn: string;
  /** Cechy 1:1 z tabeli wariantów — nazwa cechy → wartość. Filtr buduje z nich
   *  grupy, więc klasa z innymi osiami (mobilne: Łączność + Nośnik) działa bez
   *  zmian w kodzie. */
  cechy: Record<string, string>;
  netto: number;
  brutto: number;
  dostepny: boolean;
  magazynPL: boolean;
}

export interface ModelDoFiltra {
  slug: string;
  nazwa: string;
  zdjecie: string | null;
  druk: "termiczny" | "termotransfer";
  netto: number;
  brutto: number;
  warianty: WariantDoFiltra[];
}

interface Grupa {
  klucz: string;
  etykieta: string;
  opcje: { wartosc: string; etykieta: string }[];
}

type Stan = Record<string, string[]>;

/** Klucze specjalne: rodzaj druku bierze się z modelu, dostępność ze stanu. */
const KLUCZ_DRUK = "druk";
const KLUCZ_DOSTEPNE = "dostepne";

/** Kolejność kolumn filtra — cechy spoza listy trafiają na koniec, alfabetycznie. */
const KOLEJNOSC_CECH = [
  "Rozdzielczość",
  "Łączność",
  "Nośnik",
  "Akumulator",
  "Wyposażenie",
  "Panel",
  "Kolor",
];

/** Kolejność wartości w obrębie cechy — od najprostszej opcji do najbogatszej. */
const KOLEJNOSC_WARTOSCI: Record<string, string[]> = {
  "Rozdzielczość": ["203 dpi", "300 dpi", "600 dpi"],
  "Łączność": ["USB", "Bluetooth", "Ethernet", "Wi-Fi", "Wi-Fi 5", "Wi-Fi 6"],
  "Nośnik": ["Z podkładem", "Linerless"],
  "Akumulator": ["W zestawie", "Bez akumulatora"],
  "Wyposażenie": ["Standard", "Odklejak", "Gilotyna"],
  "Panel": ["Diody", "Ekran dotykowy"],
  "Kolor": ["Czarna", "Biała"],
};

/** Adres ma zostać czytelny, więc klucz w query to slug nazwy cechy. */
const slugCechy = (nazwa: string) =>
  nazwa
    .toLowerCase()
    .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e").replace(/ł/g, "l")
    .replace(/ń/g, "n").replace(/ó/g, "o").replace(/ś/g, "s").replace(/[źż]/g, "z")
    .replace(/[^a-z0-9]+/g, "");

/**
 * Grupy filtra wyliczone z tego, co faktycznie różnicuje warianty w tej klasie.
 * Dzięki temu drukarki biurkowe dostają Rozdzielczość / Łączność / Wyposażenie,
 * a mobilne Łączność / Nośnik — bez martwych chipów z opcjami, których w danej
 * klasie nikt nie sprzedaje.
 */
function zbudujGrupy(modele: ModelDoFiltra[]): Grupa[] {
  const grupy: Grupa[] = [];

  const rodzaje = new Set(modele.map((m) => m.druk));
  if (rodzaje.size > 1) {
    grupy.push({
      klucz: KLUCZ_DRUK,
      etykieta: "Rodzaj druku",
      opcje: [
        { wartosc: "termiczny", etykieta: "Termiczna" },
        { wartosc: "termotransfer", etykieta: "Termotransferowa" },
      ].filter((o) => rodzaje.has(o.wartosc as ModelDoFiltra["druk"])),
    });
  }

  const wartosciCech = new Map<string, Set<string>>();
  for (const m of modele) {
    for (const v of m.warianty) {
      for (const [nazwa, wartosc] of Object.entries(v.cechy || {})) {
        if (!wartosc) continue;
        if (!wartosciCech.has(nazwa)) wartosciCech.set(nazwa, new Set());
        wartosciCech.get(nazwa)!.add(wartosc);
      }
    }
  }

  const nazwy = Array.from(wartosciCech.keys()).sort((a, b) => {
    const ia = KOLEJNOSC_CECH.indexOf(a);
    const ib = KOLEJNOSC_CECH.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b, "pl");
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  for (const nazwa of nazwy) {
    const wartosci = Array.from(wartosciCech.get(nazwa)!);
    // Cecha, która ma jedną wartość, niczego nie różnicuje — nie zajmuje miejsca
    if (wartosci.length < 2) continue;
    const kolejnosc = KOLEJNOSC_WARTOSCI[nazwa] || [];
    wartosci.sort((a, b) => {
      const ia = kolejnosc.indexOf(a);
      const ib = kolejnosc.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b, "pl");
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    grupy.push({
      klucz: slugCechy(nazwa),
      etykieta: nazwa,
      opcje: wartosci.map((w) => ({ wartosc: w, etykieta: w })),
    });
  }

  grupy.push({
    klucz: KLUCZ_DOSTEPNE,
    etykieta: "Dostępność",
    opcje: [{ wartosc: "1", etykieta: "Tylko dostępne" }],
  });

  return grupy;
}

const pustyStan = (grupy: Grupa[]): Stan =>
  Object.fromEntries(grupy.map((g) => [g.klucz, [] as string[]]));

/** Wartość wariantu w danym wymiarze — druk jest cechą modelu, reszta wariantu. */
function wartosc(
  grupa: Grupa,
  m: ModelDoFiltra,
  v: WariantDoFiltra,
): string {
  if (grupa.klucz === KLUCZ_DRUK) return m.druk;
  if (grupa.klucz === KLUCZ_DOSTEPNE) return v.dostepny ? "1" : "0";
  return v.cechy?.[grupa.etykieta] ?? "";
}

/**
 * Wariant przechodzi, gdy spełnia każdą AKTYWNĄ grupę (wewnątrz grupy wybory
 * sumują się jak „albo"). `pomin` zostawia jedną grupę poza oceną — dzięki temu
 * liczymy, ile wyników dałaby opcja z tej grupy, i wygaszamy ślepe zaułki.
 */
function pasuje(
  grupy: Grupa[],
  m: ModelDoFiltra,
  v: WariantDoFiltra,
  stan: Stan,
  pomin?: string,
): boolean {
  return grupy.every((g) => {
    if (g.klucz === pomin) return true;
    const wybrane = stan[g.klucz] || [];
    if (wybrane.length === 0) return true;
    return wybrane.includes(wartosc(g, m, v));
  });
}

const stanZAdresu = (grupy: Grupa[], sp: URLSearchParams): Stan => {
  const s: Stan = pustyStan(grupy);
  for (const g of grupy) {
    const surowe = sp.get(g.klucz);
    if (!surowe) continue;
    const dozwolone = g.opcje.map((o) => o.wartosc);
    s[g.klucz] = surowe.split(",").filter((w) => dozwolone.includes(w));
  }
  return s;
};

const doAdresu = (grupy: Grupa[], stan: Stan): string => {
  const p = new URLSearchParams();
  for (const g of grupy) {
    if (stan[g.klucz]?.length) p.set(g.klucz, stan[g.klucz].join(","));
  }
  return p.toString();
};

/** „1 wersja", „22 wersje", „7 wersji" — mianownik po liczebniku. */
const odmianaWersji = (n: number) => {
  if (n === 1) return "wersja";
  const d = n % 10;
  const s = n % 100;
  return d >= 2 && d <= 4 && !(s >= 12 && s <= 14) ? "wersje" : "wersji";
};

/** „Pasuje 1 z 6", „Pasują 3 z 6", „Pasuje 7 z 22" — orzeczenie idzie za liczbą. */
const czasownikPasuje = (n: number) => {
  const d = n % 10;
  const s = n % 100;
  return d >= 2 && d <= 4 && !(s >= 12 && s <= 14) ? "Pasują" : "Pasuje";
};

export default function KatalogDrukarek({
  modele,
}: {
  modele: ModelDoFiltra[];
}) {
  const searchParams = useSearchParams();
  const grupy = useMemo(() => zbudujGrupy(modele), [modele]);
  const [stan, setStan] = useState<Stan>(() =>
    stanZAdresu(zbudujGrupy(modele), new URLSearchParams(searchParams)),
  );
  const [rozwiniety, setRozwiniety] = useState(false);
  const idFiltra = useId();

  const aktywne = grupy.reduce((n, g) => n + (stan[g.klucz]?.length || 0), 0);

  const przelacz = (klucz: string, wartosc: string) => {
    setStan((poprzedni) => {
      const teraz = (poprzedni[klucz] || []).includes(wartosc)
        ? poprzedni[klucz].filter((w: string) => w !== wartosc)
        : [...(poprzedni[klucz] || []), wartosc];
      const nowy = { ...poprzedni, [klucz]: teraz };
      zapiszAdres(nowy);
      return nowy;
    });
  };

  const wyczysc = () => {
    const pusty = pustyStan(grupy);
    setStan(pusty);
    zapiszAdres(pusty);
  };

  /**
   * Stan filtra trzymamy w adresie przez history API, nie przez router.replace —
   * strona jest force-dynamic, więc każda nawigacja oznaczałaby ponowne pytanie
   * serwera o te same dane. Adres ma być tylko udostępnialny.
   */
  const zapiszAdres = (nowy: Stan) => {
    if (typeof window === "undefined") return;
    const qs = doAdresu(grupy, nowy);
    window.history.replaceState(
      null,
      "",
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
    );
  };

  const widoczne = useMemo(
    () =>
      modele
        .map((m) => ({
          m,
          warianty: m.warianty.filter((v) => pasuje(grupy, m, v, stan)),
        }))
        .filter((x) => x.warianty.length > 0),
    [grupy, modele, stan],
  );

  const wszystkichWariantow = useMemo(
    () => modele.reduce((n, m) => n + m.warianty.length, 0),
    [modele],
  );
  const pasujacychWariantow = widoczne.reduce(
    (n, x) => n + x.warianty.length,
    0,
  );

  /** Ile wyników dałaby opcja przy pozostałych filtrach — 0 wygasza chip. */
  const licznoscOpcji = (g: Grupa, wartoscOpcji: string) => {
    let n = 0;
    for (const m of modele) {
      for (const v of m.warianty) {
        if (!pasuje(grupy, m, v, stan, g.klucz)) continue;
        if (wartosc(g, m, v) === wartoscOpcji) n += 1;
      }
    }
    return n;
  };

  /** Etykieta opcji do pigułek nad wynikami — chip nazywa wybór, nie kod. */
  const etykietaOpcji = (klucz: string, wartoscOpcji: string) =>
    grupy.find((g) => g.klucz === klucz)?.opcje.find(
      (o) => o.wartosc === wartoscOpcji,
    )?.etykieta || wartoscOpcji;

  const wybrane: { klucz: string; wartosc: string }[] = grupy.flatMap((g) =>
    (stan[g.klucz] || []).map((w: string) => ({ klucz: g.klucz, wartosc: w })),
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Filtry po lewej — tak, jak klient zna to ze sklepów. Na telefonie
          kolumna wskakuje nad listę i startuje zwinięta, żeby pięć grup nie
          spychało produktów poniżej pierwszego ekranu. */}
      <aside className="lg:sticky lg:top-6 lg:w-60 lg:shrink-0">
        <div className="rounded-xl border border-gray-200 bg-white">
          {/* Bez nagłówka: na desktopie kolumna filtrów mówi sama za siebie
              nazwami grup. Na telefonie zostaje pasek rozwijający — z ikoną
              suwaków i licznikiem wybranych, bo tam panel startuje zwinięty
              i musi być za co kliknąć. */}
          <button
            type="button"
            onClick={() => setRozwiniety((x) => !x)}
            aria-expanded={rozwiniety}
            aria-label="Filtry"
            className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            Filtry
            {aktywne > 0 && (
              <span className="rounded-md bg-gray-900 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {aktywne}
              </span>
            )}
            <ChevronDown
              className={`ml-auto h-4 w-4 text-gray-400 transition ${
                rozwiniety ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* `role="group"` z `aria-labelledby` zamiast fieldset/legend:
              legendy nie da się odsunąć od krawędzi, bo przeglądarka
              pozycjonuje ją poza flow paddingu, a `float` rozbijał układ
              opcji. Dla czytnika ekranu grupa nazywa się tak samo. */}
          <div className={rozwiniety ? "block" : "hidden lg:block"}>
            {grupy.map((g) => (
              <div
                key={g.klucz}
                role="group"
                aria-labelledby={`${idFiltra}-${g.klucz}`}
                className="border-b border-gray-100 px-4 pb-3 pt-4 last:border-0"
              >
                <p
                  id={`${idFiltra}-${g.klucz}`}
                  className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400"
                >
                  {g.etykieta}
                </p>
                <div className="space-y-1">
                  {g.opcje.map((o) => {
                    const zaznaczony = (stan[g.klucz] || []).includes(o.wartosc);
                    const ile = licznoscOpcji(g, o.wartosc);
                    const martwy = ile === 0 && !zaznaczony;
                    return (
                      <label
                        key={o.wartosc}
                        className={`flex min-h-[32px] items-center gap-2 text-sm ${
                          martwy
                            ? "cursor-not-allowed text-gray-300"
                            : "cursor-pointer text-gray-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={zaznaczony}
                          disabled={martwy}
                          onChange={() => przelacz(g.klucz, o.wartosc)}
                          className="h-4 w-4 rounded border-gray-300 text-gray-900 accent-gray-900 disabled:opacity-40"
                        />
                        <span
                          className={
                            zaznaczony ? "font-medium text-gray-900" : ""
                          }
                        >
                          {o.etykieta}
                        </span>
                        <span className="ml-auto text-xs text-gray-400">
                          {ile}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            {aktywne > 0 && (
              <div className="px-4 py-3">
                <button
                  type="button"
                  onClick={wyczysc}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 underline hover:text-gray-900"
                >
                  <X className="h-3.5 w-3.5" />
                  Wyczyść filtry
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <p className="text-xs text-gray-500">
            {aktywne === 0
              ? `${wszystkichWariantow} ${odmianaWersji(wszystkichWariantow)} w ${modele.length} modelach`
              : `${czasownikPasuje(pasujacychWariantow)} ${pasujacychWariantow} z ${wszystkichWariantow} wersji w ${widoczne.length} ${
                  widoczne.length === 1 ? "modelu" : "modelach"
                }`}
          </p>
          {/* Pigułki wybranych filtrów — na telefonie kolumna bywa zwinięta,
              więc to jedyne miejsce, gdzie widać i można cofnąć wybór */}
          {wybrane.map(({ klucz, wartosc: w }) => (
            <button
              key={`${klucz}-${w}`}
              type="button"
              onClick={() => przelacz(klucz, w)}
              className="inline-flex items-center gap-1 rounded-full bg-gray-900 py-1 pl-3 pr-2 text-xs font-medium text-white"
            >
              {etykietaOpcji(klucz, w)}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>

        {widoczne.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-700">
              Żadna wersja z magazynu nie spełnia wszystkich warunków naraz.
            </p>
            <button
              type="button"
              onClick={wyczysc}
              className="mt-3 inline-flex min-h-[40px] items-center rounded-lg bg-[#A8F000] px-4 text-sm font-semibold text-gray-900"
            >
              Pokaż wszystkie wersje
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {widoczne.map(({ m, warianty }) => {
              const najtanszy = warianty.reduce((a, b) =>
                b.netto < a.netto ? b : a,
              );
              // Gdy filtr zawęził model do jednej wersji, kafelek prowadzi prosto
              // do niej — karta produktu honoruje `?pn=`.
              const href =
                aktywne > 0 && warianty.length === 1
                  ? `/sklep/drukarki-etykiet/${m.slug}?pn=${encodeURIComponent(warianty[0].pn)}`
                  : undefined;
              return (
                <KafelekProduktu
                  key={m.slug}
                  p={{
                    slug: m.slug,
                    nazwa: m.nazwa,
                    zdjecie: m.zdjecie,
                    cechy: chipy(m, warianty),
                    netto: najtanszy.netto > 0 ? najtanszy.netto : m.netto,
                    brutto: najtanszy.brutto > 0 ? najtanszy.brutto : m.brutto,
                    liczbaWersji: warianty.length,
                    wszystkichWersji:
                      aktywne > 0 ? m.warianty.length : undefined,
                    dostepny: warianty.some((v) => v.dostepny),
                    magazynPL: warianty.some((v) => v.magazynPL),
                    href,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Chipy na kafelku — liczone z wariantów, które przeszły filtr, i z tych samych
 * cech, które napędzają filtr. Dzięki temu kafelek drukarki mobilnej mówi
 * o łączności i nośniku, a biurkowej o rozdzielczości i łączności, bez
 * osobnego kodu na klasę.
 */
function chipy(m: ModelDoFiltra, warianty: WariantDoFiltra[]): string[] {
  const chip = (nazwa: string, skrot?: (w: string) => string) => {
    const wartosci = Array.from(
      new Set(warianty.map((v) => v.cechy?.[nazwa]).filter(Boolean) as string[]),
    );
    if (wartosci.length === 0) return null;
    const kolejnosc = KOLEJNOSC_WARTOSCI[nazwa] || [];
    wartosci.sort((a, b) => {
      const ia = kolejnosc.indexOf(a);
      const ib = kolejnosc.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b, "pl");
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return wartosci.map((w) => (skrot ? skrot(w) : w)).join(" · ");
  };

  return [
    chip("Rozdzielczość"),
    chip("Łączność", (w) => (w === "Ethernet" ? "LAN" : w)),
    m.druk === "termotransfer" ? "z taśmą" : "bez taśmy",
  ].filter((x): x is string => !!x);
}
