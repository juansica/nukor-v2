const Footer = () => (
  <footer className="py-12 bg-slate-50 border-t border-gray-200">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
        <span className="font-heading font-bold text-xl text-gray-950 tracking-tight">Nukor</span>
        <span className="text-[15px] font-medium text-gray-500">
          © {new Date().getFullYear()} Nukor · Hecho en Santiago, Chile 🇨🇱
        </span>
      </div>
      <div className="flex items-center gap-8">
        <a href="#" className="text-[15px] font-medium text-gray-500 hover:text-gray-950 transition-colors">Privacidad</a>
        <a href="#" className="text-[15px] font-medium text-gray-500 hover:text-gray-950 transition-colors">Términos</a>
        <a href="#" className="text-[15px] font-medium text-gray-500 hover:text-gray-950 transition-colors">Contacto</a>
      </div>
    </div>
  </footer>
);

export default Footer;
