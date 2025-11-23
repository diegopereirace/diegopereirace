import React from 'react';
import { BIO_TEXT } from '../constants';
import { CheckCircle2, Award, BrainCircuit } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Text Content */}
          <div className="order-2 lg:order-1">
             <h2 className="text-emerald-400 font-bold tracking-wide uppercase mb-2">Sobre Mim</h2>
             <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
               Arquitetura limpa e sem gambiarra.
             </h3>
             
             <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                <p className="border-l-4 border-emerald-500 pl-4 italic bg-slate-800/50 py-2 pr-2 rounded-r">
                  "{BIO_TEXT.intro}"
                </p>
                <p>
                  {BIO_TEXT.details}
                </p>
             </div>

             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 mt-1 shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold text-white">20 Anos de Estrada</h4>
                    <p className="text-sm text-slate-400">Experiência sólida no mercado de tecnologia.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="text-emerald-400 mt-1 shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold text-white">Pós-Graduado</h4>
                    <p className="text-sm text-slate-400">Análise, Projeto e Gerência de Sistemas.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BrainCircuit className="text-emerald-400 mt-1 shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold text-white">Foco em IA</h4>
                    <p className="text-sm text-slate-400">Estudos avançados em Python e Data Science.</p>
                  </div>
                </div>
             </div>
          </div>

          {/* Visual/Decoration */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 transform translate-y-8">
                <span className="text-4xl font-bold text-white block mb-2">15+</span>
                <span className="text-slate-400 text-sm uppercase tracking-wider">Anos programando</span>
              </div>
              <div className="bg-emerald-900/20 p-6 rounded-2xl border border-emerald-500/30">
                <span className="text-4xl font-bold text-emerald-400 block mb-2">100%</span>
                <span className="text-emerald-200/70 text-sm uppercase tracking-wider">Comprometimento</span>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 col-span-2">
                 <h4 className="text-white font-bold mb-3">Filosofia de Trabalho</h4>
                 <p className="text-slate-400 text-sm">
                   "Aqui a pegada é resolver bronca sem enrolação." - Foco total em entregar valor para o cliente com código sustentável.
                 </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
