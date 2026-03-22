const steps = [
  {
    number: "01",
    icon: "💬",
    title: "Tu equipo conversa naturalmente",
    description: "Haz preguntas, comparte procesos o documenta decisiones como si chatearas con un colega.",
  },
  {
    number: "02",
    icon: "🧠",
    title: "La IA extrae y estructura",
    description: "Nukor identifica conocimiento valioso y lo organiza automáticamente en categorías y etiquetas.",
  },
  {
    number: "03",
    icon: "⚡",
    title: "Todos acceden al instante",
    description: "Cualquier persona del equipo puede buscar y encontrar respuestas en segundos, no en horas.",
  },
  {
    number: "04",
    icon: "📈",
    title: "Se vuelve más inteligente",
    description: "Cada interacción mejora las respuestas. Tu base de conocimiento crece con tu empresa.",
  },
];

const HowItWorks = () => (
  <section id="como-funciona" className="py-24 md:py-32 bg-white border-b border-gray-200">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="inline-flex items-center px-4 py-1.5 text-[13px] font-bold tracking-widest uppercase bg-slate-50 text-gray-600 rounded-full border border-gray-200 mb-6 shadow-sm">
          Cómo funciona
        </span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-gray-950 leading-tight">
          De conversación a conocimiento en segundos
        </h2>
        <p className="mt-6 text-gray-500 text-xl font-medium leading-relaxed">
          Sin formularios, sin wikis abandonadas. Solo habla y Nukor hace el resto.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <div key={step.number}
               className={`bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-md hover:border-gray-300 transition-all duration-300 animate-fade-up-delay-${Math.min(i + 1, 4)}`}>
            <div className="text-3xl mb-6 bg-slate-50 w-14 h-14 rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">{step.icon}</div>
            <div className="inline-block text-[13px] font-bold font-heading text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md mb-4 border border-indigo-100 shadow-sm">
              PASO {step.number}
            </div>
            <h3 className="font-heading font-bold text-xl mb-3 text-gray-950 tracking-tight">{step.title}</h3>
            <p className="text-[15px] font-medium text-gray-600 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
