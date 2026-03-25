import React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion'

type Niche = 'rrhh' | 'logistica' | 'ventas'

const niches: Record<Niche, { label: string; icon: string; messages: { role: 'user' | 'ai'; avatar: string; name: string; text: string }[] }> = {
  rrhh: {
    label: 'Recursos Humanos',
    icon: '👥',
    messages: [
      { role: 'user', avatar: 'MC', name: 'María C.', text: '¿Cuál es el proceso para solicitar vacaciones?' },
      { role: 'ai', avatar: 'N', name: 'Nukor', text: 'Para solicitar vacaciones:\n\n1. Ingresa al portal de RRHH → "Solicitudes"\n2. Selecciona las fechas y tu backup\n3. Envía para aprobación de tu líder directo\n\n📎 Fuente: Equipo de People Ops · Actualizado hace 3 días' },
      { role: 'user', avatar: 'MC', name: 'María C.', text: 'Ahora también se necesita aprobación de finanzas si son más de 10 días.' },
      { role: 'ai', avatar: 'N', name: 'Nukor', text: '✅ Listo. Actualicé la política de vacaciones con ese nuevo requisito. Todo el equipo podrá verlo.' },
    ],
  },
  logistica: {
    label: 'Logística',
    icon: '📦',
    messages: [
      { role: 'user', avatar: 'JR', name: 'Jorge R.', text: '¿Cuál es el procedimiento cuando un envío llega dañado al cliente?' },
      { role: 'ai', avatar: 'N', name: 'Nukor', text: 'Protocolo de envío dañado:\n\n1. Registrar el reclamo con fotos del daño\n2. Notificar al transportista dentro de 24 horas\n3. Ofrecer reenvío o reembolso al cliente\n\n📎 Fuente: Equipo de Operaciones · Actualizado hace 5 días' },
      { role: 'user', avatar: 'JR', name: 'Jorge R.', text: 'Agregamos un nuevo transportista: FastCargo. Cubre zona norte desde esta semana.' },
      { role: 'ai', avatar: 'N', name: 'Nukor', text: '✅ Registrado. Agregué FastCargo como transportista activo para zona norte. El equipo de despacho ya puede verlo.' },
    ],
  },
  ventas: {
    label: 'Ventas',
    icon: '💼',
    messages: [
      { role: 'user', avatar: 'AS', name: 'Ana S.', text: '¿Qué descuento máximo puedo ofrecer a un cliente enterprise?' },
      { role: 'ai', avatar: 'N', name: 'Nukor', text: 'Política de descuentos enterprise:\n\n• Hasta 15% → aprobación del líder de ventas\n• 15–25% → requiere aprobación de dirección comercial\n• Más de 25% → caso especial con VP de Revenue\n\n📎 Fuente: Equipo Comercial · Actualizado hace 2 días' },
      { role: 'user', avatar: 'AS', name: 'Ana S.', text: 'El nuevo pricing del plan Growth incluye soporte prioritario. Hay que actualizar el pitch deck.' },
      { role: 'ai', avatar: 'N', name: 'Nukor', text: '✅ Actualizado. Agregué el soporte prioritario al plan Growth en la base de conocimiento. Todo el equipo comercial puede verlo.' },
    ],
  },
}

