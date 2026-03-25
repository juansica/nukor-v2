'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface SignOutButtonProps {
  className?: string
  style?: React.CSSProperties
}

const SignOutButton = ({ className }: SignOutButtonProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in')
  }

  return (
    <button onClick={handleSignOut} disabled={loading} className={className}>
      {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </button>
  )
}

export default SignOutButton
