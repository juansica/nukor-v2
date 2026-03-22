import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DEFAULT_WORKSPACE_ID = '00000000-0000-0000-0000-000000000001'

export async function GET() {
  const { data: areas, error } = await supabaseAdmin
    .from('areas')
    .select('*, collections(id), entries(id)')
    .eq('workspace_id', DEFAULT_WORKSPACE_ID)
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(areas)
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { name, description, color } = await request.json()

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 })
    }

    const { data: area, error } = await supabaseAdmin
      .from('areas')
      .insert({
        name,
        description: description ?? null,
        color: color ?? '#4F46E5',
        workspace_id: DEFAULT_WORKSPACE_ID,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Area insert error:', error)
      return new Response(JSON.stringify({ error: error.message, detail: error }), { status: 500 })
    }

    return new Response(JSON.stringify({ area }), { status: 201 })

  } catch (err: any) {
    console.error('Areas route error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
