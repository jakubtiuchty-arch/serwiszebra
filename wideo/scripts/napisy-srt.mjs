// Napisy SRT na YouTube z docs/youtube/<film>/sceny.json.
// Podział jak w src/napisy.ts (napisy wypalone w filmie) — oba muszą zostać takie same.
// Użycie: node scripts/napisy-srt.mjs 01-skaner-enter-tab
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const MAKS = 84
const katalog = join(import.meta.dirname, '../../docs/youtube', process.argv[2] ?? '')
const dane = JSON.parse(readFileSync(join(katalog, 'sceny.json'), 'utf8'))

function napisySceny(s) {
  const kawalki = []
  for (let z of s.tekst.split(/(?<=[.?!])\s+/)) {
    while (z.length > MAKS) {
      let ciecie = z.lastIndexOf(', ', MAKS)
      ciecie = ciecie > 20 ? ciecie + 1 : z.lastIndexOf(' ', MAKS)
      kawalki.push(z.slice(0, ciecie).trim())
      z = z.slice(ciecie).trim()
    }
    kawalki.push(z)
  }
  const koniec = s.tekstDo ?? s.do
  const razem = kawalki.reduce((a, k) => a + k.length, 0)
  let t = s.od
  return kawalki.map((k) => {
    const d = ((koniec - s.od) * k.length) / razem
    const n = { od: t, do: t + d, tekst: k }
    t += d
    return n
  })
}

const czas = (t) => {
  let ms = Math.round(t * 1000)
  const h = Math.floor(ms / 3600000); ms -= h * 3600000
  const m = Math.floor(ms / 60000); ms -= m * 60000
  const s = Math.floor(ms / 1000); ms -= s * 1000
  const p = (x, n = 2) => String(x).padStart(n, '0')
  return `${p(h)}:${p(m)}:${p(s)},${p(ms, 3)}`
}

const napisy = dane.sceny.flatMap(napisySceny)
const srt = napisy.map((n, i) => `${i + 1}\n${czas(n.od)} --> ${czas(n.do - 0.05)}\n${n.tekst}\n`).join('\n')
writeFileSync(join(katalog, 'napisy-pl.srt'), srt)
console.log(`${napisy.length} napisów → ${join(katalog, 'napisy-pl.srt')}`)
