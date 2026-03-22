"use client";

import { useState } from "react";

type Niche = "rrhh" | "logistica" | "ventas";

interface NicheConfig {
  label: string;
  icon: string;
  messages: { role: "user" | "ai"; avatar: string; name: string; text: string }[];
}

const niches: Record<Niche, NicheConfig> = {
  rrhh: {
    label: "Recursos Humanos",
    icon: "👥",
    messages: [
      {
        role: "user",
        avatar: "MC",
        name: "María C.",
        text: "¿Cuál es el proceso para solicitar vacaciones?",
      },
      {
        role: "ai",
        avatar: "N",
        name: "Nukor",
        text: `Para solicitar vacaciones, sigue estos pasos:

1. Ingresa al portal de RRHH → "Solicitudes"
2. Selecciona las fechas y tu backup
3. Envía para aprobación de tu líder directo

📎 Fuente: Equipo de People Ops · Actualizado hace 3 días`,
      },
      {
        role: "user",
        avatar: "MC",
        name: "María C.",
        text: "Ahora también se necesita aprobación de finanzas si son más de 10 días.",
      },
      {
        role: "ai",
        avatar: "N",
        name: "Nukor",
        text: "✅ Listo. Actualicé la política de vacaciones con ese nuevo requisito. Todo el equipo podrá verlo.",
      },
    ],
  },
  logistica: {
    label: "Logística",
    icon: "📦",
    messages: [
      {
        role: "user",
        avatar: "JR",
        name: "Jorge R.",
        text: "¿Cuál es el procedimiento cuando un envío llega dañado al cliente?",
      },
      {
        role: "ai",
        avatar: "N",
        name: "Nukor",
        text: `Protocolo de envío dañado:

1. Registrar el reclamo en el sistema con fotos del daño
2. Notificar al transportista dentro de 24 horas
3. Ofrecer reenvío o reembolso al cliente
4. Escalar a calidad si el mismo producto acumula 3+ incidencias

📎 Fuente: Equipo de Operaciones · Actualizado hace 5 días`,
      },
      {
        role: "user",
        avatar: "JR",
        name: "Jorge R.",
        text: "Agregamos un nuevo transportista: FastCargo. Cubre zona norte desde esta semana.",
      },
      {
        role: "ai",
        avatar: "N",
        name: "Nukor",
        text: "✅ Registrado. Agregué FastCargo como transportista activo para zona norte. El equipo de despacho ya puede verlo.",
      },
    ],
  },
  ventas: {
    label: "Ventas",
    icon: "💼",
    messages: [
      {
        role: "user",
        avatar: "AS",
        name: "Ana S.",
        text: "¿Qué descuento máximo puedo ofrecer a un cliente enterprise?",
      },
      {
        role: "ai",
        avatar: "N",
        name: "Nukor",
        text: `Política de descuentos enterprise:

• Hasta 15% → aprobación del líder de ventas
• 15-25% → requiere aprobación de dirección comercial
• Más de 25% → caso especial con VP de Revenue

Tip: Ofrece valor agregado (onboarding, soporte premium) antes de descuento.

📎 Fuente: Equipo Comercial · Actualizado hace 2 días`,
      },
      {
        role: "user",
        avatar: "AS",
        name: "Ana S.",
        text: "El nuevo pricing del plan Growth incluye soporte prioritario. Hay que actualizar el pitch deck.",
      },
      {
        role: "ai",
        avatar: "N",
        name: "Nukor",
        text: "✅ Actualizado. Agregué el soporte prioritario al plan Growth en la base de conocimiento. Todo el equipo comercial puede verlo.",
      },
    ],
  },
};

const nicheKeys: Niche[] = ["rrhh", "logistica", "ventas"];

const HeroSection = () => {
  const [activeNiche, setActiveNiche] = useState<Niche>("rrhh");
  const current = niches[activeNiche];

  return (
    <section className="pt-36 pb-28 md:pt-48 md:pb-36 bg-white relative overflow-hidden">
      <div className="container mx-auto relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20 text-gray-950">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 mb-8 shadow-sm">
            ✨ Base de conocimiento con IA
          </span>
          <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight animate-fade-up-delay-1">
            El cerebro colectivo de tu empresa, accesible para todos
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed animate-fade-up-delay-2 font-medium">
            Nukor captura, organiza y comparte el conocimiento de tu equipo automáticamente.
            Solo conversa — la IA hace el resto.
          </p>
        </div>

        {/* Chat mockup with niche selector */}
        <div className="max-w-3xl mx-auto animate-fade-up-delay-3">
          {/* Niche selector tabs */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {nicheKeys.map((key) => {
              const niche = niches[key];
              const isActive = key === activeNiche;
              return (
                <button
                  key={key}
                  onClick={() => setActiveNiche(key)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md border-transparent hover:-translate-y-[1px]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 border hover:shadow-sm"
                  }`}
                >
                  <span className="text-base">{niche.icon}</span>
                  <span className="hidden sm:inline">{niche.label}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-slate-50/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="ml-3 text-[13px] text-gray-500 font-semibold tracking-wide uppercase">
                Nukor Chat · {current.label}
              </span>
            </div>

            {/* Messages */}
            <div className="p-8 space-y-6 max-h-[450px] overflow-y-auto" key={activeNiche}>
              {current.messages.map((msg, i) => (
                <div key={i} className="flex gap-4 animate-fade-up"
                     style={{ animationDelay: `${i * 80}ms` }}>
                  <div
                    className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
                      msg.role === "ai"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-gray-950 border border-gray-200 font-medium"
                    }`}
                  >
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <span className="text-[13px] font-bold text-gray-950 tracking-tight">{msg.name}</span>
                    <div className="mt-1.5 text-[15px] text-gray-600 whitespace-pre-line leading-relaxed font-medium">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <div className="px-8 pb-8 pt-4">
              <div className="flex items-center gap-3 rounded-full px-5 py-3.5 bg-white border border-gray-200 shadow-sm focus-within:ring-4 focus-within:ring-indigo-50 focus-within:border-indigo-300 transition-all">
                <span className="text-[15px] font-medium text-gray-400 flex-1">
                  Pregunta algo o comparte conocimiento...
                </span>
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 cursor-pointer transition-colors">
                  <svg
                    width="16" height="16" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="translate-x-[-1px]"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
