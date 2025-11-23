import React from 'react';
import { Database, Layout, Server, Code, Layers, LineChart } from 'lucide-react';

const Skills: React.FC = () => {
  const skills = [
    {
      category: "Core Stack",
      icon: <Server className="text-emerald-400" />,
      techs: ["PHP 8+", "Drupal 11", "MySQL/MariaDB", "Composer"]
    },
    {
      category: "Frontend & Interface",
      icon: <Layout className="text-blue-400" />,
      techs: ["HTML5 / CSS3", "JavaScript (ES6+)", "Tailwind CSS", "Twig Engine"]
    },
    {
      category: "Next Steps / Learning",
      icon: <LineChart className="text-purple-400" />,
      techs: ["Python", "Data Analysis", "Artificial Intelligence", "React"]
    },
    {
      category: "Ferramentas & DevOps",
      icon: <Layers className="text-orange-400" />,
      techs: ["Git / GitHub", "Docker", "Linux Terminal", "Agile Methodologies"]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-emerald-400 font-bold tracking-wide uppercase mb-2">Tecnologias</h2>
          <h3 className="text-3xl font-bold text-white">Minha Caixa de Ferramentas</h3>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Stack focada em performance, escalabilidade e segurança. Especialista em resolver problemas complexos com soluções robustas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-colors duration-300 group">
              <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4 border border-slate-700 group-hover:border-emerald-500/30">
                {skill.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-4">{skill.category}</h4>
              <ul className="space-y-2">
                {skill.techs.map((tech, i) => (
                  <li key={i} className="flex items-center text-slate-400 text-sm">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Featured Tech Banner */}
        <div className="mt-16 bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
                <h4 className="text-2xl font-bold text-white mb-2">Especialista Drupal 11</h4>
                <p className="text-slate-400">Desenvolvimento de módulos customizados, migrações complexas e otimização de performance.</p>
            </div>
            <div className="flex gap-4">
                <div className="px-4 py-2 bg-slate-800 rounded border border-slate-700 text-emerald-400 font-mono font-bold">hook_form_alter()</div>
                <div className="px-4 py-2 bg-slate-800 rounded border border-slate-700 text-blue-400 font-mono font-bold">drush cr</div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
