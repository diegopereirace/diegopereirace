import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-slate-950 py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-2xl font-bold tracking-tighter text-white">
              <span className="text-emerald-400">{`{`}</span> DIEGO PEREIRA <span className="text-emerald-400">{`}`}</span>
            </span>
            <p className="text-slate-500 mt-2 max-w-md">
              Desenvolvedor focado em resolver problemas reais com código limpo e eficiente.
            </p>
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
              <Github size={24} />
            </a>
            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="mailto:contato@diegopereirace.com.br" className="text-slate-400 hover:text-red-400 transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} Diego Pereira. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0">Feito com React, Tailwind e muita cafeína.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
