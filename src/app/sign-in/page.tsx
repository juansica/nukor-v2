'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignInPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [checking, setChecking] = useState(true)

  // Redirect already authenticated users
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard')
      else setChecking(false)
    })
  }, [])

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-9 h-9 rounded-full border-2 border-transparent border-t-indigo-600 border-r-indigo-100 animate-spin" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)

    if (error) {
      if (
        error.message.includes('Invalid login credentials') ||
        error.message.includes('invalid_credentials')
      ) {
        setError('Correo o contraseña incorrectos. Inténtalo de nuevo.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Confirma tu correo electrónico antes de iniciar sesión.')
      } else {
        setError(error.message)
      }
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading font-bold text-xl text-gray-950"
          >
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black bg-indigo-600 text-white">
              N
            </span>
            Nukor
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
          <h1 className="font-heading text-2xl font-bold mb-1 text-gray-950">
            Bienvenido de vuelta
          </h1>
          <p className="text-sm mb-6 text-gray-500">
            Accede a tu espacio de conocimiento.
          </p>

          {error && (
            <div className="rounded-lg px-4 py-3 mb-5 text-sm bg-red-50 border border-red-100 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none bg-white border border-gray-200 text-gray-950 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none bg-white border border-gray-200 text-gray-950 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link
              href="/sign-up"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
