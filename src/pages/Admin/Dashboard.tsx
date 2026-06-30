import { motion } from 'motion/react';
import { 
  Rocket, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  Users, 
  ArrowRight,
  Plus,
  FileText,
  LogOut,
  Award
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao sair');
    }
  };

  const modules = [
    {
      title: 'Startups',
      description: 'Gerenciar portfólio de startups',
      icon: <Rocket className="w-6 h-6 text-brand-teal" />,
      link: '/admin/startups',
      color: 'from-brand-teal/20 to-brand-teal/10'
    },
    {
      title: 'Oportunidades',
      description: 'Editais, investimentos e parcerias',
      icon: <Briefcase className="w-6 h-6 text-brand-teal" />,
      link: '/admin/oportunidades',
      color: 'from-brand-teal/20 to-brand-teal/10'
    },
    {
      title: 'Eventos',
      description: 'Agenda e histórico de eventos',
      icon: <Calendar className="w-6 h-6 text-brand-teal" />,
      link: '/admin/eventos',
      color: 'from-brand-teal/20 to-brand-teal/10'
    },
    {
      title: 'Equipe',
      description: 'Membros que fazem o Hub acontecer',
      icon: <Users className="w-6 h-6 text-brand-teal" />,
      link: '/admin/equipe',
      color: 'from-brand-teal/20 to-brand-teal/10'
    },
    {
      title: 'KPIs',
      description: 'Indicadores de impacto do Hub',
      icon: <BarChart3 className="w-6 h-6 text-brand-teal" />,
      link: '/admin/kpis',
      color: 'from-brand-teal/20 to-brand-teal/10'
    },
    {
      title: 'Acessos',
      description: 'Gerenciar logins e permissões',
      icon: <Users className="w-6 h-6 text-brand-teal" />,
      link: '/admin/usuarios',
      color: 'from-brand-teal/20 to-brand-teal/10'
    },
    {
      title: 'Cases',
      description: 'Histórias de sucesso e resultados',
      icon: <FileText className="w-6 h-6 text-brand-teal" />,
      link: '/admin/cases',
      color: 'from-brand-teal/20 to-brand-teal/10'
    },
    {
      title: 'Premiações',
      description: 'Prêmios e reconhecimentos do Hub',
      icon: <Award className="w-6 h-6 text-brand-teal" />,
      link: '/admin/premiacoes',
      color: 'from-brand-teal/20 to-brand-teal/10'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-wide italic text-gray-900 flex items-center gap-4">
            Painel <span className="text-brand-teal">Administrativo</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Bem-vindo de volta! O que vamos gerenciar hoje?</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-6 py-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-black uppercase text-[10px] tracking-widest border border-red-100 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair do Painel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((module, index) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              to={module.link}
              className="group block bg-white p-10 h-full hover:border-brand-teal transition-all relative overflow-hidden border border-gray-100 rounded-[40px] shadow-lg"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:scale-110 group-hover:bg-brand-teal group-hover:border-brand-teal transition-all">
                    {/* Access icon and change color on hover if possible, but keeping it simple for now */}
                    <div className="group-hover:text-white transition-colors">
                      {module.icon}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100">
                    <Plus className="w-5 h-5 text-brand-teal" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-black mb-2 uppercase tracking-wide italic text-gray-900">{module.title}</h3>
                <p className="text-gray-500 mb-8 font-medium">{module.description}</p>
                
                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-teal group-hover:translate-x-2 transition-transform">
                  Gerenciar Módulo <ArrowRight className="ml-3 w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Summary */}
      <div className="mt-16 bg-white border border-gray-100 rounded-[40px] p-8 shadow-xl">
        <h2 className="text-xl font-black uppercase tracking-tight italic mb-8 flex items-center text-gray-900">
          <BarChart3 className="w-5 h-5 mr-3 text-brand-teal" />
          Resumo de Atividade
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Total Startups', val: '--' },
            { label: 'Eventos Ativos', val: '--' },
            { label: 'Oportunidades', val: '--' },
            { label: 'Parceiros', val: '--' },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</div>
              <div className="text-3xl font-black text-gray-900">{stat.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
