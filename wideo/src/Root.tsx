import React from 'react'
import { Composition } from 'remotion'
import { Film, type FilmProps } from './Film'
import film01 from '../../docs/youtube/01-skaner-enter-tab/sceny.json'

const FPS = 30

// Każdy film: katalog w docs/youtube/ z plansze/*.png i sceny.json
const FILMY: { id: string; katalog: string; dane: FilmProps['dane'] }[] = [
  { id: 'Film01-SkanerEnterTab', katalog: '01-skaner-enter-tab', dane: film01 },
]

export const Root: React.FC = () => (
  <>
    {FILMY.map((f) => (
      <Composition
        key={f.id}
        id={f.id}
        component={Film}
        durationInFrames={Math.round(f.dane.koniec * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ katalog: f.katalog, dane: f.dane, napisy: true, lektor: null } satisfies FilmProps}
      />
    ))}
  </>
)
