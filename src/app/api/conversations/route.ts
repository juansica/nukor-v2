import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET — fetch all conversations for the current user
export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

    const { data: conversations } = await supabaseAdmin
      .from('conversations')
      .select('id, title, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    return new Response(JSON.stringify({ conversations }), { status: 200 })
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

// DELETE — delete a conversation and its messages (auth + ownership required)
export async function DELETE(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { id } = await request.json()
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing conversation id' }), { status: 400 })
    }

    // Verify ownership before deleting
    const { data: conversation } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!conversation) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
    }

    await supabaseAdmin.from('messages').delete().eq('conversation_id', id)
    await supabaseAdmin.from('conversations').delete().eq('id', id).eq('user_id', user.id)

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
