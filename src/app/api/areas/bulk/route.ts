export const dynamic = 'force-dynamic'

import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, ids } = await req.json() as { action: 'delete'; ids: string[] }
    if (!action || !Array.isArray(ids) || ids.length === 0) {
      return Response.json({ error: 'action and ids are required' }, { status: 400 })
    }

    // Verify ownership
    const { data: owned, error: ownerErr } = await supabaseAdmin
      .from('areas')
      .select('id')
      .in('id', ids)
      .eq('created_by', user.id)

    if (ownerErr || !owned || owned.length !== ids.length) {
      return Response.json({ error: 'One or more areas not found' }, { status: 404 })
    }

    if (action === 'delete') {
      // Find all collections in these areas
      const { data: colls } = await supabaseAdmin
        .from('collections')
        .select('id')
        .in('area_id', ids)

      const collIds = (colls ?? []).map((c: { id: string }) => c.id)

      // Delete entries in those collections
      if (collIds.length > 0) {
        await supabaseAdmin.from('entries').delete().in('collection_id', collIds)
      }

      // Delete entries directly on the areas (no collection)
      await supabaseAdmin.from('entries').delete().in('area_id', ids)

      // Delete collections
      if (collIds.length > 0) {
        await supabaseAdmin.from('collections').delete().in('id', collIds)
      }

      // Delete areas
      const { error } = await supabaseAdmin.from('areas').delete().in('id', ids)
      if (error) return Response.json({ error: 'Failed to delete areas' }, { status: 500 })

      return Response.json({ success: true, deleted: ids.length })
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    console.error('[areas/bulk]', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
