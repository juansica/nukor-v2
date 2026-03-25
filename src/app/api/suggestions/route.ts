import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const DEFAULT_SUGGESTIONS = [
  '¿Cuál es nuestro proceso de onboarding?',
  '¿Cómo manejamos las devoluciones?',
  '¿Cuáles son nuestras políticas de vacaciones?',
]

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response(JSON.stringify({ suggestions: DEFAULT_SUGGESTIONS }), { status: 200 })

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspace_id')
    if (!workspaceId) return new Response(JSON.stringify({ suggestions: DEFAULT_SUGGESTIONS }), { status: 200 })

    // Fetch the last 20 conversation titles for this user in this workspace
    const { data: conversations } = await supabaseAdmin
      .from('conversations')
      .select('title')
      .eq('user_id', user.id)
      .eq('workspace_id', workspaceId)
      .not('title', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(20)

    const titles = (conversations ?? [])
      .map((c: { title: string }) => c.title)
      .filter(Boolean)

    if (titles.length < 3) {
      return new Response(JSON.stringify({ suggestions: DEFAULT_SUGGESTIONS }), { status: 200 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente que genera sugerencias de preguntas cortas y concretas para un chat interno de empresa. Las sugerencias deben ser relevantes para los temas que el usuario ha consultado anteriormente. Responde SOLO con un JSON array de exactamente 3 strings, sin explicaciones adicionales. Las preguntas deben estar en español, ser concisas (máximo 60 caracteres cada una) y variadas entre sí.',
        },
        {
          role: 'user',
          content: `Basándote en estos temas de conversaciones recientes del usuario, genera 3 preguntas de sugerencia relevantes y distintas entre sí:\n\n${titles.slice(0, 15).map((t, i) => `${i + 1}. ${t}`).join('\n')}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const raw = completion.choices[0]?.message?.content?.trim() ?? ''
    const parsed = JSON.parse(raw.replace(/^```json\n?/, '').replace(/\n?```$/, ''))

    if (Array.isArray(parsed) && parsed.length === 3 && parsed.every(s => typeof s === 'string')) {
      return new Response(JSON.stringify({ suggestions: parsed }), { status: 200 })
    }

    return new Response(JSON.stringify({ suggestions: DEFAULT_SUGGESTIONS }), { status: 200 })
  } catch {
    return new Response(JSON.stringify({ suggestions: DEFAULT_SUGGESTIONS }), { status: 200 })
  }
}
