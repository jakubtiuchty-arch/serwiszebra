import { ALERTY, type TypAlertu, type ZnalezionyProblem } from '@/lib/chat-alerts'

export interface RozmowaZProblemem {
  sessionId: string
  czas: string
  kategoria: string
  ocena: number
  pierwszeUserMessage: string
  problemy: ZnalezionyProblem[]
  odpowiedziAsystenta: string[]
}

const KOLOR: Record<'krytyczny' | 'wazny' | 'drobny', string> = {
  krytyczny: '#b91c1c',
  wazny: '#b45309',
  drobny: '#4b5563',
}

const ETYKIETA: Record<'krytyczny' | 'wazny' | 'drobny', string> = {
  krytyczny: 'Krytyczny',
  wazny: 'Ważny',
  drobny: 'Drobny',
}

const esc = (t: string) =>
  (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Gotowy do wklejenia opis zadania dla sesji, która ma to naprawić. */
export function zbudujBriefNaprawy(rozmowy: RozmowaZProblemem[]): string {
  const linie = rozmowy.flatMap((r) =>
    r.problemy.map(
      (p) =>
        `- [${p.typ}] sesja ${r.sessionId}, tura ${p.tura}: ${p.dlaczego}\n  Cytat: „${p.cytat}"`
    )
  )
  return [
    'Czat serwis-zebry.pl pomylił się w poniższych rozmowach. Napraw przyczynę, nie objaw.',
    'Kod czatu: /Users/jakubtiuchty/projects/serwiszebra, prompt i logika w app/api/chat/route.ts,',
    'baza wiedzy we wpisach blogowych w lib/blog.ts i w instrukcjach w tabeli manuals_documents.',
    'Po zmianie uruchom node scripts/test-poprawki-czatu.mjs i npx next build.',
    '',
    ...linie,
  ].join('\n')
}

export function generujAlertHtml(rozmowy: RozmowaZProblemem[], adminUrl: string): string {
  const wszystkie = rozmowy.flatMap((r) => r.problemy)
  const krytyczne = wszystkie.filter((p) => ALERTY[p.typ].waga === 'krytyczny').length

  const sekcje = rozmowy
    .map((r) => {
      const problemy = r.problemy
        .map((p) => {
          const def = ALERTY[p.typ]
          return `
          <div style="margin:0 0 14px;padding:12px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
            <div style="font-size:12px;color:${KOLOR[def.waga]};font-weight:700;text-transform:uppercase;letter-spacing:.03em">
              ${ETYKIETA[def.waga]} &middot; tura ${p.tura} &middot; pewność ${Math.round(p.waga * 100)}%
            </div>
            <div style="margin:6px 0 8px;font-size:15px;color:#111827">${esc(p.dlaczego)}</div>
            <div style="padding:8px 10px;background:#f9fafb;border-radius:6px;font-size:13px;color:#4b5563;font-style:italic">
              „${esc(p.cytat)}"
            </div>
          </div>`
        })
        .join('')

      return `
      <div style="margin:0 0 26px;padding:16px;background:#f9fafb;border-radius:10px">
        <div style="font-size:13px;color:#6b7280;margin-bottom:4px">
          ${esc(r.czas)} &middot; ocena ${r.ocena}/5 &middot; ${esc(r.kategoria)}
        </div>
        <div style="font-size:15px;color:#111827;font-weight:600;margin-bottom:12px">
          Klient: „${esc(r.pierwszeUserMessage.slice(0, 160))}"
        </div>
        ${problemy}
      </div>`
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="pl"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:28px">
    <h1 style="margin:0 0 6px;font-size:20px;color:#111827">Czat wymaga uwagi</h1>
    <p style="margin:0 0 22px;font-size:14px;color:#6b7280">
      ${wszystkie.length} ${wszystkie.length === 1 ? 'problem' : 'problemów'}
      w ${rozmowy.length} ${rozmowy.length === 1 ? 'rozmowie' : 'rozmowach'}${krytyczne > 0 ? `, w tym ${krytyczne} krytyczne` : ''}.
    </p>
    ${sekcje}
    <a href="${adminUrl}" style="display:inline-block;padding:11px 18px;background:#111827;color:#fff;text-decoration:none;border-radius:8px;font-size:14px">
      Otwórz panel rozmów
    </a>

    <div style="margin:26px 0 0;padding:16px;background:#111827;border-radius:10px">
      <div style="font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px">
        Do wklejenia w Claude Code — naprawa przyczyny
      </div>
      <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.55;color:#e5e7eb">${esc(zbudujBriefNaprawy(rozmowy))}</pre>
    </div>
    <p style="margin:22px 0 0;font-size:12px;color:#9ca3af">
      Alert wysyła cron /api/cron/chat-alerts. Progi czułości są w lib/chat-alerts.ts.
    </p>
  </div>
</body></html>`
}

export function temat(rozmowy: RozmowaZProblemem[]): string {
  const wszystkie = rozmowy.flatMap((r) => r.problemy)
  const krytyczne = wszystkie.filter((p) => ALERTY[p.typ].waga === 'krytyczny')
  if (krytyczne.length > 0) {
    const typy = Array.from(new Set(krytyczne.map((p) => p.typ as TypAlertu)))
    return `Czat: ${krytyczne.length} x krytyczny (${typy.join(', ')})`
  }
  return `Czat: ${wszystkie.length} ${wszystkie.length === 1 ? 'problem' : 'problemów'} do sprawdzenia`
}
