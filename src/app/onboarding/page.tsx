'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Building2,
  User,
  Users,
  TrendingUp,
  Megaphone,
  Truck,
  Code2,
  DollarSign,
  Settings,
  MessageSquare,
  Check,
  Sparkles,
  BarChart3,
  Package,
} from 'lucide-react'

type UsageType = 'empresa' | 'personal'

interface AreaOption {
  name: string
  color: string
  icon: React.ElementType
}

const AREA_OPTIONS: AreaOption[] = [
  { name: 'Recursos Humanos', color: '#8B5CF6', icon: Users },
  { name: 'Ventas', color: '#3B82F6', icon: TrendingUp },
  { name: 'Marketing', color: '#EC4899', icon: Megaphone },
  { name: 'Logística', color: '#F97316', icon: Truck },
  { name: 'Tecnología', color: '#14B8A6', icon: Code2 },
  { name: 'Finanzas', color: '#10B981', icon: DollarSign },
  { name: 'Operaciones', color: '#F59E0B', icon: Settings },
  { name: 'Atención al Cliente', color: '#6366F1', icon: MessageSquare },
  { name: 'Producto', color: '#F43F5E', icon: Package },
  { name: 'Reportes', color: '#64748B', icon: BarChart3 },
]

const stepVariants = {
  enter: { opacity: 0, x: 32 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [usageType, setUsageType] = useState<UsageType | null>(null)
  const [workspaceName, setWorkspaceName] = useState('')
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdAreasCount, setCreatedAreasCount] = useState(0)

  // empresa: steps 1–4 then success; personal: steps 1–3 then success
  const totalSteps = usageType === 'empresa' ? 4 : 3
  const isSuccess = step > totalSteps

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

  const toggleArea = (name: string) => {
    setSelectedAreas((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const handleFinish = async () => {
    if (!workspaceName.trim() || submitting) return
    setSubmitting(true)
    setError(null)

    const areasPayload = AREA_OPTIONS.filter((a) => selectedAreas.has(a.name)).map((a) => ({
      name: a.name,
      color: a.color,
    }))

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          workspace_name: workspaceName.trim(),
          initial_areas: areasPayload,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Algo salió mal. Inténtalo de nuevo.')
        setSubmitting(false)
        return
      }

      const data = await res.json()
      setCreatedAreasCount(data.areas_created ?? 0)
      setStep(totalSteps + 1) // success screen
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
      setSubmitting(false)
    }
  }

  const firstName = fullName.split(' ')[0]

  // Progress bar segments: only shown during content steps
  const progressSegments = usageType ? totalSteps : 3

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-xl">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black bg-indigo-600 text-white">
            N
          </span>
          <span className="font-heading font-bold text-xl text-gray-950">Nukor</span>
        </div>

        {/* Progress indicator */}
        {!isSuccess && (
          <div className="flex items-center gap-1.5 mb-8">
            {Array.from({ length: progressSegments }).map((_, i) => {
              const segStep = i + 1
              const isActive = step === segStep
              const isDone = step > segStep
              return (
                <div key={i} className="flex items-center gap-1.5 flex-1">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      isDone
                        ? 'bg-indigo-600'
                        : isActive
                        ? 'bg-indigo-400'
                        : 'bg-gray-200'
                    }`}
                  />
                </div>
              )
            })}
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Name ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                className="p-8"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">
                  Paso 1 — Cuéntanos sobre ti
                </p>
                <h1 className="font-heading text-2xl font-bold text-gray-950 mb-1">
                  ¡Bienvenido a Nukor!
                </h1>
                <p className="text-sm text-gray-500 mb-7">
                  El asistente de conocimiento de tu empresa. Empecemos con tu nombre.
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
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none bg-white border border-gray-200 text-gray-950 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all duration-200 mb-7"
                />

                <button
                  onClick={handleStep1}
                  disabled={!fullName.trim()}
                  className="btn-primary w-full py-3 text-sm font-semibold gap-2 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl"
                >
                  Continuar <ArrowRight size={15} />
                </button>
              </motion.div>
            )}

            {/* ── Step 2: Usage type ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                className="p-8"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">
                  Paso 2 — Tipo de uso
                </p>
                <h1 className="font-heading text-2xl font-bold text-gray-950 mb-1">
                  ¿Cómo usarás Nukor, {firstName}?
                </h1>
                <p className="text-sm text-gray-500 mb-7">
                  Esto nos ayuda a preparar tu espacio ideal desde el primer día.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleStep2('empresa')}
                    className="group flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-colors">
                      <Building2 size={22} className="text-indigo-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-950">Para mi empresa</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">Equipo, áreas y procesos</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleStep2('personal')}
                    className="group flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-colors">
                      <User size={22} className="text-indigo-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-950">Uso personal</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">Solo yo por ahora</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Workspace / company name ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                className="p-8"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">
                  Paso 3 — Tu workspace
                </p>
                <h1 className="font-heading text-2xl font-bold text-gray-950 mb-1">
                  {usageType === 'empresa'
                    ? '¿Cómo se llama tu empresa?'
                    : 'Dale un nombre a tu workspace'}
                </h1>
                <p className="text-sm text-gray-500 mb-7">
                  {usageType === 'empresa'
                    ? 'Usa el nombre con el que todos la conocen.'
                    : 'Puedes cambiarlo en cualquier momento.'}
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (usageType === 'empresa') {
                        if (workspaceName.trim()) setStep(4)
                      } else {
                        handleFinish()
                      }
                    }
                  }}
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none bg-white border border-gray-200 text-gray-950 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all duration-200 mb-7"
                />

                {error && (
                  <div className="rounded-lg px-4 py-3 mb-5 text-sm bg-red-50 border border-red-100 text-red-600">
                    {error}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!workspaceName.trim()) return
                    if (usageType === 'empresa') setStep(4)
                    else handleFinish()
                  }}
                  disabled={!workspaceName.trim() || submitting}
                  className="btn-primary w-full py-3 text-sm font-semibold gap-2 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl"
                >
                  {submitting ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      {usageType === 'empresa' ? 'Continuar' : 'Crear workspace'}
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* ── Step 4: Seed areas (empresa only) ── */}
            {step === 4 && usageType === 'empresa' && (
              <motion.div
                key="step4"
                className="p-8"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">
                  Paso 4 — Estructura inicial
                </p>
                <h1 className="font-heading text-2xl font-bold text-gray-950 mb-1">
                  ¿Qué áreas tiene {workspaceName}?
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                  Selecciona las que apliquen — las crearemos automáticamente. Puedes agregar más después.
                </p>

                <div className="grid grid-cols-2 gap-2.5 mb-7">
                  {AREA_OPTIONS.map((area) => {
                    const Icon = area.icon
                    const selected = selectedAreas.has(area.name)
                    return (
                      <button
                        key={area.name}
                        onClick={() => toggleArea(area.name)}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                          selected
                            ? 'border-indigo-400 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: area.color + '20' }}
                        >
                          <Icon size={15} style={{ color: area.color }} />
                        </span>
                        <span className="text-sm font-medium text-gray-900 leading-tight">
                          {area.name}
                        </span>
                        {selected && (
                          <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                            <Check size={10} className="text-white" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {error && (
                  <div className="rounded-lg px-4 py-3 mb-5 text-sm bg-red-50 border border-red-100 text-red-600">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedAreas(new Set())
                      handleFinish()
                    }}
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors disabled:opacity-40"
                  >
                    Saltar por ahora
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={submitting}
                    className="btn-primary flex-[2] py-3 text-sm font-semibold gap-2 disabled:opacity-40 rounded-xl"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        Crear workspace
                        {selectedAreas.size > 0 && (
                          <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-xs font-bold">
                            {selectedAreas.size}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Success screen ── */}
            {isSuccess && (
              <motion.div
                key="success"
                className="p-8 flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Animated checkmark */}
                <motion.div
                  className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 12 }}
                >
                  <Check size={36} className="text-emerald-600" strokeWidth={2.5} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h1 className="font-heading text-2xl font-bold text-gray-950 mb-2">
                    ¡{firstName}, tu workspace está listo!
                  </h1>
                  <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                    <span className="font-semibold text-gray-700">{workspaceName}</span> está configurado y listo para guardar el conocimiento de tu equipo.
                  </p>

                  {/* Summary pills */}
                  <div className="flex flex-wrap gap-2 justify-center mb-8">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <Sparkles size={11} />
                      Workspace creado
                    </span>
                    {createdAreasCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Check size={11} />
                        {createdAreasCount} {createdAreasCount === 1 ? 'área creada' : 'áreas creadas'}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                      <Sparkles size={11} />
                      Asistente IA activado
                    </span>
                  </div>

                  <button
                    onClick={() => router.push('/dashboard')}
                    className="btn-primary w-full py-3 text-sm font-semibold gap-2 rounded-xl"
                  >
                    Ir al dashboard <ArrowRight size={15} />
                  </button>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Back link */}
        {step > 1 && !isSuccess && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="mt-5 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Volver al paso anterior
          </button>
        )}

      </div>
    </div>
  )
}
