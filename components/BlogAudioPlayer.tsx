'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Headphones, Loader2, RotateCcw, RotateCw } from 'lucide-react'

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const SPEEDS = [1, 1.25, 1.5, 2]

export default function BlogAudioPlayer({
  src,
  title,
}: {
  src: string
  title: string
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speedIndex, setSpeedIndex] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoaded = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      }
      setIsReady(true)
    }
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    const onError = () => setHasError(true)

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('durationchange', onLoaded)
    audio.addEventListener('canplay', onLoaded)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    // Metadane mogły załadować się zanim listener został podpięty (plik z cache) — sprawdź stan ręcznie
    if (audio.readyState >= 1) onLoaded()

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('durationchange', onLoaded)
      audio.removeEventListener('canplay', onLoaded)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      void audio.play()
      setIsPlaying(true)
    }
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const time = Number(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }

  const skip = (delta: number) => {
    const audio = audioRef.current
    if (!audio) return
    const next = Math.min(Math.max(audio.currentTime + delta, 0), duration || 0)
    audio.currentTime = next
    setCurrentTime(next)
  }

  const cycleSpeed = () => {
    const audio = audioRef.current
    if (!audio) return
    const next = (speedIndex + 1) % SPEEDS.length
    audio.playbackRate = SPEEDS[next]
    setSpeedIndex(next)
  }

  if (hasError) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-2 mb-3 text-slate-600">
        <Headphones className="w-4 h-4" />
        <span className="text-sm font-semibold">Posłuchaj podsumowania</span>
        {isReady && duration > 0 && (
          <span className="text-xs text-slate-400">· {formatTime(duration)}</span>
        )}
        <span className="ml-auto text-[11px] text-slate-400">streszczenie AI</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pauza' : 'Odtwórz nagranie artykułu'}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-sm hover:from-blue-600 hover:to-indigo-700 transition-colors disabled:opacity-60"
          disabled={!isReady}
        >
          {!isReady ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={seek}
            aria-label="Pasek postępu nagrania"
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 accent-blue-600"
            style={{
              background: `linear-gradient(to right, #2563eb ${progress}%, #e2e8f0 ${progress}%)`,
            }}
          />
          <div className="flex justify-between mt-1 text-xs text-slate-500 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-1">
          <button
            type="button"
            onClick={() => skip(-15)}
            aria-label="Cofnij 15 sekund"
            className="w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors flex items-center justify-center"
            disabled={!isReady}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => skip(15)}
            aria-label="Przewiń 15 sekund do przodu"
            className="w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors flex items-center justify-center"
            disabled={!isReady}
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={cycleSpeed}
            aria-label="Zmień prędkość odtwarzania"
            className="min-w-[3rem] h-9 px-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors tabular-nums"
            disabled={!isReady}
          >
            {SPEEDS[speedIndex]}×
          </button>
        </div>
      </div>
    </div>
  )
}
