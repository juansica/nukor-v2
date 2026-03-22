'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setSubmitting(false)

    if (error) {
      if (
        error.message.includes('already registered') ||
        error.message.includes('User already registered')
      ) {
        setError('Este correo ya está registrado. ¿Quieres iniciar sesión?')
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
            Crea tu cuenta
          </h1>
          <p className="text-sm mb-6 text-gray-500">
            Empieza gratis, sin tarjeta de crédito.
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none bg-white border border-gray-200 text-gray-950 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirm-password"
                className="text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Confirmar contraseña
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none bg-white border border-gray-200 text-gray-950 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/sign-in"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
