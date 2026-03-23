'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, Building2, User } from 'lucide-react'

type UsageType = 'empresa' | 'personal'

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [usageType, setUsageType] = useState<UsageType | null>(null)
  const [workspaceName, setWorkspaceName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStep1 = () => {
    if (!fullName.trim()) return
    setStep(2)
  }

  const handleStep2 = (type: UsageType) => {
    setUsageType(type)
    if (type === 'personal') {
      setWorkspaceName(`Workspace de ${fullName.split(' ')[0]}`)
    } else {
      setWorkspaceName('')
    }
    setStep(3)
  }

  const handleFinish = async () => {
    if (!workspaceName.trim() || submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          workspace_name: workspaceName.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Algo salió mal. Inténtalo de nuevo.')
        setSubmitting(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-black bg-indigo-600 text-white">
            N
          </span>
          <span className="font-heading font-bold text-xl text-gray-950">Nukor</span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                  Paso 1 de 3
                </p>
                <h1 className="font-heading text-2xl font-bold text-gray-950 mb-1">
                  ¡Bienvenido a Nukor!
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                  Cuéntanos cómo te llamas para personalizar tu experiencia.
                </p>

                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  Tu nombre completo
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="Ej: María García"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStep1()}
                  className="w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-slate-50 hover:bg-white focus:bg-white text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all mb-8"
                />

                <motion.button
                  onClick={handleStep1}
                  disabled={!fullName.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-200"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continuar <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                  Paso 2 de 3
                </p>
                <h1 className="font-heading text-2xl font-bold text-gray-950 mb-1">
                  ¿Cómo usarás Nukor?
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                  Esto nos ayuda a preparar tu espacio de trabajo ideal.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => handleStep2('empresa')}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Building2 size={28} className="text-indigo-600" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-950">Para mi empresa</p>
                      <p className="text-xs text-gray-500 mt-0.5">Equipo y organización</p>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleStep2('personal')}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <User size={28} className="text-indigo-600" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-950">Uso personal</p>
                      <p className="text-xs text-gray-500 mt-0.5">Solo yo por ahora</p>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                  Paso 3 de 3
                </p>
                <h1 className="font-heading text-2xl font-bold text-gray-950 mb-1">
                  {usageType === 'empresa'
                    ? '¿Cómo se llama tu empresa?'
                    : 'Dale un nombre a tu workspace'}
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                  {usageType === 'empresa'
                    ? 'Usa el nombre oficial o como lo conocen todos.'
                    : 'Puedes cambiarlo cuando quieras.'}
                </p>

                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  {usageType === 'empresa' ? 'Nombre de la empresa' : 'Nombre del workspace'}
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder={usageType === 'empresa' ? 'Ej: Acme Corp' : 'Ej: Mi conocimiento'}
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFinish()}
                  className="w-full rounded-xl px-4 py-3 text-sm border border-gray-200 bg-slate-50 hover:bg-white focus:bg-white text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all mb-6"
                />

                {error && (
                  <div className="rounded-lg px-4 py-3 mb-6 text-sm bg-red-50 border border-red-100 text-red-600">
                    {error}
                  </div>
                )}

                <motion.button
                  onClick={handleFinish}
                  disabled={!workspaceName.trim() || submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-200"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      ¡Empezar! <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
