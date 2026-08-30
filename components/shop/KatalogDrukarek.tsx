"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import KafelekProduktu from "./KafelekProduktu";

/**
 * Katalog drukarek z filtrowaniem po WARIANTACH, nie po modelach. Modeli jest
 * kilka, ale numerów katalogowych kilkadziesiąt — i to na ich poziomie klient
 * się gubi (ZD421t sam ma sześć wersji). Filtr zawęża więc pulę wariantów,
 * a kafelek modelu pokazuje, ile jego wersji przeszło przez sito.
 */

export interface WariantDoFiltra {
  pn: string;
  dpi: string;
  lacznosc: string;
  wyposazenie: string;
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

type Klucz = "druk" | "dpi" | "lacznosc" | "wyposazenie" | "dostepne";

interface Grupa {
  klucz: Klucz;
  etykieta: string;
  opcje: { wartosc: string; etykieta: string }[];
}

const GRUPY: Grupa[] = [
  {
    klucz: "druk",
    etykieta: "Rodzaj druku",
    opcje: [
      { wartosc: "termiczny", etykieta: "Bez taśmy" },
      { wartosc: "termotransfer", etykieta: "Z taśmą" },
    ],
  },
  {
    klucz: "dpi",
    etykieta: "Rozdzielczość",
    opcje: [
      { wartosc: "203", etykieta: "203 dpi" },
      { wartosc: "300", etykieta: "300 dpi" },
    ],
  },
  {
    klucz: "lacznosc",
    etykieta: "Łączność",
    opcje: [
      { wartosc: "USB", etykieta: "USB" },
      { wartosc: "Ethernet", etykieta: "Ethernet" },
      { wartosc: "Wi-Fi", etykieta: "Wi-Fi" },
    ],
  },
  {
    klucz: "wyposazenie",
    etykieta: "Wyposażenie",
    opcje: [
      { wartosc: "Odklejak", etykieta: "Odklejak" },
      { wartosc: "Gilotyna", etykieta: "Gilotyna" },
    ],
  },
  {
    klucz: "dostepne",
    etykieta: "Dostępność",
    opcje: [{ wartosc: "1", etykieta: "Tylko dostępne" }],
  },
];

type Stan = Record<Klucz, string[]>;

const PUSTY: Stan = {
  druk: [],
  dpi: [],
  lacznosc: [],
  wyposazenie: [],
  dostepne: [],
};

/** Wartość wariantu w danym wymiarze — druk jest cechą modelu, reszta wariantu. */
function wartosc(klucz: Klucz, m: ModelDoFiltra, v: WariantDoFiltra): string {
  switch (klucz) {
    case "druk":
      return m.druk;
    case "dpi":
      return v.dpi;
    case "lacznosc":
      return v.lacznosc;
    case "wyposazenie":
      return v.wyposazenie;
    case "dostepne":
      return v.dostepny ? "1" : "0";
  }
}

/**
 * Wariant przechodzi, gdy spełnia każdą AKTYWNĄ grupę (wewnątrz grupy wybory
 * sumują się jak „albo"). `pomin` zostawia jedną grupę poza oceną — dzięki temu
 * liczymy, ile wyników dałaby opcja z tej grupy, i wygaszamy ślepe zaułki.
 */
function pasuje(
  m: ModelDoFiltra,
  v: WariantDoFiltra,
  stan: Stan,
  pomin?: Klucz,
): boolean {
  return GRUPY.every((g) => {
    if (g.klucz === pomin) return true;
    const wybrane = stan[g.klucz];
    if (wybrane.length === 0) return true;
    return wybrane.includes(wartosc(g.klucz, m, v));
  });
}

const stanZAdresu = (sp: URLSearchParams): Stan => {
  const s: Stan = { ...PUSTY };
  for (const g of GRUPY) {
    const surowe = sp.get(g.klucz);
    if (!surowe) continue;
    const dozwolone = g.opcje.map((o) => o.wartosc);
    s[g.klucz] = surowe.split(",").filter((w) => dozwolone.includes(w));
  }
  return s;
};

const doAdresu = (stan: Stan): string => {
  const p = new URLSearchParams();
  for (const g of GRUPY) {
    if (stan[g.klucz].length) p.set(g.klucz, stan[g.klucz].join(","));
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
  const [stan, setStan] = useState<Stan>(() =>
    stanZAdresu(new URLSearchParams(searchParams)),
  );
  const [rozwiniety, setRozwiniety] = useState(false);

  const aktywne = GRUPY.reduce((n, g) => n + stan[g.klucz].length, 0);

  const przelacz = (klucz: Klucz, wartosc: string) => {
    setStan((poprzedni) => {
      const teraz = poprzedni[klucz].includes(wartosc)
        ? poprzedni[klucz].filter((w) => w !== wartosc)
        : [...poprzedni[klucz], wartosc];
      const nowy = { ...poprzedni, [klucz]: teraz };
      zapiszAdres(nowy);
      return nowy;
    });
  };

  const wyczysc = () => {
    setStan(PUSTY);
    zapiszAdres(PUSTY);
  };

  /**
   * Stan filtra trzymamy w adresie przez history API, nie przez router.replace —
   * strona jest force-dynamic, więc każda nawigacja oznaczałaby ponowne pytanie
   * serwera o te same dane. Adres ma być tylko udostępnialny.
   */
  const zapiszAdres = (nowy: Stan) => {
    if (typeof window === "undefined") return;
    const qs = doAdresu(nowy);
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
          warianty: m.warianty.filter((v) => pasuje(m, v, stan)),
        }))
        .filter((x) => x.warianty.length > 0),
    [modele, stan],
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
        if (!pasuje(m, v, stan, g.klucz)) continue;
        if (wartosc(g.klucz, m, v) === wartoscOpcji) n += 1;
      }
    }
    return n;
  };

  return (
    <>
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          {/* Na telefonie panel startuje zwinięty — pięć rzędów chipów zepchnęłoby
              produkty poniżej pierwszego ekranu */}
          <h2 className="text-sm font-semibold text-gray-900">
            <button
              type="button"
              onClick={() => setRozwiniety((x) => !x)}
              aria-expanded={rozwiniety}
              className="flex items-center gap-1.5 sm:pointer-events-none"
            >
              Dobierz wersję
              {aktywne > 0 && (
                <span className="rounded-md bg-gray-900 px-1.5 py-0.5 text-[11px] font-semibold text-white sm:hidden">
                  {aktywne}
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition sm:hidden ${rozwiniety ? "rotate-180" : ""}`}
              />
            </button>
          </h2>
          <p className="text-xs text-gray-500">
            {aktywne === 0
              ? `${wszystkichWariantow} ${odmianaWersji(wszystkichWariantow)} w ${modele.length} modelach`
              : `${czasownikPasuje(pasujacychWariantow)} ${pasujacychWariantow} z ${wszystkichWariantow} wersji w ${widoczne.length} ${widoczne.length === 1 ? "modelu" : "modelach"}`}
          </p>
        </div>

        <div
          className={`mt-3 space-y-3 ${rozwiniety ? "" : "hidden sm:block"}`}
        >
          {GRUPY.map((g) => (
            <div key={g.klucz} className="flex flex-wrap items-center gap-2">
              <span className="w-full text-[11px] font-medium uppercase tracking-wide text-gray-400 sm:w-28">
                {g.etykieta}
              </span>
              {g.opcje.map((o) => {
                const wybrany = stan[g.klucz].includes(o.wartosc);
                const ile = licznoscOpcji(g, o.wartosc);
                const martwy = ile === 0 && !wybrany;
                return (
                  <button
                    key={o.wartosc}
                    type="button"
                    onClick={() => przelacz(g.klucz, o.wartosc)}
                    disabled={martwy}
                    aria-pressed={wybrany}
                    className={`min-h-[36px] rounded-lg border px-3 text-sm font-medium transition ${
                      wybrany
                        ? "border-gray-900 bg-gray-900 text-white"
                        : martwy
                          ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {o.etykieta}
                    <span
                      className={`ml-1.5 text-xs ${wybrany ? "text-gray-300" : "text-gray-400"}`}
                    >
                      {ile}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {aktywne > 0 && (
          <button
            type="button"
            onClick={wyczysc}
            className={`mt-3 inline-flex items-center gap-1 text-xs font-medium text-gray-600 underline hover:text-gray-900 ${
              rozwiniety ? "" : "hidden sm:inline-flex"
            }`}
          >
            <X className="h-3.5 w-3.5" />
            Wyczyść filtry
          </button>
        )}
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  wszystkichWersji: aktywne > 0 ? m.warianty.length : undefined,
                  dostepny: warianty.some((v) => v.dostepny),
                  magazynPL: warianty.some((v) => v.magazynPL),
                  href,
                }}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

/** Chipy liczone z wariantów, które przeszły filtr — a nie z całej oferty modelu. */
function chipy(m: ModelDoFiltra, warianty: WariantDoFiltra[]): string[] {
  const dpi = Array.from(new Set(warianty.map((v) => v.dpi))).sort();
  const laczn = Array.from(new Set(warianty.map((v) => v.lacznosc)));
  const kolejnosc = ["USB", "Ethernet", "Wi-Fi"];
  laczn.sort((a, b) => kolejnosc.indexOf(a) - kolejnosc.indexOf(b));
  return [
    dpi.length ? `${dpi.join(" / ")} dpi` : null,
    laczn.join(" · ").replace("Ethernet", "LAN"),
    m.druk === "termotransfer" ? "z taśmą" : "bez taśmy",
  ].filter((x): x is string => !!x);
}
