import { Rocket, Mail, Instagram, Linkedin, Twitter, MapPin, Phone, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brand-darker border-t border-white/10 pt-16 pb-8 text-white relative overflow-hidden">
      {/* Background Aura */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#00c9a7,transparent_70%)]" />
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#00c9a7]/5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-black tracking-tighter uppercase">
                NINNA<span className="text-[#00c9a7] ml-1">HUB</span>
              </span>
            </Link>
            <p className="text-white/60 max-w-sm text-lg leading-relaxed font-medium">
              O NINNA é um hub de inovação focado em gerar conexões estratégicas entre empresas, startups e o ecossistema, com foco em resultados reais.
            </p>
            <div className="flex space-x-6">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="text-white/40 hover:text-[#00c9a7] transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="/docs/Codigo-de-Conduta-e-Etica-Timbrado-NINNA-vyf150626.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-[#00c9a7]/60 hover:bg-[#00c9a7]/10 text-white/60 hover:text-[#00c9a7] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <FileText className="w-4 h-4" />
                Código de ética e conduta
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#00c9a7] font-black uppercase text-[10px] tracking-widest mb-8">Navegação</h3>
            <ul className="space-y-4">
              <li><Link to="/empresas" className="text-white/60 hover:text-white transition-all font-medium">Empresas</Link></li>
              <li><Link to="/startups" className="text-white/60 hover:text-white transition-all font-medium">Startups</Link></li>
              <li><Link to="/ecossistema" className="text-white/60 hover:text-white transition-all font-medium">Ecossistema</Link></li>
              <li><Link to="/oportunidades" className="text-white/60 hover:text-white transition-all font-medium">Oportunidades</Link></li>
              <li><Link to="/sobre" className="text-white/60 hover:text-white transition-all font-medium">Sobre Nós</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#00c9a7] font-black uppercase text-[10px] tracking-widest mb-8">Contato</h3>
            <ul className="space-y-6">
              <li className="flex items-center space-x-3 text-white/60">
                <Mail className="w-5 h-5 text-[#00c9a7]" />
                <span className="text-sm font-medium">contato@ninnahub.com.br</span>
              </li>
              <li className="flex items-center space-x-3 text-white/60">
                <Phone className="w-5 h-5 text-[#00c9a7]" />
                <span className="text-sm font-black italic">(85) 9 9999-9999</span>
              </li>
              <li className="flex items-center space-x-3 text-white/60 uppercase text-[10px] font-black tracking-widest">
                <MapPin className="w-5 h-5 text-[#00c9a7]" />
                <span>Fortaleza, CE - Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 text-center text-white/30 text-[10px] font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} NINNA Hub. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
