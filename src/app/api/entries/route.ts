export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { title, content, workspace_id, area_id, collection_id } = await request.json()

    if (!title || !content) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    const entry = await prisma.entry.create({
      data: {
        title,
        content,
        workspace_id: workspace_id || '00000000-0000-0000-0000-000000000001',
        area_id: area_id ?? null,
        collection_id: collection_id ?? null,
        created_by: user.id,
        is_published: true,
      }
    })

    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: `${title}\n${content}`,
      })

      const embedding = embeddingResponse.data[0].embedding

      await supabase
        .from('entries')
        .update({ embedding: JSON.stringify(embedding) })
        .eq('id', entry.id)
    } catch (embeddingError) {
      console.error('Embedding generation failed:', embeddingError)
      // Don't fail the request — entry is saved, just won't be searchable yet
    }

    return new Response(JSON.stringify({ entry }), { status: 201 })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
