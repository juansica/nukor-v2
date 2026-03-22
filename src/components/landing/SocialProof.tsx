const companies = ["Cornershop", "Betterfly", "NotCo", "Buk", "Fintual"];

const SocialProof = () => (
  <section className="py-16 bg-slate-50 border-y border-gray-200">
    <div className="container mx-auto text-center px-6">
      <p className="text-xs font-bold text-gray-500 mb-10 tracking-widest uppercase">
        Usado por equipos en toda Latinoamérica
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
        {companies.map((name) => (
          <span key={name} className="text-xl font-heading font-bold text-gray-400 select-none">
            {name}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;
