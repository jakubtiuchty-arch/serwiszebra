'use client'

import { useEffect, useState } from 'react'
import { Loader2, ThumbsDown, ThumbsUp } from 'lucide-react'

type ReactionVote = 'up' | 'down'

type ReactionState = {
  upvotes: number
  downvotes: number
  userVote: ReactionVote | null
}

const initialState: ReactionState = {
  upvotes: 0,
  downvotes: 0,
  userVote: null,
}

export default function BlogReactions({ slug }: { slug: string }) {
  const [state, setState] = useState<ReactionState>(initialState)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchReactions = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/blog/reactions?slug=${encodeURIComponent(slug)}`)
        const data = await res.json()

        if (!res.ok || data.error) {
          throw new Error(data.error || 'Nie udało się pobrać danych')
        }

        if (isMounted) {
          setState({
            upvotes: data.upvotes ?? 0,
            downvotes: data.downvotes ?? 0,
            userVote: data.userVote ?? null,
          })
        }
      } catch {
        if (isMounted) {
          setError('Nie udało się pobrać reakcji. Spróbuj ponownie później.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchReactions()

    return () => {
      isMounted = false
    }
  }, [slug])

  const handleVote = async (vote: ReactionVote) => {
    if (submitting) return

    setSubmitting(true)
    setError(null)

    const previousState = state
    const optimistic = getOptimisticState(state, vote)
    setState(optimistic)

    try {
      const res = await fetch('/api/blog/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, vote }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Błąd zapisu')
      }

      setState({
        upvotes: data.upvotes ?? optimistic.upvotes,
        downvotes: data.downvotes ?? optimistic.downvotes,
        userVote: data.userVote ?? vote,
      })
    } catch (err) {
      console.error('Reaction error', err)
      setState(previousState)
      setError('Nie udało się zapisać reakcji. Spróbuj ponownie.')
    } finally {
      setSubmitting(false)
    }
  }

  const total = state.upvotes + state.downvotes

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-gray-50 border border-gray-200 rounded-2xl px-4 sm:px-6 py-5">
        <div>
          <p className="text-sm font-semibold text-gray-900">Czy artykuł Ci pomógł?</p>
          <p className="text-xs text-gray-500 mt-1">
            Twoja reakcja podpowie innym, czy treść jest użyteczna.
          </p>
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          {!error && total > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {total} {total === 1 ? 'osoba oceniła' : 'osoby oceniły'} ten wpis.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <ReactionButton
            label="Pomogło"
            icon={ThumbsUp}
            count={state.upvotes}
            active={state.userVote === 'up'}
            loading={submitting && state.userVote === 'up' && !error}
            onClick={() => handleVote('up')}
            disabled={loading || submitting}
            tone="positive"
          />
          <ReactionButton
            label="Nie pomogło"
            icon={ThumbsDown}
            count={state.downvotes}
            active={state.userVote === 'down'}
            loading={submitting && state.userVote === 'down' && !error}
            onClick={() => handleVote('down')}
            disabled={loading || submitting}
            tone="negative"
          />
        </div>
      </div>
    </div>
  )
}

function getOptimisticState(state: ReactionState, vote: ReactionVote): ReactionState {
  const { upvotes, downvotes, userVote } = state

  if (userVote === vote) {
    return state
  }

  if (vote === 'up') {
    const newUpvotes = upvotes + 1
    const newDownvotes = userVote === 'down' ? Math.max(0, downvotes - 1) : downvotes
    return { upvotes: newUpvotes, downvotes: newDownvotes, userVote: 'up' }
  } else {
    const newDownvotes = downvotes + 1
    const newUpvotes = userVote === 'up' ? Math.max(0, upvotes - 1) : upvotes
    return { upvotes: newUpvotes, downvotes: newDownvotes, userVote: 'down' }
  }
}

type ReactionButtonProps = {
  label: string
  icon: typeof ThumbsUp
  count: number
  active: boolean
  loading: boolean
  disabled: boolean
  onClick: () => void
  tone: 'positive' | 'negative'
}

function ReactionButton({
  label,
  icon: Icon,
  count,
  active,
  loading,
  disabled,
  onClick,
  tone,
}: ReactionButtonProps) {
  const base =
    tone === 'positive'
      ? 'bg-green-50 text-green-700 border-green-200 hover:border-green-300 hover:bg-green-100'
      : 'bg-red-50 text-red-700 border-red-200 hover:border-red-300 hover:bg-red-100'

  const activeStyles =
    tone === 'positive'
      ? 'bg-green-100 border-green-300 ring-2 ring-green-200'
      : 'bg-red-100 border-red-300 ring-2 ring-red-200'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
        active ? activeStyles : base
      } ${disabled ? 'opacity-80 cursor-not-allowed' : 'shadow-sm'}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
      <span>{label}</span>
      <span className="text-xs px-2 py-1 bg-white/70 rounded-full text-gray-700 border border-white/60">
        {count}
      </span>
    </button>
  )
}
