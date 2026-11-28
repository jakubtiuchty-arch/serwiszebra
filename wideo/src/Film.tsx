import React from 'react'
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { napisySceny } from './napisy'
import type { DaneFilmu, Scena } from './typy'

// type, nie interface: Remotion wymaga propsów zgodnych z Record<string, unknown>
export type FilmProps = {
  katalog: string
  dane: DaneFilmu
  napisy: boolean
  lektor: string | null
}

const PRZENIKANIE = 12 // klatek

const Plansza: React.FC<{ src: string; kod: boolean; klatek: number }> = ({ src, kod, klatek }) => {
  const f = useCurrentFrame()
  const krycie = interpolate(f, [0, PRZENIKANIE], [0, 1], { extrapolateRight: 'clamp' })
  // Plansza z kodem stoi nieruchomo — każdy ruch to rozmyte kreski po kompresji YouTube
  const skala = kod ? 1 : interpolate(f, [0, klatek], [1, 1.035])
  return (
    <AbsoluteFill style={{ opacity: krycie, backgroundColor: '#0a1228' }}>
      <Img src={src} style={{ width: '100%', height: '100%', transform: `scale(${skala})` }} />
    </AbsoluteFill>
  )
}

const Napisy: React.FC<{ sceny: Scena[] }> = ({ sceny }) => {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const t = f / fps
  const napis = sceny.flatMap(napisySceny).find((n) => t >= n.od && t < n.do)
  if (!napis) return null
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 22 }}>
      <div
        style={{
          maxWidth: 1640,
          padding: '10px 26px',
          borderRadius: 14,
          background: 'rgba(5, 10, 25, 0.86)',
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: 36,
          lineHeight: 1.3,
          textAlign: 'center',
        }}
      >
        {napis.tekst}
      </div>
    </AbsoluteFill>
  )
}

export const Film: React.FC<FilmProps> = ({ katalog, dane, napisy, lektor }) => {
  const { fps } = useVideoConfig()
  return (
    <AbsoluteFill style={{ backgroundColor: '#0a1228' }}>
      {dane.sceny.map((s, i) => {
        const od = Math.round(s.od * fps)
        // zakładka na przenikanie z następną planszą
        const klatek = Math.round((s.do - s.od) * fps) + (i < dane.sceny.length - 1 ? PRZENIKANIE : 0)
        return (
          <Sequence key={i} from={od} durationInFrames={klatek} name={`${s.plansza} ${s.ujecie ?? ''}`}>
            <Plansza src={staticFile(`${katalog}/plansze/${s.plansza}`)} kod={!!s.kod} klatek={klatek} />
          </Sequence>
        )
      })}
      {napisy && <Napisy sceny={dane.sceny} />}
      {lektor && <Audio src={staticFile(`${katalog}/${lektor}`)} />}
    </AbsoluteFill>
  )
}
