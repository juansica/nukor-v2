import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET — fetch all messages for a specific conversation (auth + ownership required)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { id } = await params

    // Verify the conversation belongs to this user
    const { data: conversation } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!conversation) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
    }

    const { data: messages, error } = await supabaseAdmin
      .from('messages')
      .select('id, role, content, created_at')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })

    if (error) return new Response(JSON.stringify({ error: 'Failed to fetch messages' }), { status: 500 })
    return new Response(JSON.stringify({ messages }), { status: 200 })
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
