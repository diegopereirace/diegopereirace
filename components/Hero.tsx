import React from 'react';
import { Terminal, Database, Server } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-20 lg:pt-32 pb-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center">
        <div className="w-full lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
            Disponível para projetos
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Desenvolvedor <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Full Stack</span>
            <br />
            Especialista PHP
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            20 anos transformando café em código limpo. Do Ceará para o mundo, criando soluções robustas com 
            <span className="text-slate-200 font-semibold"> Drupal</span>, 
            <span className="text-slate-200 font-semibold"> PHP</span> e 
            <span className="text-slate-200 font-semibold"> MySQL</span>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a href="#contact" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1">
              Vamos conversar?
            </a>
            <a href="#about" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-all duration-300">
              Conheça minha história
            </a>
          </div>
          
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-slate-500">
             <div className="flex items-center gap-2">
                <Terminal size={20} />
                <span className="font-mono text-sm">Backend Expert</span>
             </div>
             <div className="flex items-center gap-2">
                <Database size={20} />
                <span className="font-mono text-sm">DB Architect</span>
             </div>
             <div className="flex items-center gap-2">
                <Server size={20} />
                <span className="font-mono text-sm">DevOps aware</span>
             </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-blue-500 rounded-2xl transform rotate-3 blur opacity-30"></div>
            <div className="relative bg-slate-800 p-2 rounded-2xl shadow-2xl border border-slate-700">
               <img 
                 src="https://picsum.photos/600/600?grayscale" 
                 alt="Diego Pereira Coding" 
                 className="rounded-xl w-full max-w-md object-cover h-auto grayscale hover:grayscale-0 transition-all duration-500"
               />
               
               {/* Floating Badge */}
               <div className="absolute -bottom-6 -left-6 bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-xl flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <span className="text-2xl">🇧🇷</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Localização</p>
                    <p className="text-white font-semibold">Ceará, Brasil</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
