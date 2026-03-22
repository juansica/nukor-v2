const plans = [
  {
    name: "Starter",
    price: "Gratis",
    period: "",
    description: "Para equipos pequeños que empiezan a organizar su conocimiento.",
    features: [
      "Hasta 5 usuarios",
      "Chat IA ilimitado",
      "100 documentos",
      "Búsqueda básica",
    ],
    cta: "Empieza ahora",
    featured: false,
  },
  {
    name: "Growth",
    price: "$49",
    period: "/mes",
    description: "Para empresas en crecimiento que necesitan escalar su conocimiento.",
    features: [
      "Hasta 50 usuarios",
      "Chat IA con fuentes citadas",
      "Documentos ilimitados",
      "Permisos por equipo y rol",
      "Integraciones (Slack, Teams)",
    ],
    cta: "Empezar prueba gratis",
    featured: true,
    badge: "Más popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Para organizaciones que requieren control total y soporte dedicado.",
    features: [
      "Usuarios ilimitados",
      "SSO y SAML",
      "API completa",
      "SLA garantizado",
      "Onboarding personalizado",
    ],
    cta: "Contactar ventas",
    featured: false,
  },
];

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Pricing = () => (
  <section id="precios" className="py-24 md:py-32 bg-white border-b border-gray-200">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <span className="inline-flex items-center px-4 py-1.5 text-[13px] font-bold tracking-widest uppercase bg-slate-50 text-gray-600 rounded-full border border-gray-200 mb-6 shadow-sm">
          Precios
        </span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-gray-950 leading-tight">
          Simple, transparente, sin sorpresas
        </h2>
        <p className="mt-6 text-gray-500 text-xl font-medium leading-relaxed">
          Empieza ahora. Escala cuando estés listo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative flex flex-col p-8 rounded-2xl bg-white ${
            plan.featured 
              ? "border-2 border-indigo-600 shadow-xl transform md:-translate-y-4" 
              : "border border-gray-200 shadow-sm"
          }`}>
            {plan.featured && plan.badge && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[13px] font-bold bg-indigo-600 text-white shadow-md tracking-wide uppercase">
                {plan.badge}
              </span>
            )}
            <div className="mb-8">
              <h3 className="font-heading font-bold text-2xl mb-2 text-gray-950 tracking-tight">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-heading text-5xl font-black text-gray-950 tracking-tight">{plan.price}</span>
                {plan.period && (
                  <span className="text-base font-semibold text-gray-500">
                    {plan.period}
                  </span>
                )}
              </div>
              <p className="mt-4 text-[15px] font-medium leading-relaxed text-gray-600">
                {plan.description}
              </p>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="text-indigo-600"><CheckIcon /></span>
                  <span className="text-[15px] font-medium text-gray-600">{f}</span>
                </li>
              ))}
            </ul>
            <a href="#"
               className={`w-full py-3.5 rounded-full font-semibold text-center transition-all shadow-sm ${
                 plan.featured
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-[1px]"
                    : "bg-white border border-gray-200 text-gray-950 hover:bg-slate-50 hover:border-gray-300 hover:-translate-y-[1px]"
               }`}>
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
