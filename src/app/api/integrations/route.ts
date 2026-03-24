import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { ragie } from '@/lib/ragie'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getUserWorkspaceId(userId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('last_workspace_id')
    .eq('id', userId)
    .maybeSingle()
  return data?.last_workspace_id ?? null
}

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workspaceId = await getUserWorkspaceId(user.id)
    if (!workspaceId) {
      return Response.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const iterator = await ragie.connections.list({
      partition: `workspace-${workspaceId}`,
    })

    const connections: any[] = []
    for await (const page of iterator) {
      connections.push(...page.result.connections)
    }

    // Fetch stats for each connection in parallel
    const statsResults = await Promise.allSettled(
      connections.map((c: any) => ragie.connections.getStats({ connectionId: c.id }))
    )

    const enriched = connections.map((c: any, i: number) => {
      const stats = statsResults[i].status === 'fulfilled' ? statsResults[i].value : null
      return {
        ...c,
        documentCount: stats?.documentCount ?? null,
        pageCount: stats?.pageCount ?? null,
      }
    })

    return Response.json({ connections: enriched })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { connectionId } = await request.json()
    if (!connectionId) {
      return Response.json({ error: 'Missing connectionId' }, { status: 400 })
    }

    const workspaceId = await getUserWorkspaceId(user.id)
    if (!workspaceId) {
      return Response.json({ error: 'Workspace not found' }, { status: 404 })
    }

    // Verify this connection belongs to the user's workspace before deleting
    let conn
    try {
      conn = await ragie.connections.get({ connectionId })
    } catch {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    if (conn.partition !== `workspace-${workspaceId}`) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    await ragie.connections.delete({
      connectionId,
      deleteConnectionPayload: { keepFiles: false },
    })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
