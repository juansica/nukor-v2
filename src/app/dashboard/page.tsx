import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import DashboardClient from '@/components/dashboard/DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const profile = await prisma.profile.findUnique({ where: { id: user.id } })
  if (!profile?.last_workspace_id) {
    redirect('/onboarding')
  }

  const userName =
    profile.full_name ||
    (user.user_metadata?.full_name as string) ||
    user.email?.split('@')[0] ||
    'Usuario'

  const userEmail = user.email ?? ''

  return (
    <DashboardClient
      userId={user.id}
      userName={userName}
      userEmail={userEmail}
    />
  )
}