// Single message bubble that fades + slides in
function Message({ msg, delay, fps }: {
  msg: typeof niches.rrhh.messages[0]
  delay: number
  fps: number
}) {
  const frame = useCurrentFrame()
  const anim = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 20 })
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  if (frame < delay) return null

  return (
    <div style={{
      display: 'flex', gap: 16, opacity,
      transform: `translateY(${interpolate(anim, [0, 1], [16, 0])}px)`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700,
        background: msg.role === 'ai' ? '#4f46e5' : '#f1f5f9',
        color: msg.role === 'ai' ? '#fff' : '#0f172a',
        border: msg.role === 'ai' ? 'none' : '1px solid #e2e8f0',
      }}>
        {msg.avatar}
      </div>
      <div style={{ flex: 1, paddingTop: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', letterSpacing: -0.3 }}>{msg.name}</div>
        <div style={{
          marginTop: 6, fontSize: 14, color: '#475569', lineHeight: 1.6, fontWeight: 500,
          whiteSpace: 'pre-line',
        }}>
          {msg.text}
        </div>
      </div>
    </div>
  )
}

// Tab button
function TabButton({ label, icon, isActive }: { label: string; icon: string; isActive: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 20px', borderRadius: 999, fontSize: 13, fontWeight: 600,
      background: isActive ? '#4f46e5' : '#fff',
      color: isActive ? '#fff' : '#475569',
      border: isActive ? 'none' : '1px solid #e2e8f0',
      boxShadow: isActive ? '0 4px 12px rgba(79,70,229,0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span>{label}</span>
    </div>
  )
}

// Chat window for one niche
function ChatWindow({ niche, startFrame }: { niche: Niche; startFrame: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const config = niches[niche]
  const localFrame = frame - startFrame

  // Window slide-in
  const windowAnim = spring({ frame: localFrame, fps, config: { damping: 18, stiffness: 100 }, durationInFrames: 25 })
  const windowOpacity = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Show each message 40 frames apart
  const msgDelays = config.messages.map((_, i) => 20 + i * 50)

  return (
    <div style={{
      opacity: windowOpacity,
      transform: `scale(${interpolate(windowAnim, [0, 1], [0.96, 1])}) translateY(${interpolate(windowAnim, [0, 1], [20, 0])}px)`,
    }}>
      {/* Niche tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
        {(Object.keys(niches) as Niche[]).map((key) => (
          <TabButton key={key} label={niches[key].label} icon={niches[key].icon} isActive={key === niche} />
        ))}
      </div>

      {/* Chat card */}
      <div style={{
        background: '#fff', borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0',
      }}>
        {/* Window chrome */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 24px', borderBottom: '1px solid #f1f5f9',
          background: 'rgba(248,250,252,0.8)',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['#f87171', '#fbbf24', '#34d399'].map((c) => (
              <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span style={{ marginLeft: 12, fontSize: 12, color: '#64748b', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
            Nukor Chat · {config.label}
          </span>
        </div>

        {/* Messages */}
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, minHeight: 300 }}>
          {config.messages.map((msg, i) => (
            <Message key={i} msg={msg} delay={msgDelays[i]} fps={fps} />
          ))}
        </div>

        {/* Input bar */}
        <div style={{ padding: '16px 32px 28px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            borderRadius: 999, padding: '12px 20px',
            border: '1px solid #e2e8f0', background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}>
            <span style={{ fontSize: 14, color: '#94a3b8', flex: 1, fontWeight: 500 }}>
              Pregunta algo o comparte conocimiento...
            </span>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Frames per niche section (intro + messages + hold)
const SECTION_FRAMES = 220

// Main composition
export const NukorDemo: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Intro: badge + headline fade in
  const badgeAnim = spring({ frame, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 20 })
  const titleAnim = spring({ frame: frame - 10, fps, config: { damping: 20, stiffness: 100 }, durationInFrames: 25 })
  const subtitleAnim = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 100 }, durationInFrames: 25 })

  const niches: Niche[] = ['rrhh', 'logistica', 'ventas']
  const introFrames = 60

  return (
    <AbsoluteFill style={{
      background: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
      padding: '48px 80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Header text — fades out after intro */}
      <div style={{
        textAlign: 'center',
        marginBottom: 32,
        opacity: interpolate(frame, [0, 20, introFrames - 10, introFrames], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        transform: `translateY(${interpolate(badgeAnim, [0, 1], [12, 0])}px)`,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 700,
          letterSpacing: 1, textTransform: 'uppercase',
          background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe',
          marginBottom: 20,
        }}>
          ✨ Base de conocimiento con IA
        </div>
        <h1 style={{
          fontSize: 40, fontWeight: 800, color: '#0f172a', lineHeight: 1.1,
          letterSpacing: -1.5, margin: 0,
          opacity: interpolate(frame - 10, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `translateY(${interpolate(titleAnim, [0, 1], [12, 0])}px)`,
        }}>
          El cerebro colectivo de tu empresa
        </h1>
        <p style={{
          marginTop: 12, fontSize: 17, color: '#64748b', fontWeight: 500,
          opacity: interpolate(frame - 20, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `translateY(${interpolate(subtitleAnim, [0, 1], [10, 0])}px)`,
        }}>
          Solo conversa — la IA hace el resto.
        </p>
      </div>

      {/* Chat sections */}
      <div style={{ width: '100%', maxWidth: 720 }}>
        {niches.map((niche, i) => {
          const start = introFrames + i * SECTION_FRAMES
          const end = start + SECTION_FRAMES
          if (frame < start || frame >= end) return null
          return (
            <Sequence key={niche} from={start} durationInFrames={SECTION_FRAMES}>
              <ChatWindow niche={niche} startFrame={0} />
            </Sequence>
          )
        })}
      </div>

      {/* Nukor branding watermark */}
      <div style={{
        position: 'absolute', bottom: 28, right: 44,
        display: 'flex', alignItems: 'center', gap: 8,
        opacity: 0.35,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: '#4f46e5', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 900,
        }}>N</div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', letterSpacing: -0.3 }}>Nukor</span>
      </div>
    </AbsoluteFill>
  )
}
