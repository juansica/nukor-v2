const features = [
  {
    icon: "🤖",
    label: "IA Conversacional",
    title: "Chat IA entrenado con tu empresa",
    description: "Responde preguntas usando el conocimiento real de tu organización. No inventa — cita fuentes y fechas.",
    accent: true,
  },
  {
    icon: "🔒",
    label: "Permisos",
    title: "Control de acceso granular",
    description: "Define quién ve qué. Por equipo, rol o proyecto. La información sensible se mantiene segura.",
    accent: false,
  },
  {
    icon: "📚",
    label: "Biblioteca viva",
    title: "Conocimiento siempre actualizado",
    description: "A diferencia de wikis estáticas, Nukor se actualiza con cada conversación. Nunca más info desactualizada.",
    accent: false,
  },
  {
    icon: "🕐",
    label: "Trazabilidad",
    title: "Historial completo de cambios",
    description: "Cada modificación queda registrada. Sabes quién actualizó qué, cuándo y por qué.",
    accent: false,
  },
];

const Features = () => (
  <section id="producto" className="py-24 md:py-32 bg-slate-50 border-b border-gray-200">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="inline-flex items-center px-4 py-1.5 text-[13px] font-bold tracking-widest uppercase bg-white text-gray-600 rounded-full border border-gray-200 mb-6 shadow-sm">
          Características
        </span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-gray-950 leading-tight">
          Todo lo que necesitas para gestionar conocimiento
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <div key={i} className={`p-8 md:p-10 rounded-2xl border transition-shadow duration-300 hover:shadow-md ${
            f.accent ? "bg-indigo-50 border-indigo-100 md:row-span-1 shadow-sm" : "bg-white border-gray-200 shadow-sm"
          } ${i === 0 ? "md:col-span-2" : ""}`}>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="text-4xl flex-shrink-0 bg-white w-16 h-16 rounded-xl flex items-center justify-center border border-gray-200 shadow-sm">
                {f.icon}
              </div>
              <div className="pt-2">
                <span className="text-[13px] font-bold uppercase tracking-widest text-indigo-600 mb-2 inline-block">
                  {f.label}
                </span>
                <h3 className="font-heading font-bold text-2xl mt-1 mb-3 text-gray-950 tracking-tight">{f.title}</h3>
                <p className="text-[16px] font-medium leading-relaxed text-gray-600">
                  {f.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
