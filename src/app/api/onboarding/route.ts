export const dynamic = 'force-dynamic'

import { createClient as createServerClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 50) || 'workspace'
  )
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { full_name, workspace_name } = await req.json()
    if (!full_name?.trim() || !workspace_name?.trim()) {
      return new Response(JSON.stringify({ error: 'full_name and workspace_name are required' }), { status: 400 })
    }

    // Generate a unique slug
    const baseSlug = slugify(workspace_name.trim())
    let slug = baseSlug
    for (let i = 1; i <= 10; i++) {
      const existing = await prisma.workspace.findUnique({ where: { slug } })
      if (!existing) break
      slug = `${baseSlug}-${i}`
    }

    // Create workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: workspace_name.trim(),
        slug,
        created_by: user.id,
      },
    })

    // Add creator as admin member
    await prisma.workspaceMember.create({
      data: {
        workspace_id: workspace.id,
        user_id: user.id,
        role: 'admin',
      },
    })

    // Upsert profile with name and workspace
    await prisma.profile.upsert({
      where: { id: user.id },
      update: { full_name: full_name.trim(), last_workspace_id: workspace.id },
      create: {
        id: user.id,
        email: user.email!,
        full_name: full_name.trim(),
        last_workspace_id: workspace.id,
      },
    })

    return new Response(JSON.stringify({ workspace }), { status: 200 })
  } catch (err: any) {
    console.error('Onboarding error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
