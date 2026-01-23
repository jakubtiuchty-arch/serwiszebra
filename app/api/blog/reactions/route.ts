import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase environment variables are missing for blog reactions API')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const COOKIE_NAME = 'blog_reaction_fp'

type ReactionVote = 'up' | 'down'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Brak parametru slug' }, { status: 400 })
    }

    const fingerprint = req.cookies.get(COOKIE_NAME)?.value

    const { data: reactionRow, error: reactionError } = await supabase
      .from('blog_reactions')
      .select('upvotes, downvotes')
      .eq('slug', slug)
      .maybeSingle()

    if (reactionError) {
      return NextResponse.json({ error: reactionError.message }, { status: 500 })
    }

    const counts = {
      upvotes: reactionRow?.upvotes ?? 0,
      downvotes: reactionRow?.downvotes ?? 0,
    }

    let userVote: ReactionVote | null = null

    if (fingerprint) {
      const { data: voteRow, error: voteError } = await supabase
        .from('blog_reaction_votes')
        .select('vote')
        .eq('slug', slug)
        .eq('fingerprint', fingerprint)
        .maybeSingle()

      if (voteError && voteError.code !== 'PGRST116') {
        return NextResponse.json({ error: voteError.message }, { status: 500 })
      }

      userVote = (voteRow?.vote as ReactionVote | undefined) ?? null
    }

    return NextResponse.json({ ...counts, userVote })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { slug, vote }: { slug?: string; vote?: ReactionVote } = await req.json()

    if (!slug || (vote !== 'up' && vote !== 'down')) {
      return NextResponse.json(
        { error: 'Wymagane pola: slug i vote (up|down)' },
        { status: 400 }
      )
    }

    const existingFingerprint = req.cookies.get(COOKIE_NAME)?.value
    const fingerprint = existingFingerprint || randomUUID()
    const now = new Date().toISOString()

    const { data: reactionRow, error: reactionError } = await supabase
      .from('blog_reactions')
      .select('upvotes, downvotes')
      .eq('slug', slug)
      .maybeSingle()

    if (reactionError) {
      return NextResponse.json({ error: reactionError.message }, { status: 500 })
    }

    const currentUpvotes = reactionRow?.upvotes ?? 0
    const currentDownvotes = reactionRow?.downvotes ?? 0

    const { data: existingVoteRow, error: existingVoteError } = await supabase
      .from('blog_reaction_votes')
      .select('vote')
      .eq('slug', slug)
      .eq('fingerprint', fingerprint)
      .maybeSingle()

    if (existingVoteError && existingVoteError.code !== 'PGRST116') {
      return NextResponse.json({ error: existingVoteError.message }, { status: 500 })
    }

    if (existingVoteRow?.vote === vote) {
      const response = NextResponse.json({
        upvotes: currentUpvotes,
        downvotes: currentDownvotes,
        userVote: vote,
      })

      if (!existingFingerprint) {
        response.cookies.set(COOKIE_NAME, fingerprint, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 365, // 1 rok
          path: '/',
        })
      }

      return response
    }

    let upvoteDelta = vote === 'up' ? 1 : 0
    let downvoteDelta = vote === 'down' ? 1 : 0

    if (existingVoteRow?.vote === 'up' && vote === 'down') {
      upvoteDelta = -1
      downvoteDelta = 1
    } else if (existingVoteRow?.vote === 'down' && vote === 'up') {
      upvoteDelta = 1
      downvoteDelta = -1
    }

    const newUpvotes = Math.max(0, currentUpvotes + upvoteDelta)
    const newDownvotes = Math.max(0, currentDownvotes + downvoteDelta)

    const { error: upsertError } = await supabase
      .from('blog_reactions')
      .upsert({
        slug,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        updated_at: now,
      })

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }

    if (existingVoteRow) {
      const { error: updateVoteError } = await supabase
        .from('blog_reaction_votes')
        .update({ vote, updated_at: now })
        .eq('slug', slug)
        .eq('fingerprint', fingerprint)

      if (updateVoteError) {
        return NextResponse.json({ error: updateVoteError.message }, { status: 500 })
      }
    } else {
      const { error: insertVoteError } = await supabase
        .from('blog_reaction_votes')
        .insert({
          slug,
          fingerprint,
          vote,
          created_at: now,
          updated_at: now,
        })

      if (insertVoteError) {
        return NextResponse.json({ error: insertVoteError.message }, { status: 500 })
      }
    }

    const response = NextResponse.json({
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      userVote: vote,
    })

    if (!existingFingerprint) {
      response.cookies.set(COOKIE_NAME, fingerprint, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      })
    }

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
